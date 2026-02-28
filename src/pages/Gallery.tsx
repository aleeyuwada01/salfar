import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, Video, Maximize2 } from 'lucide-react';

interface GalleryItem {
    id: string;
    title: string;
    description: string;
    media_url: string;
    media_type: 'image' | 'video';
    created_at: string;
}

export const Gallery: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching gallery:', error);
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Gallery</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Capturing moments of advocacy, leadership, and community impact at SSAI.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-red"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No gallery items discovered yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden bg-gray-200">
                                    {item.media_type === 'image' ? (
                                        <img
                                            src={item.media_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                            <Video className="h-12 w-12 text-white opacity-50" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => setSelectedImage(item.media_url)}
                                            className="p-3 bg-white rounded-full text-gray-900 hover:bg-google-red hover:text-white transition-colors"
                                        >
                                            <Maximize2 className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        <img
                            src={selectedImage}
                            alt="Gallery Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
