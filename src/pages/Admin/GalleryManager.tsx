import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/storage';
import {
    Plus,
    Search,
    Video,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    Trash2,
    Upload,
    Edit3
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const GalleryManager = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const bucket = 'gallery';
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
            const path = `media/${fileName}`;

            const publicUrl = await uploadFile(bucket, path, file);

            setEditingItem({
                ...editingItem,
                media_url: publicUrl,
                media_type: file.type.startsWith('video/') ? 'video' : 'image'
            });

            setMessage({ type: 'success', text: 'Media uploaded successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...editingItem };
        delete payload.created_at;

        let result;
        if (editingItem.id) {
            result = await supabase.from('gallery_items').update(payload).eq('id', editingItem.id);
        } else {
            result = await supabase.from('gallery_items').insert([payload]);
        }

        if (result.error) {
            setMessage({ type: 'error', text: result.error.message });
        } else {
            setMessage({ type: 'success', text: 'Gallery item saved successfully!' });
            setEditingItem(null);
            fetchGallery();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
        const { error } = await supabase.from('gallery_items').delete().eq('id', id);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Item deleted and removed from gallery.' });
            fetchGallery();
        }
    };

    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Gallery Management">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <ImageIcon className="mr-3 text-indigo-600 h-6 w-6" />
                        Media Assets
                    </h2>
                    <p className="text-gray-600 font-medium">Manage photos and videos of SSAI activities.</p>
                </div>
                <button
                    onClick={() => setEditingItem({ title: '', description: '', media_url: '', media_type: 'image' })}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Upload Media
                </button>
            </div>

            {message && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center space-x-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8 bg-gray-50/50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search gallery by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium outline-none text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading && !editingItem ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Loading media assets...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">No media items found matched your search.</p>
                    </div>
                ) : filteredItems.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all animate-fade-in">
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                            {item.media_type === 'image' ? (
                                <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                    <div className="bg-white/10 p-4 rounded-full backdrop-blur-md">
                                        <Video className="h-8 w-8 text-white" />
                                    </div>
                                    {item.media_url && <span className="absolute bottom-2 right-2 text-[8px] bg-black/50 text-white px-2 py-1 rounded">Video</span>}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className="p-3 bg-white rounded-2xl shadow-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <Edit3 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-3 bg-white rounded-2xl shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                            <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{item.description || 'No description'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-up">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingItem.id ? 'Modify' : 'New'} Media Item
                            </h2>
                            <button onClick={() => setEditingItem(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 bg-gray-50/50">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                                    <input
                                        required
                                        value={editingItem.title}
                                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                        placeholder="Enter media title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Media File</label>
                                    <div className="flex space-x-2">
                                        <input
                                            required
                                            value={editingItem.media_url}
                                            onChange={(e) => setEditingItem({ ...editingItem, media_url: e.target.value })}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium font-mono text-xs"
                                            placeholder="URL or Upload..."
                                        />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept="image/*,video/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-indigo-600 disabled:opacity-50"
                                        >
                                            {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div> : <Upload className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Media Type</label>
                                        <select
                                            value={editingItem.media_type}
                                            onChange={(e) => setEditingItem({ ...editingItem, media_type: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-xs bg-white"
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-center p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        {editingItem.media_url ? (
                                            <span className="text-[10px] text-green-600 font-bold">Media Ready ✓</span>
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">No file selected</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        value={editingItem.description}
                                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-xs leading-relaxed"
                                        placeholder="Optional caption for this media..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-50"
                                >
                                    <Save className="h-5 w-5 mr-3" />
                                    {loading ? 'Processing...' : 'Save Media Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

