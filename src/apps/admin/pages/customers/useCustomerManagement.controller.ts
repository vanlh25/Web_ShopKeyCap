import { useState } from "react";
import { useCustomers } from "../../features/customers/hooks/queries/customers.query";
import { useCustomerDetail } from "../../features/customers/hooks/queries/customerDetail.query";
import { useUpdateCustomer } from "../../features/customers/hooks/mutations/updateCustomer.mutation";

export const useCustomerManagementController = () => {
    // List state
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [search, setSearch] = useState("");

    // Selection state
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

    // Queries
    const { 
        data: customersData, 
        isLoading: isCustomersLoading, 
        isError: isCustomersError 
    } = useCustomers({ page, limit, search });

    const { 
        data: selectedCustomer, 
        isLoading: isDetailLoading 
    } = useCustomerDetail(selectedCustomerId!, !!selectedCustomerId);

    // Mutations
    const updateMutation = useUpdateCustomer();

    // Handlers
    const handleSearch = (term: string) => {
        setSearch(term);
        setPage(1);
    };

    const handleSelectCustomer = (id: number) => {
        setSelectedCustomerId(id);
    };

    const handleClosePanel = () => {
        setSelectedCustomerId(null);
    };

    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; title: string; message: string; onConfirm: () => void} | null>(null);

    const handleToggleLock = () => {
        if (!selectedCustomer) return;
        
        const isLocking = !selectedCustomer.locked;
        setConfirmModal({
            isOpen: true,
            title: isLocking ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
            message: `Bạn có chắc chắn muốn ${isLocking ? 'khóa' : 'mở khóa'} khách hàng này không? Khách hàng ${isLocking ? 'sẽ không thể đăng nhập' : 'có thể đăng nhập bình thường'}.`,
            onConfirm: async () => {
                try {
                    await updateMutation.mutateAsync({
                        id: selectedCustomer.id,
                        request: { locked: isLocking }
                    });
                    setConfirmModal(null);
                } catch (error) {
                    console.error("Failed to toggle customer lock status", error);
                }
            }
        });
    };

    return {
        // State
        page,
        setPage,
        search,
        selectedCustomerId,
        
        // Data
        customers: customersData?.data || [],
        pagination: customersData?.meta,
        selectedCustomer,
        isCustomersLoading,
        isCustomersError,
        isDetailLoading,

        // Mutation states
        isUpdating: updateMutation.isPending,

        // Handlers
        handleSearch,
        handleSelectCustomer,
        handleClosePanel,
        handleToggleLock,

        // Modal
        confirmModal,
        setConfirmModal
    };
};
