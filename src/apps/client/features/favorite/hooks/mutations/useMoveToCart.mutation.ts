import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../../services/favorite.service';
import { favoriteKeys } from '../favoriteKeys';
import { cartKeys } from '../../../cart/hooks/cartKeys';
import { productKeys } from '../../../products/hooks/productKeys';

export const useMoveToCartMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            productId,
            variantId,
            quantity = 1,
        }: {
            productId: number;
            variantId?: number;
            quantity?: number;
        }) => {
            const res = await favoriteService.moveToCart(productId, variantId, quantity);
            if (!res.success) throw new Error(res.message);
            return res.data;
        },
        onSuccess: (data) => {
            if (data?.cartCount !== undefined) {
                queryClient.setQueryData(cartKeys.summary(), { cartCount: data.cartCount });
            }
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};
