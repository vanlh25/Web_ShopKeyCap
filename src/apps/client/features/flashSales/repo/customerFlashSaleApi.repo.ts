import { apiClient } from '@/core/api/apiClient';
import { ApiResponse } from '@/core/api/apiResponse';
import { ICustomerFlashSaleRepo } from './customerFlashSale.repo';
import {
    CustomerActiveFlashSale,
    CustomerFlashSaleProductItem,
    CustomerTimeSlot
} from '../models/flashSaleShopping.model';

export class CustomerFlashSaleApiRepo implements ICustomerFlashSaleRepo {
    async getActiveFlashSale(): Promise<ApiResponse<CustomerActiveFlashSale>> {
        return apiClient.get<ApiResponse<CustomerActiveFlashSale>>('/flash-sales/active');
    }

    async getUpcomingSlots(): Promise<ApiResponse<CustomerTimeSlot[]>> {
        return apiClient.get<ApiResponse<CustomerTimeSlot[]>>('/flash-sales/upcoming');
    }

    async getFlashSaleById(id: number): Promise<ApiResponse<CustomerTimeSlot>> {
        return apiClient.get<ApiResponse<CustomerTimeSlot>>(`/flash-sales/${id}`);
    }

    async getVariantFlashSale(variantId: number): Promise<ApiResponse<CustomerFlashSaleProductItem | null>> {
        return apiClient.get<ApiResponse<CustomerFlashSaleProductItem | null>>(`/flash-sales/variants/${variantId}/active`);
    }
}
