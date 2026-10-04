export interface ReviewItemRequest {
    productId: number;
    rating: number;
    content: string;
    imageUrls?: string[];
}

export interface CreateReviewRequest {
    orderId: number;
    reviews: ReviewItemRequest[];
}
