import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerFlashSaleProductItem } from '../models/flashSaleShopping.model';

interface FlashSaleCardProps {
    data: CustomerFlashSaleProductItem;
    isUpcoming?: boolean;
}

export const FlashSaleCard: React.FC<FlashSaleCardProps> = ({ data, isUpcoming = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${data.slug}${data.sku ? `?sku=${encodeURIComponent(data.sku)}` : ''}`);
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    return (
        <div
            onClick={handleClick}
            className="group relative flex flex-col h-full rounded-md bg-white border border-slate-200 transition-all duration-300 hover:border-red-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-500/10 cursor-pointer overflow-hidden"
        >
            {/* Top Ribbon Badges */}
            <div className="absolute top-2 left-2 z-20 flex flex-wrap items-center gap-1.5">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5 tracking-wide">
                    <span>⚡</span>
                    <span>-{data.discountPercent}%</span>
                </span>
                {!isUpcoming && !data.isSoldOut && data.percentSold >= 70 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 animate-pulse">
                        <span className="animate-flicker">🔥</span>
                        <span>Sắp hết</span>
                    </span>
                )}
                {data.userLimit && data.userLimit > 0 && (
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Tối đa {data.userLimit}
                    </span>
                )}
            </div>

            {/* Thumbnail */}
            <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden border-b border-slate-100 shrink-0">
                <img
                    src={data.thumbnailUrl || 'https://via.placeholder.com/300'}
                    alt={data.productName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                {data.isSoldOut && !isUpcoming && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-10">
                        <span className="px-3 py-1 bg-red-600 text-white font-bold text-[12px] uppercase tracking-wider rounded shadow-md">
                            Hết suất ưu đãi
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                    <h3 className="text-[15px] lg:text-[16px] font-bold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                        {data.productName}
                    </h3>
                    <p className="text-[12px] font-mono text-slate-400 mt-1 truncate">
                        Mã: {data.sku} {data.variantAttributes ? `• ${data.variantAttributes}` : ''}
                    </p>
                </div>

                <div className="space-y-3">
                    {/* Prices */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-[18px] lg:text-[21px] font-extrabold text-red-600 leading-none">
                            {formatPrice(data.flashSalePrice)}
                        </span>
                        <span className="text-[13px] text-slate-400 line-through">
                            {formatPrice(data.originalPrice)}
                        </span>
                    </div>

                    {/* Progress Bar & Sold count */}
                    {isUpcoming ? (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[12px] text-slate-500 font-medium">
                                <span className="text-blue-600 font-bold flex items-center gap-1">
                                    <span>🕒</span> Sắp mở bán
                                </span>
                                <span>{data.totalSlots} suất</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full w-0"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[12px]">
                                {data.isSoldOut ? (
                                    <span className="text-slate-400 font-medium">Đã hết {data.totalSlots} suất</span>
                                ) : (
                                    <span className="text-slate-600 font-semibold flex items-center gap-1">
                                        <span className="animate-flicker">🔥</span>
                                        <span>Đã bán {data.soldSlots}/{data.totalSlots} suất</span>
                                    </span>
                                )}
                                <span className="text-red-600 font-extrabold">{data.percentSold}%</span>
                            </div>

                            <div className="w-full h-2.5 bg-red-100/70 rounded-full overflow-hidden relative">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                                        data.isSoldOut
                                            ? 'bg-slate-300'
                                            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600'
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(6, data.percentSold))}%` }}
                                >
                                    {/* Shimmer light animation */}
                                    {!data.isSoldOut && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="button"
                        disabled={data.isSoldOut && !isUpcoming}
                        className={`w-full py-2.5 px-3 rounded-md text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                            isUpcoming
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : data.isSoldOut
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-95'
                        }`}
                    >
                        {isUpcoming ? (
                            'Xem trước deal'
                        ) : data.isSoldOut ? (
                            'Hết suất ưu đãi'
                        ) : (
                            <>
                                <span className="text-amber-300">⚡</span>
                                <span>Săn deal ngay</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
