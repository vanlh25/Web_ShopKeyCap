import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import { categoryKeys } from '../categories.keys';

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    }
  });
};
