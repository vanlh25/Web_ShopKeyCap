import React from 'react';
import { useCategoryManagementController } from './useCategoryManagement.controller';
import { CategoryList } from './components/CategoryList';
import { CategoryModal } from './components/CategoryModal';
import { Search, Plus } from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';

export const CategoryManagementPage: React.FC = () => {
    const ctrl = useCategoryManagementController();

    return (
        <div className="w-full pb-20">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Danh mục</h1>
                    <p className="text-slate-500 mt-1 text-sm">Quản lý danh sách các danh mục sản phẩm (Category)</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm danh mục..." 
                            defaultValue={ctrl.search}
                            onChange={(e) => ctrl.handleSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    
                    <button 
                        onClick={ctrl.handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo danh mục
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                <CategoryList 
                    categories={ctrl.categories}
                    isLoading={ctrl.isCategoriesLoading}
                    isError={ctrl.isCategoriesError}
                    onEdit={ctrl.handleOpenEdit}
                    onDelete={ctrl.handleDeleteCategory}
                />
            </div>

            {/* Modal */}
            <CategoryModal 
                isOpen={ctrl.isModalOpen}
                mode={ctrl.modalMode}
                initialData={ctrl.selectedCategory}
                onClose={ctrl.handleCloseModal}
                onSubmit={ctrl.modalMode === 'create' ? ctrl.handleCreateCategory : ctrl.handleUpdateCategory}
                isSubmitting={ctrl.isSubmitting}
            />
            
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
