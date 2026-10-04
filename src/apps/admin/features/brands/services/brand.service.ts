import { USE_MOCK } from "../../../../../core/config/useMock.config";
import type { BrandRepo } from "../repos/brand.repo";
import { BrandApiRepo } from "../repos/brandApi.repo";
import { BrandMockRepo } from "../repos/brandMock.repo";

export const brandService: BrandRepo = USE_MOCK ? new BrandMockRepo() : new BrandApiRepo();
