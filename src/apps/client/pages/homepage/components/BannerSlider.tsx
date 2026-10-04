import React, { useState, useEffect } from 'react';
import { useBanners } from '../hooks/useBanners';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const BannerSlider: React.FC = () => {
    const { data: banners, isLoading } = useBanners();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!banners || banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (isLoading) return <div className="w-full h-[250px] md:h-[400px] bg-slate-200 animate-pulse rounded-2xl mb-12 shadow-inner" />;
    
    if (!banners || banners.length === 0) return null;

    const nextSlide = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };
    const prevSlide = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="w-full mb-12 relative group rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] ring-1 ring-slate-900/5 bg-slate-900">
            <div className="relative w-full h-[250px] md:h-[400px]">
                {banners.map((banner, index) => (
                    <a 
                        key={banner.id} 
                        href={banner.linkUrl || '#'}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                        <img 
                            src={banner.imageUrl} 
                            alt={banner.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight mb-2 drop-shadow-md">{banner.title}</h3>
                        </div>
                    </a>
                ))}
            </div>

            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/50 hover:scale-110 shadow-lg"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/50 hover:scale-110 shadow-lg"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/90'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
