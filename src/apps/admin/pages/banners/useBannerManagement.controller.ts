import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBannersQuery } from "../../features/banners/hooks/queries/banners.query";
import { bannerKeys } from "../../features/banners/hooks/banner.keys";
import { useCreateBannerMutation } from "../../features/banners/hooks/mutations/createBanner.mutation";
import { useUpdateBannerMutation } from "../../features/banners/hooks/mutations/updateBanner.mutation";
import { useDeleteBannerMutation } from "../../features/banners/hooks/mutations/deleteBanner.mutation";
import type { CreateBannerRequest } from "../../features/banners/models/create-banner.request";
import type { UpdateBannerRequest } from "../../features/banners/models/update-banner.request";
import { useToastStore } from "../../../../core/store/useToastStore";
import { Banner } from "../../features/banners/models/banner.model";

export const useBannerManagementController = () => {
    // List state
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    // Queries
    const { 
        data: bannersData, 
        isLoading: isBannersLoading, 
        isError: isBannersError 
    } = useBannersQuery();

    const banners = bannersData?.data || [];
    // Sort by display order by default
    let sortedBanners = [...banners].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const filteredBanners = sortedBanners.filter(b => 
        (b.title || "").toLowerCase().includes((search || "").toLowerCase())
    );

    // Mutations
    const createMutation = useCreateBannerMutation();
    const updateMutation = useUpdateBannerMutation();
    const deleteMutation = useDeleteBannerMutation();

    // Toasts
    const addToast = useToastStore((state) => state.addToast);

    // Handlers
    const handleSearch = (term: string) => {
        setSearch(term);
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setSelectedBanner(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (banner: Banner) => {
        setModalMode('edit');
        setSelectedBanner(banner);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBanner(null);
    };

    const handleCreateBanner = async (data: CreateBannerRequest) => {
        try {
            await createMutation.mutateAsync(data);
            handleCloseModal();
            addToast("Tạo banner thành công", "success");
        } catch (error: any) {
            addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi tạo banner", "error");
        }
    };

    const handleUpdateBanner = async (data: UpdateBannerRequest) => {
        if (!selectedBanner) return;
        try {
            await updateMutation.mutateAsync({ id: selectedBanner.id, request: data });
            handleCloseModal();
            addToast("Cập nhật banner thành công", "success");
        } catch (error: any) {
            addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật banner", "error");
        }
    };

    const handleToggleActive = async (banner: Banner) => {
        try {
            await updateMutation.mutateAsync({ 
                id: banner.id, 
                request: { active: !banner.active } 
            });
            addToast(`Đã ${!banner.active ? 'bật' : 'tắt'} banner`, "success");
        } catch (error: any) {
            addToast("Lỗi khi cập nhật trạng thái", "error");
        }
    };

    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; title: string; message: string; onConfirm: () => void} | null>(null);

    const handleDeleteBanner = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xóa banner',
            message: 'Bạn có chắc chắn muốn xóa banner này không? Thao tác này không thể hoàn tác.',
            onConfirm: async () => {
                try {
                    await deleteMutation.mutateAsync(id);
                    setConfirmModal(null);
                    addToast("Xóa banner thành công", "success");
                } catch (error: any) {
                    addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi xóa banner", "error");
                }
            }
        });
    };

    return {
        // State
        search,
        isModalOpen,
        modalMode,
        selectedBanner,
        
        // Data
        banners: filteredBanners,
        isBannersLoading,
        isBannersError,

        // Mutation states
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Handlers
        handleSearch,
        handleOpenCreate,
        handleOpenEdit,
        handleCloseModal,
        handleCreateBanner,
        handleUpdateBanner,
        handleToggleActive,
        handleDeleteBanner,

        // Modal
        confirmModal,
        setConfirmModal
    };
};
