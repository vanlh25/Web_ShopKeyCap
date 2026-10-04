import { useQuery } from '@tanstack/react-query';
import { bannerService } from '../../services/banner.service';
import { bannerKeys } from '../banner.keys';

export const useBannersQuery = () => {
  return useQuery({
    queryKey: bannerKeys.lists(),
    queryFn: () => bannerService.getBanners(),
  });
};
