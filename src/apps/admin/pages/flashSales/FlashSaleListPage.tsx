import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Zap, Eye, Ban } from 'lucide-react';
import { useAdminFlashSalesQuery } from '../../features/flashSales/hooks/queries/useAdminFlashSales.query';
import { useCancelFlashSaleMutation } from '../../features/flashSales/hooks/mutations/useCancelFlashSale.mutation';
import { EFlashSaleStatus, FlashSaleSummaryModel } from '../../features/flashSales/models/flashSale.model';
import { FlashSaleStatusBadge } from './components/FlashSaleStatusBadge';
import { ConfirmModal } from '../../components/ConfirmModal';

export const FlashSaleListPage: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<EFlashSaleStatus | undefined>(undefined);
    const [cancelModalSale, setCancelModalSale] = useState<FlashSaleSummaryModel | null>(null);

    const { data: salesRes, isLoading } = useAdminFlashSalesQuery({
        page: 1,
        limit: 50,
        search: search || undefined,
        status: selectedStatus
    });

    const cancelMutation = useCancelFlashSaleMutation();

    const sales: FlashSaleSummaryModel[] = salesRes?.data || [];

    const handleConfirmCancel = async () => {
        if (!cancelModalSale) return;
        await cancelMutation.mutateAsync(cancelModalSale.id);
        setCancelModalSale(null);
    };

    const formatDate = (isoString: string) => {
        try {
            const d = new Date(isoString);
            return d.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return isoString;
        }
    };

    const filterTabs = [
        { label: 'Tất cả', value: undefined },
        { label: 'Đang diễn ra', value: EFlashSaleStatus.ACTIVE },
        { label: 'Sắp diễn ra', value: EFlashSaleStatus.UPCOMING },
        { label: 'Đã kết thúc', value: EFlashSaleStatus.EXPIRED },
        { label: 'Đã hủy', value: EFlashSaleStatus.CANCELLED }
    ];

    return (
        <div className="w-full pb-20">
            {/* Page Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-7 h-7 text-amber-500 fill-amber-500" />
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chiến Dịch Flash Sale</h1>
                    </div>
                    <p className="text-slate-500 mt-1 text-sm">
                        Quản lý khung giờ ưu đãi chớp nhoáng, phân bổ suất bán và giới hạn số lượng mua
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/flash-sales/new')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo chiến dịch mới
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-xl">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setSelectedStatus(tab.value)}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    selectedStatus === tab.value
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên chiến dịch..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Chiến dịch</th>
                                <th className="px-5 py-3.5">Khung giờ</th>
                                <th className="px-5 py-3.5 text-center">Sản phẩm</th>
                                <th className="px-5 py-3.5">Tiến độ bán</th>
                                <th className="px-5 py-3.5 text-center">Trạng thái</th>
                                <th className="px-5 py-3.5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        Đang tải danh sách chiến dịch Flash Sale...
                                    </td>
                                </tr>
                            ) : sales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Zap className="w-10 h-10 text-slate-300 mb-2 stroke-1" />
                                            <p className="font-medium text-slate-600">Chưa có chiến dịch Flash Sale nào</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Bấm nút "Tạo chiến dịch mới" để thiết lập đợt sale đầu tiên</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => {
                                    const percentSold = sale.totalSlots > 0 ? Math.round((sale.soldSlots / sale.totalSlots) * 100) : 0;
                                    const canCancel = sale.status === EFlashSaleStatus.ACTIVE || sale.status === EFlashSaleStatus.UPCOMING;

                                    return (
                                        <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-5 py-4 font-semibold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                    <span>{sale.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="text-xs space-y-1">
                                                    <div className="flex items-center gap-1.5 text-slate-700">
                                                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>Bắt đầu: {formatDate(sale.startTime)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Kết thúc: {formatDate(sale.endTime)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                                                    {sale.totalItems} biến thể
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 min-w-[180px]">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1 font-medium">
                                                        <span className="text-slate-700">{sale.soldSlots} / {sale.totalSlots} suất</span>
                                                        <span className="text-blue-600 font-bold">{percentSold}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 ${
                                                                percentSold >= 100 ? 'bg-rose-500' : 'bg-blue-600'
                                                            }`}
                                                            style={{ width: `${Math.min(100, percentSold)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <FlashSaleStatusBadge status={sale.status} />
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => navigate(`/admin/flash-sales/${sale.id}`)}
                                                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết / Chỉnh sửa"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {canCancel && (
                                                        <button
                                                            onClick={() => setCancelModalSale(sale)}
                                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Hủy chiến dịch"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirm Cancel Modal */}
            <ConfirmModal
                isOpen={!!cancelModalSale}
                title="Hủy chiến dịch Flash Sale"
                message={`Bạn có chắc chắn muốn hủy chiến dịch "${cancelModalSale?.name}"? Các sản phẩm trong chiến dịch sẽ lập tức quay trở lại giá bán thông thường.`}
                confirmText="Xác nhận hủy"
                cancelText="Quay lại"
                onConfirm={handleConfirmCancel}
                onCancel={() => setCancelModalSale(null)}
                isDestructive={true}
            />
        </div>
    );
};
