import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Eye, EyeOff, MessageSquare, User } from "lucide-react";
import { useAdminReviewDetailQuery } from "../../features/reviews/hooks/queries/adminReviewDetail.query";
import { useToggleReviewMutation } from "../../features/reviews/hooks/mutations/toggleReview.mutation";

export const ReviewDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    const numericProductId = Number(productId);

    const { data, isLoading, isError } = useAdminReviewDetailQuery(numericProductId, page, PAGE_SIZE);
    const toggleMutation = useToggleReviewMutation();

    const reviews = data?.data ?? [];
    const pagination = data?.pagination;

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    if (isError) {
        return (
            <div className="p-8 text-center text-red-500">Đã xảy ra lỗi khi tải dữ liệu!</div>
        );
    }

    return (
        <div className="w-full pb-20">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/reviews")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                </button>
                <div className="h-5 w-px bg-slate-200" />
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Chi tiết đánh giá
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Quản lý ẩn/hiện từng đánh giá của sản phẩm
                    </p>
                </div>
            </div>

            {/* Review List */}
            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400">Đang tải đánh giá...</div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200">
                        <MessageSquare className="w-14 h-14 text-slate-200 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700">Chưa có đánh giá nào</h3>
                        <p className="text-slate-400 text-sm mt-1">Sản phẩm này chưa được khách hàng đánh giá.</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div
                            key={review.id}
                            className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
                                review.isHidden
                                    ? "border-red-100 bg-red-50/30 opacity-80"
                                    : "border-slate-200"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* User info */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                                        {review.user.avatar ? (
                                            <img
                                                src={review.user.avatar}
                                                alt={review.user.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-slate-800 text-sm">
                                                {review.user.fullName}
                                            </span>
                                            {review.isHidden && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                                                    <EyeOff className="w-3 h-3" />
                                                    Đang ẩn
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {renderStars(review.rating)}
                                            <span className="text-xs text-slate-400">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Toggle Button */}
                                <button
                                    onClick={() => toggleMutation.mutate(review.id)}
                                    disabled={toggleMutation.isPending}
                                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                                        review.isHidden
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {review.isHidden ? (
                                        <>
                                            <Eye className="w-3.5 h-3.5" />
                                            Hiện đánh giá
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-3.5 h-3.5" />
                                            Ẩn đánh giá
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Content */}
                            {review.content && (
                                <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-13">
                                    {review.content}
                                </p>
                            )}

                            {/* Images */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2 pl-13">
                                    {review.imageUrls.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Review image ${i + 1}`}
                                            className="w-16 h-16 rounded-lg object-cover border border-slate-100"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Reply */}
                            {review.reply && (
                                <div className="mt-4 ml-13 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                    <p className="text-xs font-semibold text-blue-700 mb-1">
                                        Phản hồi từ {review.reply.adminName}
                                    </p>
                                    <p className="text-sm text-blue-800">{review.reply.content}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
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
