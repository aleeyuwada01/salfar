import React, { useState, useEffect } from 'react';
import { Upload, Users, MapPin, TrendingUp, Database, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const DataCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    poverty: 0,
    states: 0,
    rate: 0
  });
  const [stateStats, setStateStats] = useState<any[]>([]);
  const [warriors, setWarriors] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    state_residence: '',
    lga: '',
    ward_community: '',
    phone_primary: '',
    monthly_income: ''
  });

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'warriors') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all warriors for counting and listing
      const { data, error } = await supabase
        .from('scd_register')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allWarriors = data || [];
      setWarriors(allWarriors);

      // Calculate stats
      const total = allWarriors.length;
      const poverty = allWarriors.filter(w =>
        w.monthly_income === 'None' ||
        w.monthly_income === 'Less than ₦30,000'
      ).length;

      const uniqueStates = new Set(allWarriors.map(w => w.state_residence).filter(Boolean));
      const rate = total > 0 ? Math.round((poverty / total) * 100) : 0;

      setStats({ total, poverty, states: uniqueStates.size, rate });

      // State Breakdown
      const stateMap: Record<string, { warriors: number, poverty: number }> = {};
      allWarriors.forEach(w => {
        const s = w.state_residence || 'Unknown';
        if (!stateMap[s]) stateMap[s] = { warriors: 0, poverty: 0 };
        stateMap[s].warriors++;
        if (w.monthly_income === 'None' || w.monthly_income === 'Less than ₦30,000') {
          stateMap[s].poverty++;
        }
      });

      const breakdown = Object.entries(stateMap).map(([state, sStats]) => ({
        state,
        warriors: sStats.warriors,
        underPoverty: sStats.poverty,
        percentage: sStats.warriors > 0 ? Math.round((sStats.poverty / sStats.warriors) * 100) : 0
      })).sort((a, b) => b.warriors - a.warriors);

      setStateStats(breakdown);
    } catch (error) {
      console.error('Error fetching data center info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('scd_register')
        .insert([{
          full_name: formData.full_name,
          dob: formData.dob,
          state_residence: formData.state_residence,
          lga: formData.lga,
          ward_community: formData.ward_community,
          phone_primary: formData.phone_primary,
          monthly_income: formData.monthly_income,
          consent_given: true
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Warrior registered successfully! Thank you for contributing to the national database.' });
      setFormData({
        full_name: '',
        dob: '',
        state_residence: '',
        lga: '',
        ward_community: '',
        phone_primary: '',
        monthly_income: ''
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to register. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWarriors = warriors.filter(warrior =>
    (warrior.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warrior.phone_primary?.includes(searchTerm)) &&
    (selectedState === 'all' || warrior.state_residence === selectedState)
  );

  const statesList = ['Lagos', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Abuja', 'Enugu', 'Edo', 'Delta', 'Anambra', 'Ogun', 'Kwara', 'Plateau', 'Bauchi', 'Katsina', 'Sokoto', 'Gombe', 'Jigawa', 'Kebbi', 'Zamfara', 'Adamawa', 'Taraba', 'Yobe', 'Borno', 'Cross River', 'Akwa Ibom', 'Abia', 'Imo', 'Ebonyi', 'Bayelsa', 'Kogi', 'Nasarawa', 'Benue', 'Ekiti', 'Ondo', 'Osun'];

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-blue via-indigo-600 to-google-blue py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">National Data Center</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            A real-time analytics hub driving policy and support for SCD warriors across Nigeria.
            Every entry helps us advocate for better care and social protection.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white sticky top-16 z-20 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-start space-x-1 md:space-x-8">
            {[
              { id: 'dashboard', icon: <TrendingUp className="h-4 w-4" />, label: 'Analytics' },
              { id: 'warriors', icon: <Database className="h-4 w-4" />, label: 'Warriors Registry' },
              { id: 'register', icon: <Upload className="h-4 w-4" />, label: 'New Registration' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-5 px-4 md:px-2 border-b-2 font-bold text-sm transition-all flex items-center space-x-2 ${activeTab === tab.id
                  ? 'border-google-red text-google-red bg-red-50/10'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Warriors', value: stats.total.toLocaleString(), icon: <Users className="text-white h-6 w-6" />, bg: 'bg-google-red' },
                { label: 'States Reached', value: stats.states, icon: <MapPin className="text-white h-6 w-6" />, bg: 'bg-google-blue' },
                { label: 'Income Vulnerable', value: stats.poverty, icon: <TrendingUp className="text-white h-6 w-6" />, bg: 'bg-google-orange' },
                { label: 'Vulnerability Rate', value: `${stats.rate}%`, icon: <Database className="text-white h-6 w-6" />, bg: 'bg-google-green' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transform hover:scale-105 transition-transform">
                  <div className={`${stat.bg} p-4 rounded-2xl w-fit mb-4 shadow-lg shadow-gray-200`}>
                    {stat.icon}
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 font-bold text-sm tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* State-wise Data */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Geographical Breakdown</h3>
                <div className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 uppercase tracking-widest">Live Data</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white border-b border-gray-100">
                    <tr>
                      {['State', 'Total Warriors', 'In Vulnerable Group', 'Vulnerability Rate'].map(h => (
                        <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {loading ? (
                      <tr><td colSpan={4} className="py-20 text-center text-gray-400 font-bold italic">Loading analytics...</td></tr>
                    ) : stateStats.length === 0 ? (
                      <tr><td colSpan={4} className="py-20 text-center text-gray-400 font-bold italic">No data records found.</td></tr>
                    ) : stateStats.map((state, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 whitespace-nowrap text-lg font-black text-gray-900 underline decoration-google-blue/30 underline-offset-4 decoration-2">
                          {state.state}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-lg font-bold text-gray-700">
                          {state.warriors}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-lg font-bold text-google-orange">
                          {state.underPoverty}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-100 rounded-full h-3 mr-4 overflow-hidden border border-gray-100">
                              <div
                                className="bg-google-red h-full rounded-full shadow-inner shadow-black/10 font-bold"
                                style={{ width: `${state.percentage}%` }}
                              ></div>
                            </div>
                            <span className="font-black text-gray-900">{state.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Register Warrior Tab */}
        {activeTab === 'register' && (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-google-red/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

              <div className="text-center mb-12">
                <div className="inline-flex p-4 bg-google-red/10 rounded-3xl mb-6">
                  <Upload className="h-8 w-8 text-google-red" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">Registry Enrollment</h2>
                <p className="text-gray-500 font-medium max-w-xl mx-auto">
                  Contribute to our national mapping project. Your data helps us secure funding and design inclusive programs.
                </p>
              </div>

              {message && (
                <div className={`mb-10 p-5 rounded-3xl flex items-center space-x-4 animate-scale-up ${message.type === 'success' ? 'bg-green-50 text-green-700 border-2 border-green-100 shadow-lg shadow-green-100' : 'bg-red-50 text-red-700 border-2 border-red-100'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="h-6 w-6 shrink-0" /> : <AlertCircle className="h-6 w-6 shrink-0" />}
                  <p className="font-bold">{message.text}</p>
                  <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-full"><XIcon className="h-5 w-5" /></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      placeholder="First Middle Surname"
                      className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State of Residence</label>
                    <select
                      name="state_residence"
                      value={formData.state_residence}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 outline-none transition-all font-bold"
                    >
                      <option value="">Select State</option>
                      {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px) font-black text-gray-400 uppercase tracking-widest ml-1">LGA</label>
                    <input
                      type="text"
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      required
                      placeholder="Local Govt Area"
                      className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Income Level</label>
                    <select
                      name="monthly_income"
                      value={formData.monthly_income}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 outline-none transition-all font-bold"
                    >
                      <option value="">Select Level</option>
                      <option value="None">No regular income</option>
                      <option value="Less than ₦30,000">Less than ₦30,000 (Vulnerable)</option>
                      <option value="₦30,000 - ₦75,000">₦30,000 - ₦75,000</option>
                      <option value="Above ₦75,000">Above ₦75,000</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_primary"
                      value={formData.phone_primary}
                      onChange={handleInputChange}
                      required
                      placeholder="080 0000 0000"
                      className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="text-center pt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gray-900 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-black transition-all shadow-2xl shadow-gray-400 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center mx-auto"
                  >
                    {submitting ? 'Registering...' : 'Complete Registration'}
                    <ArrowIcon className="ml-3 h-6 w-6" />
                  </button>
                  <p className="mt-6 text-gray-400 text-xs font-bold uppercase tracking-widest">Secure & Confidential data processing</p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Warriors Database Tab */}
        {activeTab === 'warriors' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 bg-gray-50/20">
              <div className="px-8 py-8 border-b border-gray-100 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Registered Warriors</h3>
                    <p className="text-gray-500 font-bold text-sm">Public registry database of verified entries.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-google-blue rounded-2xl outline-none transition-all font-bold text-sm w-full sm:w-64"
                      />
                    </div>

                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="px-6 py-3 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-sm outline-none focus:bg-white focus:border-google-blue cursor-pointer"
                    >
                      <option value="all">Everywhere</option>
                      {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto p-4 md:p-8">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {['Warrior Identity', 'Region', 'Status', 'Date Joined'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan={4} className="py-20 text-center font-bold text-gray-400 italic">Accessing database...</td></tr>
                    ) : filteredWarriors.length === 0 ? (
                      <tr><td colSpan={4} className="py-20 text-center font-bold text-gray-400 italic bg-white rounded-3xl">No records found matching filters.</td></tr>
                    ) : filteredWarriors.map((warrior) => (
                      <tr key={warrior.id} className="hover:bg-gray-50/50 transition-all rounded-2xl">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-lg mr-4 border border-indigo-100">
                              {warrior.full_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="text-lg font-black text-gray-900">{warrior.full_name}</div>
                              <div className="text-xs font-bold text-gray-400">{warrior.phone_primary?.replace(/.(?=.{4})/g, '*')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2 text-gray-700 font-bold">
                            <MapPin className="h-4 w-4 text-google-blue" />
                            <span>{warrior.lga || 'Unknown'}, {warrior.state_residence}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`inline-flex px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${(warrior.monthly_income === 'None' || warrior.monthly_income === 'Less than ₦30,000')
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-green-50 text-green-600 border border-green-100'
                            }`}>
                            {(warrior.monthly_income === 'None' || warrior.monthly_income === 'Less than ₦30,000') ? 'Vulnerable' : 'Stable'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-gray-400">
                          {new Date(warrior.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// UI Components
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);