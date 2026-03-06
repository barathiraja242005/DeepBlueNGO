import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Shield, Building2, Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { ngoData } from '@/data/ngoData';
import { toast } from 'sonner';

const Login = () => {
  const { login } = useUser();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'ngo'>('ngo');
  const [ngoId, setNgoId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'admin') {
      // Simple admin login (in production, use proper authentication)
      if (password === 'admin123') {
        login({
          id: 'admin1',
          role: 'admin',
          name: 'Admin User',
        });
        toast.success('Welcome Admin!');
      } else {
        toast.error('Invalid admin credentials');
      }
    } else {
      // NGO login
      const ngo = ngoData.find(n => n.id === ngoId);
      if (ngo) {
        login({
          id: ngo.id,
          role: 'ngo',
          name: ngo.name,
          ngoId: ngo.id,
          state: ngo.state,
          city: ngo.city,
        });
        toast.success(`Welcome ${ngo.name}!`);
      } else {
        toast.error('Invalid NGO ID');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#050C9C] via-[#3572EF] to-[#3ABEF9] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-[#A7E6FF]/20 rounded-full blur-3xl"
        />

        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LogIn className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Street Health</h2>
              <p className="text-white/80 text-sm font-medium">Monitoring System</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-6"
        >
          <h1 className="text-5xl font-black text-white leading-tight">
            Real-Time Health<br />
            <span className="text-[#A7E6FF]">Data Analytics</span>
          </h1>
          <p className="text-xl text-white/90 font-medium leading-relaxed max-w-md">
            Track disease outbreaks, analyze patterns, and coordinate responses across India's urban communities.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <p className="text-3xl font-black text-white">161</p>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wide">Active Cases</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <p className="text-3xl font-black text-white">28+</p>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wide">States</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <p className="text-3xl font-black text-white">50+</p>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wide">NGO Partners</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 text-white/60 text-sm font-medium"
        >
          © 2026 Street Health Map. All rights reserved.
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-[#050C9C]">Street Health</h2>
            </div>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-[#050C9C] mb-2">Welcome Back</h1>
            <p className="text-[#3ABEF9] font-medium">Sign in to access your dashboard</p>
          </motion.div>

          {/* Role Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 p-1.5 bg-[#A7E6FF]/30 rounded-2xl mb-6"
          >
            <button
              onClick={() => setSelectedRole('ngo')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                selectedRole === 'ngo'
                  ? 'bg-white text-[#050C9C] shadow-md'
                  : 'text-[#3ABEF9] hover:text-[#3572EF]'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              NGO Partner
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-[#050C9C] shadow-md'
                  : 'text-[#3ABEF9] hover:text-[#3572EF]'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Administrator
            </button>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {selectedRole === 'ngo' ? (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#050C9C]">
                  Select Your Organization
                </label>
                <select
                  value={ngoId}
                  onChange={(e) => setNgoId(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-[#A7E6FF] focus:border-[#3ABEF9] focus:outline-none text-[#050C9C] font-medium transition-colors"
                >
                  <option value="">Choose your organization...</option>
                  {ngoData.map(ngo => (
                    <option key={ngo.id} value={ngo.id}>
                      {ngo.name} - {ngo.city}, {ngo.state}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#3ABEF9] font-medium">
                  Select your registered NGO from the list
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#050C9C]">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-[#A7E6FF] focus:border-[#3ABEF9] focus:outline-none text-[#050C9C] font-medium pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3ABEF9] hover:text-[#050C9C] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-[#3ABEF9] font-medium">
                  Demo: Use "admin123" to login
                </p>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#050C9C] via-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 mt-6"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </motion.button>
          </motion.form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-xl bg-[#A7E6FF]/20 border border-[#3ABEF9]/30"
          >
            <p className="text-xs text-[#3572EF] leading-relaxed">
              <strong className="font-bold text-[#050C9C]">Note:</strong> NGO users can only access data for their registered state. Administrators have full system access.
            </p>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-[#3ABEF9] font-semibold mb-3">Trusted by health organizations nationwide</p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3ABEF9] to-[#3572EF] border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#3572EF] font-medium ml-2">50+ Active Partners</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
