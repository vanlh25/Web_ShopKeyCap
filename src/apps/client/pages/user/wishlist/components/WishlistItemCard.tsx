import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Eye } from 'lucide-react';
import type { ProductItem } from '../../../../features/products/model/product.model';

interface WishlistItemCardProps {
    product: ProductItem;
    onRemove: (productId: number) => void;
    onMoveToCart: (productId: number) => void;
    isMoving: boolean;
    isRemoving: boolean;
}

export const WishlistItemCard = ({
    product,
    onRemove,
    onMoveToCart,
    isMoving,
    isRemoving,
}: WishlistItemCardProps) => {
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.minPrice) + '₫';

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between group">
            {/* Top part */}
            <div>
                {/* Image container */}
                <div className="relative overflow-hidden bg-slate-50 rounded-lg aspect-4/3 mb-4 flex items-center justify-center p-2 border border-slate-100">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Quick remove button */}
                    <button
                        onClick={() => onRemove(product.id)}
                        disabled={isRemoving}
                        title="Xóa khỏi yêu thích"
                        className="cursor-pointer absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Category tag */}
                {product.category?.name && (
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        {product.category.name}
                    </span>
                )}

                {/* Product Name */}
                <Link
                    to={`/product/${product.slug}`}
                    className="text-[16px] font-bold text-slate-800 hover:text-blue-600 line-clamp-2 leading-snug transition-colors mb-2 block"
                >
                    {product.name}
                </Link>
            </div>

            {/* Bottom part */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Giá từ:</span>
                    <span className="text-[17px] font-bold text-slate-900 leading-none">
                        {formattedPrice}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onMoveToCart(product.id)}
                        disabled={isMoving}
                        className="cursor-pointer flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isMoving ? 'Đang chuyển...' : 'Chuyển vào giỏ'}</span>
                    </button>

                    <Link
                        to={`/product/${product.slug}`}
                        title="Xem chi tiết"
                        className="py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 text-[13px] font-semibold flex items-center justify-center transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
