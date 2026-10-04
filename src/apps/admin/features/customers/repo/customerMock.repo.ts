import { ICustomerRepo, CustomerListRequest, CustomerListResponse } from './customer.repo';
import { Customer } from '../models/customer.model';
import { UpdateCustomerRequest } from '../models/update-customer.request';

// Dummy data for mock repo
let mockCustomers: Customer[] = [
  {
    id: 1,
    email: 'customer1@example.com',
    fullName: 'Nguyen Van A',
    phone: '0123456789',
    gender: 'MALE',
    dateOfBirth: '1995-01-01',
    avatarUrl: null,
    locked: false,
    createdAt: '2023-01-01T00:00:00Z',
    totalOrders: 10,
    totalSpent: 15000000,
  },
  {
    id: 2,
    email: 'customer2@example.com',
    fullName: 'Tran Thi B',
    phone: '0987654321',
    gender: 'FEMALE',
    dateOfBirth: '2000-05-15',
    avatarUrl: 'https://example.com/avatar.jpg',
    locked: true,
    createdAt: '2023-06-15T00:00:00Z',
    totalOrders: 3,
    totalSpent: 4500000,
  },
];

export class CustomerMockRepo implements ICustomerRepo {
  async getCustomers(params: CustomerListRequest): Promise<CustomerListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let filtered = [...mockCustomers];
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.email.toLowerCase().includes(s) || 
        (c.fullName && c.fullName.toLowerCase().includes(s)) ||
        (c.phone && c.phone.includes(s))
      );
    }
    
    const limit = params.limit || 10;
    const page = params.page || 1;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }

  async getCustomerById(id: number): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  }

  async updateCustomer(id: number, request: UpdateCustomerRequest): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    if (request.locked !== undefined) {
      mockCustomers[index].locked = request.locked;
    }
    
    return mockCustomers[index];
  }
}
