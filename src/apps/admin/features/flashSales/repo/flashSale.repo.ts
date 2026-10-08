import { ApiResponse } from '@/core/api/apiResponse';
import {
    CreateFlashSalePayload,
    FlashSaleDetailModel,
    FlashSaleFilterParams,
    FlashSaleItemPayload,
    FlashSaleSummaryModel,
    UpdateFlashSalePayload
} from '../models/flashSale.model';

export interface IFlashSaleRepo {
    getFlashSales(params?: FlashSaleFilterParams): Promise<ApiResponse<FlashSaleSummaryModel[]>>;
    getFlashSaleById(id: number): Promise<ApiResponse<FlashSaleDetailModel>>;
    createFlashSale(payload: CreateFlashSalePayload): Promise<ApiResponse<FlashSaleDetailModel>>;
    updateFlashSale(id: number, payload: UpdateFlashSalePayload): Promise<ApiResponse<FlashSaleDetailModel>>;
    cancelFlashSale(id: number): Promise<ApiResponse<void>>;
    addItems(id: number, items: FlashSaleItemPayload[]): Promise<ApiResponse<FlashSaleDetailModel>>;
    deleteItem(saleId: number, itemId: number): Promise<ApiResponse<void>>;
}
