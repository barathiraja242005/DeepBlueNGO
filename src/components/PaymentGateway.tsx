import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, X, CreditCard, Smartphone, Building, Shield, CheckCircle2,
  Loader2, Sparkles, Lock, ArrowRight, Globe, BarChart3, HeartPulse,
  TrendingUp, IndianRupee, AlertCircle, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  ngoName: string;
  planAmount?: number;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking';
type PaymentStep = 'plan-confirm' | 'payment-method' | 'payment-details' | 'processing' | 'success' | 'failed';

const PLAN_AMOUNT = 999;

const PaymentGateway = ({ isOpen, onClose, onPaymentSuccess, ngoName, planAmount = PLAN_AMOUNT }: PaymentGatewayProps) => {
  const [step, setStep] = useState<PaymentStep>('plan-confirm');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI state
  const [upiId, setUpiId] = useState('');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('plan-confirm');
      setPaymentMethod('card');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardName('');
      setUpiId('');
      setSelectedBank('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (number: string) => {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    if (/^6(?:011|5)/.test(n)) return 'Discover';
    if (/^(508[5-9]|6069|6521|6522)/.test(n)) return 'RuPay';
    return '';
  };

  const validatePayment = (): boolean => {
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Invalid card number');
        return false;
      }
      if (cardExpiry.length < 5) {
        toast.error('Invalid expiry date');
        return false;
      }
      if (cardCvv.length < 3) {
        toast.error('Invalid CVV');
        return false;
      }
      if (cardName.trim().length < 3) {
        toast.error('Please enter cardholder name');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) {
        toast.error('Invalid UPI ID (e.g., name@upi)');
        return false;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        toast.error('Please select a bank');
        return false;
      }
    }
    return true;
  };

  const handleProcessPayment = async () => {
    if (!validatePayment()) return;

    setStep('processing');
    setIsProcessing(true);

    // Simulate payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate success (in production, this would be a real Razorpay/Stripe call)
    const isSuccess = Math.random() > 0.05; // 95% success rate for demo

    if (isSuccess) {
      setStep('success');
      setIsProcessing(false);
      
      // Auto-complete after showing success
      setTimeout(() => {
        onPaymentSuccess();
        toast.success('🎉 Premium activated successfully!', {
          description: `₹${planAmount} payment confirmed. Transaction ID: TXN${Date.now().toString(36).toUpperCase()}`,
          duration: 6000,
        });
      }, 2000);
    } else {
      setStep('failed');
      setIsProcessing(false);
    }
  };

  const banks = [
    { id: 'sbi', name: 'State Bank of India', color: '#0066B3' },
    { id: 'hdfc', name: 'HDFC Bank', color: '#004B87' },
    { id: 'icici', name: 'ICICI Bank', color: '#F58220' },
    { id: 'axis', name: 'Axis Bank', color: '#97144D' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', color: '#ED1C24' },
    { id: 'bob', name: 'Bank of Baroda', color: '#F47920' },
    { id: 'pnb', name: 'Punjab National Bank', color: '#0072BC' },
    { id: 'canara', name: 'Canara Bank', color: '#FFD700' },
  ];

  const premiumBenefits = [
    { icon: Globe, text: 'Access all 28+ states' },
    { icon: BarChart3, text: 'Advanced analytics & AI' },
    { icon: TrendingUp, text: 'Real-time outbreak alerts' },
    { icon: HeartPulse, text: '24/7 priority support' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F2854] via-[#1C4D8D] to-[#4988C4] p-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#BDE8F5] rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Premium Subscription</h3>
                    <p className="text-xs text-[#BDE8F5] font-medium">{ngoName}</p>
                  </div>
                </div>
                {step !== 'processing' && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>

              {/* Step Indicator */}
              <div className="relative z-10 flex gap-2 mt-4">
                {['Plan', 'Method', 'Pay', 'Done'].map((label, idx) => {
                  const stepIndex = ['plan-confirm', 'payment-method', 'payment-details', 'success'].indexOf(step);
                  const isActive = idx <= stepIndex || step === 'processing' && idx <= 2;
                  return (
                    <div key={label} className="flex-1">
                      <div className={`h-1 rounded-full transition-all duration-500 ${isActive ? 'bg-white' : 'bg-white/20'}`} />
                      <p className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-white' : 'text-white/40'}`}>{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <AnimatePresence mode="wait">
                {/* Step 1: Plan Confirmation */}
                {step === 'plan-confirm' && (
                  <motion.div
                    key="plan-confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {/* Plan Card */}
                    <div className="bg-gradient-to-br from-[#0F2854]/5 to-[#4988C4]/10 rounded-2xl p-5 border border-[#1C4D8D]/15">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-[#0F2854]" />
                          <span className="font-black text-[#0F2854]">CURA Premium</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white text-xs font-bold">
                          MONTHLY
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-black text-[#0F2854]">₹{planAmount}</span>
                        <span className="text-sm text-[#4988C4] font-medium">/month</span>
                      </div>
                      <div className="space-y-2.5">
                        {premiumBenefits.map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="flex items-center gap-2.5"
                          >
                            <div className="w-6 h-6 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0">
                              <benefit.icon className="h-3.5 w-3.5 text-[#4CAF50]" />
                            </div>
                            <span className="text-sm font-medium text-[#0F2854]">{benefit.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#f8faff] rounded-xl p-4 space-y-2">
                      <p className="text-xs font-bold text-[#4988C4] uppercase tracking-wide">Order Summary</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1C4D8D]">CURA Premium (Monthly)</span>
                        <span className="font-bold text-[#0F2854]">₹{planAmount}.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1C4D8D]">GST (18%)</span>
                        <span className="font-bold text-[#0F2854]">₹{Math.round(planAmount * 0.18)}.00</span>
                      </div>
                      <div className="border-t border-[#BDE8F5] pt-2 flex justify-between">
                        <span className="font-bold text-[#0F2854]">Total</span>
                        <span className="font-black text-lg text-[#0F2854]">₹{planAmount + Math.round(planAmount * 0.18)}.00</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('payment-method')}
                      className="w-full py-3.5 bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      Proceed to Payment
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>

                    <p className="text-center text-[10px] text-[#4988C4]/60 flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3" />
                      Secured by 256-bit SSL encryption
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Payment Method Selection */}
                {step === 'payment-method' && (
                  <motion.div
                    key="payment-method"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm font-bold text-[#0F2854]">Select Payment Method</p>

                    <div className="space-y-2.5">
                      {/* Card */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          paymentMethod === 'card'
                            ? 'border-[#0F2854] bg-[#0F2854]/5 shadow-md'
                            : 'border-[#BDE8F5] bg-white hover:border-[#4988C4]/40'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          paymentMethod === 'card'
                            ? 'bg-gradient-to-br from-[#0F2854] to-[#1C4D8D]'
                            : 'bg-[#BDE8F5]/50'
                        }`}>
                          <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-white' : 'text-[#4988C4]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0F2854] text-sm">Credit / Debit Card</p>
                          <p className="text-xs text-[#4988C4]">Visa, Mastercard, RuPay, Amex</p>
                        </div>
                        {paymentMethod === 'card' && <CheckCircle2 className="h-5 w-5 text-[#0F2854]" />}
                      </motion.button>

                      {/* UPI */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setPaymentMethod('upi')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          paymentMethod === 'upi'
                            ? 'border-[#0F2854] bg-[#0F2854]/5 shadow-md'
                            : 'border-[#BDE8F5] bg-white hover:border-[#4988C4]/40'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          paymentMethod === 'upi'
                            ? 'bg-gradient-to-br from-[#0F2854] to-[#1C4D8D]'
                            : 'bg-[#BDE8F5]/50'
                        }`}>
                          <Smartphone className={`h-5 w-5 ${paymentMethod === 'upi' ? 'text-white' : 'text-[#4988C4]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0F2854] text-sm">UPI</p>
                          <p className="text-xs text-[#4988C4]">Google Pay, PhonePe, Paytm, BHIM</p>
                        </div>
                        {paymentMethod === 'upi' && <CheckCircle2 className="h-5 w-5 text-[#0F2854]" />}
                      </motion.button>

                      {/* Net Banking */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          paymentMethod === 'netbanking'
                            ? 'border-[#0F2854] bg-[#0F2854]/5 shadow-md'
                            : 'border-[#BDE8F5] bg-white hover:border-[#4988C4]/40'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          paymentMethod === 'netbanking'
                            ? 'bg-gradient-to-br from-[#0F2854] to-[#1C4D8D]'
                            : 'bg-[#BDE8F5]/50'
                        }`}>
                          <Building className={`h-5 w-5 ${paymentMethod === 'netbanking' ? 'text-white' : 'text-[#4988C4]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0F2854] text-sm">Net Banking</p>
                          <p className="text-xs text-[#4988C4]">SBI, HDFC, ICICI, Axis & more</p>
                        </div>
                        {paymentMethod === 'netbanking' && <CheckCircle2 className="h-5 w-5 text-[#0F2854]" />}
                      </motion.button>
                    </div>

                    {/* Amount Display */}
                    <div className="flex items-center justify-between bg-[#f8faff] rounded-xl p-3">
                      <span className="text-sm text-[#1C4D8D] font-medium">Amount to Pay</span>
                      <span className="text-lg font-black text-[#0F2854] flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {planAmount + Math.round(planAmount * 0.18)}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('payment-details')}
                      className="w-full py-3.5 bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>

                    <button
                      onClick={() => setStep('plan-confirm')}
                      className="w-full py-2 text-sm text-[#4988C4] hover:text-[#0F2854] font-medium transition-colors"
                    >
                      ← Back to plan details
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Payment Details */}
                {step === 'payment-details' && (
                  <motion.div
                    key="payment-details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-4 w-4 text-[#0F2854]" />
                          <p className="text-sm font-bold text-[#0F2854]">Card Details</p>
                          {getCardType(cardNumber) && (
                            <span className="ml-auto text-xs font-bold text-[#4988C4] bg-[#BDE8F5]/30 px-2 py-0.5 rounded-full">
                              {getCardType(cardNumber)}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#1C4D8D] mb-1 block">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium tracking-wider text-sm placeholder:tracking-normal transition-all"
                            />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BDE8F5]" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#1C4D8D] mb-1 block">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            placeholder="NAME ON CARD"
                            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium text-sm uppercase tracking-wide transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-[#1C4D8D] mb-1 block">Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium text-sm tracking-wider transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-[#1C4D8D] mb-1 block">CVV</label>
                            <div className="relative">
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                maxLength={4}
                                placeholder="•••"
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium text-sm tracking-widest transition-all"
                              />
                              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#BDE8F5]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Payment Form */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone className="h-4 w-4 text-[#0F2854]" />
                          <p className="text-sm font-bold text-[#0F2854]">UPI Payment</p>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#1C4D8D] mb-1 block">UPI ID</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                            placeholder="yourname@upi"
                            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-[#0F2854] font-medium text-sm transition-all"
                          />
                          <p className="text-[10px] text-[#4988C4] mt-1.5">Enter your UPI ID linked to Google Pay, PhonePe, or any UPI app</p>
                        </div>

                        {/* Quick UPI Options */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { name: 'GPay', suffix: '@okicici', color: '#4285F4' },
                            { name: 'PhonePe', suffix: '@ybl', color: '#5F259F' },
                            { name: 'Paytm', suffix: '@paytm', color: '#00BAF2' },
                            { name: 'BHIM', suffix: '@upi', color: '#00897B' },
                          ].map((app) => (
                            <motion.button
                              key={app.name}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setUpiId(prev => {
                                const base = prev.split('@')[0] || 'user';
                                return base + app.suffix;
                              })}
                              className="p-2 rounded-xl border border-[#BDE8F5] hover:border-[#4988C4]/40 text-center transition-all bg-white"
                            >
                              <div className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: app.color }}>
                                {app.name[0]}
                              </div>
                              <p className="text-[10px] font-semibold text-[#0F2854]">{app.name}</p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Net Banking Form */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="h-4 w-4 text-[#0F2854]" />
                          <p className="text-sm font-bold text-[#0F2854]">Select Your Bank</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                          {banks.map((bank) => (
                            <motion.button
                              key={bank.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedBank(bank.id)}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${
                                selectedBank === bank.id
                                  ? 'border-[#0F2854] bg-[#0F2854]/5 shadow-sm'
                                  : 'border-[#BDE8F5] bg-white hover:border-[#4988C4]/30'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ backgroundColor: bank.color }}
                                >
                                  {bank.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#0F2854] truncate">{bank.name}</p>
                                </div>
                              </div>
                              {selectedBank === bank.id && (
                                <Check className="h-4 w-4 text-[#0F2854] absolute top-2 right-2" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pay Now Button */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between bg-[#f8faff] rounded-xl p-3">
                        <span className="text-sm text-[#1C4D8D] font-medium">Total Amount</span>
                        <span className="text-lg font-black text-[#0F2854]">₹{planAmount + Math.round(planAmount * 0.18)}</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(15, 40, 84, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProcessPayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-[#0F2854] via-[#1C4D8D] to-[#0F2854] text-white rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-xl disabled:opacity-50 transition-all"
                      >
                        <Shield className="h-5 w-5" />
                        Pay ₹{planAmount + Math.round(planAmount * 0.18)} Securely
                      </motion.button>

                      <button
                        onClick={() => setStep('payment-method')}
                        className="w-full py-2 text-sm text-[#4988C4] hover:text-[#0F2854] font-medium transition-colors"
                      >
                        ← Change payment method
                      </button>

                      <div className="flex items-center justify-center gap-3 pt-1">
                        <div className="flex items-center gap-1 text-[10px] text-[#4988C4]/60">
                          <Lock className="h-3 w-3" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="w-px h-3 bg-[#BDE8F5]" />
                        <div className="flex items-center gap-1 text-[10px] text-[#4988C4]/60">
                          <Shield className="h-3 w-3" />
                          <span>PCI DSS Compliant</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Processing */}
                {step === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="relative mx-auto w-20 h-20">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border-4 border-[#BDE8F5] border-t-[#0F2854]"
                      />
                      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#0F2854] to-[#1C4D8D] flex items-center justify-center">
                        <IndianRupee className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#0F2854]">Processing Payment</h4>
                      <p className="text-sm text-[#4988C4] mt-1">Please do not close this window...</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-[#4988C4]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying with your bank</span>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 text-center space-y-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                      className="relative mx-auto w-20 h-20"
                    >
                      <div className="absolute inset-0 rounded-full bg-[#4CAF50]/10" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="absolute inset-2 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center shadow-lg"
                      >
                        <Check className="h-8 w-8 text-white" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="text-xl font-black text-[#0F2854]">Payment Successful! 🎉</h4>
                      <p className="text-sm text-[#4988C4] mt-1">Premium subscription activated</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-[#4CAF50]/5 rounded-xl p-4 space-y-2 text-left border border-[#4CAF50]/20"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1C4D8D]">Transaction ID</span>
                        <span className="font-bold text-[#0F2854] font-mono text-xs">TXN{Date.now().toString(36).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1C4D8D]">Amount Paid</span>
                        <span className="font-bold text-[#0F2854]">₹{planAmount + Math.round(planAmount * 0.18)}.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1C4D8D]">Plan</span>
                        <span className="font-bold text-[#0F2854] flex items-center gap-1">
                          <Crown className="h-3.5 w-3.5" /> Premium Monthly
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1C4D8D]">Next Billing</span>
                        <span className="font-bold text-[#0F2854]">
                          {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center justify-center gap-2 text-sm text-[#4CAF50] font-medium"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Redirecting to dashboard...</span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 6: Failed */}
                {step === 'failed' && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 text-center space-y-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="relative mx-auto w-20 h-20"
                    >
                      <div className="absolute inset-0 rounded-full bg-red-500/10" />
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div>
                      <h4 className="text-xl font-black text-[#0F2854]">Payment Failed</h4>
                      <p className="text-sm text-[#4988C4] mt-1">Your bank declined the transaction</p>
                    </div>

                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('payment-details')}
                        className="w-full py-3.5 bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        Try Again
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                      <button
                        onClick={() => setStep('payment-method')}
                        className="w-full py-2 text-sm text-[#4988C4] hover:text-[#0F2854] font-medium transition-colors"
                      >
                        Try a different payment method
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentGateway;
