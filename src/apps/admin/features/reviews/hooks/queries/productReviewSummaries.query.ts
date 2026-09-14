import { useQuery } from "@tanstack/react-query";
import { reviewAdminApi } from "../../repo/reviewApi.repo";
import { reviewKeys } from "../review.keys";

/** Hook lấy danh sách sản phẩm có đánh giá kèm thống kê */
export const useProductReviewSummariesQuery = (page: number, pageSize: number = 20) => {
    return useQuery({
        queryKey: reviewKeys.productSummaries(page, pageSize),
        queryFn: async () => {
            const response = await reviewAdminApi.getProductReviewSummaries(page, pageSize);
            return response;
        },
    });
};
