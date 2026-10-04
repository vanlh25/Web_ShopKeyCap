import { apiClient } from '../../../../../core/api/apiClient';
import { ApiResponse } from '../../../../../core/api/apiResponse';
import { ICustomerRepo, CustomerListRequest, CustomerListResponse } from './customer.repo';
import { Customer } from '../models/customer.model';
import { UpdateCustomerRequest } from '../models/update-customer.request';

export class CustomerApiRepo implements ICustomerRepo {
  async getCustomers(params: CustomerListRequest): Promise<CustomerListResponse> {
    const response = await apiClient.get<ApiResponse<Customer[]>>('/admin/customers', { params });
    return {
      data: response.data,
      meta: response.pagination,
    };
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await apiClient.get<ApiResponse<Customer>>(`/admin/customers/${id}`);
    return response.data;
  }

  async updateCustomer(id: number, request: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.patch<ApiResponse<Customer>>(`/admin/customers/${id}`, request);
    return response.data;
  }
}

