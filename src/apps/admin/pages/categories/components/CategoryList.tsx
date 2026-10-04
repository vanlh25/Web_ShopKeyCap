import React from 'react';
import { Category } from '../../../features/categories/models/category.model';
import { FolderTree, Edit2, Trash2 } from 'lucide-react';

interface Props {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryList: React.FC<Props> = ({ 
  categories, 
  isLoading, 
  isError, 
  onEdit,
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
          <FolderTree className="w-6 h-6" />
        </div>
        <p>Đã xảy ra lỗi khi tải danh sách danh mục</p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500 gap-2">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
          <FolderTree className="w-6 h-6" />
        </div>
        <p>Không tìm thấy danh mục nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Tên danh mục</th>
              <th className="px-6 py-4 font-semibold">Slug (Đường dẫn)</th>
              <th className="px-6 py-4 font-semibold">Mô tả</th>
              <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                <td className="px-6 py-4 text-slate-500">{category.slug}</td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{category.description || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(category.id)}
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
