import { supabase } from './supabase';

// Helper to get or create a visitor ID
const getVisitorId = () => {
    let vid = localStorage.getItem('site_visitor_id');
    if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem('site_visitor_id', vid);
    }
    return vid;
};

// Helper to check if user opted out (Admin)
const isAdminOptOut = () => {
    return localStorage.getItem('admin_opt_out') === 'true';
};

export const trackEvent = (eventName, params = {}) => {
    if (window.gtag) {
        window.gtag('event', eventName, params);
    } else {
        console.warn(`Gtag not found for event: ${eventName}`, params);
    }
};

export const trackContactClick = (type, propertyTitle = 'General') => {
    trackEvent('contact_click', {
        contact_type: type,
        property_name: propertyTitle
    });
};

export const trackPropertyView = (property) => {
    trackEvent('view_item', {
        items: [{
            item_id: property.id,
            item_name: property.title,
            item_category: property.type,
            price: property.price,
            location_id: property.city
        }]
    });
};

export const trackPageView = (path, title) => {
    // Google Analytics
    trackEvent('page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
    });

    // Supabase Custom Tracking
    trackSupabaseView(path, title || document.title);
};

export const trackSupabaseView = async (path, title) => {
    if (isAdminOptOut()) {
        console.log('Analytics skipped (Admin Opt-out)');
        return;
    }

    try {
        await supabase.from('site_stats').insert({
            page_path: path,
            page_title: title,
            visitor_id: getVisitorId(),
            is_admin: false // We assume false, admins who didn't opt-out are still tracked but flagged if needed later
        });
    } catch (error) {
        console.warn('Supabase tracking error:', error);
    }
};
