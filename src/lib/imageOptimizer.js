export const getOptimizedImageUrl = (url, width = 800) => {
    if (!url) return '';
    // Only optimize Supabase Storage URLs
    if (url.includes('supabase.co/storage/v1/object/public')) {
        return `${url}?width=${width}&resize=contain&quality=80&format=webp`;
    }
    return url;
};
