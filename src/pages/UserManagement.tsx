import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Eye, X, FileText, Activity,
  Heart, ClipboardList, Calendar, Mail, AlertTriangle,
  ChevronDown, ChevronUp, RefreshCw, Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:3001/api';

interface UserRow {
  id: string;
  email: string;
  profile_image: string | null;
  created_at: string;
  report_count: string;
  medical_data_count: string;
  profile_data_count: string;
}

interface Stats {
  users: number;
  medical_records: number;
  profile_entries: number;
  reports: number;
  urgency_distribution: Array<{ urgency_level: string; count: string }>;
}

interface UserDetail {
  id: string;
  email: string;
  profile_image: string | null;
  created_at: string;
  medical_data: Array<{
    id: string;
    question_id: string;
    question_text: string;
    answer_json: any;
    created_at: string;
  }>;
  profiles: Array<{
    id: string;
    question_id: string;
    question_text: string;
    answer_json: any;
    created_at: string;
  }>;
  reports: Array<{
    id: string;
    report_id: string;
    assessment_topic: string;
    urgency_level: string;
    report_data: any;
    created_at: string;
  }>;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<'profile' | 'medical' | 'reports'>('profile');
  const [sortField, setSortField] = useState<'email' | 'created_at' | 'report_count'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/stats`),
      ]);

      if (!usersRes.ok || !statsRes.ok) throw new Error('API error');

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData);
      setStats(statsData);
      setDbConnected(true);
    } catch (err) {
      setDbConnected(false);
      toast.error('Failed to connect to database', {
        description: 'Make sure the API server is running: node server/api.js',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success('Data refreshed from database');
  };

  const openUserDetail = async (userId: string) => {
    setDetailLoading(true);
    setShowDetail(true);
    setDetailTab('profile');
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setSelectedUser(data);
    } catch (err) {
      toast.error('Failed to load user details');
      setShowDetail(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(u =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valA: any, valB: any;
      if (sortField === 'email') {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      } else if (sortField === 'created_at') {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      } else {
        valA = parseInt(a.report_count);
        valB = parseInt(b.report_count);
      }
      return sortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    return filtered;
  }, [users, searchTerm, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  const getUrgencyColor = (level: string | null) => {
    if (!level) return 'bg-gray-100 text-gray-600';
    const l = level.toLowerCase();
    if (l.includes('emergency') || l.includes('high')) return 'bg-red-100 text-red-700';
    if (l.includes('doctor') || l.includes('medium') || l.includes('moderate')) return 'bg-[#BDE8F5] text-[#1C4D8D]';
    return 'bg-green-100 text-green-700';
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const formatTime = (d: string) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // ─── NOT CONNECTED STATE ───────────────────────────────
  if (!dbConnected && !loading) {
    return (
      <div className="h-screen overflow-y-auto bg-background p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#BDE8F5] to-[#4988C4] flex items-center justify-center mx-auto mb-6">
            <Database className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F2854] mb-2">Database Not Connected</h2>
          <p className="text-[#4988C4] mb-6">
            Start the API server to connect to your PostgreSQL database.
          </p>
          <div className="bg-[#0F2854] rounded-xl p-4 text-left font-mono text-sm text-white mb-6">
            <p className="text-[#BDE8F5] mb-1"># Run this in terminal:</p>
            <p>PG_PASSWORD=your_password node server/api.js</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchData(); }}
            className="px-6 py-3 bg-gradient-to-r from-[#4988C4] to-[#1C4D8D] text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-background p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#BDE8F5] to-[#4988C4] flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground text-sm">
                  Live data from PostgreSQL — {users.length} registered users
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                DB Connected
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="px-4 py-2.5 bg-gradient-to-r from-[#4988C4] to-[#1C4D8D] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.users, icon: Users, color: 'from-[#4988C4] to-[#1C4D8D]' },
              { label: 'Medical Records', value: stats.medical_records, icon: Heart, color: 'from-[#1C4D8D] to-[#0F2854]' },
              { label: 'Profile Entries', value: stats.profile_entries, icon: ClipboardList, color: 'from-[#BDE8F5] to-[#4988C4]' },
              { label: 'Reports', value: stats.reports, icon: FileText, color: 'from-[#0F2854] to-[#1C4D8D]' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white rounded-2xl p-5 border border-[#BDE8F5]/30 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-black text-[#0F2854]">{stat.value.toLocaleString()}</p>
                <p className="text-xs font-medium text-[#4988C4] uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Urgency Distribution */}
        {stats && stats.urgency_distribution.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-[#BDE8F5]/30 shadow-sm mb-8">
            <h3 className="text-sm font-bold text-[#0F2854] uppercase tracking-wide mb-4">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              Report Urgency Distribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.urgency_distribution.map((item) => (
                <div key={item.urgency_level || 'unknown'} className="text-center p-3 rounded-xl bg-[#BDE8F5]/10">
                  <Badge className={`${getUrgencyColor(item.urgency_level)} text-xs mb-2`}>
                    {item.urgency_level || 'Unknown'}
                  </Badge>
                  <p className="text-xl font-bold text-[#0F2854]">{item.count}</p>
                  <p className="text-xs text-[#4988C4]">reports</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4988C4]" />
            <input
              type="text"
              placeholder="Search by email or user ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#BDE8F5] focus:border-[#4988C4] focus:outline-none text-sm font-medium bg-white transition-colors"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-[#4988C4]" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#BDE8F5] border-t-[#4988C4] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#BDE8F5]/30 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white text-xs uppercase tracking-wide">
                  <th className="text-left py-4 px-5 font-bold">
                    <button onClick={() => toggleSort('email')} className="flex items-center gap-1 hover:text-[#BDE8F5] transition-colors">
                      Email <SortIcon field="email" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-5 font-bold">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-[#BDE8F5] transition-colors">
                      Joined <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="text-center py-4 px-5 font-bold">
                    <button onClick={() => toggleSort('report_count')} className="flex items-center gap-1 hover:text-[#BDE8F5] transition-colors">
                      Reports <SortIcon field="report_count" />
                    </button>
                  </th>
                  <th className="text-center py-4 px-5 font-bold">Medical</th>
                  <th className="text-center py-4 px-5 font-bold">Profile</th>
                  <th className="text-center py-4 px-5 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[#BDE8F5]/20 hover:bg-[#BDE8F5]/5 transition-colors cursor-pointer"
                      onClick={() => openUserDetail(user.id)}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4988C4] to-[#1C4D8D] flex items-center justify-center text-white text-xs font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0F2854]">{user.email}</p>
                            <p className="text-xs text-[#4988C4] font-mono">{user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <p className="text-sm text-[#1C4D8D]">{formatDate(user.created_at)}</p>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="secondary" className="bg-[#0F2854] text-white text-xs">
                          {user.report_count}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="secondary" className="bg-[#4988C4]/10 text-[#1C4D8D] text-xs">
                          {user.medical_data_count}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant="secondary" className="bg-[#BDE8F5]/30 text-[#1C4D8D] text-xs">
                          {user.profile_data_count}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={e => { e.stopPropagation(); openUserDetail(user.id); }}
                          className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4988C4] to-[#1C4D8D] flex items-center justify-center text-white shadow-sm mx-auto"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-[#4988C4]">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetail(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
              >
                {detailLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#BDE8F5] border-t-[#4988C4] rounded-full animate-spin" />
                  </div>
                ) : selectedUser ? (
                  <>
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] p-6 text-white relative">
                      <button
                        onClick={() => setShowDetail(false)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                          {selectedUser.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{selectedUser.email}</h2>
                          <p className="text-white/70 text-sm font-mono">{selectedUser.id}</p>
                          <p className="text-[#BDE8F5] text-xs mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Joined {formatDate(selectedUser.created_at)}
                          </p>
                        </div>
                      </div>
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3 mt-5">
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                          <p className="text-2xl font-black">{selectedUser.reports.length}</p>
                          <p className="text-xs text-white/70">Reports</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                          <p className="text-2xl font-black">{selectedUser.medical_data.length}</p>
                          <p className="text-xs text-white/70">Medical</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                          <p className="text-2xl font-black">{selectedUser.profiles.length}</p>
                          <p className="text-xs text-white/70">Profile</p>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#BDE8F5]/30">
                      {[
                        { id: 'profile' as const, label: 'Profile Data', icon: ClipboardList, count: selectedUser.profiles.length },
                        { id: 'medical' as const, label: 'Medical Data', icon: Heart, count: selectedUser.medical_data.length },
                        { id: 'reports' as const, label: 'Reports', icon: FileText, count: selectedUser.reports.length },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setDetailTab(tab.id)}
                          className={`flex-1 py-3 px-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                            detailTab === tab.id
                              ? 'text-[#0F2854] border-b-3 border-[#4988C4] bg-[#BDE8F5]/10'
                              : 'text-[#4988C4] hover:text-[#1C4D8D] hover:bg-[#BDE8F5]/5'
                          }`}
                        >
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                          <Badge variant="secondary" className="text-xs bg-[#BDE8F5]/30 text-[#1C4D8D]">
                            {tab.count}
                          </Badge>
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="overflow-y-auto max-h-[40vh] p-6">
                      {detailTab === 'profile' && (
                        <div className="space-y-3">
                          {selectedUser.profiles.length === 0 ? (
                            <p className="text-center text-[#4988C4] py-8">No profile data available</p>
                          ) : (
                            selectedUser.profiles.map(item => (
                              <div key={item.id} className="bg-[#BDE8F5]/10 rounded-xl p-4 border border-[#BDE8F5]/20">
                                <p className="text-xs font-bold text-[#4988C4] uppercase tracking-wide mb-1">{item.question_id}</p>
                                <p className="text-sm font-semibold text-[#0F2854] mb-2">{item.question_text}</p>
                                <div className="bg-white rounded-lg p-3 text-sm text-[#1C4D8D]">
                                  {typeof item.answer_json === 'object'
                                    ? JSON.stringify(item.answer_json, null, 2)
                                    : String(item.answer_json)}
                                </div>
                                <p className="text-xs text-[#4988C4] mt-2">{formatTime(item.created_at)}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {detailTab === 'medical' && (
                        <div className="space-y-3">
                          {selectedUser.medical_data.length === 0 ? (
                            <p className="text-center text-[#4988C4] py-8">No medical data available</p>
                          ) : (
                            selectedUser.medical_data.map(item => (
                              <div key={item.id} className="bg-[#BDE8F5]/10 rounded-xl p-4 border border-[#BDE8F5]/20">
                                <div className="flex items-center gap-2 mb-1">
                                  <Heart className="h-3.5 w-3.5 text-[#4988C4]" />
                                  <p className="text-xs font-bold text-[#4988C4] uppercase tracking-wide">{item.question_id}</p>
                                </div>
                                <p className="text-sm font-semibold text-[#0F2854] mb-2">{item.question_text}</p>
                                <div className="bg-white rounded-lg p-3 text-sm text-[#1C4D8D]">
                                  {typeof item.answer_json === 'object'
                                    ? JSON.stringify(item.answer_json, null, 2)
                                    : String(item.answer_json)}
                                </div>
                                <p className="text-xs text-[#4988C4] mt-2">{formatTime(item.created_at)}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {detailTab === 'reports' && (
                        <div className="space-y-3">
                          {selectedUser.reports.length === 0 ? (
                            <p className="text-center text-[#4988C4] py-8">No reports available</p>
                          ) : (
                            selectedUser.reports.map(item => (
                              <div key={item.id} className="bg-[#BDE8F5]/10 rounded-xl p-4 border border-[#BDE8F5]/20">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-[#1C4D8D]" />
                                    <p className="text-sm font-bold text-[#0F2854]">{item.assessment_topic || 'Assessment'}</p>
                                  </div>
                                  <Badge className={`${getUrgencyColor(item.urgency_level)} text-xs`}>
                                    {item.urgency_level || 'N/A'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-[#4988C4] font-mono mb-2">Report ID: {item.report_id}</p>
                                <div className="bg-white rounded-lg p-3 text-sm text-[#1C4D8D] max-h-40 overflow-y-auto">
                                  <pre className="whitespace-pre-wrap text-xs">
                                    {JSON.stringify(item.report_data, null, 2)}
                                  </pre>
                                </div>
                                <p className="text-xs text-[#4988C4] mt-2">{formatTime(item.created_at)}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UserManagement;
