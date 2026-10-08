import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { ProductItem } from "../../products/model/product.model";
import type { FavoriteRepo } from "./favorite.repo";
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from "../../products/repo/productMock.repo";
import { ApiException } from "../../../../../core/exceptions/api.exception";

const TOGGLE_FAVORITE_SUCCESS = true;

export class FavoriteMockRepo implements FavoriteRepo {
    async toggleFavorite(productId: number): Promise<ApiResponse<{ isFavorite: boolean }>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!TOGGLE_FAVORITE_SUCCESS) {
                    reject(new ApiException("Không thể cập nhật trạng thái yêu thích", 401));
                    return;
                }

                MOCK_PRODUCT_DETAIL.isFavorite = !MOCK_PRODUCT_DETAIL.isFavorite;

                resolve({
                    success: true,
                    message: `Cập nhật yêu thích sản phẩm ${productId} thành công`,
                    data: {
                        isFavorite: MOCK_PRODUCT_DETAIL.isFavorite
                    }
                });
            }, 300);
        });
    }

    async getFavorites(_page: number = 1, _limit: number = 12): Promise<ApiResponse<ProductItem[]>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const favorites = MOCK_PRODUCTS.slice(0, 4).map(p => ({ ...p, isFavorite: true }));
                resolve({
                    success: true,
                    message: "Lấy danh sách yêu thích thành công",
                    data: favorites,
                    pagination: {
                        page: 1,
                        pageSize: 12,
                        totalItems: favorites.length,
                        totalPages: 1
                    }
                });
            }, 300);
        });
    }

    async removeFavorite(productId: number): Promise<ApiResponse<void>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: `Xóa sản phẩm ${productId} khỏi danh sách yêu thích thành công`,
                    data: undefined as unknown as void
                });
            }, 300);
        });
    }

    async moveToCart(_productId: number, _variantId?: number, _quantity: number = 1): Promise<ApiResponse<{ cartCount: number }>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Đã chuyển sản phẩm vào giỏ hàng",
                    data: { cartCount: 5 }
                });
            }, 300);
        });
    }
}

