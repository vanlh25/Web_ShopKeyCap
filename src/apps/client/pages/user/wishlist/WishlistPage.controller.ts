import { useState } from 'react';
import { useFavoritesQuery } from '../../../features/favorite/hooks/queries/useFavorites.query';
import { useRemoveFavoriteMutation } from '../../../features/favorite/hooks/mutations/useRemoveFavorite.mutation';
import { useMoveToCartMutation } from '../../../features/favorite/hooks/mutations/useMoveToCart.mutation';
import { useToastStore } from '../../../../../core/store/useToastStore';

export const useWishlistPageController = () => {
    const [page, setPage] = useState<number>(1);
    const [movingId, setMovingId] = useState<number | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const toast = useToastStore((state) => state.addToast);

    const { data, isLoading, error } = useFavoritesQuery(page, 12);
    const removeMutation = useRemoveFavoriteMutation();
    const moveToCartMutation = useMoveToCartMutation();

    const favorites = data?.data || [];
    const pagination = data?.pagination;

    const handleRemove = async (productId: number) => {
        try {
            setRemovingId(productId);
            await removeMutation.mutateAsync(productId);
            toast('Đã xóa sản phẩm khỏi danh sách yêu thích', 'success');
        } catch (err: any) {
            toast(err.message || 'Không thể xóa sản phẩm', 'error');
        } finally {
            setRemovingId(null);
        }
    };

    const handleMoveToCart = async (productId: number) => {
        try {
            setMovingId(productId);
            await moveToCartMutation.mutateAsync({ productId, quantity: 1 });
            toast('Đã chuyển sản phẩm vào giỏ hàng thành công', 'success');
        } catch (err: any) {
            toast(err.message || 'Không thể chuyển sản phẩm vào giỏ hàng', 'error');
        } finally {
            setMovingId(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return {
        favorites,
        pagination,
        isLoading,
        error: error ? (error as Error).message : null,
        movingId,
        removingId,
        page,
        handleRemove,
        handleMoveToCart,
        handlePageChange,
    };
};
