import { ApiResponse } from '@/core/api/apiResponse';
import {
    CustomerActiveFlashSale,
    CustomerFlashSaleProductItem,
    CustomerTimeSlot
} from '../models/flashSaleShopping.model';

export interface ICustomerFlashSaleRepo {
    getActiveFlashSale(): Promise<ApiResponse<CustomerActiveFlashSale>>;
    getUpcomingSlots(): Promise<ApiResponse<CustomerTimeSlot[]>>;
    getFlashSaleById(id: number): Promise<ApiResponse<CustomerTimeSlot>>;
    getVariantFlashSale(variantId: number): Promise<ApiResponse<CustomerFlashSaleProductItem | null>>;
}
