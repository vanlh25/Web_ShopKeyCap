import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewAdminApi } from "../../repo/reviewApi.repo";
import { reviewKeys } from "../review.keys";

/** Mutation ẩn/hiện một đánh giá, tự động invalidate cache detail và summaries */
export const useToggleReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: number) => reviewAdminApi.toggleVisibility(reviewId),
        onSuccess: () => {
            // Làm mới danh sách đánh giá của sản phẩm này
            queryClient.invalidateQueries({ queryKey: reviewKeys.all });
        },
    });
};
