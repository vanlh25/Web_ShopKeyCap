import React from 'react';
import { useCustomerManagementController } from './useCustomerManagement.controller';
import { CustomerList } from './components/CustomerList';
import { CustomerDetailPanel } from './components/CustomerDetailPanel';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { ConfirmModal } from '../../components/ConfirmModal';

export const CustomerManagementPage: React.FC = () => {
    const ctrl = useCustomerManagementController();

    return (
        <div className="w-full pb-20">
            {/* Header Area */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Khách hàng</h1>
                    <p className="text-slate-500 mt-1 text-sm">Quản lý danh sách khách hàng, thống kê chi tiêu và trạng thái tài khoản</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm khách hàng..." 
                            defaultValue={ctrl.search}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') ctrl.handleSearch(e.currentTarget.value);
                            }}
                            onBlur={(e) => ctrl.handleSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area: Split Pane */}
            <div className="flex relative h-[calc(100vh-200px)] overflow-hidden rounded-xl bg-slate-50/50">
                {/* Left Pane: Customer List */}
                <div className={clsx(
                    "h-full overflow-y-auto transition-all duration-300 ease-in-out",
                    ctrl.selectedCustomerId ? "w-7/12 pr-4" : "w-full"
                )}>
                    <CustomerList 
                        customers={ctrl.customers}
                        isLoading={ctrl.isCustomersLoading}
                        isError={ctrl.isCustomersError}
                        selectedCustomerId={ctrl.selectedCustomerId}
                        onSelect={ctrl.handleSelectCustomer}
                    />
                </div>

                {/* Right Pane: Customer Detail */}
                <div className={clsx(
                    "absolute top-0 right-0 h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-slate-200 transition-transform duration-300 ease-in-out w-5/12",
                    ctrl.selectedCustomerId ? "translate-x-0" : "translate-x-full"
                )}>
                    {ctrl.selectedCustomerId && ctrl.selectedCustomer && (
                        <CustomerDetailPanel 
                            customer={ctrl.selectedCustomer}
                            isLoading={ctrl.isDetailLoading}
                            onClose={ctrl.handleClosePanel}
                            onToggleLock={ctrl.handleToggleLock}
                            isUpdating={ctrl.isUpdating}
                        />
                    )}
                </div>
            </div>
            
            <ConfirmModal 
                isOpen={!!ctrl.confirmModal?.isOpen}
                title={ctrl.confirmModal?.title || ''}
                message={ctrl.confirmModal?.message || ''}
                onConfirm={() => ctrl.confirmModal?.onConfirm()}
                onCancel={() => ctrl.setConfirmModal(null)}
                isDestructive={true}
            />
        </div>
    );
};
