import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCategoriesQuery } from "../../features/categories/hooks/queries/categories.query";
import { categoryKeys } from "../../features/categories/hooks/categories.keys";
import { useCreateCategoryMutation } from "../../features/categories/hooks/mutations/createCategory.mutation";
import { useUpdateCategoryMutation } from "../../features/categories/hooks/mutations/updateCategory.mutation";
import { useDeleteCategoryMutation } from "../../features/categories/hooks/mutations/deleteCategory.mutation";
import type { CreateCategoryRequest } from "../../features/categories/models/create-category.request";
import type { UpdateCategoryRequest } from "../../features/categories/models/update-category.request";
import { useToastStore } from "../../../../core/store/useToastStore";
import { Category } from "../../features/categories/models/category.model";

export const useCategoryManagementController = () => {
    // List state
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Queries
    const { 
        data: categoriesData, 
        isLoading: isCategoriesLoading, 
        isError: isCategoriesError 
    } = useCategoriesQuery();

    const categories = categoriesData?.data || [];
    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.slug.toLowerCase().includes(search.toLowerCase())
    );

    // Mutations
    const createMutation = useCreateCategoryMutation();
    const updateMutation = useUpdateCategoryMutation();
    const deleteMutation = useDeleteCategoryMutation();

    // Toasts
    const addToast = useToastStore((state) => state.addToast);

    // Handlers
    const handleSearch = (term: string) => {
        setSearch(term);
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        setModalMode('edit');
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleCreateCategory = async (data: CreateCategoryRequest) => {
        try {
            await createMutation.mutateAsync(data);
            handleCloseModal();
            addToast("Tạo danh mục thành công", "success");
        } catch (error: any) {
            addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi tạo danh mục", "error");
        }
    };

    const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
        if (!selectedCategory) return;
        try {
            await updateMutation.mutateAsync({ id: selectedCategory.id, request: data });
            handleCloseModal();
            addToast("Cập nhật danh mục thành công", "success");
        } catch (error: any) {
            addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật danh mục", "error");
        }
    };

    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; title: string; message: string; onConfirm: () => void} | null>(null);

    const handleDeleteCategory = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xóa danh mục',
            message: 'Bạn có chắc chắn muốn xóa danh mục này không? Thao tác này không thể hoàn tác.',
            onConfirm: async () => {
                try {
                    await deleteMutation.mutateAsync(id);
                    setConfirmModal(null);
                    addToast("Xóa danh mục thành công", "success");
                } catch (error: any) {
                    addToast(error?.response?.data?.message || "Đã xảy ra lỗi khi xóa danh mục", "error");
                }
            }
        });
    };

    return {
        // State
        search,
        isModalOpen,
        modalMode,
        selectedCategory,
        
        // Data
        categories: filteredCategories,
        isCategoriesLoading,
        isCategoriesError,

        // Mutation states
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Handlers
        handleSearch,
        handleOpenCreate,
        handleOpenEdit,
        handleCloseModal,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,

        // Modal
        confirmModal,
        setConfirmModal
    };
};
