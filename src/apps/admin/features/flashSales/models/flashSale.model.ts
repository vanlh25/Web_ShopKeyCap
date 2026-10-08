export enum EFlashSaleStatus {
    UPCOMING = 'UPCOMING',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED'
}

export interface FlashSaleItemModel {
    id: number;
    productId: number;
    productName: string;
    productThumbnail?: string;
    variantId: number;
    sku: string;
    variantAttributesSummary?: string;
    originalPrice: number;
    flashSalePrice: number;
    discountPercent: number;
    totalSlots: number;
    soldSlots: number;
    userLimit: number;
}

export interface FlashSaleItemPayload {
    productId: number;
    variantId: number;
    flashSalePrice: number;
    totalSlots: number;
    userLimit: number;
}

export interface FlashSaleSummaryModel {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    status: EFlashSaleStatus;
    totalItems: number;
    totalSlots: number;
    soldSlots: number;
}

export interface FlashSaleDetailModel {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    status: EFlashSaleStatus;
    items: FlashSaleItemModel[];
}

export interface CreateFlashSalePayload {
    name: string;
    startTime: string;
    endTime: string;
    items?: FlashSaleItemPayload[];
}

export interface UpdateFlashSalePayload {
    name: string;
    startTime: string;
    endTime: string;
    status?: EFlashSaleStatus;
}

export interface FlashSaleFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: EFlashSaleStatus;
}
