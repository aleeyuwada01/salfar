import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Calendar, ArrowLeft, BookOpen, Share2 } from 'lucide-react';

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

export const ArticleDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    const fetchArticle = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media_articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching article:', error);
        } else {
            setArticle(data);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-google-red"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <BookOpen className="h-16 w-16 text-gray-200 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                <p className="text-gray-500 mb-8">The story you're looking for might have been moved or deleted.</p>
                <Link to="/media/articles" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all">
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Header */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <img
                    src={article.featured_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <Link to="/media/articles" className="inline-flex items-center text-white/80 hover:text-white mb-6 font-bold transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Stories
                        </Link>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center space-x-6 text-white/90 text-sm font-medium">
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-google-red" />
                                {new Date(article.published_at || article.created_at).toLocaleDateString()}
                            </span>
                            <span className="bg-google-red/20 text-white px-3 py-1 rounded-full border border-google-red/30 backdrop-blur-sm">
                                Article
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                        {/* Excerpt/Lead */}
                        {article.excerpt && (
                            <p className="text-2xl font-serif italic text-gray-500 mb-10 leading-relaxed border-l-4 border-google-red pl-6">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Body Content */}
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            {article.content.split('\n').map((paragraph, idx) => (
                                paragraph ? <p key={idx} className="mb-6">{paragraph}</p> : <br key={idx} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-64 space-y-8">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <Share2 className="h-4 w-4 mr-2 text-indigo-600" />
                                Share Story
                            </h3>
                            <div className="flex gap-3">
                                <button className="p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all flex-1 flex justify-center">
                                    <span className="text-xs font-bold">Twitter</span>
                                </button>
                                <button className="p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all flex-1 flex justify-center">
                                    <span className="text-xs font-bold">Facebook</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
                            <h3 className="font-bold mb-3">Support Our Mission</h3>
                            <p className="text-sm opacity-90 mb-4 leading-relaxed">
                                Help us continue telling these stories and supporting warriors.
                            </p>
                            <Link to="/get-involved" className="block w-full bg-white text-indigo-600 py-2 rounded-xl text-center font-bold text-sm hover:bg-gray-100 transition-all">
                                Get Involved
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
