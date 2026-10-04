import type { ApiResponse } from "../../../../../core/api/apiResponse";
import type { Brand } from "../models/brand.model";
import type { BrandRepo } from "./brand.repo";
import type { CreateBrandRequest } from "../models/create-brand.request";
import type { UpdateBrandRequest } from "../models/update-brand.request";

let mockBrands: Brand[] = [
    { id: 1, name: "Akko", slug: "akko", description: "Hãng Akko", createdAt: "2023-01-01" },
    { id: 2, name: "Logitech", slug: "logitech", description: "Hãng Logitech", createdAt: "2023-01-02" },
    { id: 3, name: "Razer", slug: "razer", description: "Hãng Razer", createdAt: "2023-01-03" },
    { id: 4, name: "Corsair", slug: "corsair", description: "Hãng Corsair", createdAt: "2023-01-04" }
];

export class BrandMockRepo implements BrandRepo {
    async getBrands(): Promise<ApiResponse<Brand[]>> {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                success: true,
                message: "Success",
                data: mockBrands,
            }), 500);
        });
    }

    async getBrandById(id: number): Promise<ApiResponse<Brand>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const b = mockBrands.find(c => c.id === id);
                if (b) resolve({ success: true, message: "Success", data: b });
                else reject(new Error("Not found"));
            }, 300);
        });
    }

    async createBrand(request: CreateBrandRequest): Promise<ApiResponse<Brand>> {
        return new Promise(resolve => {
            setTimeout(() => {
                const newBrand: Brand = {
                    id: mockBrands.length + 1,
                    ...request,
                    createdAt: new Date().toISOString()
                };
                mockBrands.push(newBrand);
                resolve({ success: true, message: "Created", data: newBrand });
            }, 500);
        });
    }

    async updateBrand(id: number, request: UpdateBrandRequest): Promise<ApiResponse<Brand>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const idx = mockBrands.findIndex(c => c.id === id);
                if (idx !== -1) {
                    mockBrands[idx] = { ...mockBrands[idx], ...request };
                    resolve({ success: true, message: "Updated", data: mockBrands[idx] });
                } else {
                    reject(new Error("Not found"));
                }
            }, 500);
        });
    }

    async deleteBrand(id: number): Promise<ApiResponse<void>> {
        return new Promise(resolve => {
            setTimeout(() => {
                mockBrands = mockBrands.filter(c => c.id !== id);
                resolve({ success: true, message: "Deleted", data: undefined as void });
            }, 500);
        });
    }
}
