// Mock data for development when API is not available

export const mockCategories = {
  categories: [
    "Shirts",
    "Pants", 
    "Dresses",
    "Jackets",
    "Bedding",
    "Curtains",
    "Dry Clean Only"
  ]
};

export const mockProducts = {
  products: [
    {
      id: 1,
      item_name: "Cotton Shirt",
      rate_per_unit: 25,
      category: "Shirts",
      description: "Regular cotton shirt cleaning"
    },
    {
      id: 2,
      item_name: "Formal Shirt",
      rate_per_unit: 30,
      category: "Shirts", 
      description: "Formal shirt with pressing"
    },
    {
      id: 3,
      item_name: "Casual Pants",
      rate_per_unit: 35,
      category: "Pants",
      description: "Regular pants cleaning"
    },
    {
      id: 4,
      item_name: "Formal Pants",
      rate_per_unit: 40,
      category: "Pants",
      description: "Formal pants with pressing"
    },
    {
      id: 5,
      item_name: "Summer Dress",
      rate_per_unit: 50,
      category: "Dresses",
      description: "Light summer dress cleaning"
    },
    {
      id: 6,
      item_name: "Evening Dress",
      rate_per_unit: 75,
      category: "Dresses",
      description: "Formal evening dress cleaning"
    },
    {
      id: 7,
      item_name: "Leather Jacket",
      rate_per_unit: 150,
      category: "Jackets",
      description: "Leather jacket dry cleaning"
    },
    {
      id: 8,
      item_name: "Winter Coat",
      rate_per_unit: 120,
      category: "Jackets",
      description: "Heavy winter coat cleaning"
    },
    {
      id: 9,
      item_name: "Bed Sheet Set",
      rate_per_unit: 80,
      category: "Bedding",
      description: "Complete bed sheet set"
    },
    {
      id: 10,
      item_name: "Comforter",
      rate_per_unit: 100,
      category: "Bedding",
      description: "Heavy comforter cleaning"
    },
    {
      id: 11,
      item_name: "Window Curtains",
      rate_per_unit: 60,
      category: "Curtains",
      description: "Regular window curtains"
    },
    {
      id: 12,
      item_name: "Heavy Drapes",
      rate_per_unit: 90,
      category: "Curtains",
      description: "Heavy decorative drapes"
    },
    {
      id: 13,
      item_name: "Silk Blouse",
      rate_per_unit: 85,
      category: "Dry Clean Only",
      description: "Delicate silk blouse"
    },
    {
      id: 14,
      item_name: "Wool Sweater",
      rate_per_unit: 65,
      category: "Dry Clean Only",
      description: "Pure wool sweater"
    }
  ]
};

export const mockCustomers = {
  "9876543210": {
    name: "John Doe",
    phone_number: "9876543210",
    state: "Karnataka",
    address: "123 MG Road, Bangalore",
    gst_number: "29ABCDE1234F1Z5",
    reference: "Walk-in customer"
  },
  "9876543211": {
    name: "Jane Smith", 
    phone_number: "9876543211",
    state: "Maharashtra",
    address: "456 FC Road, Pune",
    gst_number: "",
    reference: "Referred by John"
  },
  "9876543212": {
    name: "Mike Johnson",
    phone_number: "9876543212", 
    state: "Delhi",
    address: "789 CP, New Delhi",
    gst_number: "07FGHIJ5678K2L9",
    reference: "Corporate client"
  }
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};