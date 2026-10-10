import React, { useState } from 'react';
import { Flame, Clock, Search, AlertCircle, Sparkles } from 'lucide-react';
import { useActiveFlashSaleQuery } from '../../features/flashSales/hooks/useActiveFlashSale.query';
import { CountdownTimer } from '../../features/flashSales/components/CountdownTimer';
import { FlashSaleCard } from '../../features/flashSales/components/FlashSaleCard';
import { CustomerTimeSlot } from '../../features/flashSales/models/flashSaleShopping.model';
import { useDocumentTitle } from '../../../../core/hooks/useDocumentTitle';

export const FlashSalePage: React.FC = () => {
    useDocumentTitle('Săn Flash Sale Giờ Vàng - Cyber Key');

    const { data: flashSaleData, isLoading } = useActiveFlashSaleQuery();
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const currentSlot = flashSaleData?.currentSlot || null;
    const activeSlots = flashSaleData?.activeSlots?.length
        ? flashSaleData.activeSlots
        : (currentSlot ? [currentSlot] : []);
    const upcomingSlots = flashSaleData?.upcomingSlots || [];

    // Combine all slots: all active slots first, then upcoming slots
    const allSlots: CustomerTimeSlot[] = [...activeSlots, ...upcomingSlots];

    const activeSlot: CustomerTimeSlot | null = allSlots[selectedSlotIndex] || currentSlot || null;
    const isUpcoming = activeSlot?.status === 'UPCOMING';

    const formatTimeLabel = (isoString: string) => {
        try {
            const d = new Date(isoString);
            return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const formatDateLabel = (isoString: string) => {
        try {
            const d = new Date(isoString);
            const today = new Date();
            if (d.toDateString() === today.toDateString()) {
                return 'Hôm nay';
            }
            return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        } catch {
            return '';
        }
    };

    const filteredItems = (activeSlot?.items || []).filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.productName.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q) ||
            (item.variantAttributes && item.variantAttributes.toLowerCase().includes(q))
        );
    });

    return (
        <div className="w-full pb-24 bg-slate-50 min-h-screen">
            {/* Top Banner Header */}
            <div className="relative overflow-hidden bg-white border-b border-slate-200 pt-8 pb-10 px-6 before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-red-600 before:via-orange-500 before:to-amber-500">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
                        Săn Deal Giờ Vàng
                    </div>

                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight flex items-center justify-center gap-2.5">
                        <span className="text-amber-500 animate-flicker">⚡</span>
                        <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                            Flash Sale Siêu Tốc
                        </span>
                        <span className="text-amber-500 animate-flicker">⚡</span>
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base mt-2 max-w-xl font-medium">
                        Cơ hội sở hữu bàn phím cơ, switch và keycap tuyển chọn với mức giá giảm sốc theo khung giờ quy định
                    </p>
                </div>
            </div>

            {/* Time Slots Navigation Bar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center overflow-x-auto no-scrollbar py-3 gap-3">
                        {isLoading ? (
                            <div className="py-3 text-slate-400 text-xs font-medium">Đang tải khung giờ...</div>
                        ) : allSlots.length === 0 ? (
                            <div className="py-3 text-slate-400 text-xs font-medium">Hiện chưa có khung giờ Flash Sale nào</div>
                        ) : (
                            allSlots.map((slot, idx) => {
                                const isSelected = selectedSlotIndex === idx;
                                const isSlotActive = slot.status === 'ACTIVE';

                                return (
                                    <button
                                        key={slot.flashSaleId}
                                        onClick={() => setSelectedSlotIndex(idx)}
                                        className={`flex flex-col items-center px-6 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer text-left ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/30 scale-102 font-bold'
                                                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 font-black text-base md:text-lg">
                                            {isSlotActive && <Flame className={`w-4 h-4 animate-flicker ${isSelected ? 'fill-amber-300 text-amber-300' : 'fill-red-500 text-red-500'}`} />}
                                            <span>{formatTimeLabel(slot.startTime)}</span>
                                        </div>
                                        <div className={`text-[11px] font-semibold ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                                            {isSlotActive ? (
                                                <span>Đang diễn ra</span>
                                            ) : (
                                                <span>Sắp mở bán ({formatDateLabel(slot.startTime)})</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Active Slot Status Bar */}
            {activeSlot && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
                    <div className="bg-white rounded-2xl p-5 md:p-6 border border-red-100 shadow-[0_8px_30px_rgb(239,68,68,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div
                                className={`p-3.5 rounded-xl shadow-xs ${
                                    isUpcoming
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/25 animate-flicker'
                                }`}
                            >
                                {isUpcoming ? <Clock className="w-6 h-6" /> : <Flame className="w-6 h-6 fill-white" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg md:text-xl font-extrabold text-slate-900">{activeSlot.name}</h2>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                        isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700 animate-pulse'
                                    }`}>
                                        {isUpcoming ? 'Sắp diễn ra' : 'Đang mở bán'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 font-medium">
                                    {isUpcoming
                                        ? `Khung giờ sẽ mở bán vào ${new Date(activeSlot.startTime).toLocaleString('vi-VN')}`
                                        : 'Săn deal ngay trước khi thời gian kết thúc hoặc hết suất ưu đãi'}
                                </p>
                            </div>
                        </div>

                        {/* Live Countdown Timer */}
                        <div className="flex items-center gap-3 bg-red-50/60 px-4 py-2.5 rounded-xl border border-red-200/60 shadow-xs self-start md:self-auto">
                            <CountdownTimer
                                initialSeconds={activeSlot.remainingSeconds}
                                label={isUpcoming ? 'MỞ BÁN SAU:' : 'KẾT THÚC TRONG:'}
                                variant="large"
                                theme={isUpcoming ? 'light' : 'danger'}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>Sản phẩm trong đợt sale</span>
                    <span className="px-2.5 py-0.5 text-xs rounded-full bg-red-50 text-red-600 font-extrabold border border-red-200 shadow-xs">
                        {filteredItems.length} sản phẩm
                    </span>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm flash sale..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-xs"
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
                {isLoading ? (
                    <div className="py-24 text-center text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-sm font-medium">Đang tải danh sách ưu đãi Flash Sale...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h3 className="text-base font-bold text-slate-700">Không có sản phẩm nào phù hợp</h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Khung giờ này hiện chưa có mặt hàng nào tham gia'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredItems.map((item) => (
                            <FlashSaleCard key={item.variantId} data={item} isUpcoming={isUpcoming} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashSalePage;
