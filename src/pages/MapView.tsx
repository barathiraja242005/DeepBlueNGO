import { useState, useMemo } from 'react';
import DiseaseMap from '@/components/DiseaseMap';
import MapSidebar from '@/components/Sidebar';
import DetailPanel from '@/components/DetailPanel';
import { diseaseData, DiseasePoint } from '@/data/diseaseData';
import { motion } from 'framer-motion';

interface MapViewProps {
  onStateClick?: (stateName: string) => void;
  userState?: string; // For NGO users - restrict to their state
  isPremium?: boolean; // Premium subscription
}

const MapView = ({ onStateClick, userState, isPremium }: MapViewProps) => {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DiseasePoint | null>(null);

  // Filter data by user's state if NGO user (premium users see all)
  const filteredData = useMemo(() => {
    if (userState && !isPremium) {
      return diseaseData.filter(d => d.state === userState);
    }
    return diseaseData;
  }, [userState, isPremium]);

  return (
    <div className="flex h-screen overflow-hidden">
      <MapSidebar
        data={filteredData}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
      />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 relative"
      >
        <DiseaseMap
          data={filteredData}
          selectedDisease={selectedDisease}
          selectedSeverity={selectedSeverity}
          onSelectPoint={setSelectedPoint}
          onStateClick={onStateClick}
          userState={userState}
          isPremium={isPremium}
        />
        <DetailPanel
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
          showAISuggestions={!!userState}
        />
      </motion.main>
    </div>
  );
};

export default MapView;
