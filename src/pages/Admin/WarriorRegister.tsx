import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Save, X, ExternalLink, Activity, Users } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const WarriorRegister: React.FC = () => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [warriors, setWarriors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarrior, setSelectedWarrior] = useState<any | null>(null);

    // Initial Form State
    const initialForm = {
        fullName: '', nin: '', gender: '', dob: '', stateOrigin: '', stateResidence: '',
        lga: '', wardCommunity: '', residentialAddress: '', phonePrimary: '', phoneAlternative: '', email: '',

        genotype: '', ageAtDiagnosis: '', placeOfDiagnosis: '', managingFacility: '',
        hasRegularHematologist: false, crisisFrequency: '', hospitalAdmissions: '',
        onHydroxyurea: false, complications: [] as string[],

        highestEducation: '', inSchool: false, droppedOutDueToScd: false,

        employmentStatus: '', occupation: '', monthlyIncome: '', householdIncome: '',
        householdSize: 0, primaryEarner: false,

        healthInsurance: '', struggleAffordMeds: '', missedAppointmentsFinance: false,
        receiveSocialWelfare: false, housingType: '', cleanWater: false, electricity: false, transportUnder30m: false,

        distanceToCenter: '', transportMode: '', experienceDiscrimination: false,

        willingToParticipate: false, wantUpdates: false,

        consentGiven: false, signatureName: '', signatureDate: ''
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchWarriors();
    }, []);

    const fetchWarriors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('scd_register')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setWarriors(data);
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (name === 'complications' ? handleComplications(value, checked, prev.complications) : checked) : value
        }));
    };

    const handleComplications = (value: string, checked: boolean, current: string[]) => {
        if (checked) {
            return [...current, value];
        } else {
            return current.filter(c => c !== value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const dbPayload = {
            full_name: formData.fullName,
            nin: formData.nin,
            gender: formData.gender,
            dob: formData.dob || null,
            state_origin: formData.stateOrigin,
            state_residence: formData.stateResidence,
            lga: formData.lga,
            ward_community: formData.wardCommunity,
            residential_address: formData.residentialAddress,
            phone_primary: formData.phonePrimary,
            phone_alternative: formData.phoneAlternative,
            email: formData.email,

            genotype: formData.genotype,
            age_at_diagnosis: formData.ageAtDiagnosis,
            place_of_diagnosis: formData.placeOfDiagnosis,
            managing_facility: formData.managingFacility,
            has_regular_hematologist: Boolean(formData.hasRegularHematologist),
            crisis_frequency: formData.crisisFrequency,
            hospital_admissions: formData.hospitalAdmissions,
            on_hydroxyurea: Boolean(formData.onHydroxyurea),
            complications: formData.complications,

            highest_education: formData.highestEducation,
            in_school: Boolean(formData.inSchool),
            dropped_out_due_to_scd: Boolean(formData.droppedOutDueToScd),

            employment_status: formData.employmentStatus,
            occupation: formData.occupation,
            monthly_income: formData.monthlyIncome,
            household_income: formData.householdIncome,
            household_size: Number(formData.householdSize),
            primary_earner: Boolean(formData.primaryEarner),

            health_insurance: formData.healthInsurance,
            struggle_afford_meds: formData.struggleAffordMeds,
            missed_appointments_finance: Boolean(formData.missedAppointmentsFinance),
            receive_social_welfare: Boolean(formData.receiveSocialWelfare),
            housing_type: formData.housingType,
            clean_water: Boolean(formData.cleanWater),
            electricity: Boolean(formData.electricity),
            transport_under_30m: Boolean(formData.transportUnder30m),

            distance_to_center: formData.distanceToCenter,
            transport_mode: formData.transportMode,
            experience_discrimination: Boolean(formData.experienceDiscrimination),

            willing_to_participate: Boolean(formData.willingToParticipate),
            want_updates: Boolean(formData.wantUpdates),

            consent_given: Boolean(formData.consentGiven),
            signature_name: formData.signatureName,
            signature_date: formData.signatureDate || null
        };

        try {
            const { error } = await supabase.from('scd_register').insert([dbPayload]);
            if (error) throw error;

            alert('Warrior enrolled successfully!');
            setFormData(initialForm);
            setView('list');
            fetchWarriors();
        } catch (err: any) {
            console.error(err);
            alert('Failed to enroll warrior: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredWarriors = warriors.filter(w =>
        w.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.phone_primary?.includes(searchTerm) ||
        w.state_residence?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="National SCD Register">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <Activity className="mr-3 text-red-600 h-6 w-6" />
                        Warrior Database
                    </h2>
                    <p className="text-gray-600 font-medium">Warrior Enrollment & Socio-Economic Data Capture</p>
                </div>

                <div className="flex space-x-3">
                    {view === 'form' ? (
                        <button
                            onClick={() => setView('list')}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 flex items-center transition-all shadow-sm"
                        >
                            <X className="h-4 w-4 mr-2" /> Cancel Enrollment
                        </button>
                    ) : (
                        <button
                            onClick={() => setView('form')}
                            className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 flex items-center transition-all shadow-lg shadow-red-100"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Enroll Warrior
                        </button>
                    )}
                </div>
            </div>

            {view === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-indigo-500" />
                            Registered Warriors ({warriors.length})
                        </h3>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or state..."
                                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                                    <th className="px-6 py-4">Name / ID</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Genotype</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading register...</td></tr>
                                ) : filteredWarriors.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No warriors found.</td></tr>
                                ) : filteredWarriors.map((w) => (
                                    <tr key={w.id} className="hover:bg-red-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{w.full_name}</div>
                                            <div className="text-xs text-gray-500">NIN: {w.nin || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-800">{w.state_residence}</div>
                                            <div className="text-xs text-gray-500">{w.lga}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200">
                                                {w.genotype || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{w.phone_primary}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedWarrior(w)}
                                                className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center"
                                            >
                                                View Profile <ExternalLink className="h-3 w-3 ml-1" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'form' && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-scale-up">
                    <div className="bg-gray-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-2xl font-bold relative z-10">Warrior Enrollment Form</h2>
                        <p className="text-gray-400 relative z-10">Capture comprehensive socio-economic and medical data.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-12">
                        {/* SECTION 1 */}
                        <section>
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6 border-b pb-2">Section 1: Identification Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Name *</label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" placeholder="As it appears on official ID" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">NIN (if available)</label>
                                    <input type="text" name="nin" value={formData.nin} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">State of Origin</label>
                                    <input type="text" name="stateOrigin" value={formData.stateOrigin} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">State of Residence</label>
                                    <input type="text" name="stateResidence" value={formData.stateResidence} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">LGA</label>
                                    <input type="text" name="lga" value={formData.lga} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Ward/Community</label>
                                    <input type="text" name="wardCommunity" value={formData.wardCommunity} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Residential Address</label>
                                    <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primary Phone</label>
                                    <input type="tel" name="phonePrimary" value={formData.phonePrimary} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Alternative Phone</label>
                                    <input type="tel" name="phoneAlternative" value={formData.phoneAlternative} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2 */}
                        <section>
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6 border-b pb-2">Section 2: Genotype & Medical Confirmation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Confirmed Genotype</label>
                                    <select name="genotype" value={formData.genotype} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="HbSS">HbSS</option>
                                        <option value="HbSC">HbSC</option>
                                        <option value="HbSβ Thalassemia">HbSβ Thalassemia</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Age at Diagnosis</label>
                                    <input type="text" name="ageAtDiagnosis" value={formData.ageAtDiagnosis} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Place of Diagnosis</label>
                                    <select name="placeOfDiagnosis" value={formData.placeOfDiagnosis} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="Government Hospital">Government Hospital</option>
                                        <option value="Private Hospital">Private Hospital</option>
                                        <option value="Teaching Hospital">Teaching Hospital</option>
                                        <option value="PHC">PHC</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Managing Health Facility</label>
                                    <input type="text" name="managingFacility" value={formData.managingFacility} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" placeholder="Name & Location" />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input type="checkbox" id="hasRegularHematologist" name="hasRegularHematologist" checked={formData.hasRegularHematologist} onChange={handleInputChange} className="h-5 w-5 rounded text-red-600 focus:ring-red-500 border-gray-300" />
                                    <label htmlFor="hasRegularHematologist" className="ml-2 text-sm text-gray-700 font-bold">Has regular hematologist?</label>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Crisis in last 12 months</label>
                                    <select name="crisisFrequency" value={formData.crisisFrequency} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="0-2">0–2</option>
                                        <option value="3-5">3–5</option>
                                        <option value="6-10">6–10</option>
                                        <option value="10+">10+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hospital Admissions (last 12 mos)</label>
                                    <input type="text" name="hospitalAdmissions" value={formData.hospitalAdmissions} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input type="checkbox" id="onHydroxyurea" name="onHydroxyurea" checked={formData.onHydroxyurea} onChange={handleInputChange} className="h-5 w-5 rounded text-red-600 focus:ring-red-500 border-gray-300" />
                                    <label htmlFor="onHydroxyurea" className="ml-2 text-sm text-gray-700 font-bold">Currently on Hydroxyurea?</label>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">SCD-related complications</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['Stroke', 'Leg ulcers', 'Acute chest syndrome', 'Organ damage', 'None'].map(comp => (
                                            <label key={comp} className="flex items-center">
                                                <input type="checkbox" name="complications" value={comp} checked={formData.complications.includes(comp)} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                                <span className="text-sm">{comp}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 3: Education */}
                        <section>
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6 border-b pb-2">Section 3: Educational Background</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Highest Education Level</label>
                                    <select name="highestEducation" value={formData.highestEducation} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="No formal education">No formal education</option>
                                        <option value="Primary School">Primary School</option>
                                        <option value="Secondary School">Secondary School</option>
                                        <option value="Vocational Training">Vocational Training</option>
                                        <option value="University/Polytechnic">University/Polytechnic</option>
                                        <option value="Post-Graduate">Post-Graduate</option>
                                    </select>
                                </div>
                                <div className="flex flex-col space-y-4 justify-center">
                                    <label className="flex items-center">
                                        <input type="checkbox" name="inSchool" checked={formData.inSchool} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                        <span className="text-sm font-bold">Currently in school?</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" name="droppedOutDueToScd" checked={formData.droppedOutDueToScd} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                        <span className="text-sm font-bold">Dropped out due to SCD complications?</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 4: Employment & Economic */}
                        <section>
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6 border-b pb-2">Section 4: Employment & Socio-Economic</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Employment Status</label>
                                    <select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="Fully Employed">Fully Employed</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Self-Employed">Self-Employed</option>
                                        <option value="Unemployed">Unemployed</option>
                                        <option value="Student">Student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Occupation</label>
                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" placeholder="e.g. Teacher, Trader" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Monthly Personal Income</label>
                                    <select name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select Category...</option>
                                        <option value="Under ₦20,000">Under ₦20,000</option>
                                        <option value="₦20,000 - ₦50,000">₦20,000 - ₦50,000</option>
                                        <option value="₦50,000 - ₦100,000">₦50,000 - ₦100,000</option>
                                        <option value="Above ₦100,000">Above ₦100,000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Household Monthly Income</label>
                                    <input type="text" name="householdIncome" value={formData.householdIncome} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Household Size</label>
                                    <input type="number" name="householdSize" value={formData.householdSize} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" name="primaryEarner" checked={formData.primaryEarner} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                    <span className="text-sm font-bold">Are you the primary breadwinner?</span>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 5: Social Support */}
                        <section>
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6 border-b pb-2">Section 5: Social Support & Welfare</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Health Insurance Type</label>
                                    <input type="text" name="healthInsurance" value={formData.healthInsurance} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" placeholder="e.g. NHIA, Private, None" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Struggle to afford medications?</label>
                                    <select name="struggleAffordMeds" value={formData.struggleAffordMeds} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none">
                                        <option value="">Select...</option>
                                        <option value="Always">Always</option>
                                        <option value="Often">Often</option>
                                        <option value="Sometimes">Sometimes</option>
                                        <option value="Never">Never</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="flex items-center">
                                        <input type="checkbox" name="missedAppointmentsFinance" checked={formData.missedAppointmentsFinance} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                        <span className="text-sm font-bold text-gray-700">Missed Clinic due to funds?</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" name="receiveSocialWelfare" checked={formData.receiveSocialWelfare} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                        <span className="text-sm font-bold text-gray-700">Receive social welfare?</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" name="experienceDiscrimination" checked={formData.experienceDiscrimination} onChange={handleInputChange} className="rounded text-red-600 border-gray-300 focus:ring-red-500 mr-2" />
                                        <span className="text-sm font-bold text-gray-700">Discriminated against?</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 6: Access */}
                        <section>
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6 border-b pb-2">Section 6: Center Access & Logistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Distance to managing facility (km)</label>
                                    <input type="text" name="distanceToCenter" value={formData.distanceToCenter} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Usual Mode of Transport</label>
                                    <input type="text" name="transportMode" value={formData.transportMode} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none" placeholder="e.g. Bus, Bike, Private" />
                                </div>
                            </div>
                        </section>

                        {/* CONSENT */}
                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Consent & Verification</h3>
                            <div className="space-y-4">
                                <label className="flex items-start">
                                    <input required type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleInputChange} className="mt-1 h-5 w-5 rounded text-red-600 border-gray-300 focus:ring-red-500 mr-3" />
                                    <span className="text-sm text-gray-600 leading-relaxed font-medium">
                                        I hereby consent to the collection and use of my personal and medical data for the purpose of the SSAI National SCD Register and subsequent social protection initiatives. I certify that the information provided is true to the best of my knowledge.
                                    </span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" name="signatureName" value={formData.signatureName} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-red-500" placeholder="Sign with Full Name" />
                                    <input required type="date" name="signatureDate" value={formData.signatureDate} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end pt-8 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition flex items-center shadow-lg shadow-red-200"
                            >
                                {submitting ? 'Saving Enrollment...' : <><Save className="h-5 w-5 mr-2" /> Save Warrior Enrollment</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Very basic view profile modal placeholder */}
            {selectedWarrior && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{selectedWarrior.full_name}</h2>
                            <button onClick={() => setSelectedWarrior(null)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <p><strong>NIN:</strong> {selectedWarrior.nin}</p>
                            <p><strong>Genotype:</strong> {selectedWarrior.genotype}</p>
                            <p><strong>Residence:</strong> {selectedWarrior.state_residence}</p>
                            {/* Needs full data mapping later */}
                            <p className="text-sm text-gray-500 italic">Full comprehensive view mapping to be completed.</p>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
