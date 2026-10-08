import { USE_MOCK } from '../../../../../core/config/useMock.config';
import { FlashSaleApiRepo } from '../repo/flashSaleApi.repo';
import { FlashSaleMockRepo } from '../repo/flashSaleMock.repo';
import { IFlashSaleRepo } from '../repo/flashSale.repo';

export const flashSaleService: IFlashSaleRepo = USE_MOCK ? new FlashSaleMockRepo() : new FlashSaleApiRepo();
