import { apiClient } from "../../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { ProductItem } from "../../products/model/product.model";
import type { FavoriteRepo } from "./favorite.repo";

export class FavoriteApiRepo implements FavoriteRepo {
    /**
     * POST /favorites/:productId
     * @param productId
     * @returns isFavorite
     */
    async toggleFavorite(productId: number): Promise<ApiResponse<{ isFavorite: boolean }>> {
        const response = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/favorites/${productId}`);
        return response;
    }

    /**
     * GET /favorites
     */
    async getFavorites(page: number = 1, limit: number = 12): Promise<ApiResponse<ProductItem[]>> {
        const response = await apiClient.get<ApiResponse<ProductItem[]>>(`/favorites?page=${page}&limit=${limit}`);
        return response;
    }

    /**
     * DELETE /favorites/:productId
     */
    async removeFavorite(productId: number): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(`/favorites/${productId}`);
        return response;
    }

    /**
     * POST /favorites/:productId/move-to-cart
     */
    async moveToCart(productId: number, variantId?: number, quantity: number = 1): Promise<ApiResponse<{ cartCount: number }>> {
        const params = new URLSearchParams();
        if (variantId) params.append("variantId", variantId.toString());
        params.append("quantity", quantity.toString());
        const response = await apiClient.post<ApiResponse<{ cartCount: number }>>(
            `/favorites/${productId}/move-to-cart?${params.toString()}`
        );
        return response;
    }
}

