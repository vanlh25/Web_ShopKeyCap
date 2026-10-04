import React from 'react';
import { Banner } from '../../../features/banners/models/banner.model';
import { Image as ImageIcon, Edit2, Trash2, Eye, EyeOff, Link } from 'lucide-react';

interface Props {
  banners: Banner[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (banner: Banner) => void;
  onToggleActive: (banner: Banner) => void;
  onDelete: (id: number) => void;
}

export const BannerList: React.FC<Props> = ({ 
  banners, 
  isLoading, 
  isError, 
  onEdit,
  onToggleActive,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500 gap-2">
        <div className="p-3 bg-red-50 text-red-500 rounded-full">
          <ImageIcon className="w-6 h-6" />
        </div>
        <p>Đã xảy ra lỗi khi tải danh sách banner</p>
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500 gap-2">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
          <ImageIcon className="w-6 h-6" />
        </div>
        <p>Không tìm thấy banner nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold w-32">Hình ảnh</th>
              <th className="px-6 py-4 font-semibold">Thông tin</th>
              <th className="px-6 py-4 font-semibold text-center">Thứ tự</th>
              <th className="px-6 py-4 font-semibold text-center">Hiển thị</th>
              <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-32 h-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{banner.title}</span>
                    {banner.linkUrl && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 hover:underline">
                        <Link className="w-3 h-3" />
                        <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="truncate max-w-[200px]">
                          {banner.linkUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-slate-700 font-medium">{banner.displayOrder}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onToggleActive(banner)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      banner.active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {banner.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {banner.active ? 'Đang bật' : 'Đã tắt'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(banner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(banner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
