import vanessaPhoto from './assets/photo_vanessa.jpg';
import vanessaLogo from './assets/logo_vanessa.png';

export const COLORS = {
    primary: '#002B5B', // Bleu Borbiconi Profond
    secondary: '#C5A059', // Or/Beige
    text: '#333333',
    lightGray: '#F5F5F5',
    white: '#FFFFFF'
};

export const AGENT_INFO = {
    name: "Vanessa Tancredi",
    role: "Conseillère en immobilier",
    phone: "06 95 07 13 22",
    email: "vanessa@scbi.eu",
    sector: "Mercy-Le-Bas & Alentours",
    photo: vanessaPhoto,
    facebookProfile: "https://www.facebook.com/vanessa.tancredi.96?locale=fr_FR",
    facebookPage: "https://www.facebook.com/profile.php?id=100092639060825",
    instagram: "https://www.instagram.com/vanessa_borbiconi_immo"
};

export const LOGO_URL = vanessaLogo;

export const formatPrice = (price, isRent) => {
    const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
    return isRent ? `${formatted} / mois` : formatted;
};
