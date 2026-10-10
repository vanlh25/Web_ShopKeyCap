export const customerFlashSaleKeys = {
    all: ['customer-flash-sales'] as const,
    active: () => [...customerFlashSaleKeys.all, 'active'] as const,
    upcoming: () => [...customerFlashSaleKeys.all, 'upcoming'] as const,
    detail: (id: number) => [...customerFlashSaleKeys.all, 'detail', id] as const,
    variant: (variantId: number) => [...customerFlashSaleKeys.all, 'variant', variantId] as const,
};
