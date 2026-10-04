export interface AvailableReview {
    id?: number;
    productId: number;
    rating: number;
    content: string;
    imageUrls?: string[];
    createdAt: string;
    updatedAt?: string;
    canEdit?: boolean;
    remainingDays?: number;
}
