import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
    created_at: string;
}

export const Articles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media_articles')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
        } else {
            setArticles(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif italic">Articles & Insights</h1>
                        <p className="text-xl text-gray-500 max-w-2xl">
                            Deep dives into sickle cell policy, healthcare reform, and survivor stories.
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            {articles.length} Published Articles
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-red"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl">
                        <p className="text-gray-400 text-lg">Our library is currently being updated. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {articles.map((article, idx) => (
                            <article key={article.id} className={`group flex flex-col ${idx === 0 ? 'lg:col-span-2 lg:flex-row lg:gap-8' : ''}`}>
                                <div className={`overflow-hidden rounded-2xl bg-gray-100 transition-all duration-300 group-hover:shadow-2xl mb-6 lg:mb-0 ${idx === 0 ? 'lg:w-1/2 h-80 lg:h-auto' : 'h-64'}`}>
                                    <img
                                        src={article.featured_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className={`${idx === 0 ? 'lg:w-1/2 flex flex-col justify-center' : ''}`}>
                                    <div className="flex items-center space-x-4 text-xs font-bold text-google-red uppercase tracking-widest mb-3">
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className={`font-bold text-gray-900 group-hover:text-google-red transition-colors mb-4 leading-tight ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                                        <Link to={`/media/articles/${article.slug}`}>{article.title}</Link>
                                    </h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                    <Link
                                        to={`/media/articles/${article.slug}`}
                                        className="inline-flex items-center text-gray-900 font-bold hover:text-google-red transition-colors group-hover:translate-x-2 duration-300"
                                    >
                                        Read Story
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
