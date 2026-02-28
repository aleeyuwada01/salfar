import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { LogOut, BookOpen, Video, FileText, Download, Users, CheckCircle2, Circle, Target, Upload } from 'lucide-react';

interface FellowProfile {
    full_name: string;
    cohort_name: string;
    state: string;
    role: string;
}

export const AcademyPortal: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<FellowProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('fellow_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/academy/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 animate-fade-in">
            {/* Portal Header */}
            <header className="bg-indigo-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-2 rounded-full hidden sm:block">
                                <BookOpen className="h-6 w-6 text-indigo-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Fellows Learning Portal</h1>
                                <p className="text-indigo-200 text-sm">{profile?.cohort_name || 'Active Cohort'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:block text-right">
                                <p className="font-medium">{profile?.full_name || user?.email}</p>
                                <p className="text-xs text-indigo-300 capitalize">{profile?.role || 'Fellow'}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Message */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border-l-4 border-indigo-500">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {profile?.full_name?.split(' ')[0] || 'Fellow'}!
                    </h2>
                    <p className="text-gray-600 font-medium">
                        You are currently on Week 4 of the {profile?.cohort_name || 'Academy'} Curriculum.
                        Remember to review the reading materials before the next live session.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area - 2/3 width */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Progress Tracker */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Target className="h-6 w-6 text-google-red mr-2" />
                                Your Learning Progress
                            </h3>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Overall Curriculum Completion</span>
                                    <span>35%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-google-green h-2.5 rounded-full" style={{ width: '35%' }}></div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Module 1: Identity & Strategic Advocacy</h4>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle2 className="h-5 w-5 text-google-green mr-3" />
                                        <span className="text-gray-800 font-medium">Week 1: The Power of Personal Narrative</span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">Completed</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle2 className="h-5 w-5 text-google-green mr-3" />
                                        <span className="text-gray-800 font-medium">Week 2: Mapping Healthcare Actors</span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">Completed</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                    <div className="flex items-center">
                                        <Circle className="h-5 w-5 text-indigo-500 mr-3" />
                                        <span className="text-indigo-900 font-bold">Week 3: Grassroots Organizing Models (Current)</span>
                                    </div>
                                    <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full font-bold">In Progress</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg opacity-60">
                                    <div className="flex items-center">
                                        <Circle className="h-5 w-5 text-gray-300 mr-3" />
                                        <span className="text-gray-600 font-medium">Week 4: Crafting the Advocacy Message</span>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">Locked</span>
                                </div>
                            </div>
                        </div>

                        {/* Current Week Materials */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <BookOpen className="h-6 w-6 text-google-blue mr-2" />
                                Week 3 Materials
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a href="#" className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all group">
                                    <Video className="h-8 w-8 text-google-red mr-4 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Live Session Recording</h4>
                                        <p className="text-sm text-gray-500 mt-1">Guest Speaker: Dr. Ibrahim</p>
                                        <span className="text-xs text-indigo-600 font-semibold mt-2 inline-block">Watch (1h 15m)</span>
                                    </div>
                                </a>

                                <a href="#" className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all group">
                                    <FileText className="h-8 w-8 text-google-orange mr-4 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Required Reading</h4>
                                        <p className="text-sm text-gray-500 mt-1">Community Organizing 101</p>
                                        <span className="text-xs text-indigo-600 font-semibold mt-2 inline-block">Read PDF (12 pages)</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Assignment Submission */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Upload className="h-6 w-6 text-google-green mr-2" /> {/* Assuming you've imported Upload */}
                                Assignment Upload
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                <strong>Task:</strong> Draft a stakeholder map for your local community identifying 5 key actors in sickle cell care.
                            </p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <p className="text-gray-700 font-medium">Drag & drop your file here, or click to select</p>
                                <p className="text-xs text-gray-500 mt-2">Accepted formats: .pdf, .docx (Max 5MB)</p>
                                <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700">
                                    Select File
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <div className="space-y-8">

                        {/* Resources Map */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Toolkit & Resources</h3>
                            <ul className="space-y-3">
                                {[
                                    { title: "Policy Memo Template", type: "Word Doc" },
                                    { title: "Advocacy Pitch Deck", type: "PowerPoint" },
                                    { title: "National SCD Data Brief 2025", type: "PDF" },
                                    { title: "Media Engagement Guide", type: "PDF" }
                                ].map((resource, idx) => (
                                    <li key={idx}>
                                        <a href="#" className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <div className="flex items-center">
                                                <Download className="h-4 w-4 text-gray-400 mr-3 group-hover:text-indigo-600" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">{resource.title}</p>
                                                    <p className="text-xs text-gray-500">{resource.type}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Community Connect */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl shadow-sm p-6 text-center">
                            <Users className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Fellows Community</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Connect, collaborate, and share insights with your cohort members.
                            </p>
                            <button className="w-full bg-white border border-indigo-200 text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors">
                                Open Discussion Board
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
