// Order API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get all orders
export const getAllOrders = async () => {
  try {
    const mockOrders = [
      {
        order_id: 'ORD001',
        order_number: 'LT240001',
        order_date: '2024-01-25T10:30:00Z',
        customer_id: 'RET001',
        customer_name: 'John Doe',
        phone_number: '9876543210',
        address: '123 Main Street, Apartment 4B',
        pickup_date: '2024-01-26T14:00:00Z',
        store: 'Main Store',
        status: 'processing',
        items: [
          { name: 'Shirt Wash', quantity: 3, price: 50, total: 150 },
          { name: 'Trouser Press', quantity: 2, price: 75, total: 150 }
        ],
        total_items: 5,
        discount: 10,
        promo_code: 'WELCOME10',
        promo_amount: 30,
        credits_amount: 0,
        notes: 'Handle with care',
        tip: 20,
        tax_amount: 27,
        total_amount: 297,
        due_date: '2024-01-28T18:00:00Z',
        payment_type: 'cash',
        pending_amount: 297,
        payment_status: 'pending',
        adjustment_amount: 0,
        workshop_notes: '',
        created_at: '2024-01-25T10:30:00Z'
      },
      {
        order_id: 'ORD002',
        order_number: 'LT240002',
        order_date: '2024-01-24T15:20:00Z',
        customer_id: 'COM001',
        customer_name: 'Jane Smith',
        phone_number: '9876543211',
        address: '456 Business Park, Sector 18',
        pickup_date: '2024-01-25T11:00:00Z',
        store: 'Downtown Store',
        status: 'cleaning',
        items: [
          { name: 'Suit Dry Clean', quantity: 2, price: 200, total: 400 },
          { name: 'Dress Wash', quantity: 1, price: 120, total: 120 }
        ],
        total_items: 3,
        discount: 5,
        promo_code: '',
        promo_amount: 0,
        credits_amount: 50,
        notes: 'VIP customer',
        tip: 0,
        tax_amount: 46.8,
        total_amount: 511.8,
        due_date: '2024-01-27T17:00:00Z',
        payment_type: 'card',
        pending_amount: 0,
        payment_status: 'paid',
        adjustment_amount: 0,
        workshop_notes: 'Delicate fabric - use gentle cycle',
        created_at: '2024-01-24T15:20:00Z'
      },
      {
        order_id: 'ORD003',
        order_number: 'LT240003',
        order_date: '2024-01-23T09:15:00Z',
        customer_id: 'RET002',
        customer_name: 'Mike Johnson',
        phone_number: '9876543212',
        address: '789 Tech Street',
        pickup_date: '2024-01-24T16:30:00Z',
        store: 'Tech Hub Store',
        status: 'ready',
        items: [
          { name: 'Jeans Wash', quantity: 4, price: 40, total: 160 },
          { name: 'T-shirt Wash', quantity: 6, price: 25, total: 150 }
        ],
        total_items: 10,
        discount: 0,
        promo_code: '',
        promo_amount: 0,
        credits_amount: 0,
        notes: 'Regular customer',
        tip: 15,
        tax_amount: 31,
        total_amount: 356,
        due_date: '2024-01-26T18:00:00Z',
        payment_type: 'upi',
        pending_amount: 0,
        payment_status: 'paid',
        adjustment_amount: 0,
        workshop_notes: '',
        created_at: '2024-01-23T09:15:00Z'
      }
    ];

    return mockOrders;
  } catch (error) {
    console.error('Get all orders error:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    return {
      success: true,
      message: `Order status updated to ${newStatus}`
    };
  } catch (error) {
    console.error('Update order status error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update order status'
    };
  }
};

// Send invoice
export const sendInvoice = async (orderId, type) => {
  try {
    return {
      success: true,
      message: `${type} invoice sent successfully`
    };
  } catch (error) {
    console.error('Send invoice error:', error);
    return {
      error: true,
      message: error.message || 'Failed to send invoice'
    };
  }
};

// Assign delivery
export const assignDelivery = async (orderId, deliveryData) => {
  try {
    return {
      success: true,
      message: 'Delivery assigned successfully'
    };
  } catch (error) {
    console.error('Assign delivery error:', error);
    return {
      error: true,
      message: error.message || 'Failed to assign delivery'
    };
  }
};

// Process refund
export const processRefund = async (orderId, refundData) => {
  try {
    return {
      success: true,
      message: 'Refund processed successfully'
    };
  } catch (error) {
    console.error('Process refund error:', error);
    return {
      error: true,
      message: error.message || 'Failed to process refund'
    };
  }
};

// Get challans
export const getChallans = async () => {
  try {
    const mockChallans = [
      {
        challan_id: 'CH001',
        challan_number: 'CH240001',
        type: 'given',
        from_location: 'Main Store',
        to_location: 'Central Plant',
        date: '2024-01-25T10:00:00Z',
        items_count: 25,
        orders: ['LT240001', 'LT240002'],
        status: 'in_transit',
        created_by: 'Store Manager'
      },
      {
        challan_id: 'CH002',
        challan_number: 'CH240002',
        type: 'received',
        from_location: 'Central Plant',
        to_location: 'Main Store',
        date: '2024-01-24T16:30:00Z',
        items_count: 18,
        orders: ['LT240003', 'LT240004'],
        status: 'completed',
        created_by: 'Plant Manager'
      }
    ];

    return mockChallans;
  } catch (error) {
    console.error('Get challans error:', error);
    throw error;
  }
};