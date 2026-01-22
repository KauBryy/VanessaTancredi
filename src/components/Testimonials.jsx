import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'; // Assuming these are from lucide-react, adjust if different
import { REVIEWS } from '../data/reviews';

const Testimonials = () => {
    // Duplicate reviews multiple times to ensure we fill large screens and have buffer for seamless loop
    const doubledReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];
    const containerRef = useRef(null);

    // We'll use a motion value for X position
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);

    // Calculate width of one set of reviews to know when to wrap
    useEffect(() => {
        if (containerRef.current) {
            // Approximating width based on first set count. 
            // Better to measure: TotalWidth / 4 (since we quadrupled)
            // Or just measure one card * count.
            // Let's rely on scrollWidth for total and divide.
            const totalWidth = containerRef.current.scrollWidth;
            setContentWidth(totalWidth / 4);
        }
    }, []);

    // Animation Loop
    useAnimationFrame((t, delta) => {
        if (!isHovered && contentWidth > 0) {
            // Speed of scroll. Adjust multiplier for speed.
            // .05 is very slow. 
            const moveBy = -0.6 * (delta / 16);
            let newX = x.get() + moveBy;

            // Wrap logic
            if (newX <= -contentWidth) {
                newX = 0;
            } else if (newX > 0) {
                newX = -contentWidth;
            }

            x.set(newX);
        }
    });

    const handleManualScroll = (direction) => {
        if (contentWidth > 0) {
            const scrollAmount = direction === 'left' ? 400 : -400;
            let newX = x.get() + scrollAmount;

            // Allow wrapping even on manual scroll
            // Note: Since we have 4 sets, we are safe to jump around 0 to -contentWidth range theoretically, 
            // but visuals might jump if we are at edge. 
            // If we are at 0 and move left (+400), we go to +400. That shows whitespace? 
            // No, we have items at left? No. 
            // Standard infinite loop strategy: Start at -contentWidth (Set 2). 
            // Move between -contentWidth and -2*contentWidth.
            // Let's stick to simpler logic: Just clamp or let it jump to 0.

            // To do this perfectly seamless:
            // We need to render [Set4] [Set1] [Set2] [Set3] ...
            // And strictly keep X between bounds.

            // For now, let's just slide. If we hit edge, we warp.
            if (newX <= -contentWidth) {
                newX = 0;
            } else if (newX > 0) {
                newX = -contentWidth;
            }

            // We animate the manual scroll for smoothness
            animate(x, newX, { duration: 0.5, ease: "circOut" });
        }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative group/section">
            <div className="container mx-auto px-4 md:px-8 mb-12">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#C5A059] font-medium tracking-wider uppercase mb-3 block"
                    >
                        Témoignages
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-bold text-[#002B5B] mb-6"
                    >
                        La satisfaction de mes clients
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-lg leading-relaxed"
                    >
                        Découvrez les retours authentiques de ceux qui nous ont fait confiance.
                    </motion.p>
                </div>
            </div>

            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* Manual Controls - Visible when section hovered */}
                <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-20 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => handleManualScroll('left')}
                        className="p-3 md:p-4 rounded-full bg-white/90 shadow-lg text-[#002B5B] hover:bg-[#002B5B] hover:text-white transition-all transform hover:scale-110 border border-gray-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>
                <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 z-20 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => handleManualScroll('right')}
                        className="p-3 md:p-4 rounded-full bg-white/90 shadow-lg text-[#002B5B] hover:bg-[#002B5B] hover:text-white transition-all transform hover:scale-110 border border-gray-100"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <motion.div
                    ref={containerRef}
                    className="flex gap-8 w-fit"
                    style={{ x }}
                >
                    {doubledReviews.map((review, index) => (
                        <div
                            key={index}
                            className="w-[350px] md:w-[450px] flex-shrink-0"
                        >
                            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full flex flex-col border border-gray-100 relative group hover:border-[#C5A059]/30 transition-all duration-300">
                                <div className="absolute top-8 right-8 text-[#C5A059] opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Quote size={40} strokeWidth={1} fill="currentColor" />
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill="#C5A059" className="text-[#C5A059]" />
                                    ))}
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed italic mb-8 flex-grow select-none">
                                    "{review.text}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                                    <div className="w-12 h-12 rounded-full bg-[#002B5B] text-white flex items-center justify-center font-display font-bold text-xl flex-shrink-0">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-[#002B5B] text-lg truncate">{review.name}</h4>
                                        <span className="text-sm text-gray-400">Client Vérifié Google</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
