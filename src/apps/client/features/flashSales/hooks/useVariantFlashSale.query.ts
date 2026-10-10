import { useQuery } from '@tanstack/react-query';
import { customerFlashSaleKeys } from './customerFlashSaleKeys';
import { customerFlashSaleService } from '../services/customerFlashSale.service';

export const useVariantFlashSaleQuery = (variantId?: number) => {
    return useQuery({
        queryKey: customerFlashSaleKeys.variant(variantId ?? 0),
        queryFn: async () => {
            if (!variantId) return null;
            const res = await customerFlashSaleService.getVariantFlashSale(variantId);
            return res.data;
        },
        enabled: !!variantId && variantId > 0,
        staleTime: 1000 * 30
    });
};
