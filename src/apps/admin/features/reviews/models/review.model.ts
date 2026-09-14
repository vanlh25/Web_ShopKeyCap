/** Thống kê đánh giá theo sản phẩm — dùng cho trang danh sách */
export interface AdminReviewSummary {
    productId: number;
    productName: string;
    productThumbnail: string | null;
    totalReviews: number;
    hiddenCount: number;
    visibleCount: number;
    averageRating: number | null;
}

/** Chi tiết một đánh giá — dùng cho trang chi tiết sản phẩm */
export interface AdminReview {
    id: number;
    user: {
        fullName: string;
        avatar: string | null;
    };
    rating: number;
    content: string;
    createdAt: string;
    imageUrls: string[];
    isHidden: boolean;
    reply: {
        id: number;
        adminName: string;
        content: string;
        createdAt: string;
    } | null;
}
