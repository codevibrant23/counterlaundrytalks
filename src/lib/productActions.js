// Product API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generate product ID
const generateProductId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `PRD${timestamp}${random}`;
};

// Mock categories and products data
const mockCategories = [
  {
    name: "Dry Clean",
    subCategories: ["Men", "Women", "Kids"]
  },
  {
    name: "Wash and Fold",
    subCategories: ["Men", "Women", "Kids", "Household"]
  },
  {
    name: "Ironing",
    subCategories: ["Formal", "Casual", "Delicate"]
  },
  {
    name: "Alterations",
    subCategories: ["Hemming", "Resizing", "Repairs"]
  }
];

const mockProducts = [
  {
    id: 'PRD001',
    name: 'Shirt Dry Clean',
    price: 50,
    category: 'Dry Clean',
    subCategory: 'Men',
    hsn: '99712',
    notes: 'Standard dry cleaning for shirts',
    shortCode: 'SDC',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD002',
    name: 'Dress Dry Clean',
    price: 150,
    category: 'Dry Clean',
    subCategory: 'Women',
    hsn: '99712',
    notes: 'Premium dry cleaning for dresses',
    shortCode: 'DDC',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD003',
    name: 'Trouser Wash',
    price: 40,
    category: 'Wash and Fold',
    subCategory: 'Men',
    hsn: '99712',
    notes: 'Regular wash and fold for trousers',
    shortCode: 'TW',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD004',
    name: 'Blouse Iron',
    price: 25,
    category: 'Ironing',
    subCategory: 'Women',
    hsn: '99712',
    notes: 'Professional ironing for blouses',
    shortCode: 'BI',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD005',
    name: 'Suit Dry Clean',
    price: 200,
    category: 'Dry Clean',
    subCategory: 'Men',
    hsn: '99712',
    notes: 'Complete suit dry cleaning service',
    shortCode: 'SUDC',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD006',
    name: 'Saree Dry Clean',
    price: 120,
    category: 'Dry Clean',
    subCategory: 'Women',
    hsn: '99712',
    notes: 'Delicate dry cleaning for sarees',
    shortCode: 'SADC',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD007',
    name: 'Bedsheet Wash',
    price: 60,
    category: 'Wash and Fold',
    subCategory: 'Household',
    hsn: '99712',
    notes: 'Large item wash and fold',
    shortCode: 'BSW',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD008',
    name: 'Hem Alteration',
    price: 80,
    category: 'Alterations',
    subCategory: 'Hemming',
    hsn: '99712',
    notes: 'Professional hemming service',
    shortCode: 'HA',
    created_at: '2024-01-15T10:30:00Z'
  }
];

// Get all products and categories
export const getAllProducts = async () => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/products`);
    // if (!response.ok) {
    //   throw new Error('Failed to fetch products');
    // }
    // const data = await response.json();
    
    // Mock successful response
    return {
      products: mockProducts,
      categories: mockCategories
    };
  } catch (error) {
    console.error('Get all products error:', error);
    throw error;
  }
};

// Search products by name, short codes, or ID
export const searchProducts = async (searchTerm, category, subCategory) => {
  try {
    let filteredProducts = [...mockProducts];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category
      );
    }

    // Filter by subcategory
    if (subCategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.subCategory === subCategory
      );
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.shortCode?.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term)
      );
    }

    return filteredProducts;
  } catch (error) {
    console.error('Search products error:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    // Generate product ID and short code
    const id = generateProductId();
    const shortCode = productData.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();
    
    const newProduct = {
      ...productData,
      id,
      shortCode,
      price: parseFloat(productData.price),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/products`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(newProduct),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to add product');
    // }

    // const result = await response.json();
    
    // Mock successful response
    mockProducts.unshift(newProduct); // Add to mock data
    return {
      success: true,
      product: newProduct,
      message: 'Product added successfully'
    };
  } catch (error) {
    console.error('Add product error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add product'
    };
  }
};

// Update existing product
export const updateProduct = async (productId, productData) => {
  try {
    const updatedProduct = {
      ...productData,
      id: productId,
      price: parseFloat(productData.price),
      updated_at: new Date().toISOString()
    };

    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(updatedProduct),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to update product');
    // }

    // const result = await response.json();
    
    // Mock successful response
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
    }
    
    return {
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    };
  } catch (error) {
    console.error('Update product error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update product'
    };
  }
};

// Get product details
export const getProductDetails = async (productId) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    
    // if (!response.ok) {
    //   throw new Error('Failed to fetch product details');
    // }

    // const product = await response.json();
    
    // Mock product details
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    console.error('Get product details error:', error);
    throw error;
  }
};

// Delete product (soft delete)
export const deleteProduct = async (productId) => {
  try {
    // Mock API call - replace with actual API endpoint
    // const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    //   method: 'DELETE',
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to delete product');
    // }

    // Mock successful response
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      mockProducts.splice(index, 1);
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    console.error('Delete product error:', error);
    return {
      error: true,
      message: error.message || 'Failed to delete product'
    };
  }
};

// Get products by category
export const getProductsByCategory = async (category, subCategory) => {
  try {
    let filteredProducts = mockProducts.filter(product => 
      product.category === category
    );

    if (subCategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.subCategory === subCategory
      );
    }

    return filteredProducts;
  } catch (error) {
    console.error('Get products by category error:', error);
    throw error;
  }
};

// Get categories
export const getCategories = async () => {
  try {
    return mockCategories;
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

// Add new category (for panel management)
export const addCategory = async (categoryData) => {
  try {
    const newCategory = {
      name: categoryData.name,
      subCategories: categoryData.subCategories || []
    };

    // Mock API call - replace with actual API endpoint
    mockCategories.push(newCategory);

    return {
      success: true,
      category: newCategory,
      message: 'Category added successfully'
    };
  } catch (error) {
    console.error('Add category error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add category'
    };
  }
};

// Update category
export const updateCategory = async (categoryName, categoryData) => {
  try {
    const index = mockCategories.findIndex(cat => cat.name === categoryName);
    if (index !== -1) {
      mockCategories[index] = { ...mockCategories[index], ...categoryData };
    }

    return {
      success: true,
      category: mockCategories[index],
      message: 'Category updated successfully'
    };
  } catch (error) {
    console.error('Update category error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update category'
    };
  }
};