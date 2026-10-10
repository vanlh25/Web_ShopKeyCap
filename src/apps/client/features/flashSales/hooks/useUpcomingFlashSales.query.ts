import { useQuery } from '@tanstack/react-query';
import { customerFlashSaleKeys } from './customerFlashSaleKeys';
import { customerFlashSaleService } from '../services/customerFlashSale.service';

export const useUpcomingFlashSalesQuery = () => {
    return useQuery({
        queryKey: customerFlashSaleKeys.upcoming(),
        queryFn: async () => {
            const res = await customerFlashSaleService.getUpcomingSlots();
            return res.data;
        },
        staleTime: 1000 * 60
    });
};
