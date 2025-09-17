"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/utils/CartContext";
import ProductDetailsModal from "@/components/products/ProductDetailsModal";

export default function ProductCard({ data }) {
  const { addToCart } = useCart();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Convert legacy data format to new format if needed
  const productData = {
    id: data.id || data.item_id || `legacy_${Date.now()}`,
    name: data.name || data.item_name,
    price: data.price || data.rate_per_unit,
    category: data.category || "General",
    subCategory: data.subCategory || data.sub_category,
    hsn: data.hsn || data.hsn_sac_code,
    notes: data.notes || "",
    shortCode: data.shortCode || ""
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(productData);
  };

  const handleCardClick = () => {
    setShowDetailsModal(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="h-24 flex flex-col items-center justify-center w-full text-wrap relative group border rounded-md hover:bg-gray-50 cursor-pointer p-2"
      >
        <div className="font-semibold text-wrap text-center">{productData.name}</div>
        <div className="text-sm">₹{productData.price}</div>
        
        {/* Quick add button - shows on hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 bg-gray-200 hover:bg-gray-300 rounded text-xs"
        >
          +
        </button>
      </div>

      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={productData}
      />
    </>
  );
}
