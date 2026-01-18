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
    email: "vanessa@borbiconi.immo",
    sector: "Mercy-Le-Bas & Alentours",
    photo: "https://scbi.eu/wp-content/uploads/2024/01/352336765_651400483553305_8843880496946045686_n-removebg-preview-80x80.png"
};

export const LOGO_URL = "https://scbi.fr/wp-content/uploads/2018/06/Logo_6.png";

export const formatPrice = (price, isRent) => {
    const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
    return isRent ? `${formatted} / mois` : formatted;
};
