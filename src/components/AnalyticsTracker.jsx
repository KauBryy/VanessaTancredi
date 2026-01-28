import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // We wait a tiny bit to ensure document.title has been updated by the individual pages
        const timeoutId = setTimeout(() => {
            trackPageView(location.pathname + location.hash, document.title);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [location]);

    return null;
};

export default AnalyticsTracker;
