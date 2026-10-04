import { ApiResponse } from '@/core/api/apiResponse';
import { IBannerRepo } from './banner.repo';
import { Banner } from '../models/banner.model';
import { CreateBannerRequest } from '../models/create-banner.request';
import { UpdateBannerRequest } from '../models/update-banner.request';

let mockBanners: Banner[] = [
  {
    id: 1,
    title: 'Banner 1',
    imageUrl: 'https://example.com/banner1.jpg',
    linkUrl: '/products/keycap-1',
    displayOrder: 1,
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Banner 2',
    imageUrl: 'https://example.com/banner2.jpg',
    linkUrl: '/products/switch-1',
    displayOrder: 2,
    active: false,
    createdAt: '2023-01-02T00:00:00Z',
  },
];

export class BannerMockRepo implements IBannerRepo {
  async getBanners(): Promise<ApiResponse<Banner[]>> {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Success', data: mockBanners }), 500);
    });
  }

  async getBannerById(id: number): Promise<ApiResponse<Banner>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const banner = mockBanners.find(b => b.id === id);
        if (banner) resolve({ success: true, message: 'Success', data: banner });
        else reject(new Error('Not found'));
      }, 300);
    });
  }

  async createBanner(request: CreateBannerRequest): Promise<ApiResponse<Banner>> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newBanner: Banner = {
          id: mockBanners.length > 0 ? Math.max(...mockBanners.map(b => b.id)) + 1 : 1,
          ...request,
          displayOrder: request.displayOrder ?? (mockBanners.length + 1),
          active: request.active ?? true,
          createdAt: new Date().toISOString(),
        };
        mockBanners.push(newBanner);
        resolve({ success: true, message: 'Created', data: newBanner });
      }, 500);
    });
  }

  async updateBanner(id: number, request: UpdateBannerRequest): Promise<ApiResponse<Banner>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBanners.findIndex(b => b.id === id);
        if (index !== -1) {
          mockBanners[index] = { ...mockBanners[index], ...request };
          resolve({ success: true, message: 'Updated', data: mockBanners[index] });
        } else {
          reject(new Error('Not found'));
        }
      }, 500);
    });
  }

  async deleteBanner(id: number): Promise<ApiResponse<void>> {
    return new Promise(resolve => {
      setTimeout(() => {
        mockBanners = mockBanners.filter(b => b.id !== id);
        resolve({ success: true, message: 'Deleted', data: undefined as void });
      }, 500);
    });
  }
}
