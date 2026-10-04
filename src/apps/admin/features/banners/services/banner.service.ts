import { USE_MOCK } from '../../../../../core/config/useMock.config';
import { BannerApiRepo } from '../repo/bannerApi.repo';
import { BannerMockRepo } from '../repo/bannerMock.repo';
import { IBannerRepo } from '../repo/banner.repo';

export const bannerService: IBannerRepo = USE_MOCK ? new BannerMockRepo() : new BannerApiRepo();
