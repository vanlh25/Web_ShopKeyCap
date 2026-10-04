import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import { categoryKeys } from '../categories.keys';
import { CreateCategoryRequest } from '../../models/create-category.request';

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => categoryService.createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    }
  });
};
