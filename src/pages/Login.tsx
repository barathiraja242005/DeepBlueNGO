import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Shield, Building2, Eye, EyeOff, Crown, Zap, Lock, MapPin, BarChart3, Sparkles, CheckCircle2, Star, ArrowRight, Globe, HeartPulse, TrendingUp } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { ngoData } from '@/data/ngoData';
import { toast } from 'sonner';
import PaymentGateway from '@/components/PaymentGateway';

type PlanType = 'free' | 'premium';

const Login = () => {
  const { login } = useUser();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'ngo'>('ngo');
  const [ngoId, setNgoId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('free');
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [pendingNgo, setPendingNgo] = useState<typeof ngoData[0] | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'admin') {
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
      const ngo = ngoData.find(n => n.id === ngoId);
      if (ngo) {
        if (selectedPlan === 'premium') {
          // Open payment gateway for premium
          setPendingNgo(ngo);
          setShowPaymentGateway(true);
        } else {
          // Direct login for free plan
          login({
            id: ngo.id,
            role: 'ngo',
            name: ngo.name,
            ngoId: ngo.id,
            state: ngo.state,
            city: ngo.city,
            subscription: 'free',
          });
          toast.success(`Welcome ${ngo.name}!`, {
            description: `Access limited to ${ngo.state}. Upgrade to Premium for all states.`,
          });
        }
      } else {
        toast.error('Invalid NGO ID');
      }
    }
  };

  const handlePaymentSuccess = () => {
    if (pendingNgo) {
      login({
        id: pendingNgo.id,
        role: 'ngo',
        name: pendingNgo.name,
        ngoId: pendingNgo.id,
        state: pendingNgo.state,
        city: pendingNgo.city,
        subscription: 'premium',
      });
      setShowPaymentGateway(false);
      setPendingNgo(null);
    }
  };

  const premiumFeatures = [
    { icon: Globe, title: 'All States Access', desc: 'Monitor health data across all 28+ states' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights with predictive trends' },
    { icon: TrendingUp, title: 'Real-time Alerts', desc: 'Instant outbreak notifications' },
    { icon: HeartPulse, title: 'Priority Support', desc: '24/7 dedicated assistance' },
  ];

  const freeFeatures = [
    { included: true, text: 'Single state access' },
    { included: true, text: 'Basic disease tracking' },
    { included: true, text: 'NGO network view' },
    { included: false, text: 'Multi-state monitoring' },
    { included: false, text: 'Advanced analytics' },
    { included: false, text: 'Export reports' },
    { included: false, text: 'Priority support' },
  ];

  const premiumPlanFeatures = [
    { included: true, text: 'All states access' },
    { included: true, text: 'Advanced disease tracking' },
    { included: true, text: 'NGO network view' },
    { included: true, text: 'Multi-state monitoring' },
    { included: true, text: 'Advanced analytics & AI' },
    { included: true, text: 'Export reports (Excel/PDF)' },
    { included: true, text: '24/7 Priority support' },
  ];

  return (
    <div className="min-h-screen flex bg-[#f0f7ff]">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F2854] via-[#1C4D8D] to-[#4988C4] p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#4988C4]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-[#BDE8F5]/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-[#4988C4]/10 to-[#BDE8F5]/10 rounded-full blur-3xl"
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg shadow-black/10">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">CURA</h2>
              <p className="text-[#BDE8F5] text-sm font-semibold tracking-wider uppercase">Health Surveillance</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-[#BDE8F5]" />
              <span className="text-sm font-semibold text-white/90">Trusted by 50+ NGOs nationwide</span>
            </motion.div>
            <h1 className="text-5xl font-black text-white leading-[1.1]">
              Real-Time Health<br />
              <span className="bg-gradient-to-r from-[#BDE8F5] to-[#4988C4] bg-clip-text text-transparent">Data Analytics</span>
            </h1>
          </div>
          <p className="text-lg text-white/80 font-medium leading-relaxed max-w-md">
            Track disease outbreaks, analyze patterns, and coordinate responses across India's urban communities.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {premiumFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/[0.12] transition-colors group"
              >
                <feature.icon className="h-5 w-5 text-[#BDE8F5] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white">{feature.title}</p>
                <p className="text-xs text-white/60 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-8"
        >
          <div>
            <p className="text-3xl font-black text-white">161</p>
            <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Cases Tracked</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-3xl font-black text-white">28+</p>
            <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">States</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-3xl font-black text-white">50+</p>
            <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Partners</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C4D8D] to-[#4988C4] flex items-center justify-center">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-[#0F2854]">CURA</h2>
            </div>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-[#0F2854] mb-2">Welcome Back</h1>
            <p className="text-[#4988C4] font-medium">Sign in to access your dashboard</p>
          </motion.div>

          {/* Role Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 p-1.5 bg-[#BDE8F5]/30 rounded-2xl mb-6"
          >
            <button
              onClick={() => { setSelectedRole('ngo'); setShowPlanSelector(false); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                selectedRole === 'ngo'
                  ? 'bg-white text-[#0F2854] shadow-md'
                  : 'text-[#4988C4] hover:text-[#1C4D8D]'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              NGO Partner
            </button>
            <button
              onClick={() => { setSelectedRole('admin'); setShowPlanSelector(false); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-[#0F2854] shadow-md'
                  : 'text-[#4988C4] hover:text-[#1C4D8D]'
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
              <>
                {/* NGO Organization Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#0F2854]">
                    Select Your Organization
                  </label>
                  <select
                    value={ngoId}
                    onChange={(e) => { setNgoId(e.target.value); setShowPlanSelector(!!e.target.value); }}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium transition-all hover:border-[#4988C4]/50"
                  >
                    <option value="">Choose your organization...</option>
                    {ngoData.map(ngo => (
                      <option key={ngo.id} value={ngo.id}>
                        {ngo.name} — {ngo.city}, {ngo.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subscription Plan Selector */}
                <AnimatePresence>
                  {showPlanSelector && ngoId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-[#0F2854] flex items-center gap-2">
                          <Zap className="h-4 w-4 text-[#4988C4]" />
                          Choose Your Plan
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Free Plan Card */}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlan('free')}
                            className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                              selectedPlan === 'free'
                                ? 'border-[#4988C4] bg-[#BDE8F5]/20 shadow-md shadow-[#4988C4]/10'
                                : 'border-[#BDE8F5] bg-white hover:border-[#4988C4]/40'
                            }`}
                          >
                            {selectedPlan === 'free' && (
                              <motion.div
                                layoutId="planIndicator"
                                className="absolute top-3 right-3"
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              >
                                <CheckCircle2 className="h-5 w-5 text-[#4988C4]" />
                              </motion.div>
                            )}
                            <div className="w-9 h-9 rounded-xl bg-[#BDE8F5]/50 flex items-center justify-center mb-3">
                              <MapPin className="h-5 w-5 text-[#4988C4]" />
                            </div>
                            <p className="font-black text-[#0F2854] text-sm">Free</p>
                            <p className="text-xs text-[#4988C4] font-medium mt-0.5">Single state</p>
                            <div className="mt-3 pt-3 border-t border-[#BDE8F5]">
                              <p className="text-xl font-black text-[#0F2854]">₹0<span className="text-xs font-medium text-[#4988C4]">/mo</span></p>
                            </div>
                          </motion.button>

                          {/* Premium Plan Card */}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlan('premium')}
                            className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                              selectedPlan === 'premium'
                                ? 'border-[#0F2854] bg-gradient-to-br from-[#0F2854]/5 to-[#4988C4]/10 shadow-lg shadow-[#0F2854]/15'
                                : 'border-[#BDE8F5] bg-white hover:border-[#0F2854]/40'
                            }`}
                          >
                            {/* Premium Badge */}
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                <Crown className="h-3 w-3" />
                                Popular
                              </span>
                            </div>
                            {selectedPlan === 'premium' && (
                              <motion.div
                                layoutId="planIndicator"
                                className="absolute top-3 right-3"
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              >
                                <CheckCircle2 className="h-5 w-5 text-[#0F2854]" />
                              </motion.div>
                            )}
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F2854] to-[#1C4D8D] flex items-center justify-center mb-3 shadow-md">
                              <Crown className="h-5 w-5 text-[#BDE8F5]" />
                            </div>
                            <p className="font-black text-[#0F2854] text-sm">Premium</p>
                            <p className="text-xs text-[#1C4D8D] font-medium mt-0.5">All states</p>
                            <div className="mt-3 pt-3 border-t border-[#1C4D8D]/15">
                              <p className="text-xl font-black text-[#0F2854]">₹999<span className="text-xs font-medium text-[#4988C4]">/mo</span></p>
                            </div>
                          </motion.button>
                        </div>

                        {/* Feature Comparison */}
                        <motion.div className="bg-white rounded-2xl border border-[#BDE8F5] overflow-hidden">
                          <div className="p-3">
                            <AnimatePresence mode="wait">
                              {selectedPlan === 'free' ? (
                                <motion.div
                                  key="free-features"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4 text-[#4988C4]" />
                                    <span className="text-xs font-bold text-[#0F2854] uppercase tracking-wide">Free Plan Features</span>
                                  </div>
                                  {freeFeatures.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      {feat.included ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-[#4CAF50] flex-shrink-0" />
                                      ) : (
                                        <Lock className="h-3.5 w-3.5 text-[#BDE8F5] flex-shrink-0" />
                                      )}
                                      <span className={`text-xs font-medium ${feat.included ? 'text-[#0F2854]' : 'text-[#4988C4]/50 line-through'}`}>
                                        {feat.text}
                                      </span>
                                    </div>
                                  ))}
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="premium-features"
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Crown className="h-4 w-4 text-[#0F2854]" />
                                    <span className="text-xs font-bold text-[#0F2854] uppercase tracking-wide">Premium Plan Features</span>
                                  </div>
                                  {premiumPlanFeatures.map((feat, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, x: 5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.03 }}
                                      className="flex items-center gap-2"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5 text-[#4CAF50] flex-shrink-0" />
                                      <span className="text-xs font-medium text-[#0F2854]">{feat.text}</span>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#0F2854]">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium pr-12 transition-all hover:border-[#4988C4]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4988C4] hover:text-[#0F2854] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-[#4988C4] font-medium">
                  Demo: Use "admin123" to login
                </p>
              </div>
            )}

            {/* Sign In Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(15, 40, 84, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2.5 mt-6 ${
                selectedRole === 'ngo' && selectedPlan === 'premium'
                  ? 'bg-gradient-to-r from-[#0F2854] via-[#1C4D8D] to-[#0F2854] text-white hover:shadow-[#0F2854]/30'
                  : 'bg-gradient-to-r from-[#1C4D8D] via-[#4988C4] to-[#1C4D8D] text-white hover:shadow-[#4988C4]/30'
              }`}
            >
              {selectedRole === 'ngo' && selectedPlan === 'premium' && (
                <Crown className="h-5 w-5" />
              )}
              <LogIn className="h-5 w-5" />
              {selectedRole === 'ngo' && selectedPlan === 'premium' ? 'Subscribe & Sign In — ₹999/mo' : 'Sign In'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </motion.button>
          </motion.form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <AnimatePresence mode="wait">
              {selectedRole === 'ngo' && selectedPlan === 'premium' ? (
                <motion.div
                  key="premium-info"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#0F2854]/5 to-[#4988C4]/10 border border-[#1C4D8D]/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F2854] to-[#1C4D8D] flex items-center justify-center flex-shrink-0">
                      <Crown className="h-4 w-4 text-[#BDE8F5]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F2854]">Premium Benefits</p>
                      <p className="text-xs text-[#1C4D8D] leading-relaxed mt-1">
                        Access all states, advanced analytics, AI-powered insights, and priority support. Cancel anytime.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="free-info"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-4 rounded-xl bg-[#BDE8F5]/20 border border-[#4988C4]/20"
                >
                  <p className="text-xs text-[#1C4D8D] leading-relaxed">
                    <strong className="font-bold text-[#0F2854]">Note:</strong>{' '}
                    {selectedRole === 'ngo'
                      ? 'Free NGO users can only access data for their registered state. Upgrade to Premium for full access.'
                      : 'Administrators have full system access to all states and features.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-[#4988C4] text-[#4988C4]" />
              ))}
              <span className="text-xs font-bold text-[#0F2854] ml-2">4.9/5</span>
            </div>
            <p className="text-xs text-[#4988C4] font-semibold mb-3">Trusted by health organizations nationwide</p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {['#0F2854', '#1C4D8D', '#4988C4', '#4CAF50'].map((color, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2, zIndex: 10 }}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    {['M', 'D', 'K', 'C'][i]}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-[#1C4D8D] font-medium ml-2">50+ Active Partners</p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-[10px] text-[#4988C4]/60 mt-6"
          >
            © 2026 CURA. All rights reserved. | Privacy Policy | Terms of Service
          </motion.p>
        </motion.div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentGateway
        isOpen={showPaymentGateway}
        onClose={() => { setShowPaymentGateway(false); setPendingNgo(null); }}
        onPaymentSuccess={handlePaymentSuccess}
        ngoName={pendingNgo?.name || ''}
      />
    </div>
  );
};

export default Login;
