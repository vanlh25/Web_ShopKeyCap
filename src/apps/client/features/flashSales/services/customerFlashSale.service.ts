import { USE_MOCK } from '../../../../../core/config/useMock.config';
import { CustomerFlashSaleApiRepo } from '../repo/customerFlashSaleApi.repo';
import { CustomerFlashSaleMockRepo } from '../repo/customerFlashSaleMock.repo';
import { ICustomerFlashSaleRepo } from '../repo/customerFlashSale.repo';

export const customerFlashSaleService: ICustomerFlashSaleRepo = USE_MOCK
    ? new CustomerFlashSaleMockRepo()
    : new CustomerFlashSaleApiRepo();
