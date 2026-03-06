import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Trash2, Edit2, Search, Eye, Activity, AlertCircle, CheckCircle, XCircle, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ngoData } from '@/data/ngoData';
import { toast } from 'sonner';

const NGOManagement = () => {
  const [ngos, setNgos] = useState(ngoData);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchTags, setSearchTags] = useState<Array<{type: 'name' | 'city' | 'state' | 'focus', value: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Get unique values for dropdowns from existing NGO data
  const existingCities = useMemo(() => {
    const cities = Array.from(new Set(ngos.map(n => n.city))).sort();
    return cities;
  }, [ngos]);

  const existingStates = useMemo(() => {
    const states = Array.from(new Set(ngos.map(n => n.state))).sort();
    return states;
  }, [ngos]);

  const existingFocusAreas = useMemo(() => {
    const areas = Array.from(new Set(ngos.flatMap(n => n.focus))).sort();
    return areas;
  }, [ngos]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city: '',
    state: '',
    contact: '',
    email: '',
    website: '',
    focus: [] as string[],
    assignedActivities: [] as string[],
    established: '',
    volunteers: 0,
    activeProjects: 0,
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    city: '',
    state: '',
    contact: '',
    email: '',
    focus: ''
  });

  // Validate form
  const validateForm = () => {
    const errors = {
      name: '',
      city: '',
      state: '',
      contact: '',
      email: '',
      focus: ''
    };

    let isValid = true;

    // Required field validations
    if (!formData.name.trim()) {
      errors.name = 'NGO name is required';
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }

    if (!formData.contact.trim()) {
      errors.contact = 'Contact number is required';
      isValid = false;
    } else if (!/^[+\d][\d\s-]{8,}$/.test(formData.contact)) {
      errors.contact = 'Please enter a valid contact number';
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.focus.length === 0) {
      errors.focus = 'At least one focus area is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    const results: Array<{type: 'name' | 'city' | 'state' | 'focus', value: string}> = [];
    
    // Get unique values
    const names = new Set(ngos.map(n => n.name));
    const cities = new Set(ngos.map(n => n.city));
    const states = new Set(ngos.map(n => n.state));
    const focuses = new Set(ngos.flatMap(n => n.focus));
    
    names.forEach(name => {
      if (name.toLowerCase().includes(term)) {
        results.push({ type: 'name', value: name });
      }
    });
    
    cities.forEach(city => {
      if (city.toLowerCase().includes(term)) {
        results.push({ type: 'city', value: city });
      }
    });
    
    states.forEach(state => {
      if (state.toLowerCase().includes(term)) {
        results.push({ type: 'state', value: state });
      }
    });
    
    focuses.forEach(focus => {
      if (focus.toLowerCase().includes(term)) {
        results.push({ type: 'focus', value: focus });
      }
    });
    
    return results.slice(0, 10);
  }, [searchTerm, ngos]);

  const filteredNgos = ngos.filter(ngo => {
    // Check if matches any search tags
    const matchesTags = searchTags.length === 0 || searchTags.some(tag => {
      if (tag.type === 'name') return ngo.name === tag.value;
      if (tag.type === 'city') return ngo.city === tag.value;
      if (tag.type === 'state') return ngo.state === tag.value;
      if (tag.type === 'focus') return ngo.focus.includes(tag.value);
      return false;
    });

    const matchesSearch = 
      ngo.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      ngo.city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      ngo.state.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      ngo.focus.some(f => f.toLowerCase().includes(debouncedSearch.toLowerCase()));

    return matchesTags && matchesSearch;
  });

  const handleAddNgo = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    const newNgo = {
      ...formData,
      id: `ngo${Date.now()}`,
    };
    setNgos([...ngos, newNgo]);
    toast.success(`${formData.name} added successfully!`);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditNgo = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setNgos(ngos.map(ngo => ngo.id === selectedNgo.id ? formData : ngo));
    toast.success(`${formData.name} updated successfully!`);
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteNgo = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setNgos(ngos.filter(ngo => ngo.id !== id));
      toast.success(`${name} removed successfully!`);
    }
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive' | 'pending') => {
    setNgos(ngos.map(ngo => ngo.id === id ? { ...ngo, status } : ngo));
    toast.success('Status updated!');
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      city: '',
      state: '',
      contact: '',
      email: '',
      website: '',
      focus: [],
      assignedActivities: [],
      established: '',
      volunteers: 0,
      activeProjects: 0,
      status: 'active'
    });
    setFormErrors({
      name: '',
      city: '',
      state: '',
      contact: '',
      email: '',
      focus: ''
    });
    setSelectedNgo(null);
  };

  const openEditModal = (ngo: any) => {
    setSelectedNgo(ngo);
    setFormData(ngo);
    setShowEditModal(true);
  };

  const addSearchTag = (type: 'name' | 'city' | 'state' | 'focus', value: string) => {
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

  const stats = {
    total: ngos.length,
    active: ngos.filter(n => (n.status || 'active') === 'active').length,
    inactive: ngos.filter(n => n.status === 'inactive').length,
    pending: ngos.filter(n => n.status === 'pending').length,
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-background via-[#BDE8F5]/5 to-background p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4988C4] via-[#1C4D8D] to-[#0F2854] flex items-center justify-center shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0F2854]">NGO Management</h1>
              <p className="text-[#4988C4] font-medium">Monitor and manage partner organizations</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#1C4D8D] to-[#4988C4] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add NGO
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white rounded-2xl p-6 border-2 border-[#4988C4]/20 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-[#1C4D8D] uppercase tracking-wider">Total NGOs</p>
              <Building2 className="h-5 w-5 text-[#4988C4]" />
            </div>
            <p className="text-4xl font-black text-[#0F2854]">{stats.total}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white rounded-2xl p-6 border-2 border-[#4CAF50]/20 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-[#4CAF50] uppercase tracking-wider">Active</p>
              <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
            </div>
            <p className="text-4xl font-black text-[#4CAF50]">{stats.active}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white rounded-2xl p-6 border-2 border-[#4988C4]/20 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-[#1C4D8D] uppercase tracking-wider">Pending</p>
              <AlertCircle className="h-5 w-5 text-[#4988C4]" />
            </div>
            <p className="text-4xl font-black text-[#1C4D8D]">{stats.pending}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white rounded-2xl p-6 border-2 border-[#0F2854]/20 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-[#0F2854] uppercase tracking-wider">Inactive</p>
              <XCircle className="h-5 w-5 text-[#0F2854]" />
            </div>
            <p className="text-4xl font-black text-[#0F2854]">{stats.inactive}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Search Bar with Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                  name: 'bg-[#4988C4]/10 text-[#0F2854] border-[#4988C4] hover:bg-[#4988C4]/20',
                  city: 'bg-[#1C4D8D]/10 text-[#0F2854] border-[#1C4D8D] hover:bg-[#1C4D8D]/20',
                  state: 'bg-[#BDE8F5]/20 text-[#0F2854] border-[#4988C4] hover:bg-[#BDE8F5]/30',
                  focus: 'bg-[#4CAF50]/10 text-[#0F2854] border-[#4CAF50] hover:bg-[#4CAF50]/20'
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4988C4] z-10" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Type to search NGOs by name, city, state, or focus area... (Press ↓ for suggestions)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.trim().length > 0);
              setSuggestionIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-12 pr-12 py-4 rounded-xl bg-white border-2 border-[#BDE8F5] focus:outline-none focus:border-[#4988C4] text-[#0F2854] font-medium shadow-sm transition-all"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4988C4] hover:text-[#0F2854] transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
          {searchTerm !== debouncedSearch && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 border-2 border-[#4988C4] border-t-transparent rounded-full animate-spin" />
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
                className="absolute top-full mt-2 w-full bg-white border-2 border-[#BDE8F5] rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
              >
                <div className="p-2">
                  <div className="text-xs font-semibold text-[#4988C4] px-3 py-2 flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    Click or press Enter to add as filter tag
                  </div>
                  {suggestions.map((suggestion, index) => {
                    const colors = {
                      name: 'hover:bg-[#4988C4]/10 border-l-[#4988C4]',
                      city: 'hover:bg-[#1C4D8D]/10 border-l-[#1C4D8D]',
                      state: 'hover:bg-[#BDE8F5]/30 border-l-[#4988C4]',
                      focus: 'hover:bg-[#4CAF50]/10 border-l-[#4CAF50]'
                    };
                    const iconEmoji = {
                      name: '🏢',
                      city: '🏙️',
                      state: '📍',
                      focus: '🎯'
                    };
                    
                    return (
                      <motion.button
                        key={`${suggestion.type}-${suggestion.value}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => addSearchTag(suggestion.type, suggestion.value)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all border-l-4 ${colors[suggestion.type]} ${
                          index === suggestionIndex ? 'bg-[#4988C4]/10 border-l-[#4988C4]' : 'border-l-transparent'
                        } flex items-center gap-3 group`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#BDE8F5]/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{iconEmoji[suggestion.type]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#0F2854] truncate">
                            {suggestion.value}
                          </div>
                          <div className="text-xs text-[#4988C4] capitalize">
                            {suggestion.type}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold flex-shrink-0 bg-[#BDE8F5] text-[#0F2854]">
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
      </motion.div>

      {/* NGO List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredNgos.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl p-6 border-2 border-[#BDE8F5] shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4988C4] to-[#1C4D8D] flex items-center justify-center shadow-md">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#0F2854]">{ngo.name}</h3>
                      <select
                        value={ngo.status || 'active'}
                        onChange={(e) => handleStatusChange(ngo.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${
                          (ngo.status || 'active') === 'active'
                            ? 'bg-[#4CAF50]/10 border-[#4CAF50] text-[#4CAF50]'
                            : (ngo.status || 'active') === 'pending'
                            ? 'bg-[#4988C4]/10 border-[#4988C4] text-[#1C4D8D]'
                            : 'bg-[#0F2854]/10 border-[#0F2854] text-[#0F2854]'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-[#4988C4] font-semibold mb-1">Location</p>
                        <p className="text-sm font-bold text-[#0F2854]">{ngo.city}, {ngo.state}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#4988C4] font-semibold mb-1">Contact</p>
                        <p className="text-sm font-medium text-[#1C4D8D]">{ngo.contact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#4988C4] font-semibold mb-1">Volunteers</p>
                        <p className="text-sm font-bold text-[#0F2854]">{ngo.volunteers || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#4988C4] font-semibold mb-1">Projects</p>
                        <p className="text-sm font-bold text-[#0F2854]">{ngo.activeProjects || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ngo.focus.map((f, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#BDE8F5]/50 text-[#0F2854] rounded-lg text-xs font-semibold"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEditModal(ngo)}
                    className="p-3 rounded-xl bg-[#4988C4]/10 hover:bg-[#4988C4]/20 text-[#1C4D8D] transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteNgo(ngo.id, ngo.name)}
                    className="p-3 rounded-xl bg-[#0F2854]/10 hover:bg-[#0F2854]/20 text-[#0F2854] transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNgos.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-[#BDE8F5] mx-auto mb-4" />
            <p className="text-[#4988C4] font-semibold">No NGOs found</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="text-2xl font-black text-[#0F2854] mb-6">
                {showAddModal ? 'Add New NGO' : 'Edit NGO'}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">
                      NGO Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none ${
                        formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-[#BDE8F5] focus:border-[#4988C4]'
                      }`}
                      placeholder="Enter NGO name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none ${
                        formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-[#BDE8F5] focus:border-[#4988C4]'
                      }`}
                      placeholder="email@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      list="city-options"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                      }}
                      placeholder="Select or type city name"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none ${
                        formErrors.city ? 'border-red-500 focus:border-red-500' : 'border-[#BDE8F5] focus:border-[#4988C4]'
                      }`}
                    />
                    <datalist id="city-options">
                      {existingCities.map(city => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      list="state-options"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value });
                        if (formErrors.state) setFormErrors({ ...formErrors, state: '' });
                      }}
                      placeholder="Select or type state name"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none ${
                        formErrors.state ? 'border-red-500 focus:border-red-500' : 'border-[#BDE8F5] focus:border-[#4988C4]'
                      }`}
                    />
                    <datalist id="state-options">
                      {existingStates.map(state => (
                        <option key={state} value={state} />
                      ))}
                    </datalist>
                    {formErrors.state && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.state}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0F2854] mb-2">
                    Focus Areas <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {/* Selected Focus Areas as Tags */}
                    {formData.focus.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-[#BDE8F5]/20 rounded-xl border-2 border-[#BDE8F5]">
                        {formData.focus.map((area, index) => (
                          <Badge
                            key={index}
                            className="bg-[#4988C4] text-white px-3 py-1.5 text-sm font-semibold flex items-center gap-2"
                          >
                            {area}
                            <button
                              onClick={() => {
                                const newFocus = formData.focus.filter((_, i) => i !== index);
                                setFormData({ ...formData, focus: newFocus });
                                if (formErrors.focus && newFocus.length > 0) {
                                  setFormErrors({ ...formErrors, focus: '' });
                                }
                              }}
                              className="hover:opacity-70 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Input with Datalist */}
                    <div className="relative">
                      <input
                        type="text"
                        list="focus-options"
                        placeholder="Type or select focus area and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = (e.target as HTMLInputElement).value.trim();
                            if (value && !formData.focus.includes(value)) {
                              setFormData({ ...formData, focus: [...formData.focus, value] });
                              if (formErrors.focus) setFormErrors({ ...formErrors, focus: '' });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none ${
                          formErrors.focus ? 'border-red-500 focus:border-red-500' : 'border-[#BDE8F5] focus:border-[#4988C4]'
                        }`}
                      />
                      <datalist id="focus-options">
                        {existingFocusAreas.filter(area => !formData.focus.includes(area)).map(area => (
                          <option key={area} value={area} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quick Add Buttons for Common Focus Areas */}
                    <div className="flex flex-wrap gap-2">
                      <p className="text-xs text-[#4988C4] font-semibold w-full mb-1">Quick Add:</p>
                      {existingFocusAreas.slice(0, 6).map(area => (
                        !formData.focus.includes(area) && (
                          <button
                            key={area}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, focus: [...formData.focus, area] });
                              if (formErrors.focus) setFormErrors({ ...formErrors, focus: '' });
                            }}
                            className="px-3 py-1.5 text-xs font-semibold bg-white border-2 border-[#BDE8F5] text-[#0F2854] rounded-lg hover:bg-[#BDE8F5]/20 hover:border-[#4988C4] transition-all"
                          >
                            + {area}
                          </button>
                        )
                      ))}
                    </div>
                    {formErrors.focus && (
                      <p className="text-red-500 text-xs font-semibold">{formErrors.focus}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">
                      Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => {
                        setFormData({ ...formData, contact: e.target.value });
                        if (formErrors.contact) setFormErrors({ ...formErrors, contact: '' });
                      }}
                      placeholder="+91 1234567890"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none ${
                        formErrors.contact ? 'border-red-500 focus:border-red-500' : 'border-[#BDE8F5] focus:border-[#4988C4]'
                      }`}
                    />
                    {formErrors.contact && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.contact}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">Established</label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                      placeholder="e.g., 2010"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">Volunteers</label>
                    <input
                      type="number"
                      value={formData.volunteers}
                      onChange={(e) => setFormData({ ...formData, volunteers: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F2854] mb-2">Active Projects</label>
                    <input
                      type="number"
                      value={formData.activeProjects}
                      onChange={(e) => setFormData({ ...formData, activeProjects: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0F2854] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={showAddModal ? handleAddNgo : handleEditNgo}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1C4D8D] to-[#4988C4] text-white rounded-xl font-bold"
                >
                  {showAddModal ? 'Add NGO' : 'Save Changes'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-[#BDE8F5] text-[#0F2854] rounded-xl font-bold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NGOManagement;
