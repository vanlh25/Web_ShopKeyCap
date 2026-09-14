import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, Eye, EyeOff, MessageSquare } from "lucide-react";
import { useProductReviewSummariesQuery } from "../../features/reviews/hooks/queries/productReviewSummaries.query";

export const ReviewListPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;

    const { data, isLoading, isError } = useProductReviewSummariesQuery(page, PAGE_SIZE);

    const products = data?.data ?? [];
    const pagination = data?.pagination;

    const renderStars = (rating: number | null) => {
        if (rating == null) return <span className="text-slate-400 text-sm">—</span>;
        return (
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
            </div>
        );
    };

    if (isError) {
        return (
            <div className="p-8 text-center text-red-500">
                Đã xảy ra lỗi khi tải dữ liệu!
            </div>
        );
    }

    return (
        <div className="w-full pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đánh giá</h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Quản lý đánh giá của khách hàng theo từng sản phẩm
                </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="text-left px-5 py-4 font-semibold text-slate-600">Sản phẩm</th>
                            <th className="text-center px-5 py-4 font-semibold text-slate-600">Tổng đánh giá</th>
                            <th className="text-center px-5 py-4 font-semibold text-slate-600">Đang hiện</th>
                            <th className="text-center px-5 py-4 font-semibold text-slate-600">Đang ẩn</th>
                            <th className="text-center px-5 py-4 font-semibold text-slate-600">Điểm TB</th>
                            <th className="text-right px-5 py-4 font-semibold text-slate-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <MessageSquare className="w-12 h-12 text-slate-200" />
                                        <span className="text-slate-400 font-medium">Chưa có sản phẩm nào có đánh giá</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product, idx) => (
                                <tr
                                    key={product.productId}
                                    className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${
                                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                    }`}
                                >
                                    {/* Sản phẩm */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.productThumbnail ? (
                                                <img
                                                    src={product.productThumbnail}
                                                    alt={product.productName}
                                                    className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                    <MessageSquare className="w-5 h-5 text-slate-300" />
                                                </div>
                                            )}
                                            <span className="font-medium text-slate-800 line-clamp-2 max-w-xs">
                                                {product.productName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Tổng */}
                                    <td className="px-5 py-4 text-center">
                                        <span className="font-bold text-slate-700 text-base">{product.totalReviews}</span>
                                    </td>

                                    {/* Đang hiện */}
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">
                                            <Eye className="w-3 h-3" />
                                            {product.visibleCount}
                                        </span>
                                    </td>

                                    {/* Đang ẩn */}
                                    <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-xs ${
                                            product.hiddenCount > 0
                                                ? "bg-red-50 text-red-600"
                                                : "bg-slate-100 text-slate-400"
                                        }`}>
                                            <EyeOff className="w-3 h-3" />
                                            {product.hiddenCount}
                                        </span>
                                    </td>

                                    {/* Điểm TB */}
                                    <td className="px-5 py-4 text-center">
                                        {renderStars(product.averageRating)}
                                    </td>

                                    {/* Action */}
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/reviews/${product.productId}`)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
                                        >
                                            Xem chi tiết
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-slate-50 transition-colors text-sm"
                    >
                        Trước
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Trang {page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-slate-50 transition-colors text-sm"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};
