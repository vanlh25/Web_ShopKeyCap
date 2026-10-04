import { Customer } from '../models/customer.model';
import { UpdateCustomerRequest } from '../models/update-customer.request';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CustomerListRequest {
  page: number;
  limit: number;
  search?: string;
}

export interface CustomerListResponse {
  data: Customer[];
  meta?: PaginationMeta;
}

export interface ICustomerRepo {
  getCustomers(params: CustomerListRequest): Promise<CustomerListResponse>;
  getCustomerById(id: number): Promise<Customer>;
  updateCustomer(id: number, request: UpdateCustomerRequest): Promise<Customer>;
}
