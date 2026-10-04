import React from "react";
import { useProductListController } from "./ProductList.controller";
import { AdminProductCard } from "./components/AdminProductCard";
import { ProductFloatingActions } from "../../components/floating-action/ProductFloatingActions";
import { Search, Trash2 } from "lucide-react";

export const ProductListPage: React.FC = () => {
    const listCtrl = useProductListController();

    if (listCtrl.isLoading) return <div className="p-8 text-center text-slate-500">Đang tải danh sách sản phẩm...</div>;
    if (listCtrl.isError) return <div className="p-8 text-center text-red-500">Đã xảy ra lỗi khi tải dữ liệu!</div>;

    return (
        <div className="w-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sản phẩm</h1>
                    <p className="text-slate-500 mt-1 text-sm">Quản lý toàn bộ danh mục sản phẩm của hệ thống</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        defaultValue={listCtrl.search}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                listCtrl.handleSearch(e.currentTarget.value);
                            }
                        }}
                        onBlur={(e) => listCtrl.handleSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Select All toolbar */}
            {listCtrl.products.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={listCtrl.allSelected}
                            onChange={listCtrl.handleSelectAll}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-600">
                            {listCtrl.allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </span>
                    </label>
                    {listCtrl.selectedIds.size > 0 && (
                        <span className="text-sm text-slate-500">
                            Đã chọn <strong className="text-slate-800">{listCtrl.selectedIds.size}</strong> sản phẩm
                        </span>
                    )}
                </div>
            )}

            {/* Bulk action bar */}
            {listCtrl.selectedIds.size > 0 && (
                <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-sm font-medium text-blue-700 flex-1">
                        {listCtrl.selectedIds.size} sản phẩm được chọn
                    </span>
                    <button
                        onClick={listCtrl.handleBulkDelete}
                        disabled={listCtrl.isBulkDeleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4" />
                        {listCtrl.isBulkDeleting ? 'Đang xóa...' : `Xóa ${listCtrl.selectedIds.size} sản phẩm`}
                    </button>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {listCtrl.products.map(product => (
                    <AdminProductCard 
                        key={product.id} 
                        product={product} 
                        onDelete={() => listCtrl.handleDelete(product.id)}
                        isDeleting={listCtrl.isDeleting}
                        isSelected={listCtrl.selectedIds.has(product.id)}
                        onToggleSelect={() => listCtrl.handleToggleSelect(product.id)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {listCtrl.pagination && listCtrl.pagination.totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center space-x-2">
                    <button 
                        onClick={() => listCtrl.handlePageChange(listCtrl.page - 1)} 
                        disabled={listCtrl.page === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-slate-50"
                    >
                        Trước
                    </button>
                    <span className="text-sm font-medium text-slate-600">Trang {listCtrl.page} / {listCtrl.pagination.totalPages}</span>
                    <button 
                        onClick={() => listCtrl.handlePageChange(listCtrl.page + 1)} 
                        disabled={listCtrl.page === listCtrl.pagination.totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-slate-50"
                    >
                        Sau
                    </button>
                </div>
            )}

            <ProductFloatingActions mode="list" />
        </div>
    );
};
