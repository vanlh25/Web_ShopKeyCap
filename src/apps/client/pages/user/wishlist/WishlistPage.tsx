import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlistPageController } from './WishlistPage.controller';
import { WishlistItemCard } from './components/WishlistItemCard';
import { WishlistSkeleton } from './components/WishlistSkeleton';
import { useDocumentTitle } from '../../../../../core/hooks/useDocumentTitle';

export default function WishlistPage() {
    useDocumentTitle('Sản phẩm yêu thích - Keycap Shop');

    const {
        favorites,
        pagination,
        isLoading,
        error,
        movingId,
        removingId,
        handleRemove,
        handleMoveToCart,
        handlePageChange,
    } = useWishlistPageController();

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span>Danh sách yêu thích</span>
                        {pagination && pagination.totalItems > 0 && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                {pagination.totalItems}
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Quản lý các sản phẩm bạn đã lưu để mua sau
                    </p>
                </div>

                <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                    <span>Khám phá thêm</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Content area */}
            <div className="min-h-100">
                {isLoading ? (
                    <WishlistSkeleton />
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
                        <p className="font-semibold">{error}</p>
                    </div>
                ) : favorites.length === 0 ? (
                    /* Empty state */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6 shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">
                            <Heart className="w-10 h-10 stroke-[1.5]" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            Chưa có sản phẩm yêu thích nào
                        </h2>
                        <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                            Hãy lưu các sản phẩm bạn quan tâm để dễ dàng theo dõi giá và thêm vào giỏ hàng khi muốn mua.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                        >
                            <span>Khám phá sản phẩm ngay</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {favorites.map((product) => (
                                <WishlistItemCard
                                    key={product.id}
                                    product={product}
                                    onRemove={handleRemove}
                                    onMoveToCart={handleMoveToCart}
                                    isMoving={movingId === product.id}
                                    isRemoving={removingId === product.id}
                                />
                            ))}
                        </div>

                        {/* Pagination if multiple pages */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                >
                                    Trước
                                </button>
                                <span className="text-sm text-slate-600 px-3">
                                    Trang {pagination.page} / {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
