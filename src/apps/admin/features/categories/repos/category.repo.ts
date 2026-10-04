import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { Category } from "../models/category.model";
import type { CreateCategoryRequest } from "../models/create-category.request";
import type { UpdateCategoryRequest } from "../models/update-category.request";

export interface CategoryRepo {
    getCategories(): Promise<ApiResponse<Category[]>>;
    getCategoryById(id: number): Promise<ApiResponse<Category>>;
    createCategory(request: CreateCategoryRequest): Promise<ApiResponse<Category>>;
    updateCategory(id: number, request: UpdateCategoryRequest): Promise<ApiResponse<Category>>;
    deleteCategory(id: number): Promise<ApiResponse<void>>;
}
