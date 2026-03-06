import { motion } from 'framer-motion';
import { Users, Phone, Globe, MapPin, CheckCircle, Building2, Download } from 'lucide-react';
import { ngoData } from '@/data/ngoData';
import { exportNGODataToExcel } from '@/lib/excelExport';
import { toast } from 'sonner';
import { useMemo } from 'react';

interface NGONetworkProps {
  userState?: string; // For NGO users - restrict to their state
}

const NGONetwork = ({ userState }: NGONetworkProps) => {
  // Filter NGOs by user's state if NGO user
  const filteredNgoData = useMemo(() => {
    if (userState) {
      return ngoData.filter(n => n.state === userState);
    }
    return ngoData;
  }, [userState]);

  const cityCounts = filteredNgoData.reduce((acc, ngo) => {
    acc[ngo.city] = (acc[ngo.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const focusAreas = filteredNgoData.reduce((acc, ngo) => {
    ngo.focus.forEach(f => {
      acc[f] = (acc[f] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

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
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">NGO Network</h1>
                <p className="text-muted-foreground">Partner organizations{userState ? ` in ${userState}` : ' making a difference'}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                exportNGODataToExcel();
                toast.success('NGO directory downloaded successfully!');
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#4988C4] to-[#1C4D8D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
            >
              <Download className="h-4 w-4" />
              Download Directory
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold text-foreground">{filteredNgoData.length}</p>
                <p className="text-sm text-muted-foreground">Total NGOs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-8 w-8 text-[#1C4D8D]" />
              <div>
                <p className="text-3xl font-bold text-foreground">{Object.keys(cityCounts).length}</p>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-8 w-8 text-[#4988C4]" />
              <div>
                <p className="text-3xl font-bold text-foreground">{Object.keys(focusAreas).length}</p>
                <p className="text-sm text-muted-foreground">Focus Areas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* NGO List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-sm"
        >
          <h2 className="text-xl font-bold text-foreground mb-6">All Partner Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNgoData.map((ngo, index) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05, type: 'spring', stiffness: 120 }}
                whileHover={{ scale: 1.05, y: -8, rotateZ: 1 }}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-white via-[#BDE8F5]/30 to-white backdrop-blur-xl border-2 border-[#4988C4]/50 hover:border-[#1C4D8D]/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                style={{
                  boxShadow: '0 8px 32px rgba(28, 77, 141, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4988C4]/20 to-[#BDE8F5]/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] flex items-center justify-center flex-shrink-0 shadow-lg transform hover:rotate-12 transition-transform">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 text-lg mb-2 truncate">{ngo.name}</h3>
                      <div className="flex items-center gap-2 text-sm font-bold text-[#0F2854] bg-[#BDE8F5] px-3 py-1 rounded-full w-fit">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{ngo.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{ngo.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Globe className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                    <a 
                      href={`https://${ngo.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {ngo.website}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {ngo.focus.map((focus, idx) => {
                    const colors = [
                      'from-[#4988C4] to-[#1C4D8D]',
                      'from-[#1C4D8D] to-[#0F2854]',
                      'from-[#BDE8F5] to-[#4988C4]',
                      'from-[#0F2854] to-[#4988C4]',
                      'from-[#4988C4] via-[#1C4D8D] to-[#0F2854]'
                    ];
                    return (
                      <span 
                        key={focus} 
                        className={`px-3 py-1.5 bg-gradient-to-r ${colors[idx % colors.length]} text-white text-xs font-black rounded-xl shadow-md`}
                      >
                        {focus}
                      </span>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Key Activities:</p>
                  <div className="space-y-1">
                    {ngo.assignedActivities.slice(0, 2).map((activity, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground line-clamp-1">{activity}</span>
                      </div>
                    ))}
                    {ngo.assignedActivities.length > 2 && (
                      <span className="text-xs text-primary font-medium">
                        +{ngo.assignedActivities.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NGONetwork;
