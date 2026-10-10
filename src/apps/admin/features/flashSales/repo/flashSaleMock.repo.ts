import { ApiResponse } from '@/core/api/apiResponse';
import { IFlashSaleRepo } from './flashSale.repo';
import {
    CreateFlashSalePayload,
    EFlashSaleStatus,
    FlashSaleDetailModel,
    FlashSaleFilterParams,
    FlashSaleItemModel,
    FlashSaleItemPayload,
    FlashSaleSummaryModel,
    UpdateFlashSalePayload
} from '../models/flashSale.model';

export class FlashSaleMockRepo implements IFlashSaleRepo {
    private sales: FlashSaleDetailModel[] = [
        {
            id: 1,
            name: 'Flash Sale Giữa Tháng 10',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            endTime: new Date(Date.now() + 86400000).toISOString(),
            status: EFlashSaleStatus.ACTIVE,
            items: [
                {
                    id: 101,
                    productId: 1,
                    productName: 'Bàn phím cơ MonsGeek M1 V3 QMK',
                    productThumbnail: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=300',
                    variantId: 1,
                    sku: 'MG-M1V3-BLK',
                    variantAttributesSummary: 'Màu: Đen, Switch: V3 Cream Yellow',
                    originalPrice: 2490000,
                    flashSalePrice: 1890000,
                    discountPercent: 24,
                    totalSlots: 20,
                    soldSlots: 14,
                    userLimit: 1
                },
                {
                    id: 102,
                    productId: 2,
                    productName: 'Keycap Cherry PBT Dye-sub Botanical',
                    productThumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300',
                    variantId: 4,
                    sku: 'KC-BOTANICAL-BASE',
                    variantAttributesSummary: 'Base Kit 142 phím',
                    originalPrice: 650000,
                    flashSalePrice: 450000,
                    discountPercent: 31,
                    totalSlots: 50,
                    soldSlots: 23,
                    userLimit: 2
                }
            ]
        },
        {
            id: 2,
            name: 'Siêu Sale Cuối Tuần Keycap & Switch',
            startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
            endTime: new Date(Date.now() + 86400000 * 4).toISOString(),
            status: EFlashSaleStatus.UPCOMING,
            items: [
                {
                    id: 103,
                    productId: 3,
                    productName: 'Switch Gateron Oil King Tuyển Chọn',
                    productThumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300',
                    variantId: 7,
                    sku: 'SW-OILKING-70PCS',
                    variantAttributesSummary: 'Gói 70 Switch',
                    originalPrice: 840000,
                    flashSalePrice: 620000,
                    discountPercent: 26,
                    totalSlots: 30,
                    soldSlots: 0,
                    userLimit: 1
                }
            ]
        }
    ];

    async getFlashSales(params?: FlashSaleFilterParams): Promise<ApiResponse<FlashSaleSummaryModel[]>> {
        let filtered = [...this.sales];

        if (params?.search) {
            const query = params.search.toLowerCase();
            filtered = filtered.filter(s => s.name.toLowerCase().includes(query));
        }

        if (params?.status) {
            filtered = filtered.filter(s => s.status === params.status);
        }

        const summaries: FlashSaleSummaryModel[] = filtered.map(s => ({
            id: s.id,
            name: s.name,
            startTime: s.startTime,
            endTime: s.endTime,
            status: s.status,
            totalItems: s.items.length,
            totalSlots: s.items.reduce((sum, i) => sum + i.totalSlots, 0),
            soldSlots: s.items.reduce((sum, i) => sum + i.soldSlots, 0)
        }));

        return {
            success: true,
            message: 'Mock list success',
            data: summaries,
            pagination: {
                currentPage: params?.page ?? 1,
                pageSize: params?.limit ?? 20,
                totalItems: summaries.length,
                totalPages: 1
            }
        };
    }

    async getFlashSaleById(id: number): Promise<ApiResponse<FlashSaleDetailModel>> {
        const found = this.sales.find(s => s.id === id);
        if (!found) {
            throw new Error(`Không tìm thấy Flash Sale ID: ${id}`);
        }
        return {
            success: true,
            message: 'Mock detail success',
            data: found
        };
    }

    async createFlashSale(payload: CreateFlashSalePayload): Promise<ApiResponse<FlashSaleDetailModel>> {
        const newSale: FlashSaleDetailModel = {
            id: Date.now(),
            name: payload.name,
            startTime: payload.startTime,
            endTime: payload.endTime,
            status: new Date(payload.startTime) <= new Date() ? EFlashSaleStatus.ACTIVE : EFlashSaleStatus.UPCOMING,
            items: []
        };
        this.sales.unshift(newSale);
        return {
            success: true,
            message: 'Mock create success',
            data: newSale
        };
    }

    async updateFlashSale(id: number, payload: UpdateFlashSalePayload): Promise<ApiResponse<FlashSaleDetailModel>> {
        const found = this.sales.find(s => s.id === id);
        if (!found) throw new Error(`Không tìm thấy Flash Sale ID: ${id}`);

        found.name = payload.name;
        found.startTime = payload.startTime;
        found.endTime = payload.endTime;
        if (payload.status) found.status = payload.status;

        return {
            success: true,
            message: 'Mock update success',
            data: found
        };
    }

    async cancelFlashSale(id: number): Promise<ApiResponse<void>> {
        const found = this.sales.find(s => s.id === id);
        if (found) {
            found.status = EFlashSaleStatus.CANCELLED;
        }
        return {
            success: true,
            message: 'Mock cancel success',
            data: undefined
        };
    }

    async addItems(id: number, items: FlashSaleItemPayload[]): Promise<ApiResponse<FlashSaleDetailModel>> {
        const found = this.sales.find(s => s.id === id);
        if (!found) throw new Error(`Không tìm thấy Flash Sale ID: ${id}`);

        const newItems: FlashSaleItemModel[] = items.map((i, idx) => ({
            id: Date.now() + idx,
            productId: i.productId,
            productName: `Sản phẩm #${i.productId}`,
            variantId: i.variantId,
            sku: `SKU-${i.variantId}`,
            originalPrice: i.flashSalePrice * 1.3,
            flashSalePrice: i.flashSalePrice,
            discountPercent: 23,
            totalSlots: i.totalSlots,
            soldSlots: 0,
            userLimit: i.userLimit
        }));

        found.items.push(...newItems);
        return {
            success: true,
            message: 'Mock add items success',
            data: found
        };
    }

    async deleteItem(saleId: number, itemId: number): Promise<ApiResponse<void>> {
        const found = this.sales.find(s => s.id === saleId);
        if (found) {
            found.items = found.items.filter(i => i.id !== itemId);
        }
        return {
            success: true,
            message: 'Mock delete item success',
            data: undefined
        };
    }
}
