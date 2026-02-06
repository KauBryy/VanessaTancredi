export const getOptimizedImageUrl = (url, width = 800) => {
    if (!url) return '';

    // Si c'est une image locale (preview avant upload), on ne touche pas
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;

    // Si l'URL n'est pas absolue, on ne touche pas
    if (!url.startsWith('http')) return url;

    // Solution Universelle (wsrv.nl)
    // Fonctionne pour Supabase Free Tier et tout autre hébergeur.
    // Redimensionne, compresse et convertit en WebP via un CDN global rapide.

    // On retire les params existants pour éviter les erreurs de double encodage
    const cleanUrl = url.split('?')[0];

    return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=80&output=webp`;
};
