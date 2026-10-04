export interface Customer {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  locked: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}