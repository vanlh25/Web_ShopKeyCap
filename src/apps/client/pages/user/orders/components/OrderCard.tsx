import React from 'react';
import { Link } from 'react-router-dom';
import type { OrderModel } from '../../../../features/order/models/order.model';
import { useOrderCardViewModel } from '../cpnController/orderCard.viewmodel';
import { useBuyAgainViewModel } from '../cpnController/useBuyAgain.viewmodel';
import { BuyAgainModal } from './BuyAgainModal';
import { EOrderStatus } from '../../../../features/order/enums/orderStatus.enum';

interface OrderCardProps {
    order: OrderModel;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const {
        statusInfo,
        firstItem,
        moreCount,
        formattedDate,
        formattedTotalAmount
    } = useOrderCardViewModel(order);

    const {
        isModalOpen,
        selectedItemIds,
        isAdding,
        isSingleLoading,
        handleBuyAgainClick,
        toggleItem,
        handleConfirm,
        handleCloseModal,
    } = useBuyAgainViewModel(order.items);

    const isDelivered = order.status === EOrderStatus.SUCCESS;

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            #ORDER-{order.id}
                        </span>
                        <span className="text-sm text-slate-500">
                            {formattedDate}
                        </span>
                    </div>

                    {/* No AI SLOP: Neutral text with icon instead of loud badges */}
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${statusInfo.colorClass}`}>
                        <span className="material-icons-outlined text-[18px]">{statusInfo.icon}</span>
                        {statusInfo.label}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {firstItem && (
                        <div className="flex gap-4">
                            <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                                <img src={firstItem.productImage} alt={firstItem.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="text-slate-900 font-medium text-base truncate">{firstItem.productName}</h4>
                                <div className="mt-1 text-sm text-slate-500 line-clamp-1">
                                    {firstItem.attributes.map((a: any) => `${a.name}: ${a.value}`).join(' • ')}
                                </div>
                                <div className="mt-2 text-sm font-medium text-slate-900">
                                    x{firstItem.quantity}
                                </div>
                            </div>
                        </div>
                    )}
                    {moreCount > 0 && (
                        <div className="mt-3 text-sm text-slate-500 text-center py-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            Và {moreCount} sản phẩm khác
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Tổng tiền</span>
                        <span className="text-lg font-bold text-slate-900">{formattedTotalAmount}</span>
                    </div>

                    <div className="flex gap-3">
                        {/* Nút Mua lại — chỉ hiển thị khi đơn hàng đã giao thành công */}
                        {isDelivered && (
                            <button
                                id={`buy-again-btn-order-${order.id}`}
                                onClick={handleBuyAgainClick}
                                disabled={isSingleLoading}
                                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all text-sm flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSingleLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <span className="material-icons-outlined text-[16px]">replay</span>
                                )}
                                Mua lại
                            </button>
                        )}

                        <Link
                            to={`/user/orders/${order.id}`}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
                        >
                            Xem chi tiết
                        </Link>
                    </div>
                </div>
            </div>

            {/* Popup chọn sản phẩm mua lại */}
            {isModalOpen && (
                <BuyAgainModal
                    items={order.items}
                    selectedItemIds={selectedItemIds}
                    isAdding={isAdding}
                    onToggleItem={toggleItem}
                    onConfirm={handleConfirm}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};
