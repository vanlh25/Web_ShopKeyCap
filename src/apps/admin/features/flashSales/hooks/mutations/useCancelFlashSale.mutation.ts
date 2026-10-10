import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleKeys } from '../flashSaleKeys';
import { flashSaleService } from '../../services/flashSale.service';

export const useCancelFlashSaleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => flashSaleService.cancelFlashSale(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.detail(id) });
        }
    });
};
