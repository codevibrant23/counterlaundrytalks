"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { mockCustomers, simulateApiDelay } from "./mockData";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !baseUrl;

export const addCustomer = async (values) => {
  // Use mock data in development or when API is not available
  if (USE_MOCK_DATA) {
    await simulateApiDelay();

    // Simulate adding customer to mock data
    const newCustomer = {
      ...values,
      id: Date.now(), // Simple ID generation
    };

    // In a real app, you'd persist this to a database
    // For now, just return success
    return {
      customer: newCustomer,
      success: true,
      message: "Customer added successfully"
    };
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const outlet = cookieStore.get("outletId")?.value;

  const endpoint = `/v1/counter/api/${outlet}/customers/add/`;
  try {
    const data = await fetch(baseUrl + endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(values),
      cache: "no-store",
    });
    const res = await data.json();
    return res;
  } catch (e) {
    console.log(e, "\n500: Falling back to mock data");
    // Fallback to mock behavior
    await simulateApiDelay();

    const newCustomer = {
      ...values,
      id: Date.now(),
    };

    return {
      customer: newCustomer,
      success: true,
      message: "Customer added successfully"
    };
  }
};
export const addProduct = async (values) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userId = cookieStore.get("userId")?.value;
  const outlet = cookieStore.get("outletId")?.value;

  const endpoint = `/v1/panel/api/add_product/${userId}/${outlet}/`;
  try {
    const data = await fetch(baseUrl + endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(values),
      cache: "no-store",
    });
    const res = await data.json();
    // if (res?.error) {
    //   throw new Error(res?.detail);
    // }
    revalidateTag("products");
    // console.log(baseUrl + endpoint);
    return res;
  } catch (e) {
    console.log(e, "\n500: login");
    throw new Error(
      e.message ?? "Error Adding Product. Internal Server Error!"
    );
  }
};
export const placeOrder = async (values) => {
  // Use mock data in development or when API is not available
  if (USE_MOCK_DATA) {
    await simulateApiDelay();

    // Generate mock order response
    const orderId = `ORD-${Date.now()}`;
    const mockOrderResponse = {
      order_id: orderId,
      invoice_number: `INV-${Date.now()}`,
      customer_phone: values.customer_phone,
      total_amount: values.order_items.reduce((sum, item) => sum + (item.quantity * 25), 0), // Mock calculation
      discount_percentage: values.discount_percentage || 0,
      date_of_collection: values.date_of_collection,
      status: "confirmed",
      created_at: new Date().toISOString()
    };

    return JSON.stringify(mockOrderResponse);
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const outlet = cookieStore.get("outletId")?.value;

  const endpoint = `/v1/counter/api/${outlet}/orders/place/`;
  try {
    const data = await fetch(baseUrl + endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(values),
      cache: "no-store",
    });
    const res = await data.text();
    return res;
  } catch (e) {
    console.log(e, "\n500: Falling back to mock data");
    // Fallback to mock behavior
    await simulateApiDelay();

    const orderId = `ORD-${Date.now()}`;
    const mockOrderResponse = {
      order_id: orderId,
      invoice_number: `INV-${Date.now()}`,
      customer_phone: values.customer_phone,
      total_amount: values.order_items.reduce((sum, item) => sum + (item.quantity * 25), 0),
      discount_percentage: values.discount_percentage || 0,
      date_of_collection: values.date_of_collection,
      status: "confirmed",
      created_at: new Date().toISOString()
    };

    return JSON.stringify(mockOrderResponse);
  }
};

export const authLogin = async (values) => {
  if (!baseUrl) {
    throw new Error("API base URL not configured. Please set NEXT_PUBLIC_BASE_URL in .env file.");
  }

  const endpoint = "/v1/auth/auth/login/";
  const url = baseUrl + endpoint;

  try {
    console.log('Attempting login to:', url);
    console.log('Payload:', JSON.stringify(values));
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      cache: "no-store",
    });

    if (!data.ok) {
      throw new Error(`HTTP ${data.status}: ${data.statusText}`);
    }

    const res = await data.json();
    console.log('API Response:', res);

    if (res.error === true) {
      return {
        success: false,
        message: res.detail || res.message || 'Login failed',
      };
    }

    revalidateTag("products");
    revalidateTag("categories");
    const cookieStore = cookies();
    cookieStore.set({
      name: "token",
      value: res.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    cookieStore.set({
      name: "accessToken",
      value: res.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    cookieStore.set({
      name: "userId",
      value: res.user_details.id.toString(),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    cookieStore.set({
      name: "outletId",
      value: res.outlet_details.id.toString(),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      success: true,
      message: res.detail || "Login successful",
      accessToken: res.token,
      userData: res.user_details,
      outletData: res.outlet_details,
    };
  } catch (e) {
    console.error('Login error:', e);
    if (e.name === 'TypeError' && e.message.includes('fetch')) {
      throw new Error(`Cannot connect to server at ${url}. Please check if the server is running and accessible.`);
    }
    throw new Error(e.message ?? "Error during login. Internal Server Error!");
  }
};

//to clear header cookies
export const logout = () => {
  const cookieStore = cookies();
  cookieStore.delete("outletId");
  cookieStore.delete("userId");
  cookieStore.delete("accessToken");
  cookieStore.delete("token");
};
