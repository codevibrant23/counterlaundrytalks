// Pickup API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generate pickup number
const generatePickupNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `PU${timestamp}`;
};

// Get all pickups
export const getAllPickups = async () => {
  try {
    // Mock data for demonstration
    const mockPickups = [
      {
        pickup_id: 'PU001',
        pickup_number: 'PU240001',
        customer_id: 'RET001',
        customer_name: 'John Doe',
        phone_number: '9876543210',
        email: 'john@example.com',
        address: '123 Main Street, Apartment 4B',
        area: 'downtown',
        pickup_date: '2024-01-25',
        pickup_time: '10:00 AM',
        status: 'pending',
        assigned_to: '',
        notes: 'Please call before arriving',
        notification_sent: false,
        created_at: '2024-01-20T10:30:00Z',
        updated_at: '2024-01-20T10:30:00Z'
      },
      {
        pickup_id: 'PU002',
        pickup_number: 'PU240002',
        customer_id: 'COM001',
        customer_name: 'Jane Smith',
        phone_number: '9876543211',
        email: 'jane@business.com',
        address: '456 Business Park, Sector 18',
        area: 'suburbs',
        pickup_date: '2024-01-24',
        pickup_time: '2:00 PM',
        status: 'assigned',
        assigned_to: 'Raj Kumar',
        notes: 'Large order - bring extra bags',
        notification_sent: true,
        created_at: '2024-01-22T14:20:00Z',
        updated_at: '2024-01-23T09:15:00Z'
      },
      {
        pickup_id: 'PU003',
        pickup_number: 'PU240003',
        customer_id: 'RET002',
        customer_name: 'Mike Johnson',
        phone_number: '9876543212',
        email: 'mike@gmail.com',
        address: '789 Tech Street',
        area: 'uptown',
        pickup_date: '2024-01-23',
        pickup_time: '11:30 AM',
        status: 'completed',
        assigned_to: 'Amit Singh',
        notes: 'Regular customer - knows the routine',
        notification_sent: true,
        created_at: '2024-01-21T09:15:00Z',
        updated_at: '2024-01-23T12:00:00Z'
      },
      {
        pickup_id: 'PU004',
        pickup_number: 'PU240004',
        customer_id: 'RET003',
        customer_name: 'David Brown',
        phone_number: '9876543214',
        email: 'david@yahoo.com',
        address: '654 Marina Drive',
        area: 'downtown',
        pickup_date: '2024-01-26',
        pickup_time: '3:30 PM',
        status: 'in_transit',
        assigned_to: 'Suresh Patel',
        notes: 'Fragile items - handle with care',
        notification_sent: true,
        created_at: '2024-01-24T11:30:00Z',
        updated_at: '2024-01-26T15:00:00Z'
      },
      {
        pickup_id: 'PU005',
        pickup_number: 'PU240005',
        customer_id: 'RET004',
        customer_name: 'Lisa Anderson',
        phone_number: '9876543215',
        email: 'lisa@hotmail.com',
        address: '987 Hi-Tech City',
        area: 'suburbs',
        pickup_date: '2024-01-22',
        pickup_time: '9:00 AM',
        status: 'cancelled',
        assigned_to: '',
        notes: 'Customer cancelled due to emergency',
        notification_sent: true,
        cancellation_reason: 'Customer emergency',
        created_at: '2024-01-20T13:20:00Z',
        updated_at: '2024-01-22T08:30:00Z'
      }
    ];

    return mockPickups;
  } catch (error) {
    console.error('Get all pickups error:', error);
    throw error;
  }
};

// Search pickups
export const searchPickups = async (searchTerm, searchType) => {
  try {
    const allPickups = await getAllPickups();

    if (!searchTerm.trim()) {
      return allPickups;
    }

    const filteredPickups = allPickups.filter(pickup => {
      const term = searchTerm.toLowerCase();
      switch (searchType) {
        case 'customer':
          return pickup.customer_name.toLowerCase().includes(term);
        case 'phone':
          return pickup.phone_number.includes(searchTerm);
        case 'pickup_number':
          return pickup.pickup_number.toLowerCase().includes(term);
        default:
          return pickup.customer_name.toLowerCase().includes(term) ||
                 pickup.phone_number.includes(searchTerm) ||
                 pickup.pickup_number.toLowerCase().includes(term);
      }
    });

    return filteredPickups;
  } catch (error) {
    console.error('Search pickups error:', error);
    throw error;
  }
};

// Schedule new pickup
export const schedulePickup = async (pickupData) => {
  try {
    const pickup_number = generatePickupNumber();
    
    const newPickup = {
      ...pickupData,
      pickup_id: `PU${Date.now()}`,
      pickup_number,
      status: 'pending',
      notification_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Mock successful response
    return {
      success: true,
      pickup: newPickup,
      message: 'Pickup scheduled successfully'
    };
  } catch (error) {
    console.error('Schedule pickup error:', error);
    return {
      error: true,
      message: error.message || 'Failed to schedule pickup'
    };
  }
};

// Update pickup
export const updatePickup = async (pickupId, updateData) => {
  try {
    const updatedPickup = {
      ...updateData,
      pickup_id: pickupId,
      updated_at: new Date().toISOString()
    };

    return {
      success: true,
      pickup: updatedPickup,
      message: 'Pickup updated successfully'
    };
  } catch (error) {
    console.error('Update pickup error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update pickup'
    };
  }
};

// Cancel pickup
export const cancelPickup = async (pickupId, reason) => {
  try {
    return {
      success: true,
      message: 'Pickup cancelled successfully'
    };
  } catch (error) {
    console.error('Cancel pickup error:', error);
    return {
      error: true,
      message: error.message || 'Failed to cancel pickup'
    };
  }
};

// Reschedule pickup
export const reschedulePickup = async (pickupId, newDate, newTime, reason) => {
  try {
    return {
      success: true,
      message: 'Pickup rescheduled successfully'
    };
  } catch (error) {
    console.error('Reschedule pickup error:', error);
    return {
      error: true,
      message: error.message || 'Failed to reschedule pickup'
    };
  }
};

// Get delivery personnel list
export const getDeliveryPersonnel = async () => {
  try {
    const mockPersonnel = [
      { id: 'DP001', name: 'Raj Kumar', phone: '9876543220', area: 'downtown', active: true },
      { id: 'DP002', name: 'Amit Singh', phone: '9876543221', area: 'suburbs', active: true },
      { id: 'DP003', name: 'Suresh Patel', phone: '9876543222', area: 'uptown', active: true },
      { id: 'DP004', name: 'Vikram Sharma', phone: '9876543223', area: 'downtown', active: false },
      { id: 'DP005', name: 'Rohit Gupta', phone: '9876543224', area: 'suburbs', active: true }
    ];

    return mockPersonnel.filter(person => person.active);
  } catch (error) {
    console.error('Get delivery personnel error:', error);
    throw error;
  }
};

// Send notification
export const sendNotification = async (pickupId, notificationType) => {
  try {
    // Mock notification sending
    return {
      success: true,
      message: `${notificationType} notification sent successfully`
    };
  } catch (error) {
    console.error('Send notification error:', error);
    return {
      error: true,
      message: error.message || 'Failed to send notification'
    };
  }
};