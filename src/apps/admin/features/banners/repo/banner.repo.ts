import { ApiResponse } from '@/core/api/apiResponse';
import { Banner } from '../models/banner.model';
import { CreateBannerRequest } from '../models/create-banner.request';
import { UpdateBannerRequest } from '../models/update-banner.request';

export interface IBannerRepo {
  getBanners(): Promise<ApiResponse<Banner[]>>;
  getBannerById(id: number): Promise<ApiResponse<Banner>>;
  createBanner(request: CreateBannerRequest): Promise<ApiResponse<Banner>>;
  updateBanner(id: number, request: UpdateBannerRequest): Promise<ApiResponse<Banner>>;
  deleteBanner(id: number): Promise<ApiResponse<void>>;
}
