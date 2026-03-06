import { diseases, severityColors, DiseasePoint } from '@/data/diseaseData';
import { Activity, AlertTriangle, Shield, Heart, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { exportFilteredDiseaseData, exportDiseaseDataToExcel } from '@/lib/excelExport';
import { toast } from 'sonner';

interface SidebarProps {
  data: DiseasePoint[];
  selectedDisease: string | null;
  setSelectedDisease: (d: string | null) => void;
  selectedSeverity: string | null;
  setSelectedSeverity: (s: string | null) => void;
}

const severities = ['self-care', 'doctor', 'emergency'] as const;

const MapSidebar = ({ data, selectedDisease, setSelectedDisease, selectedSeverity, setSelectedSeverity }: SidebarProps) => {
  const totalCases = data.reduce((sum, d) => sum + d.cases, 0);
  const emergencyCount = data.filter((d) => d.severity === 'emergency').length;
  const activeStates = new Set(data.map((d) => d.state)).size;

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[300px] bg-card flex flex-col h-full border-r border-border"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="p-5 border-b border-border"
      >
        <div className="flex items-center gap-3 mb-1">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
          >
            <Heart className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">CURA-NGO</h1>
            <p className="text-[10px] text-muted-foreground">Health Surveillance · India</p>
          </div>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="p-4 border-b border-border"
      >
        <div className="grid grid-cols-3 gap-2">
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center bg-secondary/50 rounded-lg p-2 transition-shadow hover:shadow-md"
          >
            <p className="text-xl font-bold text-foreground">{totalCases.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Cases</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center bg-[#0F2854]/10 rounded-lg p-2 transition-shadow hover:shadow-md"
          >
            <p className="text-xl font-bold text-[#0F2854]">{emergencyCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Emergency</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center bg-secondary/50 rounded-lg p-2 transition-shadow hover:shadow-md"
          >
            <p className="text-xl font-bold text-foreground">{activeStates}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">States</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Disease Filter */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="p-4 border-b border-border"
      >
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Filter by Disease</p>
        <div className="flex flex-wrap gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDisease(null)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all border ${
              !selectedDisease
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-secondary text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            All
          </motion.button>
          {diseases.map((d, i) => (
            <motion.button
              key={d}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDisease(selectedDisease === d ? null : d)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all border ${
                selectedDisease === d
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-secondary text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {d}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Severity Filter */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="p-4 border-b border-border"
      >
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Severity</p>
        <div className="flex gap-1.5">
          {severities.map((s, i) => {
            const isActive = selectedSeverity === s;
            return (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSeverity(isActive ? null : s)}
                className="flex-1 py-2 rounded-lg text-[10px] font-semibold capitalize transition-all flex flex-col items-center gap-1"
                style={{
                  color: isActive ? '#fff' : severityColors[s],
                  backgroundColor: isActive ? severityColors[s] : `${severityColors[s]}0d`,
                  boxShadow: isActive ? `0 2px 10px ${severityColors[s]}30` : 'none',
                }}
              >
                <motion.span
                  animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? '#fff' : severityColors[s],
                  }}
                />
                {s === 'self-care' ? 'Self-Care' : s === 'doctor' ? 'Doctor Visit' : 'Emergency'}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-auto border-t border-border"
      >
        <div className="p-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
            Click any hotspot on the map for detailed data, nearby NGOs, and AI-powered health recommendations.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (selectedDisease || selectedSeverity) {
                const filtered = data.filter(d => 
                  (!selectedDisease || d.disease === selectedDisease) &&
                  (!selectedSeverity || d.severity === selectedSeverity)
                );
                exportFilteredDiseaseData(filtered, `${selectedDisease || 'All'}_${selectedSeverity || 'All'}`);
                toast.success('Filtered data downloaded!');
              } else {
                exportDiseaseDataToExcel();
                toast.success('Disease data downloaded!');
              }
            }}
            className="w-full px-3 py-2 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="h-3 w-3" />
            Download Data
          </motion.button>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default MapSidebar;
