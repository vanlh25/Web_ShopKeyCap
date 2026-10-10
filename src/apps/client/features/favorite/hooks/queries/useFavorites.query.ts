import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '../../services/favorite.service';
import { favoriteKeys } from '../favoriteKeys';

export const useFavoritesQuery = (page: number = 1, limit: number = 12) => {
    return useQuery({
        queryKey: favoriteKeys.list(page, limit),
        queryFn: async () => {
            const res = await favoriteService.getFavorites(page, limit);
            if (!res.success) throw new Error(res.message);
            return res;
        },
    });
};
