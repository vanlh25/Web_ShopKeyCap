import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { ProductItem } from "../../products/model/product.model";

export interface FavoriteRepo {
    toggleFavorite(productId: number): Promise<ApiResponse<{ isFavorite: boolean }>>;
    getFavorites(page?: number, limit?: number): Promise<ApiResponse<ProductItem[]>>;
    removeFavorite(productId: number): Promise<ApiResponse<void>>;
    moveToCart(productId: number, variantId?: number, quantity?: number): Promise<ApiResponse<{ cartCount: number }>>;
}

