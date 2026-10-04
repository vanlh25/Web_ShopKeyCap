import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { Category } from "../models/category.model";
import type { CategoryRepo } from "./category.repo";
import type { CreateCategoryRequest } from "../models/create-category.request";
import type { UpdateCategoryRequest } from "../models/update-category.request";

let mockCategories: Category[] = [
    { id: 1, name: "Bàn phím cơ", slug: "ban-phim-co", description: "Các loại bàn phím cơ", createdAt: "2023-01-01" },
    { id: 2, name: "Keycap", slug: "keycap", description: "Các bộ keycap", createdAt: "2023-01-02" },
    { id: 3, name: "Switch", slug: "switch", description: "Switch bàn phím cơ", createdAt: "2023-01-03" },
    { id: 4, name: "Phụ kiện", slug: "phu-kien", description: "Phụ kiện khác", createdAt: "2023-01-04" }
];

export class CategoryMockRepo implements CategoryRepo {
    async getCategories(): Promise<ApiResponse<Category[]>> {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                success: true,
                message: "Success",
                data: mockCategories,
            }), 500);
        });
    }

    async getCategoryById(id: number): Promise<ApiResponse<Category>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const cat = mockCategories.find(c => c.id === id);
                if (cat) resolve({ success: true, message: "Success", data: cat });
                else reject(new Error("Not found"));
            }, 300);
        });
    }

    async createCategory(request: CreateCategoryRequest): Promise<ApiResponse<Category>> {
        return new Promise(resolve => {
            setTimeout(() => {
                const newCat: Category = {
                    id: mockCategories.length + 1,
                    ...request,
                    createdAt: new Date().toISOString()
                };
                mockCategories.push(newCat);
                resolve({ success: true, message: "Created", data: newCat });
            }, 500);
        });
    }

    async updateCategory(id: number, request: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = mockCategories.findIndex(c => c.id === id);
                if (idx !== -1) {
                    mockCategories[idx] = { ...mockCategories[idx], ...request };
                    resolve({ success: true, message: "Updated", data: mockCategories[idx] });
                } else {
                    reject(new Error("Not found"));
                }
            }, 500);
        });
    }

    async deleteCategory(id: number): Promise<ApiResponse<void>> {
        return new Promise(resolve => {
            setTimeout(() => {
                mockCategories = mockCategories.filter(c => c.id !== id);
                resolve({ success: true, message: "Deleted", data: undefined as void });
            }, 500);
        });
    }
}
