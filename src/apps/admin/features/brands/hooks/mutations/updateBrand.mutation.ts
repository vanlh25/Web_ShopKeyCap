import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../../services/brand.service';
import { brandKeys } from '../brand.keys';
import { UpdateBrandRequest } from '../../models/update-brand.request';

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateBrandRequest }) => 
      brandService.updateBrand(id, request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.id) });
    }
  });
};
