import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useActiveFlashSaleQuery } from '../../../features/flashSales/hooks/useActiveFlashSale.query';
import { CountdownTimer } from '../../../features/flashSales/components/CountdownTimer';
import { FlashSaleCard } from '../../../features/flashSales/components/FlashSaleCard';

export const FlashSaleHomeSection: React.FC = () => {
    const { data: flashSaleData, isLoading } = useActiveFlashSaleQuery();
    const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number>(0);

    const activeSlots = flashSaleData?.activeSlots?.length
        ? flashSaleData.activeSlots
        : (flashSaleData?.currentSlot ? [flashSaleData.currentSlot] : []);

    const currentSlot = activeSlots[selectedSlotIndex] || activeSlots[0] || null;

    if (isLoading) {
        return null;
    }

    if (!currentSlot || !currentSlot.items || currentSlot.items.length === 0) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
            <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 lg:p-8 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-red-600 before:via-orange-500 before:to-amber-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {/* Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-red-500/30 animate-flicker">
                                ⚡
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[22px] lg:text-[26px] font-extrabold text-[#0f172a] leading-tight flex items-center gap-2">
                                        Flash Sale Giờ Vàng
                                        <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase tracking-wider">
                                            Hot Deal
                                        </span>
                                    </h2>
                                </div>
                                <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                                    {currentSlot.name} • Số lượng ưu đãi có hạn
                                </p>
                            </div>
                        </div>

                        {/* Divider on desktop */}
                        <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                        {/* Countdown */}
                        <div className="flex items-center gap-2.5 bg-red-50/60 px-3.5 py-2 rounded-xl border border-red-200/60 shadow-xs">
                            <CountdownTimer initialSeconds={currentSlot.remainingSeconds} variant="compact" theme="danger" label="KẾT THÚC TRONG" />
                        </div>
                    </div>

                    {/* View all link */}
                    <Link
                        to="/flash-sale"
                        className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-red-600 hover:text-red-700 transition-colors self-start md:self-auto"
                    >
                        <span>Xem tất cả deal</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Campaign Tabs (khi có nhiều chiến dịch đang diễn ra) */}
                {activeSlots.length > 1 && (
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <span className="text-[13px] font-semibold text-slate-500 shrink-0 mr-1">Chiến dịch:</span>
                        {activeSlots.map((slot, idx) => (
                            <button
                                key={slot.flashSaleId}
                                type="button"
                                onClick={() => setSelectedSlotIndex(idx)}
                                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                                    idx === selectedSlotIndex
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm shadow-red-500/25 scale-102'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                            >
                                <span>⚡</span>
                                <span>{slot.name}</span>
                                <span className="text-[11px] opacity-80">({slot.items.length})</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Items Grid */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                    {currentSlot.items.slice(0, 4).map((item) => (
                        <FlashSaleCard key={item.variantId} data={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};
