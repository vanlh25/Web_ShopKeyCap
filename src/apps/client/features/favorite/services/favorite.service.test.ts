import { describe, it, expect, vi } from 'vitest';
import { FavoriteService } from './favorite.service';
import type { FavoriteRepo } from '../repo/favorite.repo';

describe('FavoriteService', () => {
    it('should delegate getFavorites to repo', async () => {
        const mockRepo: FavoriteRepo = {
            toggleFavorite: vi.fn(),
            getFavorites: vi.fn().mockResolvedValue({
                success: true,
                message: 'OK',
                data: [],
            }),
            removeFavorite: vi.fn(),
            moveToCart: vi.fn(),
        };

        const service = new FavoriteService(mockRepo);
        const res = await service.getFavorites(1, 10);

        expect(mockRepo.getFavorites).toHaveBeenCalledWith(1, 10);
        expect(res.success).toBe(true);
    });

    it('should delegate removeFavorite to repo', async () => {
        const mockRepo: FavoriteRepo = {
            toggleFavorite: vi.fn(),
            getFavorites: vi.fn(),
            removeFavorite: vi.fn().mockResolvedValue({
                success: true,
                message: 'Removed',
                data: undefined,
            }),
            moveToCart: vi.fn(),
        };

        const service = new FavoriteService(mockRepo);
        const res = await service.removeFavorite(123);

        expect(mockRepo.removeFavorite).toHaveBeenCalledWith(123);
        expect(res.success).toBe(true);
    });

    it('should delegate moveToCart to repo', async () => {
        const mockRepo: FavoriteRepo = {
            toggleFavorite: vi.fn(),
            getFavorites: vi.fn(),
            removeFavorite: vi.fn(),
            moveToCart: vi.fn().mockResolvedValue({
                success: true,
                message: 'Moved',
                data: { cartCount: 3 },
            }),
        };

        const service = new FavoriteService(mockRepo);
        const res = await service.moveToCart(123, 456, 2);

        expect(mockRepo.moveToCart).toHaveBeenCalledWith(123, 456, 2);
        expect(res.data.cartCount).toBe(3);
    });
});
