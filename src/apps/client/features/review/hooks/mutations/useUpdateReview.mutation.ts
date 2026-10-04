import { useMutation } from "@tanstack/react-query";
import type { UpdateReviewRequest } from "../../model/update-review.request";
import { reviewService } from "../../services/review.service";
import type { ApiResponse } from "../../../../../../core/api/apiResponse";

export interface UpdateReviewVariables {
    reviewId: number;
    request: UpdateReviewRequest;
}

export const useUpdateReview = () => {
    return useMutation<ApiResponse<null>, Error, UpdateReviewVariables>({
        mutationFn: ({ reviewId, request }: UpdateReviewVariables) =>
            reviewService.updateReview(reviewId, request),
    });
};
