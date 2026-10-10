import { ApiResponse } from '@/core/api/apiResponse';
import { ICustomerFlashSaleRepo } from './customerFlashSale.repo';
import {
    CustomerActiveFlashSale,
    CustomerFlashSaleProductItem,
    CustomerTimeSlot
} from '../models/flashSaleShopping.model';

export class CustomerFlashSaleMockRepo implements ICustomerFlashSaleRepo {
    private sampleItems: CustomerFlashSaleProductItem[] = [
        {
            productId: 1,
            productName: 'Bàn phím cơ MonsGeek M1 V3 QMK',
            slug: 'monsgeek-m1-v3',
            thumbnailUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
            variantId: 1,
            sku: 'MG-M1V3-BLK',
            variantAttributes: 'Màu: Đen, Switch: V3 Cream Yellow',
            originalPrice: 2490000,
            flashSalePrice: 1890000,
            discountPercent: 24,
            totalSlots: 20,
            soldSlots: 15,
            percentSold: 75,
            userLimit: 1,
            isSoldOut: false,
            isHot: true
        },
        {
            productId: 2,
            productName: 'Keycap Cherry PBT Dye-sub Botanical',
            slug: 'keycap-botanical-pbt',
            thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
            variantId: 4,
            sku: 'KC-BOTANICAL-BASE',
            variantAttributes: 'Base Kit 142 phím',
            originalPrice: 650000,
            flashSalePrice: 450000,
            discountPercent: 31,
            totalSlots: 50,
            soldSlots: 46,
            percentSold: 92,
            userLimit: 2,
            isSoldOut: false,
            isHot: true
        },
        {
            productId: 3,
            productName: 'Switch Gateron Oil King Tuyển Chọn',
            slug: 'switch-gateron-oil-king',
            thumbnailUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500',
            variantId: 7,
            sku: 'SW-OILKING-70PCS',
            variantAttributes: 'Gói 70 Switch',
            originalPrice: 840000,
            flashSalePrice: 620000,
            discountPercent: 26,
            totalSlots: 30,
            soldSlots: 8,
            percentSold: 27,
            userLimit: 1,
            isSoldOut: false,
            isHot: false
        },
        {
            productId: 4,
            productName: 'Bàn phím cơ không dây NuPhy Air75 V2',
            slug: 'nuphy-air75-v2',
            thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
            variantId: 10,
            sku: 'NUPHY-AIR75-WHITE',
            variantAttributes: 'Màu: Trắng, Cowberry Switch',
            originalPrice: 2890000,
            flashSalePrice: 2190000,
            discountPercent: 24,
            totalSlots: 15,
            soldSlots: 15,
            percentSold: 100,
            userLimit: 1,
            isSoldOut: true,
            isHot: false
        }
    ];

    async getActiveFlashSale(): Promise<ApiResponse<CustomerActiveFlashSale>> {
        const currentSlot: CustomerTimeSlot = {
            flashSaleId: 1,
            name: 'Flash Sale Giữa Tháng 10',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            endTime: new Date(Date.now() + 7200000).toISOString(),
            status: 'ACTIVE',
            remainingSeconds: 7200,
            items: this.sampleItems
        };

        const upcomingSlots: CustomerTimeSlot[] = [
            {
                flashSaleId: 2,
                name: 'Flash Sale Khung Giờ 12H Trưa',
                startTime: new Date(Date.now() + 18000000).toISOString(),
                endTime: new Date(Date.now() + 25200000).toISOString(),
                status: 'UPCOMING',
                remainingSeconds: 18000,
                items: this.sampleItems.slice(0, 2)
            },
            {
                flashSaleId: 3,
                name: 'Siêu Sale Đêm Muộn 20H',
                startTime: new Date(Date.now() + 46800000).toISOString(),
                endTime: new Date(Date.now() + 57600000).toISOString(),
                status: 'UPCOMING',
                remainingSeconds: 46800,
                items: this.sampleItems.slice(2)
            }
        ];

        return {
            success: true,
            message: 'Mock active flash sale success',
            data: {
                currentSlot,
                activeSlots: [currentSlot],
                upcomingSlots
            }
        };
    }

    async getUpcomingSlots(): Promise<ApiResponse<CustomerTimeSlot[]>> {
        const slots: CustomerTimeSlot[] = [
            {
                flashSaleId: 2,
                name: 'Flash Sale Khung Giờ 12H Trưa',
                startTime: new Date(Date.now() + 18000000).toISOString(),
                endTime: new Date(Date.now() + 25200000).toISOString(),
                status: 'UPCOMING',
                remainingSeconds: 18000,
                items: this.sampleItems.slice(0, 2)
            }
        ];
        return {
            success: true,
            message: 'Mock upcoming slots success',
            data: slots
        };
    }

    async getFlashSaleById(id: number): Promise<ApiResponse<CustomerTimeSlot>> {
        const slot: CustomerTimeSlot = {
            flashSaleId: id,
            name: `Flash Sale Khung Giờ #${id}`,
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 10800000).toISOString(),
            status: 'ACTIVE',
            remainingSeconds: 10800,
            items: this.sampleItems
        };
        return {
            success: true,
            message: 'Mock slot detail success',
            data: slot
        };
    }

    async getVariantFlashSale(variantId: number): Promise<ApiResponse<CustomerFlashSaleProductItem | null>> {
        const item = this.sampleItems.find(i => i.variantId === variantId);
        return {
            success: true,
            message: 'Mock variant sale success',
            data: item || null
        };
    }
}
