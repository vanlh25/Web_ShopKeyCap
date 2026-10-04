import { apiClient } from '@/core/api/apiClient';
import { ApiResponse } from '@/core/api/apiResponse';
import { IBannerRepo } from './banner.repo';
import { Banner } from '../models/banner.model';
import { CreateBannerRequest } from '../models/create-banner.request';
import { UpdateBannerRequest } from '../models/update-banner.request';

export class BannerApiRepo implements IBannerRepo {
  async getBanners(): Promise<ApiResponse<Banner[]>> {
    return apiClient.get<ApiResponse<Banner[]>>('/admin/banners');
  }

  async getBannerById(id: number): Promise<ApiResponse<Banner>> {
    return apiClient.get<ApiResponse<Banner>>(`/admin/banners/${id}`);
  }

  async createBanner(request: CreateBannerRequest): Promise<ApiResponse<Banner>> {
    return apiClient.post<ApiResponse<Banner>>('/admin/banners', request);
  }

  async updateBanner(id: number, request: UpdateBannerRequest): Promise<ApiResponse<Banner>> {
    return apiClient.patch<ApiResponse<Banner>>(`/admin/banners/${id}`, request);
  }

  async deleteBanner(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/admin/banners/${id}`);
  }
}
