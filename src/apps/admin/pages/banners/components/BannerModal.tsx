import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Image as ImageIcon } from 'lucide-react';
import { Banner } from '../../../features/banners/models/banner.model';
import { CreateBannerRequest } from '../../../features/banners/models/create-banner.request';
import { UpdateBannerRequest } from '../../../features/banners/models/update-banner.request';
import { useCloudMediaUpload } from '@/shared/features/cloudMedia/hooks/useCloudMediaUpload';

interface Props {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: Banner | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const BannerModal: React.FC<Props> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateBannerRequest | UpdateBannerRequest>();
  const watchImageUrl = watch('imageUrl');
  const { upload, isUploading } = useCloudMediaUpload();

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setValue('title', initialData.title || '');
        setValue('imageUrl', initialData.imageUrl || '');
        setValue('linkUrl', initialData.linkUrl || '');
        setValue('displayOrder', initialData.displayOrder || 1);
        setValue('active', initialData.active ?? true);
      } else {
        reset({ title: '', imageUrl: '', linkUrl: '', displayOrder: 1, active: true });
      }
    }
  }, [isOpen, mode, initialData, setValue, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'create' ? 'Thêm banner mới' : 'Cập nhật banner'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="banner-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="flex flex-col gap-2">
               <label className="block text-sm font-medium text-slate-700">Hình ảnh banner <span className="text-red-500">*</span></label>
               
               <div className="flex items-center gap-4 mb-2">
                 <input 
                   type="file" 
                   accept="image/*"
                   className="hidden" 
                   id="banner-image-upload"
                   onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       try {
                         const uploadedMedias = await upload([file]);
                         if (uploadedMedias && uploadedMedias.length > 0) {
                           setValue('imageUrl', uploadedMedias[0].url, { shouldValidate: true, shouldDirty: true });
                         }
                       } catch (err) {
                         alert("Lỗi upload ảnh lên Cloudinary!");
                       }
                     }
                   }}
                 />
                 <label 
                   htmlFor="banner-image-upload"
                   className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
                 >
                   <ImageIcon className="w-4 h-4" />
                   {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
                 </label>
                 
                 <div className="flex-1">
                    <input 
                      {...register('imageUrl', { required: 'Vui lòng tải ảnh lên hoặc nhập đường dẫn ảnh' })}
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                      placeholder="Hoặc nhập đường dẫn ảnh (URL)..."
                    />
                 </div>
               </div>
               {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message as string}</p>}

               <div className="w-full h-40 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                  {watchImageUrl ? (
                    <>
                      <img src={watchImageUrl as string} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            type="button"
                            onClick={() => setValue('imageUrl', '', { shouldValidate: true })}
                            className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                         >
                           <X className="w-5 h-5" />
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm">Chưa có hình ảnh</span>
                    </div>
                  )}
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề banner <span className="text-red-500">*</span></label>
              <input 
                {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="Khuyến mãi mùa hè"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Liên kết điều hướng (Link)</label>
              <input 
                {...register('linkUrl')}
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="/products/keycap-1"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự hiển thị</label>
                <input 
                  {...register('displayOrder', { valueAsNumber: true })}
                  type="number" 
                  min="1"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                />
              </div>

              <div className="flex-1 flex flex-col justify-end h-full pt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('active')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-700">Kích hoạt</span>
                </label>
              </div>
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
            form="banner-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {mode === 'create' ? 'Tạo banner' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};
