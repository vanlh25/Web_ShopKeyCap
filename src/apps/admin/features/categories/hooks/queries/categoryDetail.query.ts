import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import { categoryKeys } from '../categories.keys';

export const useCategoryDetailQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: enabled && !!id,
  });
};
