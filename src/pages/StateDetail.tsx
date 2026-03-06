import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, AlertTriangle, Activity, TrendingUp, Download } from 'lucide-react';
import { diseaseData, DiseasePoint } from '@/data/diseaseData';
import { ngoData } from '@/data/ngoData';
import DiseaseMap from '@/components/DiseaseMap';
import DetailPanel from '@/components/DetailPanel';
import { exportFilteredDiseaseData } from '@/lib/excelExport';
import { toast } from 'sonner';

interface StateDetailProps {
  stateName?: string;
  onBack?: () => void;
  onStateChange?: (newStateName: string) => void;
  userState?: string; // For NGO users - restrict to their state
}

const StateDetail = ({ stateName, onBack, onStateChange, userState }: StateDetailProps) => {
  const [selectedPoint, setSelectedPoint] = useState<DiseasePoint | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  // If NGO user, ensure they can only view their state
  const effectiveStateName = userState || stateName;

  const stateData = diseaseData.filter(d => d.state === effectiveStateName);
  const stateNGOs = ngoData.filter(ngo => 
    stateData.some(d => d.city === ngo.city)
  );

  const handleStateClick = (newStateName: string) => {
    onStateChange?.(newStateName);
  };

  useEffect(() => {
    if (!stateName || stateData.length === 0) {
      onBack?.();
    }
  }, [stateName, stateData, onBack]);

  if (stateData.length === 0) {
    return null;
  }

  const totalCases = stateData.reduce((sum, d) => sum + d.cases, 0);
  const emergencyCount = stateData.filter(d => d.severity === 'emergency').length;
  const cities = new Set(stateData.map(d => d.city)).size;
  const affectedStreets = new Set(stateData.map(d => d.street)).size;

  const filteredData = stateData.filter(d =>
    (!selectedDisease || d.disease === selectedDisease) &&
    (!selectedSeverity || d.severity === selectedSeverity)
  );

  const diseases = [...new Set(stateData.map(d => d.disease))];
  const severities = ['self-care', 'doctor', 'emergency'] as const;
  const severityColors: Record<string, string> = {
    'self-care': '#E3FDFD',
    'doctor': '#FFCE99',
    'emergency': '#FF9644',
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{stateName}</h1>
              <p className="text-sm text-muted-foreground">State Health Overview</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              exportFilteredDiseaseData(stateData, stateName || 'State');
              toast.success(`${stateName} data downloaded!`);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#FFCE99] to-[#FFCE99] text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-semibold text-sm"
          >
            <Download className="h-4 w-4" />
            Download Report
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#E3FDFD] to-[#FFCE99]/30 rounded-lg p-3 border border-[#FFCE99]/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-[#562F00]" />
              <span className="text-xs font-semibold text-[#562F00]">Total Cases</span>
            </div>
            <p className="text-2xl font-bold text-[#562F00]">{totalCases.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#FFCE99] to-[#FFCE99]/30 rounded-lg p-3 border border-[#FFCE99]/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">Emergency</span>
            </div>
            <p className="text-2xl font-bold text-white">{emergencyCount}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#E3FDFD] to-[#FFCE99]/40 rounded-lg p-3 border border-[#FFCE99]/60"
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-[#562F00]" />
              <span className="text-xs font-semibold text-[#562F00]">Cities</span>
            </div>
            <p className="text-2xl font-bold text-[#562F00]">{cities}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#FFCE99] to-[#FF9644] rounded-lg p-3 border border-[#FFCE99]"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">Streets</span>
            </div>
            <p className="text-2xl font-bold text-white">{affectedStreets}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-[280px] bg-card border-r border-border overflow-y-auto"
        >
          {/* Filters */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold text-foreground mb-3">Filter by Disease</h3>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDisease(null)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !selectedDisease
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                All Diseases ({stateData.length})
              </motion.button>
              {diseases.map((disease) => {
                const count = stateData.filter(d => d.disease === disease).length;
                return (
                  <motion.button
                    key={disease}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDisease(selectedDisease === disease ? null : disease)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                      selectedDisease === disease
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {disease} ({count})
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold text-foreground mb-3">Filter by Severity</h3>
            <div className="grid grid-cols-2 gap-2">
              {severities.map((severity) => {
                const count = stateData.filter(d => d.severity === severity).length;
                const isActive = selectedSeverity === severity;
                return (
                  <motion.button
                    key={severity}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSeverity(isActive ? null : severity)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={{
                      color: isActive ? '#fff' : severityColors[severity],
                      backgroundColor: isActive ? severityColors[severity] : `${severityColors[severity]}15`,
                    }}
                  >
                    {severity} ({count})
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* NGO List */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">NGOs in {stateName} ({stateNGOs.length})</h3>
            <div className="space-y-2">
              {stateNGOs.map((ngo) => (
                <motion.div
                  key={ngo.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <p className="text-xs font-bold text-foreground mb-1">{ngo.name}</p>
                  <p className="text-xs text-muted-foreground">{ngo.city}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ngo.focus.slice(0, 2).map((focus) => (
                      <span key={focus} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded">
                        {focus}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Map */}
        <div className="flex-1 relative">
          <DiseaseMap
            data={filteredData}
            selectedDisease={selectedDisease}
            selectedSeverity={selectedSeverity}
            onSelectPoint={setSelectedPoint}
            onStateClick={handleStateClick}
            userState={userState}
          />
          <DetailPanel
            point={selectedPoint}
            onClose={() => setSelectedPoint(null)}
            showAISuggestions={!!userState}
          />
        </div>
      </div>
    </div>
  );
};

export default StateDetail;
