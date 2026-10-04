import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Category } from '../../../features/categories/models/category.model';
import { CreateCategoryRequest } from '../../../features/categories/models/create-category.request';
import { UpdateCategoryRequest } from '../../../features/categories/models/update-category.request';

interface Props {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: Category | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const CategoryModal: React.FC<Props> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCategoryRequest | UpdateCategoryRequest>();

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setValue('name', initialData.name);
        setValue('slug', initialData.slug);
        setValue('description', initialData.description || '');
      } else {
        reset({ name: '', slug: '', description: '' });
      }
    }
  }, [isOpen, mode, initialData, setValue, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'create' ? 'Tạo danh mục mới' : 'Cập nhật danh mục'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
              <input 
                {...register('name', { required: 'Vui lòng nhập tên danh mục' })}
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="Nhập tên danh mục"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Đường dẫn (Slug) <span className="text-red-500">*</span></label>
              <input 
                {...register('slug', { required: 'Vui lòng nhập slug' })}
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="vd: ban-phim-co"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
              <textarea 
                {...register('description')}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm min-h-[100px] resize-y"
                placeholder="Nhập mô tả danh mục (tùy chọn)"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            form="category-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {mode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};
