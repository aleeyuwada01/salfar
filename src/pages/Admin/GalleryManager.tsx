import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Plus,
    Search,
    Video,
    Save,
    X,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export const GalleryManager = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let result;
        if (editingItem.id) {
            result = await supabase.from('gallery_items').update(editingItem).eq('id', editingItem.id);
        } else {
            result = await supabase.from('gallery_items').insert([editingItem]);
        }

        if (result.error) {
            setMessage({ type: 'error', text: result.error.message });
        } else {
            setMessage({ type: 'success', text: 'Gallery item saved!' });
            setEditingItem(null);
            fetchGallery();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this gallery item?')) return;
        const { error } = await supabase.from('gallery_items').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Item deleted.' });
            fetchGallery();
        }
    };

    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                    <p className="text-gray-500">Upload and organize photos and videos of SSAI activities.</p>
                </div>
                <button
                    onClick={() => setEditingItem({ title: '', description: '', media_url: '', media_type: 'image' })}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold flex items-center shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Media
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto"><X className="h-4 w-4" /></button>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search gallery..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Loading gallery...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">No media items found.</div>
                ) : filteredItems.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden">
                            {item.media_type === 'image' ? (
                                <img src={item.media_url} alt={item.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-gray-900">
                                    <Video className="h-10 w-10 text-white/50" />
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                    {item.media_type}
                                </span>
                                <div className="space-x-1">
                                    <button onClick={() => setEditingItem(item)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded italic text-xs">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded italic text-xs">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingItem.id ? 'Edit' : 'Add'} Media
                            </h2>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    required
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border-gray-200 border focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Media Type</label>
                                <select
                                    value={editingItem.media_type}
                                    onChange={(e) => setEditingItem({ ...editingItem, media_type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border-gray-200 border focus:ring-indigo-500"
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">URL (Image or Video Link)</label>
                                <input
                                    required
                                    value={editingItem.media_url}
                                    onChange={(e) => setEditingItem({ ...editingItem, media_url: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border-gray-200 border focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border-gray-200 border focus:ring-indigo-500"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-700 transition-all"
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    {loading ? 'Saving...' : 'Save Media Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
