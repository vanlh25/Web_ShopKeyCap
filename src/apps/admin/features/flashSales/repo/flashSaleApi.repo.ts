import { apiClient } from '@/core/api/apiClient';
import { ApiResponse } from '@/core/api/apiResponse';
import { IFlashSaleRepo } from './flashSale.repo';
import {
    CreateFlashSalePayload,
    FlashSaleDetailModel,
    FlashSaleFilterParams,
    FlashSaleItemPayload,
    FlashSaleSummaryModel,
    UpdateFlashSalePayload
} from '../models/flashSale.model';

export class FlashSaleApiRepo implements IFlashSaleRepo {
    async getFlashSales(params?: FlashSaleFilterParams): Promise<ApiResponse<FlashSaleSummaryModel[]>> {
        return apiClient.get<ApiResponse<FlashSaleSummaryModel[]>>('/admin/flash-sales', {
            params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? 20,
                search: params?.search,
                status: params?.status
            }
        });
    }

    async getFlashSaleById(id: number): Promise<ApiResponse<FlashSaleDetailModel>> {
        return apiClient.get<ApiResponse<FlashSaleDetailModel>>(`/admin/flash-sales/${id}`);
    }

    async createFlashSale(payload: CreateFlashSalePayload): Promise<ApiResponse<FlashSaleDetailModel>> {
        return apiClient.post<ApiResponse<FlashSaleDetailModel>>('/admin/flash-sales', payload);
    }

    async updateFlashSale(id: number, payload: UpdateFlashSalePayload): Promise<ApiResponse<FlashSaleDetailModel>> {
        return apiClient.put<ApiResponse<FlashSaleDetailModel>>(`/admin/flash-sales/${id}`, payload);
    }

    async cancelFlashSale(id: number): Promise<ApiResponse<void>> {
        return apiClient.patch<ApiResponse<void>>(`/admin/flash-sales/${id}/cancel`);
    }

    async addItems(id: number, items: FlashSaleItemPayload[]): Promise<ApiResponse<FlashSaleDetailModel>> {
        return apiClient.post<ApiResponse<FlashSaleDetailModel>>(`/admin/flash-sales/${id}/items`, items);
    }

    async deleteItem(saleId: number, itemId: number): Promise<ApiResponse<void>> {
        return apiClient.delete<ApiResponse<void>>(`/admin/flash-sales/${saleId}/items/${itemId}`);
    }
}
