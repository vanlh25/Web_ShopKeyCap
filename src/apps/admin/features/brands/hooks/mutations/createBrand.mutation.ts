import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../../services/brand.service';
import { brandKeys } from '../brand.keys';
import { CreateBrandRequest } from '../../models/create-brand.request';

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBrandRequest) => brandService.createBrand(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    }
  });
};
