import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/storage';
import {
    Plus,
    Trash2,
    Edit,
    Search,
    Layout,
    Newspaper,
    FileText,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    Upload,
    FileUp
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

type Tab = 'articles' | 'newsletters' | 'press_releases';

export const ContentManager = () => {
    const [activeTab, setActiveTab] = useState<Tab>('articles');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        let query;
        if (activeTab === 'articles') {
            query = supabase.from('media_articles').select('*');
        } else {
            query = supabase.from('media_publications')
                .select('*')
                .eq('category', activeTab === 'newsletters' ? 'newsletter' : 'press_release');
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching items:', error);
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
            const bucket = activeTab === 'articles' ? 'articles' : 'publications';
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
            const path = `${activeTab}/${fileName}`;

            const publicUrl = await uploadFile(bucket, path, file);

            if (activeTab === 'articles') {
                setEditingItem({ ...editingItem, featured_image: publicUrl });
            } else {
                setEditingItem({ ...editingItem, file_url: publicUrl });
            }

            setMessage({ type: 'success', text: 'File uploaded successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const table = activeTab === 'articles' ? 'media_articles' : 'media_publications';

        // Filter out fields not in the table
        const payload = { ...editingItem };
        delete payload.created_at;
        delete payload.updated_at;

        let result;
        if (editingItem.id) {
            result = await supabase.from(table).update(payload).eq('id', editingItem.id);
        } else {
            if (activeTab !== 'articles') {
                payload.category = activeTab === 'newsletters' ? 'newsletter' : 'press_release';
            }
            result = await supabase.from(table).insert([payload]);
        }

        if (result.error) {
            setMessage({ type: 'error', text: result.error.message });
        } else {
            setMessage({ type: 'success', text: 'Item saved successfully!' });
            setEditingItem(null);
            fetchItems();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        const table = activeTab === 'articles' ? 'media_articles' : 'media_publications';
        const { error } = await supabase.from(table).delete().eq('id', id);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Item deleted.' });
            fetchItems();
        }
    };

    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Content Management">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
                        {[
                            { id: 'articles', label: 'Articles', icon: Layout },
                            { id: 'newsletters', label: 'Newsletters', icon: Newspaper },
                            { id: 'press_releases', label: 'Press Releases', icon: FileText },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setEditingItem({ title: '', content: '', status: 'published', slug: '' })}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New {activeTab === 'articles' ? 'Article' : activeTab === 'newsletters' ? 'Newsletter' : 'Press Release'}
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && !editingItem ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading items...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No items found.</td></tr>
                            ) : filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{item.title}</div>
                                        {item.slug && <div className="text-xs text-gray-400">/{item.slug}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                        {new Date(item.published_at || item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.status || 'Published'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingItem.id ? 'Edit' : 'Create'} {activeTab === 'articles' ? 'Article' : activeTab === 'newsletters' ? 'Newsletter' : 'Press Release'}
                            </h2>
                            <button onClick={() => setEditingItem(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="overflow-y-auto flex-1 p-8 space-y-8 bg-gray-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                                    <input
                                        required
                                        value={editingItem.title}
                                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium font-serif italic text-lg"
                                    />
                                </div>

                                {activeTab === 'articles' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Slug</label>
                                            <input
                                                required
                                                value={editingItem.slug}
                                                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Featured Image</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={editingItem.featured_image || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, featured_image: e.target.value })}
                                                    placeholder="URL or Upload..."
                                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
                                                />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept="image/*"
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
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Excerpt</label>
                                            <textarea
                                                rows={2}
                                                value={editingItem.excerpt || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab !== 'articles' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Publication File (PDF)</label>
                                        <div className="flex space-x-2">
                                            <input
                                                value={editingItem.file_url || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, file_url: e.target.value })}
                                                placeholder="URL or Upload PDF..."
                                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium font-mono text-sm"
                                            />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                accept=".pdf"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-indigo-600 disabled:opacity-50"
                                            >
                                                {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div> : <FileUp className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Content / Story</label>
                                    <textarea
                                        required
                                        rows={12}
                                        value={editingItem.content}
                                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium font-sans text-base leading-relaxed"
                                        placeholder="Write your story here..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 sticky bottom-0 bg-gray-50/50 pb-8">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-50"
                                >
                                    <Save className="h-5 w-5 mr-3" />
                                    {loading ? 'Saving...' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
