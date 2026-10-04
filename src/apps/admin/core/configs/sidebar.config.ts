import { ERole } from "../../../../core/constants/role.constant";

export interface SidebarMenuItem {
    key: string;
    label: string;
    path: string;
    icon?: string;
    roles?: ERole[];
}

export const ADMIN_SIDEBAR_MENU: SidebarMenuItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/admin'
    },
    {
        key: 'products',
        label: 'Sản phẩm',
        path: '/admin/products'
    },
    {
        key: 'orders',
        label: 'Đơn hàng',
        path: '/admin/orders'
    },
    {
        key: 'banners',
        label: 'Banner',
        path: '/admin/banners'
    },
    {
        key: 'brands',
        label: 'Thương hiệu',
        path: '/admin/brands'
    },
    {
        key: 'categories',
        label: 'Danh mục',
        path: '/admin/categories'
    },
    {
        key: 'customers',
        label: 'Khách hàng',
        path: '/admin/customers'
    },
    {
        key: 'staffs',
        label: 'Nhân viên',
        path: '/admin/staffs',
        roles: [ERole.ADMIN]
    },
    {
        key: 'reviews',
        label: 'Đánh giá',
        path: '/admin/reviews'
    },
];
