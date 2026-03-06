import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, Download } from 'lucide-react';
import { diseaseData } from '@/data/diseaseData';
import { exportAnalyticsToExcel } from '@/lib/excelExport';
import { toast } from 'sonner';
import { useMemo } from 'react';

interface AnalyticsProps {
  userState?: string; // For NGO users - restrict to their state
}

const Analytics = ({ userState }: AnalyticsProps) => {
  // Filter data by user's state if NGO user
  const filteredDiseaseData = useMemo(() => {
    if (userState) {
      return diseaseData.filter(d => d.state === userState);
    }
    return diseaseData;
  }, [userState]);

  const severityCount = filteredDiseaseData.reduce((acc, d) => {
    acc[d.severity] = (acc[d.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stateCount = filteredDiseaseData.reduce((acc, d) => {
    acc[d.state] = (acc[d.state] || 0) + d.cases;
    return acc;
  }, {} as Record<string, number>);

  const topStates = Object.entries(stateCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="h-screen overflow-y-auto bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Data insights and trends</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                exportAnalyticsToExcel();
                toast.success('Analytics report downloaded successfully!');
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#4988C4] to-[#1C4D8D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
            >
              <Download className="h-4 w-4" />
              Download Analytics
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Severity Distribution</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(severityCount).map(([severity, count], index) => {
                const colors = {
                  low: 'from-[#BDE8F5] to-[#4988C4]',
                  medium: 'from-[#4988C4] to-[#1C4D8D]',
                  high: 'from-[#1C4D8D] to-[#0F2854]',
                  critical: 'from-[#0F2854] to-[#1C4D8D]',
                };
                const percentage = ((count / diseaseData.length) * 100).toFixed(1);
                
                return (
                  <motion.div
                    key={severity}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold capitalize text-foreground">{severity}</span>
                      <span className="text-sm text-muted-foreground">{count} incidents ({percentage}%)</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className={`h-full bg-gradient-to-r ${colors[severity as keyof typeof colors]} rounded-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* State-wise Cases */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Top States by Cases</h2>
            </div>
            <div className="space-y-3">
              {topStates.map(([state, cases], index) => {
                const maxCases = topStates[0][1];
                const percentage = ((cases / maxCases) * 100).toFixed(0);
                
                return (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-foreground">{state}</span>
                      <span className="text-sm font-semibold text-primary">{cases.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Disease Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Disease Overview</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(
                diseaseData.reduce((acc, d) => {
                  if (!acc[d.disease]) {
                    acc[d.disease] = { count: 0, cases: 0 };
                  }
                  acc[d.disease].count += 1;
                  acc[d.disease].cases += d.cases;
                  return acc;
                }, {} as Record<string, { count: number; cases: number }>)
              )
                .sort((a, b) => b[1].cases - a[1].cases)
                .map(([disease, data], index) => (
                  <motion.div
                    key={disease}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 border border-border text-center"
                  >
                    <p className="text-2xl font-bold text-foreground mb-1">{data.cases.toLocaleString()}</p>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{disease}</p>
                    <p className="text-xs text-muted-foreground">{data.count} locations</p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
