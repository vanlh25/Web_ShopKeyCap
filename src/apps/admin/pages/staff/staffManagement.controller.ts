import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStaffsQuery } from "../../features/staff/hooks/queries/staffs.query";
import { staffKeys } from "../../features/staff/hooks/staff.keys";
import { useStaffDetailQuery } from "../../features/staff/hooks/queries/staffDetail.query";
import { useCreateStaffMutation } from "../../features/staff/hooks/mutations/createStaff.mutation";
import { useUpdateStaffMutation } from "../../features/staff/hooks/mutations/updateStaff.mutation";
import { useDeleteStaffMutation } from "../../features/staff/hooks/mutations/deleteStaff.mutation";
import { staffService } from "../../features/staff/services/staff.service";
import type { CreateStaffRequest } from "../../features/staff/models/create-staff.request";
import type { UpdateStaffRequest } from "../../features/staff/models/update-staff.request";
import { useToastStore } from "../../../../core/store/useToastStore";

export const useStaffManagementController = () => {
    // List state
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [search, setSearch] = useState("");

    // Selection state
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; title: string; message: string; onConfirm: () => void} | null>(null);

    const queryClient = useQueryClient();

    // Queries
    const { 
        data: staffsData, 
        isLoading: isStaffsLoading, 
        isError: isStaffsError 
    } = useStaffsQuery(page, limit, search);

    const { 
        data: selectedStaffData, 
        isLoading: isDetailLoading 
    } = useStaffDetailQuery(selectedStaffId!);

    // Mutations
    const createMutation = useCreateStaffMutation();
    const updateMutation = useUpdateStaffMutation();
    const deleteMutation = useDeleteStaffMutation();

    // Toasts
    const addToast = useToastStore((state) => state.addToast);

    // Handlers
    const handleSearch = (term: string) => {
        setSearch(term);
        setPage(1);
        setSelectedIds(new Set());
    };

    const handleSelectStaff = (id: number) => {
        setSelectedStaffId(id);
    };

    const handleClosePanel = () => {
        setSelectedStaffId(null);
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleOpenEdit = () => {
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateStaff = async (data: CreateStaffRequest) => {
        try {
            const response = await createMutation.mutateAsync(data);
            handleCloseModal();
            addToast("Tạo nhân viên thành công", "success");
            
            if (response.data) {
                queryClient.setQueriesData({ queryKey: staffKeys.lists() }, (oldData: any) => {
                    if (!oldData || !oldData.data) return oldData;
                    return {
                        ...oldData,
                        data: [response.data, ...oldData.data]
                    };
                });
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Đã xảy ra lỗi khi tạo nhân viên';
            addToast(msg, "error");
            console.error("Failed to create staff", error);
        }
    };

    const handleUpdateStaff = async (data: UpdateStaffRequest) => {
        try {
            const response = await updateMutation.mutateAsync(data);
            handleCloseModal();
            addToast("Cập nhật nhân viên thành công", "success");
            
            if (response.data) {
                queryClient.setQueriesData({ queryKey: staffKeys.lists() }, (oldData: any) => {
                    if (!oldData || !oldData.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((item: any) => item.id === response.data.id ? response.data : item)
                    };
                });
                queryClient.setQueryData(staffKeys.detail(response.data.id), (oldDetail: any) => {
                    if (!oldDetail) return oldDetail;
                    return {
                        ...oldDetail,
                        data: response.data
                    };
                });
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật nhân viên';
            addToast(msg, "error");
            console.error("Failed to update staff", error);
        }
    };

    const handleDeleteStaff = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xóa nhân viên',
            message: 'Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.',
            onConfirm: async () => {
                try {
                    await deleteMutation.mutateAsync(id);
                    addToast("Xóa nhân viên thành công", "success");
                    
                    queryClient.setQueriesData({ queryKey: staffKeys.lists() }, (oldData: any) => {
                        if (!oldData || !oldData.data) return oldData;
                        return {
                            ...oldData,
                            data: oldData.data.filter((item: any) => item.id !== id)
                        };
                    });
                    queryClient.removeQueries({ queryKey: staffKeys.detail(id) });

                    if (selectedStaffId === id) {
                        setSelectedStaffId(null);
                    }
                    setConfirmModal(null);
                } catch (error: any) {
                    const msg = error?.response?.data?.message || 'Đã xảy ra lỗi khi xóa nhân viên';
                    addToast(msg, "error");
                    console.error("Failed to delete staff", error);
                }
            }
        });
    };

    const currentStaffs = staffsData?.data || [];
    const allSelected = currentStaffs.length > 0 && currentStaffs.every(s => selectedIds.has(s.id));

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(currentStaffs.map(s => s.id)));
        }
    };

    const handleBulkDelete = async () => {
        const ids = [...selectedIds];
        if (ids.length === 0) return;
        if (!confirm(`Bạn có chắc chắn muốn xóa ${ids.length} nhân viên đã chọn không?`)) return;

        setIsBulkDeleting(true);
        const results = await Promise.allSettled(ids.map(id => staffService.deleteStaff(id)));
        setIsBulkDeleting(false);

        const succeededIds: number[] = [];
        let failedCount = 0;

        results.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                succeededIds.push(ids[index]);
            } else {
                failedCount++;
            }
        });

        if (succeededIds.length > 0) {
            const succeededSet = new Set(succeededIds);
            queryClient.setQueriesData({ queryKey: staffKeys.lists() }, (oldData: any) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((item: any) => !succeededSet.has(item.id))
                };
            });
            succeededIds.forEach(id => {
                queryClient.removeQueries({ queryKey: staffKeys.detail(id) });
            });
            if (selectedStaffId && succeededSet.has(selectedStaffId)) {
                setSelectedStaffId(null);
            }
        }

        setSelectedIds(new Set());

        if (failedCount === 0) {
            addToast(`Đã xóa ${succeededIds.length} nhân viên thành công`, 'success');
        } else if (succeededIds.length > 0) {
            addToast(`Xóa thành công ${succeededIds.length} nhân viên, thất bại ${failedCount}`, 'error');
        } else {
            addToast('Không thể xóa các nhân viên đã chọn', 'error');
        }
    };

    return {
        // State
        page,
        setPage,
        search,
        selectedStaffId,
        selectedIds,
        allSelected,
        isBulkDeleting,
        isModalOpen,
        modalMode,
        
        // Data
        staffs: currentStaffs,
        pagination: staffsData?.pagination,
        selectedStaff: selectedStaffData?.data,
        isStaffsLoading,
        isStaffsError,
        isDetailLoading,

        // Mutation states
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Handlers
        handleSearch,
        handleSelectStaff,
        handleClosePanel,
        handleOpenCreate,
        handleOpenEdit,
        handleCloseModal,
        handleCreateStaff,
        handleUpdateStaff,
        handleDeleteStaff,
        handleToggleSelect,
        handleSelectAll,
        handleBulkDelete,
        
        // Confirm Modal
        confirmModal,
        setConfirmModal
    };
};
