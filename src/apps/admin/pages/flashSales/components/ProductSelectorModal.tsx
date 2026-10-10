import React, { useState } from 'react';
import { X, Search, Check, AlertCircle, Layers } from 'lucide-react';
import { useProductsQuery } from '../../../features/products/hooks/queries/products.query';
import { useProductDetailQuery } from '../../../features/products/hooks/queries/productDetail.query';
import { AdminProductItem } from '../../../features/products/models/product.model';
import { ProductVariant } from '../../../../client/features/products/model/variant.model';

export interface SelectedFlashSaleItem {
    productId: number;
    productName: string;
    productThumbnail?: string;
    variantId: number;
    sku: string;
    variantAttributesSummary: string;
    originalPrice: number;
    flashSalePrice: number;
    totalSlots: number;
    userLimit: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectItems: (items: SelectedFlashSaleItem[]) => void;
    alreadySelectedVariantIds: number[];
}

export const ProductSelectorModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSelectItems,
    alreadySelectedVariantIds
}) => {
    const [search, setSearch] = useState('');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedVariantsMap, setSelectedVariantsMap] = useState<Record<number, SelectedFlashSaleItem>>({});

    const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery(1, 20, search);
    const { data: productDetail, isLoading: isLoadingDetail } = useProductDetailQuery(selectedProductId ?? 0);

    if (!isOpen) return null;

    const products: AdminProductItem[] = (productsData?.data as AdminProductItem[]) || [];
    const activeProduct = products.find(p => p.id === selectedProductId);

    const handleToggleVariant = (variant: ProductVariant) => {
        if (!activeProduct) return;

        if (alreadySelectedVariantIds.includes(variant.id)) return;

        const nextMap = { ...selectedVariantsMap };
        if (nextMap[variant.id]) {
            delete nextMap[variant.id];
        } else {
            const attrSummary = variant.attributes
                ? Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')
                : '';
            
            // Mặc định giảm 20%
            const defaultSalePrice = Math.max(1000, Math.round(variant.price * 0.8));
            const defaultSlots = Math.min(10, Math.max(1, variant.stockQuantity));

            nextMap[variant.id] = {
                productId: activeProduct.id,
                productName: activeProduct.name,
                productThumbnail: activeProduct.imageUrl,
                variantId: variant.id,
                sku: variant.sku,
                variantAttributesSummary: attrSummary,
                originalPrice: variant.price,
                flashSalePrice: defaultSalePrice,
                totalSlots: defaultSlots,
                userLimit: 1
            };
        }
        setSelectedVariantsMap(nextMap);
    };

    const handleConfirm = () => {
        const items = Object.values(selectedVariantsMap);
        onSelectItems(items);
        setSelectedVariantsMap({});
        setSelectedProductId(null);
        onClose();
    };

    const selectedCount = Object.keys(selectedVariantsMap).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Chọn sản phẩm tham gia Flash Sale</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Chọn sản phẩm và biến thể SKU để đưa vào chiến dịch ưu đãi</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[400px]">
                    {/* Left: Product List */}
                    <div className="flex flex-col h-full overflow-hidden p-4">
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên sản phẩm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {isLoadingProducts ? (
                                <div className="py-10 text-center text-slate-400 text-sm">Đang tải sản phẩm...</div>
                            ) : products.length === 0 ? (
                                <div className="py-10 text-center text-slate-400 text-sm">Không tìm thấy sản phẩm nào</div>
                            ) : (
                                products.map((prod) => (
                                    <div
                                        key={prod.id}
                                        onClick={() => setSelectedProductId(prod.id)}
                                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                            selectedProductId === prod.id
                                                ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                                                : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <img
                                            src={prod.imageUrl || 'https://via.placeholder.com/60'}
                                            alt={prod.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{prod.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Giá từ: <span className="font-medium text-blue-600">{prod.minPrice.toLocaleString('vi-VN')}₫</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Variants of Selected Product */}
                    <div className="flex flex-col h-full overflow-hidden p-4 bg-slate-50/50">
                        <div className="mb-3">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600" />
                                Biến thể sản phẩm
                            </h3>
                            <p className="text-xs text-slate-500">
                                {activeProduct ? `Đang chọn: ${activeProduct.name}` : 'Vui lòng chọn 1 sản phẩm ở danh sách bên trái'}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {!selectedProductId ? (
                                <div className="py-14 text-center text-slate-400 text-sm">
                                    ← Nhấp vào sản phẩm ở cột bên trái để xem các biến thể SKU
                                </div>
                            ) : isLoadingDetail ? (
                                <div className="py-14 text-center text-slate-400 text-sm">Đang tải biến thể...</div>
                            ) : !productDetail?.data?.variants || productDetail.data.variants.length === 0 ? (
                                <div className="py-14 text-center text-slate-400 text-sm">Sản phẩm này chưa có biến thể</div>
                            ) : (
                                productDetail.data.variants.map((v) => {
                                    const isAlreadyInSale = alreadySelectedVariantIds.includes(v.id);
                                    const isSelectedInModal = !!selectedVariantsMap[v.id];

                                    return (
                                        <div
                                            key={v.id}
                                            onClick={() => !isAlreadyInSale && handleToggleVariant(v)}
                                            className={`p-3 rounded-xl border transition-all ${
                                                isAlreadyInSale
                                                    ? 'bg-slate-100/80 border-slate-200 opacity-60 cursor-not-allowed'
                                                    : isSelectedInModal
                                                    ? 'bg-blue-50/90 border-blue-500 cursor-pointer shadow-xs'
                                                    : 'bg-white border-slate-200 hover:border-blue-300 cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                                            {v.sku}
                                                        </span>
                                                        {isAlreadyInSale && (
                                                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                                                Đã có trong sale
                                                            </span>
                                                        )}
                                                    </div>
                                                    {v.attributes && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(' | ')}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                                        <span className="text-slate-600">
                                                            Giá gốc: <strong className="text-slate-900">{v.price.toLocaleString('vi-VN')}₫</strong>
                                                        </span>
                                                        <span className="text-slate-600">
                                                            Tồn kho: <strong className={v.stockQuantity > 0 ? 'text-emerald-600' : 'text-red-500'}>{v.stockQuantity}</strong>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 pt-0.5">
                                                    <div
                                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                                            isSelectedInModal
                                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                                : 'border-slate-300 bg-white'
                                                        }`}
                                                    >
                                                        {isSelectedInModal && <Check className="w-3.5 h-3.5" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        Đã chọn <strong>{selectedCount}</strong> biến thể
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedCount === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                        >
                            Thêm {selectedCount > 0 ? `(${selectedCount})` : ''} vào chiến dịch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
