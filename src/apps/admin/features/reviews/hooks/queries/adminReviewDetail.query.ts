import { useQuery } from "@tanstack/react-query";
import { reviewAdminApi } from "../../repo/reviewApi.repo";
import { reviewKeys } from "../review.keys";

/** Hook lấy tất cả đánh giá (kể cả ẩn) của một sản phẩm */
export const useAdminReviewDetailQuery = (productId: number, page: number, pageSize: number = 10) => {
    return useQuery({
        queryKey: reviewKeys.detail(productId, page, pageSize),
        queryFn: async () => {
            const response = await reviewAdminApi.getReviewsByProduct(productId, page, pageSize);
            return response;
        },
        enabled: !!productId,
    });
};
