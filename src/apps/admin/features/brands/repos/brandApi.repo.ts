import { apiClient } from "../../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { Brand } from "../models/brand.model";
import type { BrandRepo } from "./brand.repo";
import type { CreateBrandRequest } from "../models/create-brand.request";
import type { UpdateBrandRequest } from "../models/update-brand.request";

export class BrandApiRepo implements BrandRepo {
    /**
     * GET /admin/brands
     * @returns Brand[]
     */
    async getBrands(): Promise<ApiResponse<Brand[]>> {
        return apiClient.get<ApiResponse<Brand[]>>("/admin/brands");
    }

    async getBrandById(id: number): Promise<ApiResponse<Brand>> {
        return apiClient.get<ApiResponse<Brand>>(`/admin/brands/${id}`);
    }

    async createBrand(request: CreateBrandRequest): Promise<ApiResponse<Brand>> {
        return apiClient.post<ApiResponse<Brand>>("/admin/brands", request);
    }

    async updateBrand(id: number, request: UpdateBrandRequest): Promise<ApiResponse<Brand>> {
        return apiClient.patch<ApiResponse<Brand>>(`/admin/brands/${id}`, request);
    }

    async deleteBrand(id: number): Promise<ApiResponse<void>> {
        return apiClient.delete<ApiResponse<void>>(`/admin/brands/${id}`);
    }
}
