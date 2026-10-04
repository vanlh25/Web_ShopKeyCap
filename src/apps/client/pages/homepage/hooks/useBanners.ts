import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/core/api/apiClient";
import { ApiResponse } from "@/core/api/apiResponse";
import { Banner } from "@/apps/admin/features/banners/models/banner.model";
import { USE_MOCK } from "@/core/config/useMock.config";

export const useBanners = () => {
    return useQuery({
        queryKey: ['client', 'banners'],
        queryFn: async () => {
            if (USE_MOCK) {
                // Mock banners just in case
                return [
                    {
                        id: 1,
                        title: "Khuyến mãi 1",
                        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1471&auto=format&fit=crop",
                        active: true,
                        displayOrder: 1,
                        createdAt: new Date().toISOString()
                    }
                ] as Banner[];
            }
            const res = await apiClient.get<ApiResponse<Banner[]>>('/banners');
            return res.data;
        }
    });
};
