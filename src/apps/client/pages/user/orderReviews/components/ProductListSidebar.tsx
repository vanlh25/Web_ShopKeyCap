import React from "react";
import type { OrderModel } from "../../../../features/order/models/order.model";
import type { AvailableReview } from "../../../../features/review";
import { formatCurrency } from "../../../../../../utils/currency.util";

interface ProductListSidebarProps {
    order: OrderModel;
    availableReviews: AvailableReview[];
    selectedProductId: number | null;
    onSelectProduct: (productId: number) => void;
}

export const ProductListSidebar: React.FC<ProductListSidebarProps> = ({
    order,
    availableReviews,
    selectedProductId,
    onSelectProduct
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-2xs">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-blue-600 text-[20px]">inventory_2</span>
                        <h3 className="text-base font-bold text-slate-900 m-0 leading-tight">
                            Sản phẩm trong đơn
                        </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs shrink-0">
                        {order.items.length}
                    </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 m-0">Chọn sản phẩm bên dưới để đánh giá</p>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
                {order.items.map((item) => {
                    const isReviewed = availableReviews.some(r => r.productId === item.productId);
                    const isSelected = selectedProductId === item.productId;

                    return (
                        <div 
                            key={item.id}
                            onClick={() => onSelectProduct(item.productId)}
                            className={`group relative p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                isSelected 
                                ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/50' 
                                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-2xs'
                            }`}
                        >
                            <div className="flex gap-3 items-start">
                                {/* Thumbnail */}
                                <div className="w-16 h-16 shrink-0 bg-slate-50 rounded-lg border border-slate-200/80 overflow-hidden p-1 flex items-center justify-center">
                                    {item.productImage ? (
                                        <img 
                                            src={item.productImage} 
                                            alt={item.productName} 
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200" 
                                        />
                                    ) : (
                                        <span className="material-icons-outlined text-slate-300 text-[24px]">inventory_2</span>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                                    <div>
                                        <h4 
                                            className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-snug transition-colors ${
                                                isSelected ? 'text-blue-900' : 'text-slate-900 group-hover:text-blue-600'
                                            }`}
                                            title={item.productName}
                                        >
                                            {item.productName}
                                        </h4>

                                        {item.attributes && item.attributes.length > 0 && (
                                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                                {item.attributes.map(a => `${a.name}: ${a.value}`).join(' • ')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price and Status */}
                                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                                            {formatCurrency(item.price)}
                                        </span>

                                        {isReviewed ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                                                <span className="material-icons text-[13px] text-emerald-600">check_circle</span>
                                                <span>Đã đánh giá</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
                                                <span className="material-icons-outlined text-[13px] text-amber-600">edit</span>
                                                <span>Chưa đánh giá</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Active Dot */}
                            {isSelected && (
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
