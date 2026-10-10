import { useQuery } from '@tanstack/react-query';
import { customerFlashSaleKeys } from './customerFlashSaleKeys';
import { customerFlashSaleService } from '../services/customerFlashSale.service';

export const useActiveFlashSaleQuery = () => {
    return useQuery({
        queryKey: customerFlashSaleKeys.active(),
        queryFn: async () => {
            const res = await customerFlashSaleService.getActiveFlashSale();
            return res.data;
        },
        staleTime: 1000 * 30, // 30s
        refetchInterval: 1000 * 60 // 1 phút refetch một lần
    });
};
