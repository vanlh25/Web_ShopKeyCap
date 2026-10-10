import type { ApiResponse } from "../../../../../core/api/apiResponse";
import { USE_MOCK } from "../../../../../core/config/useMock.config";
import type { FavoriteRepo } from "../repo/favorite.repo";
import { FavoriteApiRepo } from "../repo/favoriteApi.repo";
import { FavoriteMockRepo } from "../repo/favoriteMock.repo";

export class FavoriteService {
    private readonly favoriteRepo: FavoriteRepo;

    constructor(favoriteRepo?: FavoriteRepo) {
        this.favoriteRepo = favoriteRepo ?? new FavoriteApiRepo();
    }

    async toggleFavorite(productId: number): Promise<ApiResponse<{ isFavorite: boolean }>> {
        return this.favoriteRepo.toggleFavorite(productId);
    }

    async getFavorites(page?: number, limit?: number) {
        return this.favoriteRepo.getFavorites(page, limit);
    }

    async removeFavorite(productId: number) {
        return this.favoriteRepo.removeFavorite(productId);
    }

    async moveToCart(productId: number, variantId?: number, quantity?: number) {
        return this.favoriteRepo.moveToCart(productId, variantId, quantity);
    }
}

export const favoriteService = new FavoriteService(USE_MOCK ? new FavoriteMockRepo() : undefined);
