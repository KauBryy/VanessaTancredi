import maisonMercy from '../assets/maison_mercy_le_bas_1.png';
import appartHayange from '../assets/appartement_hayange_renove.png';
import pavillonMercy from '../assets/pavillon_moderne_mercy.png';
import terrainSpincourt from '../assets/terrain_spincourt.png';

export const MOCK_PROPERTIES = [
    {
        id: '1',
        title: "Maison individuelle à Boulange",
        catch_phrase: "Quartier calme, proche commodités",
        price: 320000,
        type: "Maison",
        status: "Vente",
        surface: 125,
        city: "Boulange",
        description: "Charmante maison individuelle située dans un secteur prisé de Boulange. Idéal pour une famille avec ses grands volumes.",
        image: maisonMercy,
        features: ["4 Chambres", "Grand Jardin", "Garage Double"],
        is_favorite: true,
    },
    {
        id: '2',
        title: "Appartement rénové à Hayange",
        catch_phrase: "Aucun travaux à prévoir",
        price: 189000,
        type: "Appartement",
        status: "Vente",
        surface: 82,
        city: "Hayange",
        description: "Appartement lumineux entièrement rénové avec goût. Cuisine équipée moderne et salon spacieux.",
        image: appartHayange,
        features: ["2 Chambres", "Balcon", "Cave"],
    },
    {
        id: '3',
        title: "Pavillon récent à Mercy-le-Bas",
        catch_phrase: "Prestations modernes",
        price: 295000,
        type: "Maison",
        status: "Vente",
        surface: 110,
        city: "Mercy-le-Bas",
        description: "Belle opportunité à Mercy-le-Bas. Maison récente sous garantie décennale, faible consommation énergétique.",
        image: pavillonMercy,
        features: ["3 Chambres", "Pompe à chaleur", "Terrasse"],
    },
    {
        id: '4',
        title: "Terrain à bâtir Spincourt",
        catch_phrase: "Cadre verdoyant",
        price: 85000,
        type: "Terrain",
        status: "Vente",
        surface: 850,
        city: "Spincourt",
        description: "Beau terrain plat et viabilisé, libre de constructeur. Situé dans une rue calme de Spincourt.",
        image: terrainSpincourt,
        features: ["Viabilisé", "Plat", "Façade 20m"],
    }
];
