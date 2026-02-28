import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Shield, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export const Enrollment: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [invite, setInvite] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchInvite = async () => {
            if (!token) {
                setError("Missing enrollment token.");
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('academy_invites')
                    .select('*')
                    .eq('id', token)
                    .single();

                if (error || !data) throw new Error("Invalid or expired invite token.");
                if (data.used) throw new Error("This invite has already been used.");

                setInvite(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvite();
    }, [token]);

    const handleEnrollment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invite) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Sign up the user (this acts as password setting since they don't exist in Auth yet)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: invite.email,
                password: password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Failed to create user account.");

            // 2. Fetch their full application data to populate the profile
            const { data: applicationData } = await supabase
                .from('academy_applications')
                .select('*')
                .eq('email', invite.email)
                .single();

            // 3. Create their Fellow Profile
            const { error: profileError } = await supabase
                .from('fellow_profiles')
                .insert([{
                    id: authData.user.id,
                    full_name: applicationData?.full_name || 'Fellow',
                    state: applicationData?.state_residence || '',
                    cohort_name: invite.cohort_name,
                    role: 'fellow'
                }]);

            if (profileError) throw profileError;

            // 4. Mark invite as used
            await supabase
                .from('academy_invites')
                .update({ used: true })
                .eq('id', invite.id);

            // 5. Automatically redirect to portal (session is active from signUp)
            alert("Enrollment successful! Welcome to the Academy.");
            navigate('/academy/portal');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during enrollment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Validating invite...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
                    <AlertCircle className="h-16 w-16 text-google-red mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a href="/academy" className="text-indigo-600 font-bold hover:underline">Return to Academy</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl animate-slide-up">
                <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-full mb-4 inline-block">
                        <CheckCircle2 className="h-8 w-8 text-google-green" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Accept Fellowship
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Welcome! You have been invited to the <strong>{invite?.cohort_name}</strong>.
                    </p>
                    <p className="text-xs font-semibold text-indigo-600 mt-1 bg-indigo-50 inline-block px-3 py-1 rounded-full">
                        {invite?.email}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleEnrollment}>
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Create a Password for your Portal
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-colors disabled:opacity-50"
                        >
                            <Shield className="absolute left-4 h-5 w-5 text-indigo-200" />
                            {isSubmitting ? 'Creating Profile...' : 'Create Account & Enter Portal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
