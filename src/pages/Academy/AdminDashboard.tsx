import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, Search, ExternalLink, User, MapPin, GraduationCap, Briefcase, Heart, BookOpen, Laptop, ShieldCheck, X, TrendingUp, PieChart as PieIcon, BarChart as BarIcon, Users, Activity, FileText } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'applications'>('overview');
    const [applications, setApplications] = useState<any[]>([]);
    const [warriors, setWarriors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [generatingInvite, setGeneratingInvite] = useState<string | null>(null);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('fellow_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error || data?.role !== 'admin') {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                    fetchData();
                }
            } catch {
                setIsAdmin(false);
            }
        };

        if (!authLoading) checkAdmin();
    }, [user, authLoading]);

    const fetchData = async () => {
        setLoading(true);
        const [appsRes, warriorsRes] = await Promise.all([
            supabase.from('academy_applications').select('*').order('created_at', { ascending: false }),
            supabase.from('scd_register').select('*')
        ]);

        if (appsRes.data) setApplications(appsRes.data);
        if (warriorsRes.data) setWarriors(warriorsRes.data);
        setLoading(false);
    };

    // Analytics Calculations
    const genotypeData = [
        { name: 'HbSS', value: warriors.filter(w => w.genotype === 'HbSS').length, color: '#EA4335' },
        { name: 'HbSC', value: warriors.filter(w => w.genotype === 'HbSC').length, color: '#FBBC04' },
        { name: 'HbSβ-Thal', value: warriors.filter(w => w.genotype?.includes('Thalassemia')).length, color: '#4285F4' },
        { name: 'Other', value: warriors.filter(w => w.genotype === 'Other').length, color: '#34A853' },
    ].filter(d => d.value > 0);


    const stateDistribution = Array.from(new Set(warriors.map(w => w.state_residence)))
        .map(state => ({
            name: state,
            count: warriors.filter(w => w.state_residence === state).length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const handleAdmit = async (application: any) => {
        setGeneratingInvite(application.id);
        const cohortName = 'Dr. Sani Gwarzo mni Fellowship';

        try {
            const { data: invite, error: inviteError } = await supabase
                .from('academy_invites')
                .insert([{
                    email: application.email,
                    cohort_name: cohortName,
                    created_by: user!.id
                }])
                .select()
                .single();

            if (inviteError) throw inviteError;

            const { error: appError } = await supabase
                .from('academy_applications')
                .update({ status: 'accepted' })
                .eq('id', application.id);

            if (appError) throw appError;

            const inviteLink = `${window.location.origin}/academy/enroll?token=${invite.id}`;
            setApplications(prev => prev.map(app => app.id === application.id ? { ...app, status: 'accepted' } : app));
            alert(`Admitted!\n\nSend this secure enrollment link to ${application.email}:\n\n${inviteLink}`);
        } catch (err: any) {
            console.error(err);
            alert('Error admitting candidate: ' + err.message);
        } finally {
            setGeneratingInvite(null);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await supabase.from('academy_applications').update({ status: 'rejected' }).eq('id', id);
            setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'rejected' } : app));
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || (isAdmin === true && loading)) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Crunching dashboard data...</p>
            </div>
        </div>
    );

    if (isAdmin === false) return <Navigate to="/academy/portal" replace />;

    return (
        <AdminLayout title="Admin Command Center">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-8 w-full overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <TrendingUp size={16} className="mr-2" /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center whitespace-nowrap ${activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <Users size={16} className="mr-2" /> Applications
                </button>
            </div>

            {activeTab === 'overview' ? (
                <div className="space-y-8">
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-b-4 border-b-blue-500">
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Warriors</p>
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900">{warriors.length}</h3>
                            <div className="mt-4 hidden md:flex items-center text-blue-600 text-[10px] font-bold">
                                <TrendingUp size={12} className="mr-1" /> Active register
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-b-4 border-b-orange-500">
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Applicants</p>
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900">{applications.length}</h3>
                            <div className="mt-4 hidden md:flex items-center text-orange-600 text-[10px] font-bold">
                                <Clock size={12} className="mr-1" /> {applications.filter(a => a.status === 'pending').length} pending
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-b-4 border-b-green-500">
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Fellows</p>
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900">{applications.filter(a => a.status === 'accepted').length}</h3>
                            <div className="mt-4 hidden md:flex items-center text-green-600 text-[10px] font-bold">
                                <CheckCircle size={12} className="mr-1" /> Accepted
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-b-4 border-b-indigo-500">
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Poverty %</p>
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900">
                                {warriors.length > 0 ? Math.round((warriors.filter(w => w.monthly_income === 'Under ₦20,000').length / warriors.length) * 100) : 0}%
                            </h3>
                            <div className="mt-4 hidden md:flex items-center text-indigo-600 text-[10px] font-bold">
                                <Activity size={12} className="mr-1" /> Threshold
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Genotype Distribution Pie */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-black text-gray-800 flex items-center">
                                    <PieIcon className="mr-2 text-indigo-500" size={20} /> Genotype Distribution
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Register Data</span>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={genotypeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {genotypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top States Bar */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-black text-gray-800 flex items-center">
                                    <BarIcon className="mr-2 text-indigo-500" size={20} /> Top 5 States (Residency)
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Warrior Reach</span>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stateDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                        <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Applications Table - Same logic as before but wrapped in AdminLayout */
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="font-black text-gray-900 text-lg">Lead Warrior Academy Inbound</h3>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search applicants..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" />
                        </div>
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{app.full_name}</div>
                                            <div className="text-xs text-gray-400 uppercase font-bold tracking-tighter mt-1">{app.state_residence} • {app.highest_qualification}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${app.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-orange-50 text-orange-700 border border-orange-100'
                                                }`}>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center space-x-2">
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleReject(app.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Reject">
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAdmit(app)}
                                                            disabled={generatingInvite === app.id}
                                                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-indigo-700 shadow-sm transition-all whitespace-nowrap"
                                                        >
                                                            {generatingInvite === app.id ? '...' : 'Admit'}
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg font-bold text-[10px] flex items-center transition-all"
                                                >
                                                    View <ExternalLink className="h-3 w-3 ml-1" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Application Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {applications.map((app) => (
                            <div key={app.id} className="p-6 space-y-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-black text-gray-900 leading-tight">{app.full_name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{app.state_residence} • {app.status}</div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"
                                    >
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                                {app.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAdmit(app)}
                                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100"
                                        >
                                            Admit Candidate
                                        </button>
                                        <button
                                            onClick={() => handleReject(app.id)}
                                            className="px-4 py-2.5 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {applications.length === 0 && (
                        <div className="p-12 text-center text-gray-400 font-bold">
                            No applications found.
                        </div>
                    )}
                </div>
            )}

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-100 p-3 rounded-2xl">
                                    <User className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedApp.full_name}</h2>
                                    <p className="text-gray-500 font-medium">{selectedApp.email} • Applied on {new Date(selectedApp.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content - Tabs/Sections */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-gray-50/50">
                            {/* Section 1: Personal Information */}
                            <section>
                                <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-indigo-600 pl-4">
                                    <User className="h-4 w-4" />
                                    <span>Section 1: Personal Information</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</label><p className="text-gray-900 font-semibold">{selectedApp.gender || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label><p className="text-gray-900 font-semibold">{selectedApp.dob || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone (WhatsApp)</label><p className="text-gray-900 font-semibold">{selectedApp.phone || 'N/A'}</p></div>
                                    <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-gray-400" /><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Origin</label><p className="text-gray-900 font-semibold">{selectedApp.state_origin || 'N/A'}</p></div></div>
                                    <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-gray-400" /><div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Residence</label><p className="text-gray-900 font-semibold">{selectedApp.state_residence || 'N/A'} ({selectedApp.lga || 'N/A'})</p></div></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">LinkedIn</label><p className="text-indigo-600 font-semibold truncate hover:underline cursor-pointer">{selectedApp.linkedin || 'None'}</p></div>
                                </div>
                            </section>

                            {/* Section 2: Warrior Status Verification */}
                            <section>
                                <div className="flex items-center space-x-2 text-google-red font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-google-red pl-4">
                                    <Heart className="h-4 w-4" />
                                    <span>Section 2: Warrior Status Verification</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Diagnosis Type</label><p className="text-gray-900 font-bold text-lg">{selectedApp.diagnosis_type || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Year of Diagnosis</label><p className="text-gray-900 font-semibold">{selectedApp.diagnosis_year || 'N/A'}</p></div>
                                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Managing Hospital</label><p className="text-gray-900 font-semibold">{selectedApp.hospital_name || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hospital ID?</label><p className="text-gray-900 font-semibold">{selectedApp.has_hospital_id ? '✅ Yes' : '❌ No'}</p></div>
                                </div>
                            </section>

                            {/* Section 3: Educational Background */}
                            <section>
                                <div className="flex items-center space-x-2 text-google-orange font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-google-orange pl-4">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>Section 3: Educational Background</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Qualification</label><p className="text-gray-900 font-bold">{selectedApp.highest_qualification || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Field of Study</label><p className="text-gray-900 font-semibold">{selectedApp.field_of_study || 'N/A'}</p></div>
                                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Institution</label><p className="text-gray-900 font-semibold">{selectedApp.institution || 'N/A'} ({selectedApp.graduation_year || 'N/A'})</p></div>
                                </div>
                            </section>

                            {/* Section 4: Experience & Leadership */}
                            <section>
                                <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-indigo-600 pl-4">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Section 4: Professional & Leadership</span>
                                </div>
                                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Occupation</label><p className="text-gray-900 font-bold">{selectedApp.occupation || 'N/A'}</p></div>
                                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Years of Exp.</label><p className="text-gray-900 font-semibold">{selectedApp.experience_years || 'N/A'}</p></div>
                                    </div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Leadership Roles</label><p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">{selectedApp.leadership_role || 'No prior roles mentioned.'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Advocacy Work</label><p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">{selectedApp.advocacy_work || 'None mentioned.'}</p></div>
                                </div>
                            </section>

                            {/* Section 5: Motivation */}
                            <section>
                                <div className="flex items-center space-x-2 text-blue-600 font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-blue-600 pl-4">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Section 5: Motivation & Vision</span>
                                </div>
                                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Personal Statement</label><p className="text-gray-700 bg-indigo-50/30 p-6 rounded-2xl leading-relaxed whitespace-pre-wrap">{selectedApp.personal_statement || 'N/A'}</p></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Policy Interest</label><p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedApp.policy_interest || 'N/A'}</p></div>
                                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Attendance Commitment</label><p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedApp.attendance_commitment || 'N/A'}</p></div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Digital Readiness */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2 text-green-600 font-bold text-sm uppercase tracking-widest border-l-4 border-green-600 pl-4">
                                        <Laptop className="h-4 w-4" />
                                        <span>Section 7: Digital Readiness</span>
                                    </div>
                                    {selectedApp.cv_url && (
                                        <a
                                            href={selectedApp.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
                                            <span>View Attached CV</span>
                                        </a>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reliable Internet?</label><p className="text-gray-900 font-bold">{selectedApp.has_internet || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Functional Laptop?</label><p className="text-gray-900 font-bold">{selectedApp.has_laptop || 'N/A'}</p></div>
                                    <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time Availability</label><p className="text-gray-900 font-bold">{selectedApp.time_availability || 'N/A'}</p></div>
                                </div>
                            </section>

                            {/* Final Section: Declaration */}
                            <section>
                                <div className="flex items-center space-x-2 text-gray-900 font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-gray-900 pl-4">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Declaration & Final Check</span>
                                </div>
                                <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 italic">Signed by Applicant</p>
                                        <p className="text-xl font-serif italic text-blue-100">{selectedApp.declaration_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 italic">Date Signed</p>
                                        <p className="font-bold">{selectedApp.declaration_date}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Modal Footer - Actions */}
                        <div className="p-8 border-t border-gray-100 bg-white flex justify-end space-x-4">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                            >
                                Close
                            </button>
                            {selectedApp.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => { handleReject(selectedApp.id); setSelectedApp(null); }}
                                        className="px-6 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all border border-red-100"
                                    >
                                        Reject Application
                                    </button>
                                    <button
                                        onClick={() => { handleAdmit(selectedApp); setSelectedApp(null); }}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105"
                                    >
                                        Admit & Enroll Candidate
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
