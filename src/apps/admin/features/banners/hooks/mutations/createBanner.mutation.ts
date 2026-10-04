import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../../services/banner.service';
import { bannerKeys } from '../banner.keys';
import { CreateBannerRequest } from '../../models/create-banner.request';

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBannerRequest) => bannerService.createBanner(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    }
  });
};
