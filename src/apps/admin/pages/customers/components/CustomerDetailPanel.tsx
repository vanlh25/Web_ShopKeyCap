import React from 'react';
import { Customer } from '../../../features/customers/models/customer.model';
import { User, Mail, Phone, Calendar, ShoppingCart, DollarSign, Lock, Unlock, X } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/currency.util';

interface Props {
  customer: Customer;
  isLoading: boolean;
  onClose: () => void;
  onToggleLock: () => void;
  isUpdating: boolean;
}

export const CustomerDetailPanel: React.FC<Props> = ({ 
  customer, 
  isLoading, 
  onClose, 
  onToggleLock,
  isUpdating 
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Chi tiết khách hàng</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLock}
            disabled={isUpdating}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 ${
              customer.locked 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {customer.locked ? (
              <><Unlock className="w-4 h-4" /> Mở khóa</>
            ) : (
              <><Lock className="w-4 h-4" /> Khóa tài khoản</>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden mb-4 shadow-sm border border-slate-200">
            {customer.avatarUrl ? (
              <img src={customer.avatarUrl} alt={customer.fullName || ''} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{customer.fullName || 'Chưa cập nhật'}</h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
            customer.locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {customer.locked ? 'Đã khóa' : 'Hoạt động'}
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Thông tin cá nhân</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 w-24">Email:</span>
                <span className="text-slate-900 font-medium">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 w-24">Số điện thoại:</span>
                <span className="text-slate-900 font-medium">{customer.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 w-24">Ngày sinh:</span>
                <span className="text-slate-900 font-medium">{customer.dateOfBirth || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Thống kê mua hàng</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600 font-medium">Tổng đơn hàng</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{customer.totalOrders}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-600 font-medium">Tổng chi tiêu</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{formatCurrency(customer.totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
