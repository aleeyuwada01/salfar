import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Newspaper, FileText, Download, Calendar, ExternalLink } from 'lucide-react';

interface Publication {
    id: string;
    title: string;
    category: 'newsletter' | 'press_release';
    content: string;
    file_url: string;
    published_at: string;
    created_at: string;
}

interface PublicationsProps {
    category: 'newsletter' | 'press_release';
}

export const Publications: React.FC<PublicationsProps> = ({ category }) => {
    const [pubs, setPubs] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublications();
    }, [category]);

    const fetchPublications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media_publications')
            .select('*')
            .eq('category', category)
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching publications:', error);
        } else {
            setPubs(data || []);
        }
        setLoading(false);
    };

    const title = category === 'newsletter' ? 'Newsletters' : 'Press Releases';
    const icon = category === 'newsletter' ? <Newspaper className="h-10 w-10 text-google-orange" /> : <FileText className="h-10 w-10 text-indigo-600" />;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6">
                        {icon}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Stay updated with SSAI's latest announcements and community updates.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-red"></div>
                    </div>
                ) : pubs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No {title.toLowerCase()} published recently.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {pubs.map((pub) => (
                            <div key={pub.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6 font-semibold uppercase tracking-wider">
                                    <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(pub.published_at || pub.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{pub.title}</h3>
                                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-4">
                                    {pub.content}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-gray-50">
                                    {pub.file_url && (
                                        <a
                                            href={pub.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-md"
                                        >
                                            <Download className="h-5 w-5 mr-2" />
                                            Download PDF
                                        </a>
                                    )}
                                    <button className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                        Read Online
                                        <ExternalLink className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
