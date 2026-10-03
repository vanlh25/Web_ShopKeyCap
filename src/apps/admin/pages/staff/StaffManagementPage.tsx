import React from 'react';
import { useStaffManagementController } from './staffManagement.controller';
import { StaffList } from './components/StaffList';
import { StaffDetailPanel } from './components/StaffDetailPanel';
import { StaffModal } from './components/StaffModal';
import { Search, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export const StaffManagementPage: React.FC = () => {
    const ctrl = useStaffManagementController();

    return (
        <div className="flex flex-col w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-50 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border-b border-slate-200 shrink-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Nhân viên</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách nhân viên và phân quyền trong hệ thống</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm nhân viên..." 
                            defaultValue={ctrl.search}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') ctrl.handleSearch(e.currentTarget.value);
                            }}
                            onBlur={(e) => ctrl.handleSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                    
                    <button 
                        onClick={ctrl.handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo nhân viên
                    </button>
                </div>
            </div>

            {/* Main Content Area: Split Pane */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Pane: Staff List */}
                <div className={clsx(
                    "h-full overflow-y-auto transition-all duration-300 ease-in-out p-6",
                    ctrl.selectedStaffId ? "w-1/2 pr-3" : "w-full"
                )}>
                    {ctrl.selectedIds.size > 0 && (
                        <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl shadow-xs">
                            <span className="text-sm font-medium text-blue-900">
                                Đã chọn <strong>{ctrl.selectedIds.size}</strong> nhân viên
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={ctrl.handleSelectAll}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Bỏ chọn
                                </button>
                                <button
                                    onClick={ctrl.handleBulkDelete}
                                    disabled={ctrl.isBulkDeleting}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    {ctrl.isBulkDeleting ? 'Đang xóa...' : `Xóa (${ctrl.selectedIds.size})`}
                                </button>
                            </div>
                        </div>
                    )}
                    <StaffList 
                        staffs={ctrl.staffs}
                        isLoading={ctrl.isStaffsLoading}
                        isError={ctrl.isStaffsError}
                        selectedStaffId={ctrl.selectedStaffId}
                        onSelect={ctrl.handleSelectStaff}
                        selectedIds={ctrl.selectedIds}
                        allSelected={ctrl.allSelected}
                        onToggleSelect={ctrl.handleToggleSelect}
                        onSelectAll={ctrl.handleSelectAll}
                    />
                </div>

                {/* Right Pane: Staff Detail */}
                <div className={clsx(
                    "absolute top-0 right-0 h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-slate-200 transition-transform duration-300 ease-in-out w-1/2",
                    ctrl.selectedStaffId ? "translate-x-0" : "translate-x-full"
                )}>
                    {ctrl.selectedStaffId && ctrl.selectedStaff && (
                        <StaffDetailPanel 
                            staff={ctrl.selectedStaff}
                            isLoading={ctrl.isDetailLoading}
                            onClose={ctrl.handleClosePanel}
                            onEdit={ctrl.handleOpenEdit}
                            onDelete={() => ctrl.handleDeleteStaff(ctrl.selectedStaffId!)}
                            isDeleting={ctrl.isDeleting}
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            <StaffModal 
                isOpen={ctrl.isModalOpen}
                mode={ctrl.modalMode}
                initialData={ctrl.modalMode === 'edit' ? ctrl.selectedStaff : undefined}
                onClose={ctrl.handleCloseModal}
                onSubmit={ctrl.modalMode === 'create' ? ctrl.handleCreateStaff : ctrl.handleUpdateStaff}
                isSubmitting={ctrl.isSubmitting}
            />
        </div>
    );
};
