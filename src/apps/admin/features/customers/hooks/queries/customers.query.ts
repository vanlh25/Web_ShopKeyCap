import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../services/customer.service';
import { customerKeys } from '../customer.keys';
import { CustomerListRequest } from '../../repo/customer.repo';

export const useCustomers = (params: CustomerListRequest) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    placeholderData: (prev) => prev,
  });
};
