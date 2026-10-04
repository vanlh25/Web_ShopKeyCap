import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../../services/banner.service';
import { bannerKeys } from '../banner.keys';
import { UpdateBannerRequest } from '../../models/update-banner.request';

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateBannerRequest }) => 
      bannerService.updateBanner(id, request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(variables.id) });
    }
  });
};
