import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DiseasePoint, severityColors } from '@/data/diseaseData';
import { toast } from 'sonner';

interface DiseaseMapProps {
  data: DiseasePoint[];
  selectedDisease: string | null;
  selectedSeverity: string | null;
  onSelectPoint?: (point: DiseasePoint) => void;
  onStateClick?: (stateName: string) => void;
  userState?: string; // For NGO users - their registered state
  isPremium?: boolean; // Premium subscription - access all states
}

const severitySize: Record<string, number> = {
  'self-care': 14,
  'doctor': 20,
  'emergency': 30,
};

const indiaBounds = L.latLngBounds(
  L.latLng(6.5, 68.0),
  L.latLng(35.5, 97.5),
);

const createMarkerIcon = (severity: string, color: string) => {
  const size = severitySize[severity];
  const pulseSize = size + 16;
  const isEmergency = severity === 'emergency';
  const isDoctor = severity === 'doctor';

  return L.divIcon({
    className: 'custom-disease-marker',
    iconSize: [pulseSize, pulseSize],
    iconAnchor: [pulseSize / 2, pulseSize / 2],
    popupAnchor: [0, -pulseSize / 2 + 4],
    html: `
      <div style="position:relative;width:${pulseSize}px;height:${pulseSize}px;display:flex;align-items:center;justify-content:center">
        ${isEmergency ? `<div style="position:absolute;width:${pulseSize}px;height:${pulseSize}px;border-radius:50%;background:${color};opacity:0.18;animation:marker-pulse 2s ease-out infinite"></div>` : ''}
        ${isEmergency || isDoctor ? `<div style="position:absolute;width:${size + 8}px;height:${size + 8}px;border-radius:50%;background:${color};opacity:0.10;animation:marker-pulse 2.5s ease-out infinite 0.5s"></div>` : ''}
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background: radial-gradient(circle at 35% 35%, ${color}ee, ${color});
          border: 2px solid rgba(255,255,255,0.85);
          box-shadow: 0 2px 8px ${color}40, 0 0 16px ${color}18;
          position:relative;
          z-index:2;
          cursor:pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <div style="
            position:absolute;
            top:${size * 0.18}px;
            left:${size * 0.22}px;
            width:${size * 0.28}px;
            height:${size * 0.18}px;
            border-radius:50%;
            background:rgba(255,255,255,0.35);
            filter:blur(1px);
          "></div>
        </div>
      </div>
    `,
  });
};

const DiseaseMap = ({ data, selectedDisease, selectedSeverity, onSelectPoint, onStateClick, userState, isPremium }: DiseaseMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filtered = data.filter((d) => {
    if (selectedDisease && d.disease !== selectedDisease) return false;
    if (selectedSeverity && d.severity !== selectedSeverity) return false;
    return true;
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      maxBounds: indiaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 4,
      maxZoom: 14,
      boxZoom: false,
    }).setView([22.5, 79], 5);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);

    // Add India border with state click functionality
    fetch('/india-states.geojson')
      .then((res) => res.json())
      .then((geojson) => {
        L.geoJSON(geojson, {
          style: (feature) => {
            const stateName = feature?.properties?.st_nm || feature?.properties?.ST_NM || feature?.properties?.name;
            const isPremiumUser = isPremium;
            const isUserState = userState && stateName === userState;
            const isRestricted = userState && !isPremiumUser && stateName !== userState;
            
            return {
              color: isUserState ? 'hsl(142, 76%, 36%)' : isRestricted ? 'hsl(0, 0%, 60%)' : 'hsl(217, 91%, 60%)',
              weight: isUserState ? 4 : 2.5,
              opacity: isRestricted ? 0.3 : isUserState ? 1 : 0.7,
              fillColor: isUserState ? 'hsl(142, 76%, 50%)' : isRestricted ? 'hsl(0, 0%, 60%)' : 'hsl(217, 91%, 60%)',
              fillOpacity: isUserState ? 0.35 : isRestricted ? 0.02 : 0.04,
              dashArray: isRestricted ? '5, 5' : '',
            };
          },
          onEachFeature: (feature, layer) => {
            const stateName = feature.properties?.st_nm || feature.properties?.ST_NM || feature.properties?.name;
            if (stateName) {
              const isUserState = userState && stateName === userState;
              const isRestricted = userState && !isPremium && stateName !== userState;

              layer.on({
                click: () => {
                  // If NGO user (has userState) without premium, restrict to their state only
                  if (isRestricted) {
                    toast.error('Access Restricted', {
                      description: 'Upgrade to Premium to access all states. Currently limited to ' + userState + ' only.',
                      duration: 4000,
                    });
                    return;
                  }
                  onStateClick?.(stateName);
                },
                mouseover: (e) => {
                  const layer = e.target;
                  if (isRestricted) {
                    layer.setStyle({
                      fillOpacity: 0.08,
                      weight: 2.5,
                      color: 'hsl(0, 0%, 50%)',
                      fillColor: 'hsl(0, 0%, 50%)',
                      cursor: 'not-allowed',
                    });
                  } else {
                    layer.setStyle({
                      fillOpacity: isUserState ? 0.50 : 0.25,
                      weight: isUserState ? 5 : 3.5,
                      color: isUserState ? 'hsl(142, 76%, 30%)' : 'hsl(217, 91%, 45%)',
                      fillColor: isUserState ? 'hsl(142, 76%, 55%)' : 'hsl(217, 91%, 55%)',
                    });
                  }
                  layer.bringToFront();
                  // Show tooltip
                  if (!layer.isPopupOpen()) {
                    layer.openTooltip();
                  }
                },
                mouseout: (e) => {
                  const layer = e.target;
                  if (isRestricted) {
                    layer.setStyle({
                      fillOpacity: 0.02,
                      weight: 2.5,
                      color: 'hsl(0, 0%, 60%)',
                      fillColor: 'hsl(0, 0%, 60%)',
                    });
                  } else {
                    layer.setStyle({
                      fillOpacity: isUserState ? 0.35 : 0.04,
                      weight: isUserState ? 4 : 2.5,
                      color: isUserState ? 'hsl(142, 76%, 36%)' : 'hsl(217, 91%, 60%)',
                      fillColor: isUserState ? 'hsl(142, 76%, 50%)' : 'hsl(217, 91%, 60%)',
                    });
                  }
                  // Hide tooltip
                  layer.closeTooltip();
                },
              });
              const tooltipText = isRestricted ? `${stateName} 🔒 Premium` : isUserState ? `${stateName} ✓ Your State` : stateName;
              layer.bindTooltip(tooltipText, {
                permanent: false,
                direction: 'center',
                className: isRestricted ? 'state-label-tooltip-locked' : isUserState ? 'state-label-tooltip-active' : 'state-label-tooltip',
                sticky: true,
                opacity: 1,
              });
            }
          },
          pane: 'tilePane', // Place states below markers
        }).addTo(map);
      })
      .catch(console.error);

    // Add access status legend for NGO users
    if (userState) {
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'map-access-legend');
        if (isPremium) {
          div.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.98); border-radius: 12px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: 'DM Sans', sans-serif; min-width: 200px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
                <span style="font-weight: 800; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Map Access</span>
                <span style="margin-left: auto; font-size: 9px; font-weight: 700; color: #0F2854; background: linear-gradient(135deg, #BDE8F5, #4988C4); padding: 2px 8px; border-radius: 4px;">👑 PREMIUM</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 14px; height: 14px; border-radius: 3px; background: hsl(142, 76%, 45%); border: 2px solid hsl(142, 76%, 35%);"></div>
                <span style="font-size: 12px; font-weight: 600; color: #0f172a;">${userState}</span>
                <span style="margin-left: auto; font-size: 10px; font-weight: 700; color: hsl(142, 76%, 40%); background: hsl(142, 76%, 95%); padding: 2px 6px; border-radius: 4px;">HOME</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 14px; height: 14px; border-radius: 3px; background: hsl(217, 91%, 55%); border: 2px solid hsl(217, 91%, 45%);"></div>
                <span style="font-size: 12px; font-weight: 600; color: #0f172a;">All States</span>
                <span style="margin-left: auto; font-size: 10px; font-weight: 700; color: #0F2854; background: #BDE8F5; padding: 2px 6px; border-radius: 4px;">UNLOCKED</span>
              </div>
            </div>
          `;
        } else {
          div.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.98); border-radius: 12px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: 'DM Sans', sans-serif; min-width: 200px;">
              <div style="font-weight: 800; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Map Access</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 14px; height: 14px; border-radius: 3px; background: hsl(142, 76%, 45%); border: 2px solid hsl(142, 76%, 35%);"></div>
                <span style="font-size: 12px; font-weight: 600; color: #0f172a;">${userState}</span>
                <span style="margin-left: auto; font-size: 10px; font-weight: 700; color: hsl(142, 76%, 40%); background: hsl(142, 76%, 95%); padding: 2px 6px; border-radius: 4px;">ACTIVE</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; opacity: 0.6;">
                <div style="width: 14px; height: 14px; border-radius: 3px; background: hsl(0, 0%, 80%); border: 2px dashed hsl(0, 0%, 60%);"></div>
                <span style="font-size: 12px; font-weight: 600; color: #64748b;">Other States</span>
                <span style="margin-left: auto; font-size: 9px; font-weight: 700; color: #0F2854; background: #BDE8F5; padding: 2px 6px; border-radius: 4px;">🔒 PREMIUM</span>
              </div>
            </div>
          `;
        }
        return div;
      };
      legend.addTo(map);
    }

    // Add labels layer on top
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      pane: 'shadowPane',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    filtered.forEach((point) => {
      const color = severityColors[point.severity];
      const icon = createMarkerIcon(point.severity, color);
      const marker = L.marker([point.lat, point.lng], { icon });

      marker.bindPopup(`
        <div style="min-width:240px;font-family:'DM Sans',system-ui,sans-serif;padding:2px">
          <h3 style="font-weight:800;font-size:14px;margin:0 0 4px;color:#0f172a;letter-spacing:-0.3px">${point.disease}</h3>
          <p style="font-size:11px;color:#94a3b8;margin:0 0 8px;font-weight:500">${point.street}, ${point.city}</p>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
            <span style="font-size:20px;font-weight:900;color:#0f172a">${point.cases.toLocaleString()}</span>
            <span style="font-size:10px;color:#64748b;font-weight:600">cases</span>
            <span style="margin-left:auto;background:${color};color:#fff;padding:3px 10px;border-radius:999px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px">${point.severity}</span>
          </div>
          <p style="font-size:11px;color:#475569;margin:0;line-height:1.5">${point.description}</p>
        </div>
      `, {
        className: 'disease-popup-custom',
        maxWidth: 280,
      });

      marker.on('click', () => onSelectPoint?.(point));
      marker.addTo(markersRef.current!);
    });
  }, [filtered]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute top-4 left-4 z-[1000] bg-card/80 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-bold text-foreground tracking-wider uppercase">Live</span>
          <span className="text-[10px] text-muted-foreground font-medium">· {filtered.length} hotspots</span>
        </div>
      </div>
    </div>
  );
};

export default DiseaseMap;
