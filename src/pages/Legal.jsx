import React from 'react';
import { Shield, Lock, FileText } from 'lucide-react';

const Legal = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">

                <div className="text-center mb-12">
                    <span className="inline-block p-3 bg-[#002B5B]/5 rounded-full text-[#002B5B] mb-4">
                        <Shield size={32} />
                    </span>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-[#002B5B] mb-4">Mentions Légales & Confidentialité</h1>
                    <p className="text-gray-500">Transparence et protection de vos données sont nos priorités.</p>
                </div>

                <div className="space-y-12">
                    {/* Mentions Légales */}
                    <section id="legal">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <FileText className="text-[#C5A059]" size={24} />
                            <h2 className="text-2xl font-bold text-[#002B5B]">Mentions Légales</h2>
                        </div>

                        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-[#002B5B] mb-4 uppercase tracking-wide text-xs">Éditeur du site</h3>
                                <ul className="space-y-2">
                                    <li><strong>Entreprise :</strong> BORBICONI IMMOBILIER (SCBI)</li>
                                    <li><strong>Forme juridique :</strong> SARL au capital de 1 000 €</li>
                                    <li><strong>Siège social :</strong> 38 Rue Principale, 57840 Ottange</li>
                                    <li><strong>RCS :</strong> Thionville B 530 712 728</li>
                                    <li><strong>TVA Intracommunautaire :</strong> FR81530712728</li>
                                    <li><strong>Contact :</strong> contact@scbi.eu | 03.82.82.35.69</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-[#002B5B] mb-4 uppercase tracking-wide text-xs">Conception et Développement</h3>
                                <ul className="space-y-2">
                                    <li><strong>Créateur :</strong> KauBry Apps (Pierre Aubry)</li>
                                    <li><strong>Statut :</strong> Entrepreneur Individuel</li>
                                    <li><strong>Site web :</strong> <a href="https://kaubry.fr" target="_blank" rel="noopener noreferrer" className="text-[#C5A059] hover:underline">kaubry.fr</a></li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-[#002B5B] mb-4 uppercase tracking-wide text-xs">Hébergement</h3>
                                <ul className="space-y-2">
                                    <li><strong>Hébergeur :</strong> GitHub Inc.</li>
                                    <li><strong>Adresse :</strong> 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States</li>
                                </ul>
                            </div>

                            <p className="italic text-xs text-gray-400 mt-4 border-l-4 border-[#C5A059] pl-4">
                                Vanessa Tancredi exerce en tant que Conseillère en immobilier indépendante (Agent Commercial) pour le compte du groupe Borbiconi Immobilier.
                            </p>
                        </div>
                    </section>

                    {/* Politique de Confidentialité */}
                    <section id="privacy">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <Lock className="text-[#C5A059]" size={24} />
                            <h2 className="text-2xl font-bold text-[#002B5B]">Politique de Confidentialité</h2>
                        </div>

                        <div className="prose prose-sm prose-blue max-w-none text-gray-600">
                            <p>
                                La présente politique de confidentialité définit et vous informe de la manière dont la Sarl S&C Borbiconi Immobilier utilise et protège les informations que vous nous transmettez, le cas échéant, lorsque vous utilisez le présent site.
                            </p>
                            <p>
                                En utilisant notre site, vous acceptez notre Politique de confidentialité. Celle-ci se rapporte à la collecte et à l’utilisation des renseignements personnels que vous nous fournissez par l’utilisation de notre site web.
                            </p>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">1. Données Personnelles Collectées</h3>
                            <p>
                                Nous sommes susceptibles de collecter et traiter les données suivantes :
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Votre nom, prénom, adresse e-mail, numéro de téléphone, adresse postale.</li>
                                <li>Vos identifiants électroniques (adresse IP).</li>
                                <li>Vos préférences en termes de recherches immobilières.</li>
                            </ul>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">2. Responsable du Traitement</h3>
                            <p>
                                La Sarl S&C Borbiconi Immobilier effectue le traitement des données à caractère personnel fournies pour assurer ses services et l'exploitation du site.
                            </p>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">3. Finalités du Traitement</h3>
                            <p>Le traitement est nécessaire pour :</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Vous fournir les informations ou services demandés (demande de contact, estimation, etc.).</li>
                                <li>Améliorer notre site et nos services.</li>
                                <li>Remplir nos obligations légales et réglementaires.</li>
                            </ul>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">4. Durée de Conservation</h3>
                            <p>
                                Vos données seront conservées pendant toute la durée de la relation commerciale, puis pendant 5 ans conformément à l'article L 561-12 du Code monétaire et financier (et 10 ans pour les mandants).
                            </p>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">5. Partage des Données</h3>
                            <p>
                                Vos données peuvent être traitées par nos employés (service client, agents immobiliers) et prestataires techniques (hébergement, maintenance). Elles ne sont jamais vendues à des tiers non autorisés.
                            </p>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">6. Cookies</h3>
                            <p>
                                Ce site est conçu pour être respectueux de votre vie privée. Nous n'utilisons aucun cookie de traçage publicitaire, ni aucun cookie tiers d'analyse (type Google Analytics ou Facebook Pixel).
                            </p>
                            <p className="mt-2">
                                Votre navigation est donc totalement anonyme et privée.
                            </p>

                            <h3 className="text-[#002B5B] font-bold mt-8 mb-4">7. Vos Droits</h3>
                            <p>
                                Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles.
                            </p>
                            <p className="mt-4 font-bold">
                                Pour exercer ces droits, contactez-nous : <a href="mailto:contact@scbi.eu" className="text-[#C5A059] hover:underline">contact@scbi.eu</a>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Legal;
