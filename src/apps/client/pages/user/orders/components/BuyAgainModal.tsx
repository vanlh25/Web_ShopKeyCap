import React from 'react';
import type { OrderItemModel } from '../../../../features/order/models/order.model';

interface BuyAgainModalProps {
    items: OrderItemModel[];
    selectedItemIds: Set<number>;
    isAdding: boolean;
    onToggleItem: (itemId: number) => void;
    onConfirm: () => void;
    onClose: () => void;
}

export const BuyAgainModal: React.FC<BuyAgainModalProps> = ({
    items,
    selectedItemIds,
    isAdding,
    onToggleItem,
    onConfirm,
    onClose,
}) => {
    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(2px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Mua lại sản phẩm</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Chọn sản phẩm bạn muốn thêm vào giỏ hàng
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                        aria-label="Đóng"
                    >
                        <span className="material-icons-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Product list */}
                <div className="px-6 py-3 flex flex-col gap-2 max-h-72 overflow-y-auto">
                    {items.map((item) => {
                        const checked = selectedItemIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                role="checkbox"
                                aria-checked={checked}
                                tabIndex={0}
                                onClick={() => onToggleItem(item.id)}
                                onKeyDown={(e) => e.key === ' ' && onToggleItem(item.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                                    checked
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {/* Custom checkbox */}
                                <div className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                                    checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                                }`}>
                                    {checked && (
                                        <span className="material-icons-outlined text-white text-[14px]">check</span>
                                    )}
                                </div>

                                {/* Product image */}
                                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{item.productName}</p>
                                    {item.attributes.length > 0 && (
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                                            {item.attributes.map((a) => `${a.name}: ${a.value}`).join(' • ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
                    {/* Confirm */}
                    <button
                        onClick={onConfirm}
                        disabled={selectedItemIds.size === 0 || isAdding}
                        className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAdding ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Đang thêm...
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-[16px]">shopping_cart</span>
                                Xác nhận{selectedItemIds.size > 0 ? ` (${selectedItemIds.size})` : ''}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
