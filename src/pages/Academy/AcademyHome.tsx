import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Users, BookOpen, GraduationCap, ArrowRight, CheckCircle2, FileText, Briefcase, MapPin } from 'lucide-react';

export const AcademyHome: React.FC = () => {
    const [openModule, setOpenModule] = useState<number | null>(null);

    const toggleModule = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };

    const cohorts = [
        { title: "Dr. Sani Gwarzo mni Fellowship", quarter: "Q1 2026" },
        { title: "Mallam Yushau Shuaib mnipr Fellowship", quarter: "Q2 2026" },
        { title: "Mallam Sadiq Kassim fnipr Fellowship", quarter: "Q3 2026" },
        { title: "Salma Dunoma Fellowship", quarter: "Q4 2026" }
    ];

    const outcomes = [
        "Policy-Literate Leaders",
        "Governance-Savvy Advocates",
        "Workplace Negotiators",
        "Strategic Community Organizers"
    ];

    return (
        <div className="animate-fade-in">
            {/* 1. Landing Section (Hero Banner) */}
            <section className="relative bg-gradient-to-r from-gray-900 to-indigo-900 min-h-[80vh] flex items-center">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
                    <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold inline-block mb-6 uppercase tracking-wider">
                        SSAI Elite Fellowship Platform
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
                        Lead Warriors <span className="text-indigo-400">Academy</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-gray-200 mb-8 font-light">
                        Fostering Leadership and Capacity Building
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        The Lead Warriors Academy is SSAI's elite fellowship platform designed to transform sickle cell warriors into policy-literate leaders, advocates, and change-makers across Nigeria.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/academy/apply"
                            className="bg-google-red text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-600 transition-all transform hover:scale-105 flex items-center space-x-2"
                        >
                            <Target className="h-5 w-5" />
                            <span>Apply for Fellowship</span>
                        </Link>
                        <Link
                            to="/academy/login"
                            className="bg-white text-indigo-900 border-2 border-transparent px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center space-x-2"
                        >
                            <Users className="h-5 w-5" />
                            <span>Login to Academy Portal</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. About the Academy */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-8">About the Fellowship</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-left mx-auto">
                        <p className="mb-6">
                            The Lead Warriors Academy is a year-round, elite fellowship designed to build the next generation of sickle cell advocates and leaders. The program empowers warriors to move beyond the role of "patient" and emerge as professional policy stakeholders capable of influencing systems and driving reform in their communities.
                        </p>
                        <p>
                            Each quarterly cohort maintains a rigorous core curriculum while being named in honor of late Salma and distinguished SSAI Board Leaders.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. 2026 Named Fellowships */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">2026 Fellowship Cohorts</h2>
                        <p className="text-xl text-gray-600">Four intensive cohorts shaping the future of advocacy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cohorts.map((cohort, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-500 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    {cohort.quarter}
                                </div>
                                <GraduationCap className="h-10 w-10 text-indigo-500 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                                    {cohort.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <div className="inline-block bg-indigo-100 text-indigo-800 font-semibold px-6 py-2 rounded-full text-sm">
                            Inaugural Commencement: February 28, 2026
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Meet Our Current Warriors */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Warriors</h2>
                        <p className="text-xl text-gray-600">The brilliant minds driving systemic change in their communities.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Ebunoluwa Adeyemi", state: "Lagos State" },
                            { name: "Chiamaka Okeke", state: "Enugu State" },
                            { name: "Yusuf Ibrahim", state: "Kano State" },
                            { name: "Blessing Akpan", state: "Akwa Ibom" }
                        ].map((warrior, idx) => (
                            <div key={idx} className="group relative rounded-xl overflow-hidden shadow-md bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center">
                                <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-600 transition-colors">
                                    <Users className="h-8 w-8 text-indigo-600 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{warrior.name}</h3>
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                    <MapPin className="h-4 w-4 mr-1 text-indigo-500" /> {warrior.state}
                                </div>
                                <div className="text-indigo-600 text-sm font-semibold mb-6">
                                    Dr. Sani Gwarzo mni Fellowship
                                </div>

                                <button className="mt-auto inline-flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                                    View Profile
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Eligibility & Selection */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-8">Who Can Apply</h2>
                            <ul className="space-y-4">
                                {[
                                    "Must be living with sickle cell disease",
                                    "Proof of hospital ID required",
                                    "Minimum of HND or BSc",
                                    "Ability to attend all virtual sessions",
                                    "Demonstrated passion for advocacy and leadership"
                                ].map((req, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle2 className="h-6 w-6 text-google-green mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-700">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Selection Process</h3>
                            <div className="space-y-6 relative">
                                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
                                {[
                                    { title: "Online Application", icon: FileText },
                                    { title: "Shortlisting", icon: Target },
                                    { title: "Professional Interview", icon: Users },
                                    { title: "Final Selection", icon: Award }
                                ].map((step, idx) => {
                                    const IconComponent = step.icon;
                                    return (
                                        <div key={idx} className="flex items-center relative z-10">
                                            <div className="bg-indigo-600 rounded-full p-3 mr-4 ring-4 ring-white">
                                                <IconComponent className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="text-xl font-semibold text-gray-800">{step.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Fellowship Curriculum */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Fellowship Curriculum</h2>
                        <p className="text-xl text-gray-600">A rigorous three-month structured program.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                month: "Month 1",
                                title: "Identity, Power & Strategic Advocacy",
                                content: "Exploring personal narratives, understanding the power dynamics in healthcare, and developing effective grassroots advocacy strategies."
                            },
                            {
                                month: "Month 2",
                                title: "Governance, Law & Systems Reform",
                                content: "Deep dive into health policy, legislative engagement, understanding health budgets, and structural reform mechanisms."
                            },
                            {
                                month: "Month 3",
                                title: "Institutional Influence & Legacy",
                                content: "Building partnerships, writing impactful policy memos, corporate negotiations, and establishing long-term community presence."
                            }
                        ].map((module, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openModule === idx ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}
                                    onClick={() => toggleModule(idx)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-indigo-600 font-bold mr-4">{module.month}</span>
                                        <span className="text-xl font-semibold text-gray-900">{module.title}</span>
                                    </div>
                                    <div className={`transform transition-transform ${openModule === idx ? 'rotate-180' : ''}`}>
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openModule === idx ? 'max-h-40 py-4 border-t border-gray-100 bg-white' : 'max-h-0 py-0'}`}>
                                    <p className="text-gray-600">{module.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Graduation Milestones & 8. Program Outcomes */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* 7. Certification */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                                <Award className="h-8 w-8 text-indigo-600 mr-3" />
                                Certification Requirements
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Policy-Ready Introduction",
                                    "Community Governance Plan",
                                    "Policy Memo",
                                    "Public Accountability Output"
                                ].map((milestone, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <span className="font-medium text-gray-800">{milestone}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 8. Outcomes */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                                <Briefcase className="h-8 w-8 text-google-green mr-3" />
                                What Fellows Become
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {outcomes.map((outcome, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-indigo-600 to-blue-800 p-6 rounded-xl shadow-md text-white hover:shadow-lg transition-transform transform hover:-translate-y-1">
                                        <span className="font-bold text-lg">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Apply Call to Action */}
            <section className="py-24 bg-google-red relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-500 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-500 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Apply to Join the Academy</h2>
                    <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
                        Take the leap from being a warrior to becoming a recognized policy advocate and leader in your community.
                    </p>
                    <Link
                        to="/academy/apply"
                        className="inline-flex items-center justify-center bg-white text-google-red px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                    >
                        Start Application
                        <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                </div>
            </section>
        </div>
    );
};
