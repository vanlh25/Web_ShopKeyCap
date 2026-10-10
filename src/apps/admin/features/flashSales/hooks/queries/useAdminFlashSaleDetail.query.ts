import { useQuery } from '@tanstack/react-query';
import { flashSaleKeys } from '../flashSaleKeys';
import { flashSaleService } from '../../services/flashSale.service';

export const useAdminFlashSaleDetailQuery = (id?: number) => {
    return useQuery({
        queryKey: flashSaleKeys.detail(id ?? 0),
        queryFn: async () => {
            if (!id) throw new Error('ID không hợp lệ');
            return await flashSaleService.getFlashSaleById(id);
        },
        enabled: !!id
    });
};
