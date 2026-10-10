import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleKeys } from '../flashSaleKeys';
import { flashSaleService } from '../../services/flashSale.service';
import { CreateFlashSalePayload } from '../../models/flashSale.model';

export const useCreateFlashSaleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateFlashSalePayload) => flashSaleService.createFlashSale(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.lists() });
        }
    });
};
