import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../../services/brand.service';
import { brandKeys } from '../brand.keys';

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    }
  });
};
