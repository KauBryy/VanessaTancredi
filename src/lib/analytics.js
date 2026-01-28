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
