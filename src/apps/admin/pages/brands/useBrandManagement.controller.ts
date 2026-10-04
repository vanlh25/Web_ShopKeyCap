import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandsQuery } from "../../features/brands/hooks/queries/brands.query";
import { brandKeys } from "../../features/brands/hooks/brand.keys";
import { useCreateBrandMutation } from "../../features/brands/hooks/mutations/createBrand.mutation";
import { useUpdateBrandMutation } from "../../features/brands/hooks/mutations/updateBrand.mutation";
import { useDeleteBrandMutation } from "../../features/brands/hooks/mutations/deleteBrand.mutation";
import type { CreateBrandRequest } from "../../features/brands/models/create-brand.request";
import type { UpdateBrandRequest } from "../../features/brands/models/update-brand.request";
import { useToastStore } from "../../../../core/store/useToastStore";
import { Brand } from "../../features/brands/models/brand.model";

export const useBrandManagementController = () => {
    // List state
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

    // Queries
    const { 
        data: brandsData, 
        isLoading: isBrandsLoading, 
        isError: isBrandsError 
    } = useBrandsQuery();

    const brands = brandsData?.data || [];
    const filteredBrands = brands.filter(b => 
        b.name.toLowerCase().includes(search.toLowerCase()) || 
        b.slug.toLowerCase().includes(search.toLowerCase())
    );

    // Mutations
    const createMutation = useCreateBrandMutation();
    const updateMutation = useUpdateBrandMutation();
    const deleteMutation = useDeleteBrandMutation();

    // Toasts
    const addToast = useToastStore((state) => state.addToast);

    // Handlers
    const handleSearch = (term: string) => {
        setSearch(term);
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setSelectedBrand(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (brand: Brand) => {
        setModalMode('edit');
        setSelectedBrand(brand);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBrand(null);
    };

    const handleCreateBrand = async (data: CreateBrandRequest) => {
        try {
            await createMutation.mutateAsync(data);
            handleCloseModal();
            addToast("Tạo thương hiệu thành công", "success");
        } catch (error: any) {
            addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi tạo thương hiệu", "error");
        }
    };

    const handleUpdateBrand = async (data: UpdateBrandRequest) => {
        if (!selectedBrand) return;
        try {
            await updateMutation.mutateAsync({ id: selectedBrand.id, request: data });
            handleCloseModal();
            addToast("Cập nhật thương hiệu thành công", "success");
        } catch (error: any) {
            addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thương hiệu", "error");
        }
    };

    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; title: string; message: string; onConfirm: () => void} | null>(null);

    const handleDeleteBrand = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xóa thương hiệu',
            message: 'Bạn có chắc chắn muốn xóa thương hiệu này không? Thao tác này không thể hoàn tác.',
            onConfirm: async () => {
                try {
                    await deleteMutation.mutateAsync(id);
                    setConfirmModal(null);
                    addToast("Xóa thương hiệu thành công", "success");
                } catch (error: any) {
                    addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi xóa thương hiệu", "error");
                }
            }
        });
    };

    return {
        // State
        search,
        isModalOpen,
        modalMode,
        selectedBrand,
        
        // Data
        brands: filteredBrands,
        isBrandsLoading,
        isBrandsError,

        // Mutation states
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Handlers
        handleSearch,
        handleOpenCreate,
        handleOpenEdit,
        handleCloseModal,
        handleCreateBrand,
        handleUpdateBrand,
        handleDeleteBrand,

        // Modal
        confirmModal,
        setConfirmModal
    };
};
