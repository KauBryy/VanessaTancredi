import React from 'react';
import { Phone, TrendingUp, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AGENT_INFO } from '../constants';

const FixedMobileContact = () => {
    const navigate = useNavigate();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 flex gap-3 h-20 items-center supports-[padding-bottom:env(safe-area-inset-bottom)]:pb-[env(safe-area-inset-bottom)] supports-[padding-bottom:env(safe-area-inset-bottom)]:h-auto">
            <a
                href={`tel:${AGENT_INFO.phone.replace(/\s/g, '')}`}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-gray-50 active:bg-gray-100 text-[#002B5B] rounded-xl py-2 transition-colors"
                aria-label="Appeler"
            >
                <Phone size={20} />
                <span className="text-xs font-bold">Appeler</span>
            </a>

            <button
                onClick={() => navigate('/estimation')}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#002B5B] active:bg-[#001F44] text-white rounded-xl py-2 shadow-lg shadow-blue-900/20 transition-colors"
            >
                <TrendingUp size={20} />
                <span className="text-xs font-bold">Estimer</span>
            </button>
        </div>
    );
};

export default FixedMobileContact;
