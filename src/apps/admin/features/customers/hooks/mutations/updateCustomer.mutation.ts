import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/customer.service';
import { customerKeys } from '../customer.keys';

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: any }) => customerService.updateCustomer(id, request),
    onSuccess: (data: any) => {
      // type of queryClient.invalidateQueries expects an object with queryKey
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      if (data && data.data && data.data.id) {
        queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.data.id) });
      }
    },
  });
};
