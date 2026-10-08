import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleKeys } from '../flashSaleKeys';
import { flashSaleService } from '../../services/flashSale.service';
import { UpdateFlashSalePayload } from '../../models/flashSale.model';

export const useUpdateFlashSaleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateFlashSalePayload }) =>
            flashSaleService.updateFlashSale(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: flashSaleKeys.detail(variables.id) });
        }
    });
};
