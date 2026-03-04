import { supabase } from './supabase';

export type BucketName = 'articles' | 'gallery' | 'publications' | 'medical-docs' | 'academy-docs';

export const uploadFile = async (bucket: BucketName, path: string, file: File) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return publicUrl;
};

export const deleteFile = async (bucket: BucketName, path: string) => {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) throw error;
};

export const getFilePathFromUrl = (url: string) => {
    try {
        const parts = url.split('/');
        const bucketIndex = parts.findIndex(p => ['articles', 'gallery', 'publications', 'medical-docs', 'academy-docs'].includes(p));
        if (bucketIndex === -1) return null;
        return parts.slice(bucketIndex + 1).join('/');
    } catch (e) {
        return null;
    }
};
