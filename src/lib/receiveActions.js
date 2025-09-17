// Receive from Workshop API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mock orders data (orders that are in workshop or ready for pickup)
const mockWorkshopOrders = [
  {
    id: 'ORD001',
    customer_name: 'John Doe',
    customer_phone: '9876543210',
    status: 'in_workshop',
    total_amount: 250,
    items_count: 3,
    created_at: '2024-01-15T10:30:00Z',
    collection_date: '2024-01-20T10:00:00Z',
    challan_barcode: 'CH001_CHALLAN',
    workshop_delivery: false,
    items: [
      {
        id: 1,
        name: 'Shirt Dry Clean',
        quantity: 2,
        price: 50,
        tag_barcode: 'ITEM_1_TAG',
        customizations: { color: 'White', hanger: true }
      },
      {
        id: 2,
        name: 'Trouser Press',
        quantity: 1,
        price: 75,
        tag_barcode: 'ITEM_2_TAG',
        customizations: { starch: 'Light' }
      },
      {
        id: 3,
        name: 'Dress Dry Clean',
        quantity: 1,
        price: 125,
        tag_barcode: 'ITEM_3_TAG',
        customizations: { material: 'Silk', box: true }
      }
    ]
  },
  {
    id: 'ORD002',
    customer_name: 'Jane Smith',
    customer_phone: '9876543211',
    status: 'in_workshop',
    total_amount: 180,
    items_count: 2,
    created_at: '2024-01-16T14:20:00Z',
    collection_date: '2024-01-21T15:00:00Z',
    challan_barcode: 'CH002_CHALLAN',
    workshop_delivery: true, // Workshop is handling delivery
    items: [
      {
        id: 4,
        name: 'Suit Dry Clean',
        quantity: 1,
        price: 150,
        tag_barcode: 'ITEM_4_TAG',
        customizations: { brand: 'Armani' }
      },
      {
        id: 5,
        name: 'Shirt Wash',
        quantity: 1,
        price: 30,
        tag_barcode: 'ITEM_5_TAG',
        customizations: { washTemperature: 'Cold' }
      }
    ]
  },
  {
    id: 'ORD003',
    customer_name: 'Mike Johnson',
    customer_phone: '9876543212',
    status: 'ready_for_pickup',
    total_amount: 320,
    items_count: 4,
    created_at: '2024-01-14T09:15:00Z',
    collection_date: '2024-01-19T11:00:00Z',
    challan_barcode: 'CH003_CHALLAN',
    workshop_delivery: false,
    items: [
      {
        id: 6,
        name: 'Bedsheet Wash',
        quantity: 2,
        price: 60,
        tag_barcode: 'ITEM_6_TAG'
      },
      {
        id: 7,
        name: 'Curtain Dry Clean',
        quantity: 2,
        price: 100,
        tag_barcode: 'ITEM_7_TAG'
      }
    ]
  },
  {
    id: 'ORD004',
    customer_name: 'Sarah Wilson',
    customer_phone: '9876543213',
    status: 'in_workshop',
    total_amount: 95,
    items_count: 2,
    created_at: '2024-01-17T16:45:00Z',
    collection_date: '2024-01-22T12:00:00Z',
    challan_barcode: 'CH004_CHALLAN',
    workshop_delivery: false,
    items: [
      {
        id: 8,
        name: 'Jeans Wash',
        quantity: 2,
        price: 40,
        tag_barcode: 'ITEM_8_TAG'
      },
      {
        id: 9,
        name: 'T-shirt Wash',
        quantity: 1,
        price: 15,
        tag_barcode: 'ITEM_9_TAG'
      }
    ]
  }
];

// Get orders from workshop
export const getWorkshopOrders = async () => {
  try {
    // Mock API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockWorkshopOrders;
  } catch (error) {
    console.error('Get workshop orders error:', error);
    throw error;
  }
};

// Get order by challan barcode
export const getOrderByChallan = async (challanBarcode) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find order by challan barcode or bill barcode
    const order = mockWorkshopOrders.find(o => 
      o.challan_barcode === challanBarcode || 
      o.id + '_BILL' === challanBarcode
    );
    
    return order || null;
  } catch (error) {
    console.error('Get order by challan error:', error);
    throw error;
  }
};

// Receive single order from workshop
export const receiveOrderFromWorkshop = async (receiveData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update order status in mock data
    const orderIndex = mockWorkshopOrders.findIndex(o => o.id === receiveData.order_id);
    if (orderIndex !== -1) {
      mockWorkshopOrders[orderIndex].status = 'ready_for_pickup';
      mockWorkshopOrders[orderIndex].received_at = receiveData.received_at;
      mockWorkshopOrders[orderIndex].delivery_mode = receiveData.delivery_mode;
      mockWorkshopOrders[orderIndex].assigned_driver = receiveData.assigned_driver;
      mockWorkshopOrders[orderIndex].payment_type = receiveData.payment_type;
    }
    
    // Send notifications if there are missing items
    if (receiveData.missing_items.length > 0) {
      await sendWorkshopIssueNotification(receiveData);
    }
    
    // Send customer notification
    await sendCustomerNotification(receiveData);
    
    // Print bill
    await printCustomerBill(receiveData);
    
    return {
      success: true,
      message: 'Order received successfully',
      order_id: receiveData.order_id,
      notifications_sent: true,
      bill_printed: true
    };
  } catch (error) {
    console.error('Receive order error:', error);
    return {
      success: false,
      message: error.message || 'Failed to receive order'
    };
  }
};

// Receive multiple orders from workshop
export const receiveMultipleOrdersFromWorkshop = async (receiveData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update order statuses in mock data
    receiveData.orders.forEach(orderData => {
      const orderIndex = mockWorkshopOrders.findIndex(o => o.id === orderData.order.id);
      if (orderIndex !== -1) {
        mockWorkshopOrders[orderIndex].status = 'ready_for_pickup';
        mockWorkshopOrders[orderIndex].received_at = receiveData.received_at;
        mockWorkshopOrders[orderIndex].delivery_mode = orderData.deliveryMode;
        mockWorkshopOrders[orderIndex].assigned_driver = orderData.assignedDriver;
        mockWorkshopOrders[orderIndex].payment_type = orderData.paymentType;
      }
    });
    
    // Send notifications for missing items
    const ordersWithIssues = receiveData.orders.filter(orderData => orderData.missingItems.length > 0);
    if (ordersWithIssues.length > 0) {
      await sendMultipleOrdersIssueNotification({
        ...receiveData,
        orders_with_issues: ordersWithIssues
      });
    }
    
    // Send customer notifications for all orders
    await sendMultipleCustomerNotifications(receiveData);
    
    // Print bills for all orders
    await printMultipleCustomerBills(receiveData);
    
    return {
      success: true,
      message: `${receiveData.orders.length} orders received successfully`,
      order_count: receiveData.orders.length,
      notifications_sent: true,
      bills_printed: true
    };
  } catch (error) {
    console.error('Receive multiple orders error:', error);
    return {
      success: false,
      message: error.message || 'Failed to receive orders'
    };
  }
};

// Send workshop issue notification
const sendWorkshopIssueNotification = async (receiveData) => {
  try {
    const notificationData = {
      order_id: receiveData.order_id,
      missing_items: receiveData.missing_items,
      issue_reason: receiveData.issue_reason,
      issue_notes: receiveData.issue_notes,
      message: `Order ${receiveData.order_id} has ${receiveData.missing_items.length} missing items. Reason: ${receiveData.issue_reason}`,
      recipient: 'workshop_manager',
      sent_at: new Date().toISOString()
    };
    
    console.log('Workshop issue notification sent:', notificationData);
    
    // In real app, integrate with SMS/WhatsApp/Email services
    return { success: true };
  } catch (error) {
    console.error('Workshop issue notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send multiple orders issue notification
const sendMultipleOrdersIssueNotification = async (receiveData) => {
  try {
    const totalMissingItems = receiveData.orders_with_issues.reduce(
      (sum, orderData) => sum + orderData.missingItems.length, 0
    );
    
    const notificationData = {
      order_count: receiveData.orders_with_issues.length,
      total_missing_items: totalMissingItems,
      global_issue_reason: receiveData.global_issue_reason,
      global_issue_notes: receiveData.global_issue_notes,
      message: `${receiveData.orders_with_issues.length} orders have missing items (${totalMissingItems} total). Reason: ${receiveData.global_issue_reason}`,
      recipient: 'workshop_manager',
      sent_at: new Date().toISOString()
    };
    
    console.log('Multiple orders issue notification sent:', notificationData);
    
    return { success: true };
  } catch (error) {
    console.error('Multiple orders issue notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send customer notification
const sendCustomerNotification = async (receiveData) => {
  try {
    const order = mockWorkshopOrders.find(o => o.id === receiveData.order_id);
    if (!order) return { success: false };
    
    const notificationData = {
      order_id: receiveData.order_id,
      customer_phone: order.customer_phone,
      delivery_mode: receiveData.delivery_mode,
      payment_type: receiveData.payment_type,
      message: receiveData.delivery_mode === 'pickup' 
        ? `Your order ${receiveData.order_id} is ready for pickup!`
        : `Your order ${receiveData.order_id} will be delivered soon!`,
      payment_link: receiveData.payment_type === 'cod' ? null : 'https://pay.laundrytalks.com/order/' + receiveData.order_id,
      sent_at: new Date().toISOString()
    };
    
    console.log('Customer notification sent:', notificationData);
    
    // In real app, send SMS/WhatsApp/Email
    return { success: true };
  } catch (error) {
    console.error('Customer notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send multiple customer notifications
const sendMultipleCustomerNotifications = async (receiveData) => {
  try {
    const notifications = receiveData.orders.map(orderData => ({
      order_id: orderData.order.id,
      customer_phone: orderData.order.customer_phone,
      delivery_mode: orderData.deliveryMode,
      payment_type: orderData.paymentType,
      message: orderData.deliveryMode === 'pickup' 
        ? `Your order ${orderData.order.id} is ready for pickup!`
        : `Your order ${orderData.order.id} will be delivered soon!`,
      payment_link: orderData.paymentType === 'cod' ? null : 'https://pay.laundrytalks.com/order/' + orderData.order.id
    }));
    
    console.log('Multiple customer notifications sent:', notifications);
    
    return { success: true, count: notifications.length };
  } catch (error) {
    console.error('Multiple customer notifications error:', error);
    return { success: false, error: error.message };
  }
};

// Print customer bill
const printCustomerBill = async (receiveData) => {
  try {
    const order = mockWorkshopOrders.find(o => o.id === receiveData.order_id);
    if (!order) return { success: false };
    
    const billData = {
      order_id: receiveData.order_id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      items: receiveData.scanned_items,
      missing_items: receiveData.missing_items,
      total_amount: order.total_amount,
      delivery_mode: receiveData.delivery_mode,
      payment_type: receiveData.payment_type,
      assigned_driver: receiveData.assigned_driver,
      printed_at: new Date().toISOString()
    };
    
    console.log('Customer bill printed:', billData);
    
    return { success: true, bill_id: `BILL_${Date.now()}` };
  } catch (error) {
    console.error('Print customer bill error:', error);
    return { success: false, error: error.message };
  }
};

// Print multiple customer bills
const printMultipleCustomerBills = async (receiveData) => {
  try {
    const bills = receiveData.orders.map(orderData => ({
      order_id: orderData.order.id,
      customer_name: orderData.order.customer_name,
      customer_phone: orderData.order.customer_phone,
      items: orderData.scannedItems,
      missing_items: orderData.missingItems,
      total_amount: orderData.order.total_amount,
      delivery_mode: orderData.deliveryMode,
      payment_type: orderData.paymentType,
      assigned_driver: orderData.assignedDriver
    }));
    
    console.log('Multiple customer bills printed:', bills);
    
    return { success: true, bill_count: bills.length };
  } catch (error) {
    console.error('Print multiple customer bills error:', error);
    return { success: false, error: error.message };
  }
};