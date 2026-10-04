import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../../services/banner.service';
import { bannerKeys } from '../banner.keys';

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bannerService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    }
  });
};
