export interface CustomerFlashSaleProductItem {
    productId: number;
    productName: string;
    slug: string;
    thumbnailUrl?: string;
    variantId: number;
    sku: string;
    variantAttributes?: string;
    originalPrice: number;
    flashSalePrice: number;
    discountPercent: number;
    totalSlots: number;
    soldSlots: number;
    percentSold: number;
    userLimit: number;
    isSoldOut: boolean;
    isHot: boolean;
}

export interface CustomerTimeSlot {
    flashSaleId: number;
    name: string;
    startTime: string;
    endTime: string;
    status: 'ACTIVE' | 'UPCOMING' | 'EXPIRED' | 'CANCELLED';
    remainingSeconds: number;
    items: CustomerFlashSaleProductItem[];
}

export interface CustomerActiveFlashSale {
    currentSlot: CustomerTimeSlot | null;
    activeSlots?: CustomerTimeSlot[];
    upcomingSlots: CustomerTimeSlot[];
}
