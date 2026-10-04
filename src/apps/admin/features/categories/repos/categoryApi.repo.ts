import { apiClient } from "../../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { Category } from "../models/category.model";
import type { CategoryRepo } from "./category.repo";
import type { CreateCategoryRequest } from "../models/create-category.request";
import type { UpdateCategoryRequest } from "../models/update-category.request";

export class CategoryApiRepo implements CategoryRepo {
    /**
     * GET /admin/categories
     * @returns Category[]
     */
    async getCategories(): Promise<ApiResponse<Category[]>> {
        return apiClient.get<ApiResponse<Category[]>>("/admin/categories");
    }

    async getCategoryById(id: number): Promise<ApiResponse<Category>> {
        return apiClient.get<ApiResponse<Category>>(`/admin/categories/${id}`);
    }

    async createCategory(request: CreateCategoryRequest): Promise<ApiResponse<Category>> {
        return apiClient.post<ApiResponse<Category>>("/admin/categories", request);
    }

    async updateCategory(id: number, request: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
        return apiClient.patch<ApiResponse<Category>>(`/admin/categories/${id}`, request);
    }

    async deleteCategory(id: number): Promise<ApiResponse<void>> {
        return apiClient.delete<ApiResponse<void>>(`/admin/categories/${id}`);
    }
}
