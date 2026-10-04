import { useQuery } from '@tanstack/react-query';
import { bannerService } from '../../services/banner.service';
import { bannerKeys } from '../banner.keys';

export const useBannerDetailQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerService.getBannerById(id),
    enabled: enabled && !!id,
  });
};
