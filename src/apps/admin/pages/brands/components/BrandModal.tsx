import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Brand } from '../../../features/brands/models/brand.model';
import { useCloudMediaUpload } from '@/shared/features/cloudMedia/hooks/useCloudMediaUpload';
import { CreateBrandRequest } from '../../../features/brands/models/create-brand.request';
import { UpdateBrandRequest } from '../../../features/brands/models/update-brand.request';

interface Props {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: Brand | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const BrandModal: React.FC<Props> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateBrandRequest | UpdateBrandRequest>();
  const watchImageUrl = watch('imageUrl');
  const { upload, isUploading } = useCloudMediaUpload();
  
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const results = await upload([file]);
      if (results && results.length > 0) {
        setValue('imageUrl', results[0].url);
      }
    } catch (err) {
      console.error('Failed to upload logo', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setValue('name', initialData.name);
        setValue('slug', initialData.slug);
        setValue('description', initialData.description || '');
        setValue('imageUrl', initialData.imageUrl || '');
      } else {
        reset({ name: '', slug: '', description: '', imageUrl: '' });
      }
    }
  }, [isOpen, mode, initialData, setValue, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'create' ? 'Tạo thương hiệu mới' : 'Cập nhật thương hiệu'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="brand-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="flex justify-center mb-4">
               <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                  {watchImageUrl ? (
                    <img src={watchImageUrl as string} alt="Preview" className="w-full h-full object-contain bg-white" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên thương hiệu <span className="text-red-500">*</span></label>
              <input 
                {...register('name', { required: 'Vui lòng nhập tên thương hiệu' })}
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="Nhập tên thương hiệu"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Đường dẫn (Slug) <span className="text-red-500">*</span></label>
              <input 
                {...register('slug', { required: 'Vui lòng nhập slug' })}
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="vd: akko"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Đường dẫn ảnh logo (URL)</label>
              <div className="flex gap-2">
                <input 
                  {...register('imageUrl')}
                  type="text" 
                  readOnly
                  className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none transition-all text-sm text-slate-500"
                  placeholder="URL logo sẽ hiển thị tại đây sau khi tải lên"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isUploading}
                  />
                  <button 
                    type="button"
                    disabled={isUploading}
                    className="h-full px-4 flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></div>
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    Tải ảnh lên
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
              <textarea 
                {...register('description')}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm min-h-[100px] resize-y"
                placeholder="Nhập mô tả thương hiệu (tùy chọn)"
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
            form="brand-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {mode === 'create' ? 'Tạo thương hiệu' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};
