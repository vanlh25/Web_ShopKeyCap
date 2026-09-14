export const reviewKeys = {
    all: ["admin", "reviews"] as const,
    productSummaries: (page: number, pageSize?: number) =>
        [...reviewKeys.all, "products", { page, pageSize }] as const,
    detail: (productId: number, page: number, pageSize?: number) =>
        [...reviewKeys.all, "detail", productId, { page, pageSize }] as const,
};
