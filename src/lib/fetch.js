"use server";

import { cookies } from "next/headers";
import { mockCategories, mockProducts, mockCustomers, simulateApiDelay } from "./mockData";

const baseUrl = process.env.baseURL;
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !baseUrl;

export const getCategories = async () => {
  // Use mock data in development or when API is not available
  if (USE_MOCK_DATA) {
    await simulateApiDelay();
    return mockCategories;
  }

  let endpoint = `/v1/counter/api/categories/`;
  try {
    const data = await fetch(baseUrl + endpoint, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      next: { tags: ["categories"] },
      cache: "no-store",
    });
    const res = await data.json();

    return res;
  } catch (e) {
    console.log(e, "\n500: Falling back to mock data");
    // Fallback to mock data if API fails
    await simulateApiDelay();
    return mockCategories;
  }
};
export const getProducts = async (category) => {
  // Use mock data in development or when API is not available
  if (USE_MOCK_DATA) {
    await simulateApiDelay();
    let filteredProducts = mockProducts.products;
    
    if (category) {
      filteredProducts = mockProducts.products.filter(
        product => product.category === category
      );
    }
    
    return { products: filteredProducts };
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const outlet = cookieStore.get("outletId")?.value;
  if (!accessToken) return { products: [] };

  let endpoint = `/v1/counter/api/get-products/${outlet}/`;
  if (category) endpoint += `?category=${category}`;
  try {
    const data = await fetch(baseUrl + endpoint, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      next: { tags: ["products", `products-${category}`] },
      cache: "no-store",
    });
    const res = await data.json();

    return res;
  } catch (e) {
    console.log(e, "\n500: Falling back to mock data");
    // Fallback to mock data if API fails
    await simulateApiDelay();
    let filteredProducts = mockProducts.products;
    
    if (category) {
      filteredProducts = mockProducts.products.filter(
        product => product.category === category
      );
    }
    
    return { products: filteredProducts };
  }
};
export const getCustomer = async (contact) => {
  // Use mock data in development or when API is not available
  if (USE_MOCK_DATA) {
    await simulateApiDelay();
    
    if (mockCustomers[contact]) {
      return { customer: mockCustomers[contact] };
    } else {
      return { error: "Customer not found" };
    }
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const outlet = cookieStore.get("outletId")?.value;
  if (!accessToken) return { error: "No access token" };

  let endpoint = `/v1/counter/api/get-customers/${outlet}/`;
  if (contact) endpoint += `?phone_number=${contact}`;
  try {
    const data = await fetch(baseUrl + endpoint, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      cache: "no-store",
    });
    const res = await data.json();

    return res;
  } catch (e) {
    console.log(e, "\n500: Falling back to mock data");
    // Fallback to mock data if API fails
    await simulateApiDelay();
    
    if (mockCustomers[contact]) {
      return { customer: mockCustomers[contact] };
    } else {
      return { error: "Customer not found" };
    }
  }
};
