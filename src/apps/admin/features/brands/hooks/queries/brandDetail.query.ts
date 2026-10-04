import { useQuery } from '@tanstack/react-query';
import { brandService } from '../../services/brand.service';
import { brandKeys } from '../brand.keys';

export const useBrandDetailQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.getBrandById(id),
    enabled: enabled && !!id,
  });
};
