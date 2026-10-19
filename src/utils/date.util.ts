export const formatDateTime = (dateStr: string | Date): string => {
    return new Date(dateStr).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

export const formatDate = (dateStr: string | Date): string => {
    return new Date(dateStr).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};
