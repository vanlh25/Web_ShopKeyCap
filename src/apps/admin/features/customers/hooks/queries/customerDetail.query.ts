import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../services/customer.service';
import { customerKeys } from '../customer.keys';

export const useCustomerDetail = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: enabled && !!id,
  });
};
