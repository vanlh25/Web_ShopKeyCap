import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrderItemModel } from '../../../../features/order/models/order.model';
import { useAddToCartMutation } from '../../../../features/cart/hooks/mutations/useAddToCart.mutation';

export const useBuyAgainViewModel = (items: OrderItemModel[]) => {
    const navigate = useNavigate();
    const addToCartMutation = useAddToCartMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // Key: item.id (order item id) — luôn unique, không phụ thuộc variantId từ backend
    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
    const [isAdding, setIsAdding] = useState(false);

    const handleBuyAgainClick = useCallback(() => {
        if (items.length === 1) {
            // Đơn hàng chỉ có 1 sản phẩm — thêm thẳng, không cần popup
            addToCartMutation.mutate(
                { variantId: items[0].variantId, quantity: 1 },
                { onSuccess: () => navigate('/cart') }
            );
        } else {
            // Nhiều sản phẩm — mở popup, mặc định tick tất cả
            setSelectedItemIds(new Set(items.map((i) => i.id)));
            setIsModalOpen(true);
        }
    }, [items, addToCartMutation, navigate]);

    // Toggle theo item.id
    const toggleItem = useCallback((itemId: number) => {
        setSelectedItemIds((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    }, []);

    const handleConfirm = useCallback(async () => {
        if (selectedItemIds.size === 0) return;
        setIsAdding(true);
        try {
            // Map item.id → item, lọc bỏ những item chưa có variantId
            const selectedItems = items.filter(
                (i) => selectedItemIds.has(i.id) && i.variantId
            );
            // Gọi song song, dùng allSettled để không bị block khi 1 item lỗi
            await Promise.allSettled(
                selectedItems.map((item) =>
                    addToCartMutation.mutateAsync({ variantId: item.variantId, quantity: 1 })
                )
            );
        } catch (e) {
            console.error('[BuyAgain] Lỗi khi thêm vào giỏ:', e);
        } finally {
            setIsAdding(false);
            setIsModalOpen(false);
            navigate('/cart');
        }
    }, [selectedItemIds, items, addToCartMutation, navigate]);


    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return {
        isModalOpen,
        selectedItemIds,
        isAdding,
        isSingleLoading: addToCartMutation.isPending && !isModalOpen,
        handleBuyAgainClick,
        toggleItem,
        handleConfirm,
        handleCloseModal,
    };
};

