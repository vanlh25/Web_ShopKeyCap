import { FlashSaleFilterParams } from '../models/flashSale.model';

export const flashSaleKeys = {
    all: ['admin-flash-sales'] as const,
    lists: () => [...flashSaleKeys.all, 'list'] as const,
    list: (params?: FlashSaleFilterParams) => [...flashSaleKeys.lists(), params] as const,
    details: () => [...flashSaleKeys.all, 'detail'] as const,
    detail: (id: number) => [...flashSaleKeys.details(), id] as const,
};
