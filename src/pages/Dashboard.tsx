import { motion } from 'framer-motion';
import { Activity, TrendingUp, AlertTriangle, Users, MapPin, Heart, Download } from 'lucide-react';
import { diseaseData } from '@/data/diseaseData';
import { ngoData } from '@/data/ngoData';
import { exportDashboardReport } from '@/lib/excelExport';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { colors } from '@/config/colors';

interface DashboardProps {
  userState?: string; // For NGO users - restrict to their state
}

const Dashboard = ({ userState }: DashboardProps) => {
  // Filter data by user's state if NGO user
  const filteredDiseaseData = useMemo(() => {
    if (userState) {
      return diseaseData.filter(d => d.state === userState);
    }
    return diseaseData;
  }, [userState]);

  const filteredNgoData = useMemo(() => {
    if (userState) {
      return ngoData.filter(n => n.state === userState);
    }
    return ngoData;
  }, [userState]);

  const totalCases = filteredDiseaseData.reduce((sum, d) => sum + d.cases, 0);
  const emergencyCases = filteredDiseaseData.filter((d) => d.severity === 'emergency').length;
  const activeStates = new Set(filteredDiseaseData.map((d) => d.state)).size;
  const totalNGOs = filteredNgoData.length;

  const stats = [
    { icon: Activity, label: 'Total Cases', value: totalCases.toLocaleString(), color: colors.gradients.soft, bgPattern: colors.backgrounds.light, change: '+12%' },
    { icon: AlertTriangle, label: 'Emergency', value: emergencyCases, color: colors.gradients.reverse, bgPattern: colors.backgrounds.primary, change: '-5%' },
    { icon: MapPin, label: 'Active States', value: activeStates, color: colors.gradients.primary, bgPattern: colors.backgrounds.secondary, change: '+3' },
    { icon: Users, label: 'NGO Partners', value: totalNGOs, color: colors.gradients.light, bgPattern: colors.backgrounds.light, change: '+8' },
  ];

  const recentAlerts = filteredDiseaseData
    .filter((d) => d.severity === 'emergency' || d.severity === 'doctor')
    .slice(0, 5);

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">CURA-NGO Dashboard</h1>
                <p className="text-muted-foreground">Real-time health surveillance overview</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                exportDashboardReport();
                toast.success('Dashboard report downloaded successfully!');
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#4988C4] to-[#4988C4] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
            >
              <Download className="h-4 w-4" />
              Download Report
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-[#562F00] bg-[#E3FDFD] px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-bold text-foreground">Recent Alerts</h2>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{alert.disease}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{alert.city}, {alert.state}</p>
                      <p className="text-xs text-muted-foreground">{alert.street}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        alert.severity === 'emergency' 
                          ? 'bg-[#0F2854] text-white' 
                          : 'bg-[#4988C4] text-white'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{alert.cases} cases</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Disease Distribution</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(
                diseaseData.reduce((acc, d) => {
                  acc[d.disease] = (acc[d.disease] || 0) + d.cases;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([disease, cases], index) => {
                  const percentage = ((cases / totalCases) * 100).toFixed(1);
                  return (
                    <motion.div
                      key={disease}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{disease}</span>
                        <span className="text-muted-foreground">{cases.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
