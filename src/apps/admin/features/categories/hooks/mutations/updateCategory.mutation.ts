import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import { categoryKeys } from '../categories.keys';
import { UpdateCategoryRequest } from '../../models/update-category.request';

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCategoryRequest }) => 
      categoryService.updateCategory(id, request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    }
  });
};
