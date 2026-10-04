import { USE_MOCK } from '../../../../../core/config/useMock.config';
import { CustomerApiRepo } from '../repo/customerApi.repo';
import { CustomerMockRepo } from '../repo/customerMock.repo';
import { ICustomerRepo } from '../repo/customer.repo';

export const customerService: ICustomerRepo = USE_MOCK ? new CustomerMockRepo() : new CustomerApiRepo();
