import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleKeys } from '../flashSaleKeys';
import { flashSaleService } from '../../services/flashSale.service';

export const useDeleteFlashSaleItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ saleId, itemId }: { saleId: number; itemId: number }) =>
            flashSaleService.deleteItem(saleId, itemId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.detail(variables.saleId) });
        }
    });
};
