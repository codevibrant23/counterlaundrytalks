// Customer API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generate customer ID based on customer details
const generateCustomerId = (customerData) => {
  const prefix = customerData.customer_type === 'commercial' ? 'COM' : 'RET';
  const timestamp = Date.now().toString().slice(-6);
  const namePrefix = customerData.name.substring(0, 3).toUpperCase();
  return `${prefix}${namePrefix}${timestamp}`;
};

// Get all customers (for listing)
export const getAllCustomers = async () => {
  try {
    // Mock data for demonstration - replace with actual API call
    const mockCustomers = [
      {
        customer_id: 'RET001',
        name: 'John Doe',
        phone_number: '9876543210',
        email: 'john@example.com',
        customer_type: 'retail',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: '123 Main Street, Apartment 4B',
        gst_number: '',
        created_at: '2024-01-15T10:30:00Z',
        total_orders: 5,
        total_spent: 2750.00
      },
      {
        customer_id: 'COM001',
        name: 'Jane Smith',
        phone_number: '9876543211',
        email: 'jane@business.com',
        customer_type: 'commercial',
        business_name: 'Smith Enterprises',
        city: 'Delhi',
        state: 'Delhi',
        address: '456 Business Park, Sector 18',
        gst_number: '27AABCU9603R1ZX',
        created_at: '2024-01-10T14:20:00Z',
        total_orders: 12,
        total_spent: 15750.00
      },
      {
        customer_id: 'RET002',
        name: 'Mike Johnson',
        phone_number: '9876543212',
        email: 'mike@gmail.com',
        customer_type: 'retail',
        city: 'Bangalore',
        state: 'Karnataka',
        address: '789 Tech Street',
        gst_number: '',
        created_at: '2024-01-20T09:15:00Z',
        total_orders: 3,
        total_spent: 1200.00
      },
      {
        customer_id: 'COM002',
        name: 'Sarah Wilson',
        phone_number: '9876543213',
        email: 'sarah@techcorp.com',
        customer_type: 'commercial',
        business_name: 'TechCorp Solutions',
        city: 'Pune',
        state: 'Maharashtra',
        address: '321 Innovation Hub',
        gst_number: '27AABCU9603R1ZY',
        created_at: '2024-01-08T16:45:00Z',
        total_orders: 8,
        total_spent: 8900.00
      },
      {
        customer_id: 'RET003',
        name: 'David Brown',
        phone_number: '9876543214',
        email: 'david@yahoo.com',
        customer_type: 'retail',
        city: 'Chennai',
        state: 'Tamil Nadu',
        address: '654 Marina Drive',
        gst_number: '',
        created_at: '2024-01-25T11:30:00Z',
        total_orders: 2,
        total_spent: 850.00
      },
      {
        customer_id: 'RET004',
        name: 'Lisa Anderson',
        phone_number: '9876543215',
        email: 'lisa@hotmail.com',
        customer_type: 'retail',
        city: 'Hyderabad',
        state: 'Telangana',
        address: '987 Hi-Tech City',
        gst_number: '',
        created_at: '2024-01-12T13:20:00Z',
        total_orders: 7,
        total_spent: 3200.00
      }
    ];

    return mockCustomers;
  } catch (error) {
    console.error('Get all customers error:', error);
    throw error;
  }
};

// Search customers by name, phone, or customer ID
export const searchCustomers = async (searchTerm, searchType) => {
  try {
    const allCustomers = await getAllCustomers();

    if (!searchTerm.trim()) {
      return allCustomers;
    }

    // Filter based on search type and term
    const filteredCustomers = allCustomers.filter(customer => {
      const term = searchTerm.toLowerCase();
      switch (searchType) {
        case 'name':
          return customer.name.toLowerCase().includes(term);
        case 'phone':
          return customer.phone_number.includes(searchTerm);
        case 'customerId':
          return customer.customer_id.toLowerCase().includes(term);
        default:
          return false;
      }
    });

    return filteredCustomers;
  } catch (error) {
    console.error('Search customers error:', error);
    throw error;
  }
};

// Add new customer
export const addCustomer = async (customerData) => {
  try {
    // Generate customer ID
    const customer_id = generateCustomerId(customerData);
    
    const newCustomer = {
      ...customerData,
      customer_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(newCustomer),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to add customer');
    // }

    // const result = await response.json();
    
    // Mock successful response
    return {
      success: true,
      customer: newCustomer,
      message: 'Customer added successfully'
    };
  } catch (error) {
    console.error('Add customer error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add customer'
    };
  }
};

// Update existing customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const updatedCustomer = {
      ...customerData,
      customer_id: customerId,
      updated_at: new Date().toISOString()
    };

    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(updatedCustomer),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to update customer');
    // }

    // const result = await response.json();
    
    // Mock successful response
    return {
      success: true,
      customer: updatedCustomer,
      message: 'Customer updated successfully'
    };
  } catch (error) {
    console.error('Update customer error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update customer'
    };
  }
};

// Get customer details
export const getCustomerDetails = async (customerId) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
    
    // if (!response.ok) {
    //   throw new Error('Failed to fetch customer details');
    // }

    // const customer = await response.json();
    
    // Mock customer details
    const mockCustomer = {
      customer_id: customerId,
      name: 'John Doe',
      phone_number: '9876543210',
      email: 'john@example.com',
      customer_type: 'retail',
      business_name: '',
      billing_group: '',
      payment_terms: '',
      order_notification: false,
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400001',
      country: 'India',
      location_type: 'home',
      gst_number: '',
      tax_type: 'gst',
      tax_number: '',
      tax_exempt: false,
      discount: '5',
      promo_coupon: 'WELCOME10',
      store: 'main',
      price_list: 'standard',
      subscription_package: 'basic',
      loyalty_program: true,
      referral_program: false,
      preferences: 'Please handle with care. Prefers morning delivery.',
      loyalty_points: 150,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T15:45:00Z'
    };

    return mockCustomer;
  } catch (error) {
    console.error('Get customer details error:', error);
    throw error;
  }
};

// Get customer orders
export const getCustomerOrders = async (customerId) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers/${customerId}/orders`);
    
    // if (!response.ok) {
    //   throw new Error('Failed to fetch customer orders');
    // }

    // const orders = await response.json();
    
    // Mock orders data
    const mockOrders = [
      {
        order_id: 'ORD001',
        total_amount: 1250.00,
        status: 'completed',
        created_at: '2024-01-20T10:30:00Z',
        items: [
          { name: 'Shirt Wash', quantity: 2, price: 50 },
          { name: 'Trouser Press', quantity: 1, price: 75 }
        ]
      },
      {
        order_id: 'ORD002',
        total_amount: 850.00,
        status: 'in_progress',
        created_at: '2024-01-18T14:20:00Z',
        items: [
          { name: 'Dress Dry Clean', quantity: 1, price: 150 },
          { name: 'Suit Wash', quantity: 1, price: 200 }
        ]
      },
      {
        order_id: 'ORD003',
        total_amount: 650.00,
        status: 'completed',
        created_at: '2024-01-15T09:15:00Z',
        items: [
          { name: 'Shirt Wash', quantity: 3, price: 50 },
          { name: 'Jeans Wash', quantity: 2, price: 40 }
        ]
      }
    ];

    return mockOrders;
  } catch (error) {
    console.error('Get customer orders error:', error);
    throw error;
  }
};

// Get customer ledger
export const getCustomerLedger = async (customerId) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers/${customerId}/ledger`);
    
    // if (!response.ok) {
    //   throw new Error('Failed to fetch customer ledger');
    // }

    // const ledger = await response.json();
    
    // Mock ledger data
    const mockLedger = {
      total_amount: 2750.00,
      received_amount: 1900.00,
      pending_amount: 850.00,
      transactions: [
        {
          date: '2024-01-20T10:30:00Z',
          description: 'Order #ORD001 - Payment Received',
          amount: 1250.00,
          type: 'credit'
        },
        {
          date: '2024-01-18T14:20:00Z',
          description: 'Order #ORD002 - Service Charge',
          amount: 850.00,
          type: 'debit'
        },
        {
          date: '2024-01-15T09:15:00Z',
          description: 'Order #ORD003 - Payment Received',
          amount: 650.00,
          type: 'credit'
        }
      ]
    };

    return mockLedger;
  } catch (error) {
    console.error('Get customer ledger error:', error);
    throw error;
  }
};

// Delete customer (soft delete)
export const deleteCustomer = async (customerId) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    //   method: 'DELETE',
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to delete customer');
    // }

    return {
      success: true,
      message: 'Customer deleted successfully'
    };
  } catch (error) {
    console.error('Delete customer error:', error);
    return {
      error: true,
      message: error.message || 'Failed to delete customer'
    };
  }
};

// Get customer by phone number (for existing customer search)
export const getCustomerByPhone = async (phoneNumber) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/customers/phone/${phoneNumber}`);
    
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return { error: true, message: 'Customer not found' };
    //   }
    //   throw new Error('Failed to fetch customer');
    // }

    // const customer = await response.json();
    
    // Mock response - customer found
    if (phoneNumber === '9876543210') {
      return {
        success: true,
        customer: {
          customer_id: 'RET001',
          name: 'John Doe',
          phone_number: '9876543210',
          email: 'john@example.com',
          customer_type: 'retail',
          city: 'Mumbai',
          state: 'Maharashtra',
          address: '123 Main Street',
          gst_number: '',
          created_at: '2024-01-15T10:30:00Z'
        }
      };
    }

    // Mock response - customer not found
    return {
      error: true,
      message: 'Customer not found'
    };
  } catch (error) {
    console.error('Get customer by phone error:', error);
    return {
      error: true,
      message: error.message || 'Failed to fetch customer'
    };
  }
};