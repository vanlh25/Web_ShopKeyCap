import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductsQuery } from "../../features/products/hooks/queries/products.query";
import { useDeleteProductMutation } from "../../features/products/hooks/mutations/deleteProduct.mutation";
import { useToastStore } from "../../../../core/store/useToastStore";
import { productService } from "../../features/products/services/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { productKeys } from "../../features/products/hooks/product.keys";

export const useProductListController = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const limit = 12;

    const { data: productsData, isLoading, isError, error } = useProductsQuery(page, limit, search);
    const deleteMutation = useDeleteProductMutation();
    const toast = useToastStore(state => state.addToast);
    const queryClient = useQueryClient();

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const products = productsData?.data || [];

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allSelected = products.length > 0 && products.every(p => selectedIds.has(p.id));

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(products.map(p => p.id)));
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast("Xóa sản phẩm thành công", "success");
                    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
                },
                onError: () => {
                    toast("Lỗi khi xóa sản phẩm", "error");
                }
            });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} sản phẩm đã chọn?`)) return;

        setIsBulkDeleting(true);
        const ids = [...selectedIds];
        const results = await Promise.allSettled(ids.map(id => productService.deleteProduct(id)));
        setIsBulkDeleting(false);

        const failed = results.filter(r => r.status === 'rejected').length;
        const succeeded = results.length - failed;

        if (succeeded > 0) queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        setSelectedIds(new Set());

        if (failed === 0) {
            toast(`Đã xóa ${succeeded} sản phẩm thành công`, "success");
        } else {
            toast(`Xóa ${succeeded} thành công, ${failed} thất bại`, "error");
        }
    };

    const handlePageChange = (newPage: number) => {
        searchParams.set('page', newPage.toString());
        setSearchParams(searchParams);
        setSelectedIds(new Set());
    };

    const handleSearch = (newSearch: string) => {
        if (newSearch) {
            searchParams.set('search', newSearch);
        } else {
            searchParams.delete('search');
        }
        searchParams.set('page', '1');
        setSearchParams(searchParams);
        setSelectedIds(new Set());
    };

    return {
        products,
        pagination: productsData?.pagination,
        isLoading,
        isError,
        error,
        page,
        search,
        handlePageChange,
        handleSearch,
        handleDelete,
        isDeleting: deleteMutation.isPending,
        selectedIds,
        allSelected,
        handleToggleSelect,
        handleSelectAll,
        handleBulkDelete,
        isBulkDeleting,
    };
};
