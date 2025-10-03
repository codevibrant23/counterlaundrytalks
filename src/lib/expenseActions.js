// Expense and Income API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get expense categories
export const getExpenseCategories = async () => {
  try {
    const mockCategories = [
      { id: 'supplies', name: 'Office Supplies', description: 'Stationery, cleaning supplies, etc.' },
      { id: 'fuel', name: 'Fuel', description: 'Vehicle fuel and transportation' },
      { id: 'maintenance', name: 'Maintenance', description: 'Equipment and facility maintenance' },
      { id: 'utilities', name: 'Utilities', description: 'Electricity, water, internet bills' },
      { id: 'marketing', name: 'Marketing', description: 'Advertising and promotional expenses' },
      { id: 'other', name: 'Other', description: 'Miscellaneous expenses' }
    ];
    return mockCategories;
  } catch (error) {
    console.error('Get expense categories error:', error);
    throw error;
  }
};

// Add expense category
export const addExpenseCategory = async (categoryData) => {
  try {
    const newCategory = {
      id: `cat_${Date.now()}`,
      ...categoryData,
      created_at: new Date().toISOString()
    };
    return {
      success: true,
      message: 'Category added successfully',
      data: newCategory
    };
  } catch (error) {
    console.error('Add expense category error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add category'
    };
  }
};

// Get income reasons
export const getIncomeReasons = async () => {
  try {
    const mockReasons = [
      { id: 'refund', name: 'Customer Refund Return', description: 'Money returned from customer refunds' },
      { id: 'deposit', name: 'Security Deposit', description: 'Customer security deposits' },
      { id: 'advance', name: 'Advance Payment', description: 'Advance payments from customers' },
      { id: 'misc', name: 'Miscellaneous Income', description: 'Other income sources' }
    ];
    return mockReasons;
  } catch (error) {
    console.error('Get income reasons error:', error);
    throw error;
  }
};

// Add income reason
export const addIncomeReason = async (reasonData) => {
  try {
    const newReason = {
      id: `reason_${Date.now()}`,
      ...reasonData,
      created_at: new Date().toISOString()
    };
    return {
      success: true,
      message: 'Income reason added successfully',
      data: newReason
    };
  } catch (error) {
    console.error('Add income reason error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add income reason'
    };
  }
};

// Add expense
export const addExpenseEntry = async (expenseData) => {
  try {
    const expense = {
      id: `exp_${Date.now()}`,
      ...expenseData,
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

// Add income
export const addIncomeEntry = async (incomeData) => {
  try {
    const income = {
      id: `inc_${Date.now()}`,
      ...incomeData,
      created_at: new Date().toISOString(),
      created_by: 'Current User'
    };
    return {
      success: true,
      message: 'Income added successfully',
      data: income
    };
  } catch (error) {
    console.error('Add income error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add income'
    };
  }
};

// Get staff list
export const getStaffList = async () => {
  try {
    const mockStaff = [
      { id: 'staff_1', name: 'John Manager', role: 'Manager' },
      { id: 'staff_2', name: 'Jane Counter', role: 'Counter Staff' },
      { id: 'staff_3', name: 'Mike Delivery', role: 'Delivery Boy' },
      { id: 'staff_4', name: 'Sarah Workshop', role: 'Workshop Staff' }
    ];
    return mockStaff;
  } catch (error) {
    console.error('Get staff list error:', error);
    throw error;
  }
};