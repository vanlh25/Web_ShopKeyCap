import { apiClient } from "../../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { AdminReviewSummary, AdminReview } from "../models/review.model";

const ADMIN_REVIEWS_ENDPOINT = "/admin/reviews";

export const reviewAdminApi = {
    /**
     * GET /admin/reviews/products
     * Danh sách sản phẩm có đánh giá kèm thống kê (tổng, ẩn, sao TB).
     */
    getProductReviewSummaries(page: number, pageSize: number = 20): Promise<ApiResponse<AdminReviewSummary[]>> {
        return apiClient.get<ApiResponse<AdminReviewSummary[]>>(`${ADMIN_REVIEWS_ENDPOINT}/products`, {
            params: { page, pageSize },
        });
    },

    /**
     * GET /admin/reviews?productId=&page=&pageSize=
     * Tất cả đánh giá (kể cả ẩn) của một sản phẩm.
     */
    getReviewsByProduct(productId: number, page: number, pageSize: number = 10): Promise<ApiResponse<AdminReview[]>> {
        return apiClient.get<ApiResponse<AdminReview[]>>(ADMIN_REVIEWS_ENDPOINT, {
            params: { productId, page, pageSize },
        });
    },

    /**
     * PATCH /admin/reviews/{reviewId}/toggle
     * Ẩn hoặc hiện một đánh giá.
     */
    toggleVisibility(reviewId: number): Promise<ApiResponse<null>> {
        return apiClient.patch<ApiResponse<null>>(`${ADMIN_REVIEWS_ENDPOINT}/${reviewId}/toggle`, {});
    },
};
