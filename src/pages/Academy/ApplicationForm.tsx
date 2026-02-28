import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, Upload } from 'lucide-react';

import { supabase } from '../../lib/supabase';

export const AcademyApplication: React.FC = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 4; // Grouping the 8 sections into 4 logical steps for better UX
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const nextStep = () => { if (step < totalSteps) setStep(step + 1); window.scrollTo(0, 0); };
    const prevStep = () => { if (step > 1) setStep(step - 1); window.scrollTo(0, 0); };

    const [formData, setFormData] = useState({
        // Section 1: Personal Info
        fullName: '', gender: '', dob: '', stateOrigin: '', stateResidence: '', lga: '', phone: '', email: '', linkedin: '', otherProfiles: '',
        // Section 2: Warrior Status Verification
        diagnosisType: '', diagnosisYear: '', hospitalName: '', hasHospitalId: '',
        // Section 3: Educational Background
        highestQualification: '', fieldOfStudy: '', institution: '', graduationYear: '',
        // Section 4: Professional & Leadership
        occupation: '', experienceYears: '', leadershipRole: '', advocacyWork: '',
        // Section 5: Motivation
        personalStatement: '', policyInterest: '', communityVision: '', attendanceCommitment: '',
        // Section 6: Competence
        hasWrittenContent: '', writtenContentDescription: '',
        // Section 7: Digital Readiness
        hasInternet: '', hasLaptop: '', timeAvailability: '',
        // Section 8: Declaration
        declarationName: '', declarationDate: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Map camelCase React state to snake_case Postgres schema
            const dbData = {
                full_name: formData.fullName,
                gender: formData.gender,
                dob: formData.dob,
                state_origin: formData.stateOrigin,
                state_residence: formData.stateResidence,
                lga: formData.lga,
                phone: formData.phone,
                email: formData.email,
                linkedin: formData.linkedin,

                diagnosis_type: formData.diagnosisType,
                diagnosis_year: formData.diagnosisYear,
                hospital_name: formData.hospitalName,
                has_hospital_id: formData.hasHospitalId,

                highest_qualification: formData.highestQualification,
                field_of_study: formData.fieldOfStudy,
                institution: formData.institution,
                graduation_year: formData.graduationYear,

                occupation: formData.occupation,
                experience_years: formData.experienceYears,
                leadership_role: formData.leadershipRole,
                advocacy_work: formData.advocacyWork,

                personal_statement: formData.personalStatement,
                policy_interest: formData.policyInterest,
                community_vision: formData.communityVision,
                attendance_commitment: formData.attendanceCommitment,

                has_written_content: formData.hasWrittenContent,
                written_content_description: formData.writtenContentDescription,

                has_internet: formData.hasInternet,
                has_laptop: formData.hasLaptop,
                time_availability: formData.timeAvailability,

                declaration_name: formData.declarationName,
                declaration_date: formData.declarationDate
            };

            const { error } = await supabase
                .from('academy_applications')
                .insert([dbData]);

            if (error) throw error;

            setSubmitSuccess(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            console.error("Submission error:", err);
            setSubmitError(err.message || 'An error occurred while submitting your application.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 animate-fade-in flex flex-col items-center justify-center px-4">
                <CheckCircle2 className="h-24 w-24 text-google-green mb-6" />
                <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Application Received!</h2>
                <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
                    Thank you for applying to the Lead Warriors Academy. Our admissions team will review your application and be in touch regarding the next steps in the selection process.
                </p>
                <a href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-md">
                    Return to Homepage
                </a>
            </div>
        );
    }

    return (
        <div className="animate-fade-in min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-4 py-1 rounded-full mb-4 inline-block tracking-wide uppercase">
                        Lead Warriors Academy
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Fellowship Application</h1>
                    <p className="text-gray-600">Complete all sections carefully to be considered for the 2026 cohorts.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {[...Array(totalSteps)].map((_, i) => (
                            <div key={i} className={`flex-1 text-center font-semibold text-xs uppercase ${step >= i + 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                Step {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="flex bg-gray-200 h-2 rounded-full overflow-hidden">
                        {[...Array(totalSteps)].map((_, i) => (
                            <div key={i} className={`flex-1 h-full border-r border-white last:border-0 transition-colors duration-300 ${step >= i + 1 ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12">

                        {/* Step 1: Personal & Warrior Info */}
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 1: Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (as on official docs) *</label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Prefer not to say">Prefer not to say</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State of Origin *</label>
                                            <input type="text" name="stateOrigin" value={formData.stateOrigin} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State of Residence *</label>
                                            <input type="text" name="stateResidence" value={formData.stateResidence} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Local Government Area *</label>
                                            <input type="text" name="lga" value={formData.lga} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (WhatsApp enabled) *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                                            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 2: Warrior Status</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type of SCD Diagnosis (e.g., HbSS, HbSC) *</label>
                                            <input type="text" name="diagnosisType" value={formData.diagnosisType} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Diagnosis</label>
                                            <input type="text" name="diagnosisYear" value={formData.diagnosisYear} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Managing Hospital / Clinic Name *</label>
                                            <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Do you possess a valid hospital ID? *</label>
                                            <select name="hasHospitalId" value={formData.hasHospitalId} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start mt-2">
                                            <AlertCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-indigo-800">
                                                <strong>Required Upload:</strong> You will be required to upload a clear copy of your hospital ID card OR medical confirmation letter if selected for the interview stage.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Education & Experience */}
                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 3: Educational Background</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification (HND, BSc min) *</label>
                                            <select name="highestQualification" value={formData.highestQualification} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Qualification</option>
                                                <option value="HND">HND</option>
                                                <option value="BSc">BSc/BA</option>
                                                <option value="MSc">MSc/MA</option>
                                                <option value="PhD">PhD</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
                                            <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution Attended *</label>
                                            <input type="text" name="institution" value={formData.institution} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Graduation *</label>
                                            <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 4: Experience & Leadership</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupation *</label>
                                                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Professional Experience *</label>
                                                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Have you held any leadership position? Describe briefly (Max 150 words) *</label>
                                            <textarea name="leadershipRole" value={formData.leadershipRole} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Have you ever engaged in advocacy or community work? Explain your role (Max 200 words) *</label>
                                            <textarea name="advocacyWork" value={formData.advocacyWork} onChange={handleChange} required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Motivation & Competence */}
                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 5: Motivation & Policy Readiness</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Statement (Max 300 words): Tell us about your journey as a warrior and how it has shaped your leadership outlook. *</label>
                                            <textarea name="personalStatement" value={formData.personalStatement} onChange={handleChange} required rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Interest Statement (Max 250 words): What specific policy issue affecting people living with SCD in Nigeria would you like to influence and why? *</label>
                                            <textarea name="policyInterest" value={formData.policyInterest} onChange={handleChange} required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Community Impact Vision (Max 250 words): If selected, how will you apply the knowledge gained from this fellowship? *</label>
                                            <textarea name="communityVision" value={formData.communityVision} onChange={handleChange} required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Declaration: Are you able to attend all virtual sessions and complete all assignments for the 3-month duration? *</label>
                                            <select name="attendanceCommitment" value={formData.attendanceCommitment} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 6: Professional Competence</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Have you written an opinion article, policy memo, open letter, or advocacy campaign document? *</label>
                                            <select name="hasWrittenContent" value={formData.hasWrittenContent} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        {formData.hasWrittenContent === 'Yes' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Provide a short description of the document(s):</label>
                                                <textarea name="writtenContentDescription" value={formData.writtenContentDescription} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Digital Readiness, Docs, & Declaration */}
                        {step === 4 && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 7: Digital & Availability Readiness</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Do you have stable internet access? *</label>
                                            <select name="hasInternet" value={formData.hasInternet} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Do you have a functional laptop? *</label>
                                            <select name="hasLaptop" value={formData.hasLaptop} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time availability per week (Minimum 4–6 hours required) *</label>
                                            <select name="timeAvailability" value={formData.timeAvailability} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Select Option</option>
                                                <option value="Less than 4 hours">Less than 4 hours</option>
                                                <option value="4 - 6 hours">4 - 6 hours</option>
                                                <option value="More than 6 hours">More than 6 hours</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Document Uploads</h3>
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-700 font-medium">Click here to upload your documents</p>
                                        <p className="text-sm text-gray-500 mt-2">Required: CV (Max 2 pages). <br />Note: Selected candidates will later be asked for ID card, Academic Certificate, and Hospital ID.</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Section 8: Declaration</h3>
                                    <div className="bg-indigo-50 p-6 rounded-lg text-indigo-900 mb-6">
                                        <p className="font-medium">
                                            "I confirm that the information provided is accurate and that I am willing to uphold the values and standards of the Lead Warriors Academy."
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Electronic Signature (Type Full Name) *</label>
                                            <input type="text" name="declarationName" value={formData.declarationName} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                            <input type="date" name="declarationDate" value={formData.declarationDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {submitError && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-start">
                                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Form Controls */}
                        <div className={`mt-10 pt-6 border-t flex ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                            {step > 1 && (
                                <button type="button" onClick={prevStep} disabled={isSubmitting} className="px-6 py-3 border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                    Back
                                </button>
                            )}
                            {step < totalSteps && (
                                <button type="button" onClick={nextStep} disabled={isSubmitting} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50">
                                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            )}
                            {step === totalSteps && (
                                <button type="submit" disabled={isSubmitting} className="bg-google-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition-colors flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};
