import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, Search, ExternalLink, User, MapPin, GraduationCap, Briefcase, Heart, BookOpen, Laptop, ShieldCheck, X } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
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
                    fetchApplications();
                }
            } catch {
                setIsAdmin(false);
            }
        };

        if (!authLoading) checkAdmin();
    }, [user, authLoading]);

    const fetchApplications = async () => {
        const { data } = await supabase
            .from('academy_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setApplications(data);
        setLoading(false);
    };

    const handleAdmit = async (application: any) => {
        setGeneratingInvite(application.id);

        // In a real app, you would select the cohort dynamically
        const cohortName = 'Dr. Sani Gwarzo mni Fellowship';

        try {
            // 1. Generate Invite
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

            // 2. Update Application Status
            const { error: appError } = await supabase
                .from('academy_applications')
                .update({ status: 'accepted' })
                .eq('id', application.id);

            if (appError) throw appError;

            const inviteLink = `${window.location.origin}/academy/enroll?token=${invite.id}`;

            // Update UI
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

    if (authLoading || loading) return <div className="p-8 text-center animate-pulse">Loading Admin Dashboard...</div>;
    if (isAdmin === false) return <Navigate to="/academy/portal" replace />;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admissions Dashboard</h1>
                        <p className="text-gray-600">Review Lead Warriors Academy applications.</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm flex items-center">
                        <span className="mr-4">Admin Mode</span>
                        <div className="flex space-x-2">
                            <Link to="/academy/admin" className="bg-white px-3 py-1 rounded-md text-xs hover:bg-gray-50 transition-colors">Admissions</Link>
                            <Link to="/admin/content" className="bg-white px-3 py-1 rounded-md text-xs hover:bg-gray-50 transition-colors">Content</Link>
                            <Link to="/admin/gallery" className="bg-white px-3 py-1 rounded-md text-xs hover:bg-gray-50 transition-colors">Gallery</Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 mb-1 font-medium">Total Apps</div>
                        <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-orange-500 mb-1 font-medium flex items-center"><Clock className="h-4 w-4 mr-1" /> Pending</div>
                        <div className="text-3xl font-bold text-gray-900">{applications.filter(a => a.status === 'pending').length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-green-500 mb-1 font-medium flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Accepted</div>
                        <div className="text-3xl font-bold text-gray-900">{applications.filter(a => a.status === 'accepted').length}</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="font-bold text-gray-900 text-lg">Recent Applications</h3>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search names..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">State</th>
                                    <th className="px-6 py-4">Qualification</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{app.full_name}</div>
                                            <div className="text-sm text-gray-500">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">{app.state_residence}</td>
                                        <td className="px-6 py-4 text-gray-600 italic">{app.highest_qualification}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${app.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-orange-50 text-orange-700 border border-orange-100'
                                                }`}>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center space-x-3">
                                                {app.status === 'pending' && (
                                                    <div className="flex space-x-1">
                                                        <button onClick={() => handleReject(app.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Reject">
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAdmit(app)}
                                                            disabled={generatingInvite === app.id}
                                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-700 shadow-sm transition-all whitespace-nowrap"
                                                        >
                                                            {generatingInvite === app.id ? '...' : 'Admit'}
                                                        </button>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg font-bold text-xs flex items-center transition-all"
                                                >
                                                    View Full <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-lg">
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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
                                <div className="flex items-center space-x-2 text-green-600 font-bold mb-6 text-sm uppercase tracking-widest border-l-4 border-green-600 pl-4">
                                    <Laptop className="h-4 w-4" />
                                    <span>Section 7: Digital Readiness</span>
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
        </div>
    );
};
