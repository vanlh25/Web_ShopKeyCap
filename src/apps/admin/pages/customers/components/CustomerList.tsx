import React from 'react';
import { Customer } from '../../../features/customers/models/customer.model';
import { User, Lock } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/currency.util';

interface Props {
  customers: Customer[];
  isLoading: boolean;
  isError: boolean;
  selectedCustomerId: number | null;
  onSelect: (id: number) => void;
}

export const CustomerList: React.FC<Props> = ({ 
  customers, 
  isLoading, 
  isError, 
  selectedCustomerId, 
  onSelect 
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
          <User className="w-6 h-6" />
        </div>
        <p>Đã xảy ra lỗi khi tải danh sách khách hàng</p>
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500 gap-2">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
          <User className="w-6 h-6" />
        </div>
        <p>Không tìm thấy khách hàng nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Khách hàng</th>
              <th className="px-6 py-4 font-semibold text-center">Đơn hàng</th>
              <th className="px-6 py-4 font-semibold text-right">Chi tiêu</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr 
                key={customer.id} 
                onClick={() => onSelect(customer.id)}
                className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${
                  selectedCustomerId === customer.id ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                      {customer.avatarUrl ? (
                        <img src={customer.avatarUrl} alt={customer.fullName || ''} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{customer.fullName || 'Chưa cập nhật'}</span>
                      <span className="text-slate-500 text-xs">{customer.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-medium text-slate-700">{customer.totalOrders}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-emerald-600">{formatCurrency(customer.totalSpent)}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {customer.locked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <Lock className="w-3 h-3" /> Đã khóa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Hoạt động
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
