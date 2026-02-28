import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
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
    AlertCircle
} from 'lucide-react';

type Tab = 'articles' | 'newsletters' | 'press_releases';

export const ContentManager = () => {
    const [activeTab, setActiveTab] = useState<Tab>('articles');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const table = activeTab === 'articles' ? 'media_articles' : 'media_publications';

        let result;
        if (editingItem.id) {
            result = await supabase.from(table).update(editingItem).eq('id', editingItem.id);
        } else {
            // For new newsletters/press_releases, ensure category is set
            const newItem = { ...editingItem };
            if (activeTab !== 'articles') {
                newItem.category = activeTab === 'newsletters' ? 'newsletter' : 'press_release';
            }
            result = await supabase.from(table).insert([newItem]);
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
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                    <p className="text-gray-500">Manage your website's articles, newsletters, and announcements.</p>
                </div>
                <button
                    onClick={() => setEditingItem({ title: '', content: '', status: 'published' })}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold flex items-center shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New {activeTab === 'articles' ? 'Article' : activeTab === 'newsletters' ? 'Newsletter' : 'Press Release'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'articles', label: 'Articles', icon: Layout },
                    { id: 'newsletters', label: 'Newsletters', icon: Newspaper },
                    { id: 'press_releases', label: 'Press Releases', icon: FileText },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto"><X className="h-4 w-4" /></button>
                </div>
            )}

            {/* Search & List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading items...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No items found.</td></tr>
                            ) : filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{item.title}</div>
                                        {item.slug && <div className="text-xs text-gray-400">/{item.slug}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.published_at || item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.status || 'Published'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Editor Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingItem.id ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
                            </h2>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 p-2">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="overflow-y-auto flex-1 p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                    <input
                                        required
                                        value={editingItem.title}
                                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 border"
                                    />
                                </div>

                                {activeTab === 'articles' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                                            <input
                                                required
                                                value={editingItem.slug}
                                                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 border"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image URL</label>
                                            <input
                                                value={editingItem.featured_image}
                                                onChange={(e) => setEditingItem({ ...editingItem, featured_image: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 border"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt</label>
                                            <textarea
                                                rows={2}
                                                value={editingItem.excerpt}
                                                onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 border"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab !== 'articles' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">File/Resource URL</label>
                                        <input
                                            value={editingItem.file_url}
                                            onChange={(e) => setEditingItem({ ...editingItem, file_url: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 border"
                                        />
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                                    <textarea
                                        required
                                        rows={10}
                                        value={editingItem.content}
                                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 border font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 text-white px-10 py-3 rounded-full font-bold flex items-center shadow-lg hover:bg-indigo-700 transition-all"
                                >
                                    <Save className="h-5 w-5 mr-3" />
                                    {loading ? 'Saving...' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
