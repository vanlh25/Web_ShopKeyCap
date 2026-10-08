import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Zap, AlertCircle } from 'lucide-react';
import { useAdminFlashSaleDetailQuery } from '../../features/flashSales/hooks/queries/useAdminFlashSaleDetail.query';
import { useCreateFlashSaleMutation } from '../../features/flashSales/hooks/mutations/useCreateFlashSale.mutation';
import { useUpdateFlashSaleMutation } from '../../features/flashSales/hooks/mutations/useUpdateFlashSale.mutation';
import { useDeleteFlashSaleItemMutation } from '../../features/flashSales/hooks/mutations/useDeleteFlashSaleItem.mutation';
import { EFlashSaleStatus } from '../../features/flashSales/models/flashSale.model';
import { FlashSaleStatusBadge } from './components/FlashSaleStatusBadge';
import { ProductSelectorModal, SelectedFlashSaleItem } from './components/ProductSelectorModal';

export const FlashSaleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === 'new';
    const saleId = isNew ? undefined : Number(id);

    const { data: detailRes, isLoading: isLoadingDetail } = useAdminFlashSaleDetailQuery(saleId);
    const createMutation = useCreateFlashSaleMutation();
    const updateMutation = useUpdateFlashSaleMutation();
    const deleteItemMutation = useDeleteFlashSaleItemMutation();

    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [status, setStatus] = useState<EFlashSaleStatus>(EFlashSaleStatus.UPCOMING);
    const [items, setItems] = useState<SelectedFlashSaleItem[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Format local date for input datetime-local: YYYY-MM-DDTHH:mm
    const toInputDateTime = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        } catch {
            return '';
        }
    };

    useEffect(() => {
        if (isNew) {
            // Default 1 hour from now to 24 hours from now
            const now = new Date();
            const start = new Date(now.getTime() + 60 * 60 * 1000);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            setStartTime(toInputDateTime(start.toISOString()));
            setEndTime(toInputDateTime(end.toISOString()));
        } else if (detailRes?.data) {
            const d = detailRes.data;
            setName(d.name);
            setStartTime(toInputDateTime(d.startTime));
            setEndTime(toInputDateTime(d.endTime));
            setStatus(d.status);
            setItems(
                d.items.map((i) => ({
                    productId: i.productId,
                    productName: i.productName,
                    productThumbnail: i.productThumbnail,
                    variantId: i.variantId,
                    sku: i.sku,
                    variantAttributesSummary: i.variantAttributesSummary || '',
                    originalPrice: i.originalPrice,
                    flashSalePrice: i.flashSalePrice,
                    totalSlots: i.totalSlots,
                    userLimit: i.userLimit
                }))
            );
        }
    }, [isNew, detailRes]);

    const handleSelectNewItems = (newItems: SelectedFlashSaleItem[]) => {
        setItems((prev) => [...prev, ...newItems]);
    };

    const handleRemoveItem = async (index: number) => {
        const itemToRemove = items[index];
        if (!isNew && saleId && detailRes?.data) {
            const existingInDb = detailRes.data.items.find((i) => i.variantId === itemToRemove.variantId);
            if (existingInDb) {
                await deleteItemMutation.mutateAsync({ saleId, itemId: existingInDb.id });
            }
        }
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof SelectedFlashSaleItem, value: number) => {
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!name.trim()) {
            setErrorMsg('Vui lòng nhập tên chiến dịch');
            return;
        }

        if (!startTime || !endTime) {
            setErrorMsg('Vui lòng chọn thời gian bắt đầu và kết thúc');
            return;
        }

        if (new Date(endTime) <= new Date(startTime)) {
            setErrorMsg('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        if (items.length === 0) {
            setErrorMsg('Vui lòng thêm ít nhất 1 sản phẩm tham gia Flash Sale');
            return;
        }

        for (const item of items) {
            if (item.flashSalePrice <= 0 || item.flashSalePrice >= item.originalPrice) {
                setErrorMsg(`Giá Flash Sale cho SKU ${item.sku} phải lớn hơn 0 và nhỏ hơn giá gốc (${item.originalPrice.toLocaleString('vi-VN')}₫)`);
                return;
            }
            if (item.totalSlots <= 0) {
                setErrorMsg(`Số suất bán cho SKU ${item.sku} phải lớn hơn 0`);
                return;
            }
        }

        try {
            if (isNew) {
                await createMutation.mutateAsync({
                    name: name.trim(),
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString(),
                    items: items.map((i) => ({
                        productId: i.productId,
                        variantId: i.variantId,
                        flashSalePrice: Number(i.flashSalePrice),
                        totalSlots: Number(i.totalSlots),
                        userLimit: Number(i.userLimit || 1)
                    }))
                });
            } else if (saleId) {
                await updateMutation.mutateAsync({
                    id: saleId,
                    payload: {
                        name: name.trim(),
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                        status
                    }
                });
            }
            navigate('/admin/flash-sales');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            setErrorMsg(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi lưu chiến dịch');
        }
    };

    if (!isNew && isLoadingDetail) {
        return (
            <div className="py-20 text-center text-slate-500">
                Đang tải thông tin chiến dịch Flash Sale...
            </div>
        );
    }

    return (
        <div className="w-full pb-20 max-w-5xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/flash-sales')}
                        className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-xs"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {isNew ? 'Tạo Chiến Dịch Flash Sale' : 'Chi Tiết Chiến Dịch Flash Sale'}
                            </h1>
                            {!isNew && <FlashSaleStatusBadge status={status} />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isNew ? 'Thiết lập khung giờ và phân bổ các suất bán ưu đãi' : `Mã chiến dịch: #${saleId}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/flash-sales')}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu chiến dịch'}
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Không thể lưu chiến dịch</p>
                        <p className="text-xs mt-0.5">{errorMsg}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Info Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Thông tin chiến dịch
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tên chiến dịch Flash Sale <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Flash Sale Giữa Tháng 10 - Giảm Sốc 40%"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                Thời gian bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-rose-600" />
                                Thời gian kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {!isNew && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as EFlashSaleStatus)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                                >
                                    <option value={EFlashSaleStatus.UPCOMING}>Sắp diễn ra (UPCOMING)</option>
                                    <option value={EFlashSaleStatus.ACTIVE}>Đang diễn ra (ACTIVE)</option>
                                    <option value={EFlashSaleStatus.EXPIRED}>Đã kết thúc (EXPIRED)</option>
                                    <option value={EFlashSaleStatus.CANCELLED}>Đã hủy (CANCELLED)</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Sản phẩm tham gia ({items.length})</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Thiết lập giá sale, suất bán và giới hạn số lượng mua cho từng biến thể
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSelectorOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Chọn thêm sản phẩm
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="py-14 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                            <Zap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-slate-700">Chưa có sản phẩm nào trong chiến dịch</p>
                            <p className="text-xs text-slate-400 mt-1 mb-4">
                                Nhấp vào nút "Chọn thêm sản phẩm" để chọn biến thể từ kho hàng
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsSelectorOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                            >
                                Chọn sản phẩm ngay
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Sản phẩm & Biến thể</th>
                                        <th className="px-4 py-3 text-right">Giá gốc</th>
                                        <th className="px-4 py-3">Giá Flash Sale (₫)</th>
                                        <th className="px-4 py-3 text-center">Suất bán</th>
                                        <th className="px-4 py-3 text-center">Giới hạn / User</th>
                                        <th className="px-4 py-3 text-right">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item, idx) => {
                                        const discountPercent =
                                            item.originalPrice > 0
                                                ? Math.round(((item.originalPrice - item.flashSalePrice) / item.originalPrice) * 100)
                                                : 0;

                                        return (
                                            <tr key={item.variantId} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={item.productThumbnail || 'https://via.placeholder.com/50'}
                                                            alt={item.productName}
                                                            className="w-11 h-11 object-cover rounded-lg border border-slate-200 shrink-0"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900 text-xs truncate max-w-[220px]">
                                                                {item.productName}
                                                            </p>
                                                            <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                                                                SKU: <span className="font-bold text-slate-700">{item.sku}</span>
                                                            </p>
                                                            {item.variantAttributesSummary && (
                                                                <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                                                                    {item.variantAttributesSummary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5 text-right font-medium text-slate-500 text-xs whitespace-nowrap">
                                                    {item.originalPrice.toLocaleString('vi-VN')}₫
                                                </td>

                                                <td className="px-4 py-3.5 min-w-[170px]">
                                                    <div className="space-y-1">
                                                        <input
                                                            type="number"
                                                            min={1000}
                                                            max={item.originalPrice - 1}
                                                            step={1000}
                                                            value={item.flashSalePrice}
                                                            onChange={(e) =>
                                                                handleItemChange(idx, 'flashSalePrice', Number(e.target.value))
                                                            }
                                                            className="w-full px-3 py-1.5 text-xs font-bold text-blue-600 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <div className="text-[11px] text-emerald-600 font-semibold">
                                                            Giảm {discountPercent}% so với giá gốc
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5 text-center w-28">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.totalSlots}
                                                        onChange={(e) =>
                                                            handleItemChange(idx, 'totalSlots', Number(e.target.value))
                                                        }
                                                        className="w-20 px-2 py-1.5 text-xs text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
                                                    />
                                                </td>

                                                <td className="px-4 py-3.5 text-center w-28">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={10}
                                                        value={item.userLimit}
                                                        onChange={(e) =>
                                                            handleItemChange(idx, 'userLimit', Number(e.target.value))
                                                        }
                                                        className="w-16 px-2 py-1.5 text-xs text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
                                                    />
                                                </td>

                                                <td className="px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Xóa biến thể này"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </form>

            {/* Product Selector Modal */}
            <ProductSelectorModal
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelectItems={handleSelectNewItems}
                alreadySelectedVariantIds={items.map((i) => i.variantId)}
            />
        </div>
    );
};
