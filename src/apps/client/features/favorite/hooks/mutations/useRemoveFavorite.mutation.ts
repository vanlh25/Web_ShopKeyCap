import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../../services/favorite.service';
import { favoriteKeys } from '../favoriteKeys';
import { productKeys } from '../../../products/hooks/productKeys';

export const useRemoveFavoriteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: number) => {
            const res = await favoriteService.removeFavorite(productId);
            if (!res.success) throw new Error(res.message);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};
