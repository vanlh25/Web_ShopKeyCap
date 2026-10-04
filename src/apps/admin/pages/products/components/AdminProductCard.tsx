import React from "react";
import type { AdminProductItem } from "../../../features/products/models/product.model";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface Props {
    product: AdminProductItem;
    onDelete?: () => void;
    isDeleting?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

export const AdminProductCard: React.FC<Props> = ({ product, onDelete, isDeleting, isSelected, onToggleSelect }) => {
    return (
        <div className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-200'}`}>
            {/* Checkbox overlay */}
            <div
                className={`absolute top-2 left-2 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={(e) => { e.preventDefault(); onToggleSelect?.(); }}
            >
                <input
                    type="checkbox"
                    checked={!!isSelected}
                    onChange={onToggleSelect}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm"
                />
            </div>

            <Link to={`/admin/products/${product.id}`} className="block">
                <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); 
                            onDelete?.();
                        }}
                        disabled={isDeleting}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                        title="Xóa sản phẩm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="text-xs font-semibold text-slate-500 mb-1 tracking-wider uppercase">
                        {product.type.name}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="font-bold text-rose-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.minPrice)}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                            Kho: {product.totalStockQuantity ?? 0}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};
