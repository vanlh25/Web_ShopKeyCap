import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { Brand } from "../models/brand.model";
import type { CreateBrandRequest } from "../models/create-brand.request";
import type { UpdateBrandRequest } from "../models/update-brand.request";

export interface BrandRepo {
    getBrands(): Promise<ApiResponse<Brand[]>>;
    getBrandById(id: number): Promise<ApiResponse<Brand>>;
    createBrand(request: CreateBrandRequest): Promise<ApiResponse<Brand>>;
    updateBrand(id: number, request: UpdateBrandRequest): Promise<ApiResponse<Brand>>;
    deleteBrand(id: number): Promise<ApiResponse<void>>;
}
