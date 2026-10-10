import { useQuery } from '@tanstack/react-query';
import { flashSaleKeys } from '../flashSaleKeys';
import { flashSaleService } from '../../services/flashSale.service';
import { FlashSaleFilterParams } from '../../models/flashSale.model';

export const useAdminFlashSalesQuery = (params?: FlashSaleFilterParams) => {
    return useQuery({
        queryKey: flashSaleKeys.list(params),
        queryFn: async () => {
            const res = await flashSaleService.getFlashSales(params);
            return res;
        }
    });
};
