import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertCircle, TrendingUp, Download, Search, Filter, X, BarChart3, PieChart, Activity, Tag } from 'lucide-react';
import { diseaseData } from '@/data/diseaseData';
import { exportStreetLevelReport } from '@/lib/excelExport';
import { toast } from 'sonner';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';

interface StreetAnalysisProps {
  userState?: string; // For NGO users - restrict to their state
}

const StreetAnalysis = ({ userState }: StreetAnalysisProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTags, setSearchTags] = useState<Array<{type: 'street' | 'city' | 'state', value: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data by user's state if NGO user
  const filteredDiseaseData = useMemo(() => {
    if (userState) {
      return diseaseData.filter(d => d.state === userState);
    }
    return diseaseData;
  }, [userState]);

  // Street-wise breakdown
  const streetData = useMemo(() => {
    return filteredDiseaseData.reduce((acc, d) => {
      const key = `${d.street}, ${d.city}`;
      if (!acc[key]) {
        acc[key] = {
          street: d.street,
          city: d.city,
          state: d.state,
          totalCases: 0,
          diseases: [] as string[],
          emergencyIncidents: 0,
          doctorIncidents: 0,
          selfCareIncidents: 0,
          lastReported: d.lastReported,
          incidents: [] as typeof diseaseData,
        };
      }
      acc[key].totalCases += d.cases;
      if (!acc[key].diseases.includes(d.disease)) {
        acc[key].diseases.push(d.disease);
      }
      if (d.severity === 'emergency') acc[key].emergencyIncidents += 1;
      if (d.severity === 'doctor') acc[key].doctorIncidents += 1;
      if (d.severity === 'self-care') acc[key].selfCareIncidents += 1;
      acc[key].incidents.push(d);
      if (new Date(d.lastReported) > new Date(acc[key].lastReported)) {
        acc[key].lastReported = d.lastReported;
      }
      return acc;
    }, {} as Record<string, any>);
  }, [filteredDiseaseData]);

  const streets = Object.values(streetData).sort((a: any, b: any) => b.totalCases - a.totalCases);

  // Extract unique values for filters
  const states = ['all', ...Array.from(new Set(filteredDiseaseData.map(d => d.state))).sort()];
  const cities = selectedState === 'all' 
    ? ['all', ...Array.from(new Set(filteredDiseaseData.map(d => d.city))).sort()]
    : ['all', ...Array.from(new Set(filteredDiseaseData.filter(d => d.state === selectedState).map(d => d.city))).sort()];

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    const streetSuggestions = Array.from(new Set(streets.map((s: any) => s.street)))
      .filter(street => street.toLowerCase().includes(term))
      .slice(0, 5)
      .map(street => ({ type: 'street' as const, value: street, label: street }));
    
    const citySuggestions = Array.from(new Set(streets.map((s: any) => s.city)))
      .filter(city => city.toLowerCase().includes(term))
      .slice(0, 5)
      .map(city => ({ type: 'city' as const, value: city, label: `${city} (City)` }));
    
    const stateSuggestions = Array.from(new Set(streets.map((s: any) => s.state)))
      .filter(state => state.toLowerCase().includes(term))
      .slice(0, 5)
      .map(state => ({ type: 'state' as const, value: state, label: `${state} (State)` }));
    
    return [...streetSuggestions, ...citySuggestions, ...stateSuggestions].slice(0, 10);
  }, [searchTerm, streets]);

  const filteredStreets = useMemo(() => {
    return streets.filter((street: any) => {
      // Check if matches any search tags
      const matchesTags = searchTags.length === 0 || searchTags.some(tag => {
        if (tag.type === 'street') return street.street === tag.value;
        if (tag.type === 'city') return street.city === tag.value;
        if (tag.type === 'state') return street.state === tag.value;
        return false;
      });

      const matchesSearch = 
        street.street.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        street.city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        street.state.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesState = selectedState === 'all' || street.state === selectedState;
      const matchesCity = selectedCity === 'all' || street.city === selectedCity;
      const matchesSeverity = selectedSeverity === 'all' || 
        (selectedSeverity === 'emergency' && street.emergencyIncidents > 0) ||
        (selectedSeverity === 'doctor' && street.doctorIncidents > 0) ||
        (selectedSeverity === 'self-care' && street.selfCareIncidents > 0);

      return matchesTags && matchesSearch && matchesState && matchesCity && matchesSeverity;
    });
  }, [streets, debouncedSearch, selectedState, selectedCity, selectedSeverity, searchTags]);

  const totalStreets = filteredStreets.length;
  const emergencyStreets = filteredStreets.filter((s: any) => s.emergencyIncidents > 0).length;
  const doctorStreets = filteredStreets.filter((s: any) => s.doctorIncidents > 0).length;
  const totalCases = filteredStreets.reduce((sum: number, s: any) => sum + s.totalCases, 0);
  const avgCasesPerStreet = totalStreets > 0 ? Math.round(totalCases / totalStreets) : 0;

  // Disease distribution
  const diseaseCount = useMemo(() => {
    const count: Record<string, number> = {};
    filteredStreets.forEach((street: any) => {
      street.diseases.forEach((disease: string) => {
        count[disease] = (count[disease] || 0) + 1;
      });
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredStreets]);

  const addSearchTag = (type: 'street' | 'city' | 'state', value: string) => {
    if (!searchTags.some(tag => tag.type === type && tag.value === value)) {
      setSearchTags([...searchTags, { type, value }]);
      setSearchTerm('');
      setShowSuggestions(false);
      setSuggestionIndex(-1);
      toast.success(`Added ${type}: ${value}`);
    }
  };

  const removeSearchTag = (index: number) => {
    setSearchTags(searchTags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && suggestionIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[suggestionIndex];
      addSearchTag(selected.type, selected.value);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSuggestionIndex(-1);
    }
  };

  const clearFilters = () => {
    setSelectedState('all');
    setSelectedCity('all');
    setSelectedSeverity('all');
    setSearchTerm('');
    setSearchTags([]);
  };

  const hasActiveFilters = selectedState !== 'all' || selectedCity !== 'all' || selectedSeverity !== 'all' || searchTerm !== '' || searchTags.length > 0;

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="max-w-[1800px] mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-lg shadow-[#1C4D8D]/30"
                >
                  <MapPin className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-clip-text">
                    Street-Level Analysis
                  </h1>
                  <p className="text-muted-foreground mt-1">Comprehensive location-based health insights</p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md ${
                    showFilters 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-[#4988C4] rounded-full animate-pulse" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    exportStreetLevelReport();
                    toast.success('Street analysis report downloaded!');
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#4988C4] to-[#4988C4] text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Export
                </motion.button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Filter Options
                    </h3>
                    {hasActiveFilters && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="text-sm text-destructive hover:text-destructive/80 font-semibold flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Clear All
                      </motion.button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">State</label>
                      <select
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedCity('all');
                        }}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      >
                        {states.map(state => (
                          <option key={state} value={state}>
                            {state === 'all' ? 'All States' : state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">City</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      >
                        {cities.map(city => (
                          <option key={city} value={city}>
                            {city === 'all' ? 'All Cities' : city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">Severity</label>
                      <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      >
                        <option value="all">All Urgency Levels</option>
                        <option value="emergency">Emergency Only</option>
                        <option value="doctor">Doctor Visit Only</option>
                        <option value="self-care">Self-Care Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">View Mode</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`flex-1 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                            viewMode === 'grid'
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-secondary border border-border hover:border-primary'
                          }`}
                        >
                          Grid
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`flex-1 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                            viewMode === 'list'
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-secondary border border-border hover:border-primary'
                          }`}
                        >
                          List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateZ: 2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 shadow-2xl hover:shadow-3xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(189,232,245,0.95) 0%, rgba(73,136,196,0.18) 100%)',
                boxShadow: '0 8px 32px rgba(28, 77, 141, 0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
                borderColor: 'rgba(73,136,196,0.5)'
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] blur-2xl" />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#4988C4] to-[#4988C4] bg-clip-text text-transparent">{totalStreets}</p>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Affected Streets</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateZ: -2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 shadow-2xl hover:shadow-3xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(189,232,245,0.95) 0%, rgba(28,77,141,0.18) 100%)',
                boxShadow: '0 8px 32px rgba(15, 40, 84, 0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
                borderColor: 'rgba(28,77,141,0.5)'
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] blur-2xl" />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#0F2854] to-[#4988C4] bg-clip-text text-transparent">{emergencyStreets}</p>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Emergency Streets</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.25,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateZ: 2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 shadow-2xl hover:shadow-3xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(189,232,245,0.95) 0%, rgba(73,136,196,0.22) 100%)',
                boxShadow: '0 8px 32px rgba(28, 77, 141, 0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
                borderColor: 'rgba(73,136,196,0.6)'
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4988C4] to-[#4988C4] blur-2xl" />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4988C4] to-[#4988C4] flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#4988C4] to-[#4988C4] bg-clip-text text-transparent">{doctorStreets}</p>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Doctor Visit Streets</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateZ: -2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 shadow-2xl hover:shadow-3xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(189,232,245,0.95) 0%, rgba(28,77,141,0.2) 100%)',
                boxShadow: '0 8px 32px rgba(15, 40, 84, 0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
                borderColor: 'rgba(28,77,141,0.6)'
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4988C4] to-[#0F2854] blur-2xl" />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4988C4] to-[#0F2854] flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#0F2854] to-[#4988C4] bg-clip-text text-transparent">{totalCases.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Total Cases</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.35,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateZ: 2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 shadow-2xl hover:shadow-3xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(189,232,245,0.95) 0%, rgba(73,136,196,0.25) 100%)',
                boxShadow: '0 8px 32px rgba(15, 40, 84, 0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
                borderColor: 'rgba(73,136,196,0.7)'
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4988C4] via-[#4988C4] to-[#0F2854] blur-2xl" />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#4988C4] to-[#0F2854] flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#4988C4] to-[#0F2854] bg-clip-text text-transparent">{avgCasesPerStreet}</p>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Avg per Street</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Disease Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-lg mb-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Top Diseases by Street Count</h3>
            </div>
            <div className="space-y-3">
              {diseaseCount.map(([disease, count], index) => {
                const percentage = (count / totalStreets) * 100;
                const colors = ['bg-[#0F2854]', 'bg-[#4988C4]', 'bg-[#4988C4]', 'bg-[#E3FDFD]', 'bg-[#4988C4]'];
                return (
                  <motion.div
                    key={disease}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">{disease}</span>
                      <span className="text-sm font-bold text-muted-foreground">{count} streets ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full ${colors[index % colors.length]} rounded-full shadow-sm`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Search with Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            {/* Search Tags */}
            <AnimatePresence>
              {searchTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {searchTags.map((tag, index) => {
                    const colors = {
                      street: 'bg-[#4988C4]/10 text-[#562F00] border-[#4988C4] hover:bg-[#4988C4]/20',
                      city: 'bg-[#4988C4]/10 text-[#562F00] border-[#4988C4] hover:bg-[#4988C4]/20',
                      state: 'bg-[#E3FDFD]/20 text-[#562F00] border-[#4988C4] hover:bg-[#E3FDFD]/30'
                    };
                    return (
                      <motion.div
                        key={`${tag.type}-${tag.value}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge 
                          variant="outline" 
                          className={`${colors[tag.type]} px-3 py-1.5 text-sm font-semibold border flex items-center gap-2 cursor-pointer transition-all`}
                        >
                          <Tag className="h-3 w-3" />
                          {tag.value}
                          <button
                            onClick={() => removeSearchTag(index)}
                            className="ml-1 hover:opacity-70 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    );
                  })}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchTags([])}
                    className="text-xs text-muted-foreground hover:text-destructive font-semibold flex items-center gap-1 px-2"
                  >
                    <X className="h-3 w-3" />
                    Clear All Tags
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Input with Autocomplete */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search streets, cities, or states... (Press ↓ for suggestions)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.trim().length > 0);
                  setSuggestionIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-card border-2 border-border focus:outline-none focus:border-primary text-sm font-medium shadow-sm transition-all"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setSearchTerm('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
              {searchTerm !== debouncedSearch && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-full bg-card border-2 border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold text-muted-foreground px-3 py-2 flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        Click or press Enter to add as filter tag
                      </div>
                      {suggestions.map((suggestion, index) => {
                        const colors = {
                          street: 'hover:bg-[#4988C4]/10 border-l-[#4988C4]',
                          city: 'hover:bg-[#1C4D8D]/10 border-l-[#1C4D8D]',
                          state: 'hover:bg-[#BDE8F5]/30 border-l-[#4988C4]'
                        };
                        const iconEmoji = {
                          street: '🛣️',
                          city: '🏙️',
                          state: '📍'
                        };
                        
                        return (
                          <motion.button
                            key={`${suggestion.type}-${suggestion.value}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => addSearchTag(suggestion.type, suggestion.value)}
                            className={`w-full text-left px-3 py-3 rounded-lg transition-all border-l-4 ${colors[suggestion.type]} ${
                              index === suggestionIndex ? 'bg-primary/10 border-l-primary' : 'border-l-transparent'
                            } flex items-center gap-3 group`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">{iconEmoji[suggestion.type]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-foreground truncate">
                                {suggestion.value}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {suggestion.type}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs font-semibold flex-shrink-0">
                              Add
                            </Badge>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Counter */}
            {(debouncedSearch || searchTags.length > 0) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground mt-3 ml-1 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Found {filteredStreets.length} {filteredStreets.length === 1 ? 'result' : 'results'}
                {searchTags.length > 0 && ` with ${searchTags.length} active ${searchTags.length === 1 ? 'tag' : 'tags'}`}
              </motion.p>
            )}
          </motion.div>

          {/* Street List/Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}`}>
              <AnimatePresence mode="popLayout">
                {filteredStreets.map((street: any, index) => (
                  <motion.div
                    key={`${street.street}-${street.city}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: {
                        duration: 0.4,
                        delay: Math.min(index * 0.03, 0.6),
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.95, 
                      y: -20,
                      transition: { duration: 0.2 }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateZ: 1,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="relative p-6 rounded-3xl bg-gradient-to-br from-white via-[#E3FDFD]/30 to-white backdrop-blur-xl border-2 border-[#4988C4]/50 hover:border-[#4988C4]/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    style={{
                      boxShadow: '0 8px 32px rgba(28, 77, 141, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
                    }}
                  >
                    {/* Decorative blur element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4988C4]/20 to-[#E3FDFD]/10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#4988C4] to-[#0F2854] flex items-center justify-center flex-shrink-0 shadow-lg transform hover:rotate-12 transition-transform">
                          <MapPin className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-gray-900 text-lg mb-2 truncate">{street.street}</h3>
                          <div className="flex items-center gap-2 text-sm font-bold text-[#562F00] bg-[#E3FDFD] px-3 py-1 rounded-full w-fit">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{street.city}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 bg-gradient-to-br from-[#4988C4] to-[#0F2854] rounded-xl px-4 py-3 shadow-lg">
                          <span className="text-3xl font-bold text-white">
                            {street.totalCases}
                          </span>
                          <span className="text-xs text-white/80 font-semibold uppercase tracking-wider">cases</span>
                        </div>
                      </div>

                      {/* Urgency Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-muted-foreground">Emergency</span>
                            <span className="text-xs font-bold text-[#562F00]">{street.emergencyIncidents}</span>
                          </div>
                          <div className="w-full h-2 bg-[#E3FDFD]/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#0F2854] to-[#4988C4] rounded-full"
                              style={{ width: `${(street.emergencyIncidents / Math.max(street.emergencyIncidents + street.doctorIncidents + street.selfCareIncidents, 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-muted-foreground">Doctor</span>
                            <span className="text-xs font-bold text-[#0F2854]">{street.doctorIncidents}</span>
                          </div>
                          <div className="w-full h-2 bg-[#E3FDFD]/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#4988C4] to-[#4988C4] rounded-full"
                              style={{ width: `${(street.doctorIncidents / Math.max(street.emergencyIncidents + street.doctorIncidents + street.selfCareIncidents, 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-muted-foreground">Self-Care</span>
                            <span className="text-xs font-bold text-[#0F2854]">{street.selfCareIncidents}</span>
                          </div>
                          <div className="w-full h-2 bg-[#E3FDFD]/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#4988C4] to-[#E3FDFD] rounded-full"
                              style={{ width: `${(street.selfCareIncidents / Math.max(street.emergencyIncidents + street.doctorIncidents + street.selfCareIncidents, 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#E3FDFD]/50 to-[#E3FDFD]/20 border-2 border-[#4988C4]/30">
                          <p className="text-lg font-bold text-[#562F00]">{street.diseases.length}</p>
                          <p className="text-xs text-[#0F2854] font-medium">Diseases</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#4988C4]/30 to-[#4988C4]/10 border-2 border-[#4988C4]/30">
                          <p className="text-lg font-bold text-[#562F00]">{street.incidents.length}</p>
                          <p className="text-xs text-[#0F2854] font-medium">Incidents</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#4988C4]/30 to-[#4988C4]/10 border-2 border-[#0F2854]/30">
                          <p className="text-xs font-bold text-[#562F00]">{new Date(street.lastReported).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <p className="text-xs text-[#0F2854] font-medium">Last Report</p>
                        </div>
                      </div>

                      {/* Disease Tags */}
                      <div className="flex flex-wrap gap-2">
                        {street.diseases.slice(0, 3).map((disease: string, i: number) => {
                          const colors = [
                            'from-[#4988C4] to-[#4988C4]',
                            'from-[#4988C4] to-[#0F2854]',
                            'from-[#E3FDFD] to-[#4988C4]'
                          ];
                          return (
                            <span
                              key={i}
                              className={`px-3 py-1.5 bg-gradient-to-r ${colors[i % colors.length]} text-white text-xs font-black rounded-xl shadow-md`}
                            >
                              {disease}
                            </span>
                          );
                        })}
                        {street.diseases.length > 3 && (
                          <span className="px-3 py-1.5 bg-[#E3FDFD] text-[#562F00] text-xs font-bold rounded-xl border-2 border-[#4988C4]/50">
                            +{street.diseases.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredStreets.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-border"
              >
                <MapPin className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No Streets Found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
                  >
                    Clear Filters
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StreetAnalysis;
