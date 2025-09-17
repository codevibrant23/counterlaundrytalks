"use client";

import { CartProvider } from "@/utils/CartContext";
import React from "react";

export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
