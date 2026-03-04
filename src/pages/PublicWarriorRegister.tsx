import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    User,
    Heart,
    GraduationCap,
    Briefcase,
    Shield,
    MapPin,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Save,
    Activity
} from 'lucide-react';

export const PublicWarriorRegister: React.FC = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
        consentGiven: false, signatureName: '', signatureDate: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialForm);

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

    const totalSteps = 6;

    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 1:
                return formData.fullName && formData.gender && formData.dob && formData.stateResidence && formData.lga && formData.phonePrimary;
            case 2:
                return formData.genotype;
            case 3:
                return formData.highestEducation;
            case 4:
                return formData.employmentStatus && formData.monthlyIncome;
            case 6:
                return formData.consentGiven && formData.signatureName && formData.signatureDate;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (!validateStep(step)) {
            alert('Please fill in all required fields (*) before continuing.');
            return;
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.consentGiven) {
            alert('Please provide your consent by checking the box at the end of the form.');
            return;
        }

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
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            console.error(err);
            alert('Failed to submit registration: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-scale-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Thank you for registering in the National SCD Register. Your contribution helps us advocate for better care and social protection for all warriors.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-google-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                    >
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    const renderStepIndicator = () => (
        <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto px-4 overflow-x-auto py-2">
            {[
                { step: 1, icon: <User className="h-5 w-5" />, label: 'Profile' },
                { step: 2, icon: <Heart className="h-5 w-5" />, label: 'Medical' },
                { step: 3, icon: <GraduationCap className="h-5 w-5" />, label: 'Education' },
                { step: 4, icon: <Briefcase className="h-5 w-5" />, label: 'Economic' },
                { step: 5, icon: <Shield className="h-5 w-5" />, label: 'Access' },
                { step: 6, icon: <CheckCircle2 className="h-5 w-5" />, label: 'Consent' }
            ].map((item) => (
                <div key={item.step} className="flex flex-col items-center group relative min-w-[60px]">
                    <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${step >= item.step ? 'bg-google-red text-white shadow-red-100 scale-110' : 'bg-white text-gray-400 border border-gray-100'
                            }`}
                    >
                        {item.icon}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-black mt-3 transition-colors ${step >= item.step ? 'text-google-red' : 'text-gray-400'
                        }`}>
                        {item.label}
                    </span>
                    {item.step < 6 && (
                        <div className={`hidden md:block absolute top-6 -right-[2.5rem] w-8 h-[2px] ${step > item.step ? 'bg-google-red' : 'bg-gray-100'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center space-x-2 bg-red-50 text-google-red px-4 py-2 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest border border-red-100">
                        <Activity className="h-4 w-4" />
                        <span>National SCD Register</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight">
                        Warrior Enrollment <span className="text-google-red">Center</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-base md:text-lg">
                        Join the national movement to map, support, and empower Sickle Cell Warriors across Nigeria. Your data creates structural change.
                    </p>
                </div>

                {renderStepIndicator()}

                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* STEP 1: Identification */}
                        {step === 1 && (
                            <div className="p-8 md:p-12 animate-slide-up">
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="bg-blue-50 p-4 rounded-2xl text-google-blue">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
                                        <p className="text-gray-400 font-bold text-sm">Basic identity and location details.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="As it appears on your ID" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIN (Optional)</label>
                                        <input type="text" name="nin" value={formData.nin} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="11-digit NIN" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender <span className="text-red-500 font-bold">*</span></label>
                                        <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State of Origin</label>
                                        <input type="text" name="stateOrigin" value={formData.stateOrigin} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State of Residence <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="text" name="stateResidence" value={formData.stateResidence} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LGA <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="text" name="lga" value={formData.lga} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Residential Address</label>
                                        <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Phone <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="tel" name="phonePrimary" value={formData.phonePrimary} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Medical */}
                        {step === 2 && (
                            <div className="p-8 md:p-12 animate-slide-up">
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="bg-red-50 p-4 rounded-2xl text-google-red">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Medical History</h2>
                                        <p className="text-gray-400 font-bold text-sm">Genotype and treatment confirmation.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmed Genotype <span className="text-red-500 font-bold">*</span></label>
                                        <select required name="genotype" value={formData.genotype} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select...</option>
                                            <option value="HbSS">HbSS</option>
                                            <option value="HbSC">HbSC</option>
                                            <option value="HbSβ Thalassemia">HbSβ Thalassemia</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age at Diagnosis</label>
                                        <input type="text" name="ageAtDiagnosis" value={formData.ageAtDiagnosis} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Managing Health Facility</label>
                                        <input type="text" name="managingFacility" value={formData.managingFacility} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="Hospital/Clinic Name & City" />
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                        <input type="checkbox" id="hasRegularHematologist" name="hasRegularHematologist" checked={formData.hasRegularHematologist} onChange={handleInputChange} className="h-5 w-5 rounded text-google-red focus:ring-google-red" />
                                        <label htmlFor="hasRegularHematologist" className="text-sm font-bold text-gray-700">Has regular Hematologist/Doctor?</label>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Crisis Frequency (Last 12 mos)</label>
                                        <select name="crisisFrequency" value={formData.crisisFrequency} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select...</option>
                                            <option value="0-2">0–2 times</option>
                                            <option value="3-5">3–5 times</option>
                                            <option value="6-10">6–10 times</option>
                                            <option value="10+">10+ times</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                        <input type="checkbox" id="onHydroxyurea" name="onHydroxyurea" checked={formData.onHydroxyurea} onChange={handleInputChange} className="h-5 w-5 rounded text-google-red focus:ring-google-red" />
                                        <label htmlFor="onHydroxyurea" className="text-sm font-bold text-gray-700">Currently on Hydroxyurea?</label>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Related Complications (Check all that apply)</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            {['Stroke', 'Leg ulcers', 'Acute chest syndrome', 'Organ damage', 'Vision Loss', 'Chronic Pain', 'None'].map(comp => (
                                                <label key={comp} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group">
                                                    <input type="checkbox" name="complications" value={comp} checked={formData.complications.includes(comp)} onChange={handleInputChange} className="rounded text-google-red border-gray-300 focus:ring-google-red mr-3" />
                                                    <span className="text-sm font-bold text-gray-600 group-hover:text-google-red transition-colors">{comp}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Education */}
                        {step === 3 && (
                            <div className="p-8 md:p-12 animate-slide-up">
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="bg-yellow-50 p-4 rounded-2xl text-google-yellow">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Education Background</h2>
                                        <p className="text-gray-400 font-bold text-sm">Educational history and impact of SCD.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Highest Educational Level <span className="text-red-500 font-bold">*</span></label>
                                        <select required name="highestEducation" value={formData.highestEducation} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select Level</option>
                                            <option value="No formal education">No formal education</option>
                                            <option value="Primary School">Primary School</option>
                                            <option value="Secondary School">Secondary School</option>
                                            <option value="Vocational Training">Vocational Training</option>
                                            <option value="University/Polytechnic">University/Polytechnic</option>
                                            <option value="Post-Graduate">Post-Graduate</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-3 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-google-red/20 transition-all">
                                        <input type="checkbox" name="inSchool" checked={formData.inSchool} onChange={handleInputChange} className="h-6 w-6 rounded text-google-red" />
                                        <span className="text-sm font-bold text-gray-700">Currently in school?</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-google-red/20 transition-all">
                                        <input type="checkbox" name="droppedOutDueToScd" checked={formData.droppedOutDueToScd} onChange={handleInputChange} className="h-6 w-6 rounded text-google-red" />
                                        <span className="text-sm font-bold text-gray-700">Dropped out due to SCD complications?</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Economic */}
                        {step === 4 && (
                            <div className="p-8 md:p-12 animate-slide-up">
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="bg-green-50 p-4 rounded-2xl text-google-green">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Economic Status</h2>
                                        <p className="text-gray-400 font-bold text-sm">Employment and household finance.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Employment Status <span className="text-red-500 font-bold">*</span></label>
                                        <select required name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select Status</option>
                                            <option value="Fully Employed">Fully Employed</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Self-Employed">Self-Employed</option>
                                            <option value="Unemployed">Unemployed</option>
                                            <option value="Student">Student</option>
                                            <option value="Retired">Retired</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Occupation</label>
                                        <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="e.g. Teacher, Trader, Engineer" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Personal Monthly Income <span className="text-red-500 font-bold">*</span></label>
                                        <select required name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select Category...</option>
                                            <option value="None">No regular income</option>
                                            <option value="Under ₦20,000">Under ₦20,000 (Vulnerable)</option>
                                            <option value="₦20,000 - ₦50,000">₦20,000 - ₦50,000</option>
                                            <option value="₦50,000 - ₦100,000">₦50,000 - ₦100,000</option>
                                            <option value="Above ₦100,000">Above ₦100,000</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Household Size</label>
                                        <input type="number" name="householdSize" value={formData.householdSize} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="flex items-center space-x-3 p-6 bg-gray-50 rounded-3xl md:col-span-2">
                                        <input type="checkbox" name="primaryEarner" checked={formData.primaryEarner} onChange={handleInputChange} className="h-6 w-6 rounded text-google-red" />
                                        <span className="text-sm font-bold text-gray-700">Are you the primary breadwinner in your home?</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: Access & Support */}
                        {step === 5 && (
                            <div className="p-8 md:p-12 animate-slide-up">
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Access & Support</h2>
                                        <p className="text-gray-400 font-bold text-sm">Welfare access and daily care logistics.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Health Insurance Status</label>
                                        <input type="text" name="healthInsurance" value={formData.healthInsurance} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="NHIS, Private, or None" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Affordability of Meds</label>
                                        <select name="struggleAffordMeds" value={formData.struggleAffordMeds} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold">
                                            <option value="">Select...</option>
                                            <option value="Always">I always struggle</option>
                                            <option value="Often">I often struggle</option>
                                            <option value="Sometimes">I sometimes struggle</option>
                                            <option value="Never">I never struggle</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                        <input type="checkbox" name="missedAppointmentsFinance" checked={formData.missedAppointmentsFinance} onChange={handleInputChange} className="h-5 w-5 rounded text-google-red" />
                                        <span className="text-sm font-bold text-gray-700">Missed Clinic recently due to lack of funds?</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                        <input type="checkbox" name="receiveSocialWelfare" checked={formData.receiveSocialWelfare} onChange={handleInputChange} className="h-5 w-5 rounded text-google-red" />
                                        <span className="text-sm font-bold text-gray-700">Do you receive any Govt Social Welfare?</span>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Distance to Health Center (km)</label>
                                        <input type="text" name="distanceToCenter" value={formData.distanceToCenter} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usual Mode of Transport</label>
                                        <input type="text" name="transportMode" value={formData.transportMode} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="Bus, Bike, Private, Walk" />
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl md:col-span-2">
                                        <input type="checkbox" name="experienceDiscrimination" checked={formData.experienceDiscrimination} onChange={handleInputChange} className="h-5 w-5 rounded text-google-red" />
                                        <span className="text-sm font-bold text-gray-700">Have you ever experienced discrimination because of SCD?</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 6: Consent */}
                        {step === 6 && (
                            <div className="p-8 md:p-12 animate-slide-up">
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="bg-google-blue p-4 rounded-2xl text-white">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Consent & Verification</h2>
                                        <p className="text-gray-400 font-bold text-sm">Validating your contribution.</p>
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-google-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10">
                                        <p className="text-lg leading-relaxed mb-8 text-gray-300">
                                            I hereby consent to the collection and use of my personal and medical data for the purpose of the <span className="text-white font-bold">SSAI National SCD Register</span> and subsequent social protection initiatives. I certify that the information provided is true to the best of my knowledge.
                                        </p>
                                        <label className="flex items-center space-x-4 cursor-pointer group">
                                            <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${formData.consentGiven ? 'bg-google-red border-google-red' : 'border-gray-600 group-hover:border-google-red'
                                                }`}>
                                                <input
                                                    required
                                                    type="checkbox"
                                                    name="consentGiven"
                                                    checked={formData.consentGiven}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                {formData.consentGiven && <CheckCircle2 className="h-6 w-6 text-white" />}
                                            </div>
                                            <span className="text-xl font-bold">I Agree to the Terms Above</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Signature (Full Name) <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="text" name="signatureName" value={formData.signatureName} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" placeholder="Type your full name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date <span className="text-red-500 font-bold">*</span></label>
                                        <input required type="date" name="signatureDate" value={formData.signatureDate} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-google-red outline-none transition-all font-bold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Footer / Navigation */}
                        <div className="p-8 md:px-12 md:py-10 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <ArrowLeft className="h-5 w-5 mr-3" /> Previous Step
                            </button>

                            {step < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-black transition-all hover:scale-105 shadow-xl"
                                >
                                    Continue <ArrowRight className="h-5 w-5 ml-3" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-google-red text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-100 disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : <><Save className="h-5 w-5 mr-3" /> Complete Registration</>}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="mt-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                    <p>© 2026 Salfar Sickle Aid Initiative • Secure & Confidential</p>
                </div>
            </div>
        </div>
    );
};
