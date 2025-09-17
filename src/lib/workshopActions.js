// Workshop API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD001',
    customer_name: 'John Doe',
    customer_phone: '9876543210',
    status: 'ready_for_workshop',
    total_amount: 250,
    items_count: 3,
    created_at: '2024-01-15T10:30:00Z',
    collection_date: '2024-01-20T10:00:00Z',
    bill_barcode: 'ORD001_BILL',
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
    status: 'pending',
    total_amount: 180,
    items_count: 2,
    created_at: '2024-01-16T14:20:00Z',
    collection_date: '2024-01-21T15:00:00Z',
    bill_barcode: 'ORD002_BILL',
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
    status: 'in_workshop',
    total_amount: 320,
    items_count: 4,
    created_at: '2024-01-14T09:15:00Z',
    collection_date: '2024-01-19T11:00:00Z',
    bill_barcode: 'ORD003_BILL',
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
    status: 'ready_for_workshop',
    total_amount: 95,
    items_count: 2,
    created_at: '2024-01-17T16:45:00Z',
    collection_date: '2024-01-22T12:00:00Z',
    bill_barcode: 'ORD004_BILL',
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
  },
  {
    id: 'ORD005',
    customer_name: 'David Brown',
    customer_phone: '9876543214',
    status: 'completed',
    total_amount: 200,
    items_count: 1,
    created_at: '2024-01-12T11:30:00Z',
    collection_date: '2024-01-17T14:00:00Z',
    bill_barcode: 'ORD005_BILL',
    items: [
      {
        id: 10,
        name: 'Wedding Dress Dry Clean',
        quantity: 1,
        price: 200,
        tag_barcode: 'ITEM_10_TAG',
        customizations: { material: 'Silk', delicate: true }
      }
    ]
  }
];

// Get all orders
export const getOrders = async () => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/orders`);
    // if (!response.ok) throw new Error('Failed to fetch orders');
    // const orders = await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockOrders;
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

// Get order by barcode (bill or item)
export const getOrderByBarcode = async (barcode) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/orders/barcode/${barcode}`);
    // if (!response.ok) throw new Error('Order not found');
    // const order = await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find order by bill barcode
    let order = mockOrders.find(o => o.bill_barcode === barcode);
    
    // If not found by bill barcode, search by item tag barcode
    if (!order) {
      order = mockOrders.find(o => 
        o.items?.some(item => item.tag_barcode === barcode)
      );
    }
    
    return order || null;
  } catch (error) {
    console.error('Get order by barcode error:', error);
    throw error;
  }
};

// Send multiple orders to workshop
export const sendMultipleOrdersToWorkshop = async (workshopData) => {
  try {
    // Mock API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update order statuses in mock data
    workshopData.orders.forEach(orderData => {
      const orderIndex = mockOrders.findIndex(o => o.id === orderData.order.id);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = 'in_workshop';
        mockOrders[orderIndex].workshop_sent_at = workshopData.sent_at;
        mockOrders[orderIndex].workshop_notes = workshopData.workshop_notes;
      }
    });
    
    // Send notification (mock)
    await sendWorkshopNotification({
      ...workshopData,
      order_count: workshopData.orders.length,
      total_items: workshopData.orders.reduce((sum, orderData) => sum + orderData.scannedItems.length, 0)
    });
    
    // Print challan (mock)
    await printMultipleOrdersChallan(workshopData);
    
    return {
      success: true,
      message: `${workshopData.orders.length} orders sent to workshop successfully`,
      workshop_id: `WS${Date.now()}`,
      notification_sent: true,
      challan_printed: true
    };
  } catch (error) {
    console.error('Send multiple orders to workshop error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send orders to workshop'
    };
  }
};

// Send order to workshop
export const sendOrderToWorkshop = async (workshopData) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/workshop/send`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(workshopData)
    // });
    // if (!response.ok) throw new Error('Failed to send to workshop');
    // const result = await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update order status in mock data
    const orderIndex = mockOrders.findIndex(o => o.id === workshopData.order_id);
    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = 'in_workshop';
      mockOrders[orderIndex].workshop_sent_at = workshopData.sent_at;
      mockOrders[orderIndex].workshop_notes = workshopData.workshop_notes;
    }
    
    // Send notification (mock)
    await sendWorkshopNotification(workshopData);
    
    // Print challan (mock)
    await printWorkshopChallan(workshopData);
    
    return {
      success: true,
      message: 'Order sent to workshop successfully',
      workshop_id: `WS${Date.now()}`,
      notification_sent: true,
      challan_printed: true
    };
  } catch (error) {
    console.error('Send to workshop error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send to workshop'
    };
  }
};

// Send notification to workshop
const sendWorkshopNotification = async (workshopData) => {
  try {
    const notificationData = {
      order_id: workshopData.order_id,
      method: workshopData.notification_method,
      message: `New order ${workshopData.order_id} sent to workshop. ${workshopData.scanned_items.length} items included.`,
      recipient: 'workshop_manager', // In real app, get from settings
      sent_at: new Date().toISOString()
    };
    
    // Mock notification sending
    console.log('Workshop notification sent:', notificationData);
    
    // In real app, integrate with SMS/WhatsApp/Email services
    switch (workshopData.notification_method) {
      case 'whatsapp':
        // await sendWhatsAppMessage(notificationData);
        break;
      case 'sms':
        // await sendSMSMessage(notificationData);
        break;
      case 'email':
        // await sendEmailNotification(notificationData);
        break;
      case 'plant_device':
        // await sendToPlantDevice(notificationData);
        break;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Notification error:', error);
    return { success: false, error: error.message };
  }
};

// Print multiple orders challan
const printMultipleOrdersChallan = async (workshopData) => {
  try {
    const challanData = {
      challan_id: `CH${Date.now()}`,
      order_count: workshopData.orders.length,
      orders: workshopData.orders.map(orderData => ({
        order_id: orderData.order.id,
        customer_name: orderData.order.customer_name,
        customer_phone: orderData.order.customer_phone,
        scanned_items: orderData.scannedItems,
        total_items: orderData.totalItems
      })),
      workshop_notes: workshopData.workshop_notes,
      sent_by: workshopData.sent_by,
      sent_at: workshopData.sent_at,
      request_pickup: workshopData.request_pickup,
      total_items: workshopData.orders.reduce((sum, orderData) => sum + orderData.scannedItems.length, 0)
    };
    
    // Mock challan printing
    console.log('Multiple orders challan printed:', challanData);
    
    return { success: true, challan_id: challanData.challan_id };
  } catch (error) {
    console.error('Print multiple orders challan error:', error);
    return { success: false, error: error.message };
  }
};

// Print workshop challan
const printWorkshopChallan = async (workshopData) => {
  try {
    const order = mockOrders.find(o => o.id === workshopData.order_id);
    if (!order) throw new Error('Order not found');
    
    const challanData = {
      challan_id: `CH${Date.now()}`,
      order_id: workshopData.order_id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      items: workshopData.scanned_items,
      workshop_notes: workshopData.workshop_notes,
      sent_by: workshopData.sent_by,
      sent_at: workshopData.sent_at,
      request_pickup: workshopData.request_pickup
    };
    
    // Mock challan printing
    console.log('Workshop challan printed:', challanData);
    
    // In real app, send to printer or generate PDF
    // await printChallan(challanData);
    
    return { success: true, challan_id: challanData.challan_id };
  } catch (error) {
    console.error('Print challan error:', error);
    return { success: false, error: error.message };
  }
};

// Get workshop status
export const getWorkshopStatus = async () => {
  try {
    // Mock API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = {
      pending: mockOrders.filter(o => o.status === 'pending').length,
      ready_for_workshop: mockOrders.filter(o => o.status === 'ready_for_workshop').length,
      in_workshop: mockOrders.filter(o => o.status === 'in_workshop').length,
      completed: mockOrders.filter(o => o.status === 'completed').length,
      total: mockOrders.length
    };
    
    return stats;
  } catch (error) {
    console.error('Get workshop status error:', error);
    throw error;
  }
};

// Search orders
export const searchOrders = async (searchTerm, searchType, statusFilter) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...mockOrders];
    
    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        switch (searchType) {
          case 'customer_name':
            return order.customer_name?.toLowerCase().includes(term);
          case 'order_id':
            return order.id?.toLowerCase().includes(term);
          case 'phone':
            return order.customer_phone?.includes(searchTerm);
          default:
            return (
              order.customer_name?.toLowerCase().includes(term) ||
              order.id?.toLowerCase().includes(term) ||
              order.customer_phone?.includes(searchTerm)
            );
        }
      });
    }
    
    return filtered;
  } catch (error) {
    console.error('Search orders error:', error);
    throw error;
  }
};