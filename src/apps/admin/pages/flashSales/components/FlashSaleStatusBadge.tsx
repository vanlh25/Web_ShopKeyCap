import React from 'react';
import { EFlashSaleStatus } from '../../../features/flashSales/models/flashSale.model';

interface Props {
    status: EFlashSaleStatus;
}

export const FlashSaleStatusBadge: React.FC<Props> = ({ status }) => {
    switch (status) {
        case EFlashSaleStatus.ACTIVE:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang diễn ra
                </span>
            );
        case EFlashSaleStatus.UPCOMING:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Sắp diễn ra
                </span>
            );
        case EFlashSaleStatus.EXPIRED:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Đã kết thúc
                </span>
            );
        case EFlashSaleStatus.CANCELLED:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Đã hủy
                </span>
            );
        default:
            return null;
    }
};
