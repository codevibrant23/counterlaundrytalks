// Cash Register API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get current cash register status
export const getCashRegisterStatus = async () => {
  try {
    // Mock data for demonstration
    const mockStatus = {
      is_open: true,
      opened_at: '2024-01-25T09:00:00Z',
      opened_by: 'John Doe',
      opening_amount: 1000,
      opening_notes: 'Starting shift with standard float',
      current_sales: 2750.50,
      current_expenses: 150.00,
      expected_amount: 3600.50,
      shift_date: '2024-01-25'
    };

    return mockStatus;
  } catch (error) {
    console.error('Get cash register status error:', error);
    throw error;
  }
};

// Open cash register
export const openCashRegister = async (openingData) => {
  try {
    const registerData = {
      ...openingData,
      opened_at: new Date().toISOString(),
      opened_by: 'Current User', // Replace with actual user
      shift_date: new Date().toISOString().split('T')[0]
    };

    return {
      success: true,
      message: 'Cash register opened successfully',
      data: registerData
    };
  } catch (error) {
    console.error('Open cash register error:', error);
    return {
      error: true,
      message: error.message || 'Failed to open cash register'
    };
  }
};

// Close cash register
export const closeCashRegister = async (closingData) => {
  try {
    const closeData = {
      ...closingData,
      closed_at: new Date().toISOString(),
      closed_by: 'Current User' // Replace with actual user
    };

    return {
      success: true,
      message: 'Cash register closed successfully',
      data: closeData
    };
  } catch (error) {
    console.error('Close cash register error:', error);
    return {
      error: true,
      message: error.message || 'Failed to close cash register'
    };
  }
};

// Get cash register history
export const getCashRegisterHistory = async () => {
  try {
    const mockHistory = [
      {
        id: 'CR001',
        date: '2024-01-25',
        opened_at: '2024-01-25T09:00:00Z',
        closed_at: '2024-01-25T21:00:00Z',
        opened_by: 'John Doe',
        closed_by: 'John Doe',
        opening_amount: 1000,
        closing_amount: 3600.50,
        sales: 2750.50,
        expenses: 150.00,
        difference: 0,
        status: 'closed'
      },
      {
        id: 'CR002',
        date: '2024-01-24',
        opened_at: '2024-01-24T09:00:00Z',
        closed_at: '2024-01-24T21:30:00Z',
        opened_by: 'Jane Smith',
        closed_by: 'Jane Smith',
        opening_amount: 1000,
        closing_amount: 4200.75,
        sales: 3350.75,
        expenses: 150.00,
        difference: 0,
        status: 'closed'
      }
    ];

    return mockHistory;
  } catch (error) {
    console.error('Get cash register history error:', error);
    throw error;
  }
};

// Add expense
export const addExpense = async (expenseData) => {
  try {
    const expense = {
      ...expenseData,
      id: `EXP${Date.now()}`,
      created_at: new Date().toISOString(),
      created_by: 'Current User'
    };

    return {
      success: true,
      message: 'Expense added successfully',
      data: expense
    };
  } catch (error) {
    console.error('Add expense error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add expense'
    };
  }
};

// Get expenses for current shift
export const getCurrentShiftExpenses = async () => {
  try {
    const mockExpenses = [
      {
        id: 'EXP001',
        amount: 50.00,
        description: 'Office supplies',
        category: 'supplies',
        created_at: '2024-01-25T10:30:00Z',
        created_by: 'John Doe'
      },
      {
        id: 'EXP002',
        amount: 100.00,
        description: 'Fuel for delivery vehicle',
        category: 'fuel',
        created_at: '2024-01-25T14:15:00Z',
        created_by: 'John Doe'
      }
    ];

    return mockExpenses;
  } catch (error) {
    console.error('Get current shift expenses error:', error);
    throw error;
  }
};