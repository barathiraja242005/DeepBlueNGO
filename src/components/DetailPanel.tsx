import { useState } from 'react';
import { DiseasePoint } from '@/data/diseaseData';
import { NGO, ngoData } from '@/data/ngoData';
import { X, Sparkles, Building2, Phone, Globe, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailPanelProps {
  point: DiseasePoint | null;
  onClose: () => void;
  showAISuggestions?: boolean; // Hide for admin users
}

const DetailPanel = ({ point, onClose, showAISuggestions = true }: DetailPanelProps) => {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!point) return null;

  const cityNgos = ngoData.filter(
    (ngo) => ngo.city === point.city
  );

  const fetchSuggestions = async () => {
    setLoading(true);
    setSuggestions(null);
    try {
      const { data, error } = await supabase.functions.invoke('disease-suggestions', {
        body: {
          disease: point.disease,
          city: point.city,
          severity: point.severity,
          cases: point.cases,
          street: point.street,
          description: point.description,
        },
      });
      if (error) throw error;
      setSuggestions(data.suggestions);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Failed to get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: 420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 420, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 z-[1001] h-full w-[420px] bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl shadow-primary/5 overflow-y-auto"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-border p-4 flex items-start justify-between z-10"
        >
          <div>
            <h2 className="font-display text-base font-bold text-foreground">{point.disease}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{point.street}, {point.city}</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </motion.div>

        {/* Disease Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 border-b border-border"
        >
          <div className="grid grid-cols-3 gap-2">
            {[{label: 'Cases', value: point.cases}, {label: 'Severity', value: point.severity, capitalize: true}, {label: 'State', value: point.state}].map((item, i) => (
              <motion.div 
                key={item.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className={`text-lg font-bold font-display text-foreground ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">{item.label}</p>
              </motion.div>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground mt-3 leading-relaxed"
          >
            {point.description}
          </motion.p>
        </motion.div>

        {/* Nearby NGOs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-b border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Building2 className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Nearby NGOs ({cityNgos.length})</span>
          </div>
          <div className="space-y-3">
            {cityNgos.map((ngo, i) => (
              <motion.div 
                key={ngo.id} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gradient-to-r from-secondary to-secondary/50 rounded-xl p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h4 className="text-xs font-bold text-foreground mb-1">{ngo.name}</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {ngo.contact}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-primary">
                    <Globe className="h-3 w-3" />
                    {ngo.website}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {ngo.focus.map((f) => (
                    <motion.span 
                      key={f} 
                      whileHover={{ scale: 1.1 }}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded-md"
                    >
                      {f}
                    </motion.span>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-foreground uppercase tracking-wider mb-1">Assigned Activities</p>
                  {ngo.assignedActivities.map((act, j) => (
                    <motion.div 
                      key={j} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 + j * 0.05 }}
                      className="flex items-start gap-1.5"
                    >
                      <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-[11px] text-muted-foreground leading-relaxed">{act}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
            {cityNgos.length === 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground italic"
              >
                No registered NGOs found in this city.
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* AI Suggestions - Only for NGO users */}
        {showAISuggestions && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 2, repeat: loading ? Infinity : 0, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">AI Suggestions</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchSuggestions}
              disabled={loading}
              className="px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] font-bold rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              {loading ? 'Analyzing...' : 'Get AI Suggestions'}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {suggestions && (
              <motion.div 
                key="suggestions"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-primary/5 to-accent rounded-xl p-4 border border-primary/10 shadow-sm"
              >
                <div className="prose prose-sm max-w-none">
                  {suggestions.split('\n').filter(Boolean).map((line, i) => (
                    <motion.p 
                      key={i} 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-xs text-foreground leading-relaxed mb-2 last:mb-0"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}

            {!suggestions && !loading && (
              <motion.div 
                key="placeholder"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-secondary rounded-xl p-4 text-center border border-border/50"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                </motion.div>
                <p className="text-xs text-muted-foreground">Click "Get AI Suggestions" for tailored disease reduction strategies powered by AI.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailPanel;
