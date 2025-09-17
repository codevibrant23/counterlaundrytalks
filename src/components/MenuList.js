import React from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/fetch";
import Image from "next/image";

const MenuList = async ({ activeCategory, searchTerm }) => {
  const itemsData = await getProducts(activeCategory);

  // Filter products based on the search term (case-insensitive match)
  const filteredProducts = itemsData?.products?.filter((item) =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show no results found image when no products match
  if (filteredProducts?.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <Image
            src="/no-results.png"
            alt="No results found"
            width={200}
            height={200}
            className="mx-auto mb-4 opacity-50"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.target.style.display = 'none';
            }}
          />
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No results for "${searchTerm}". Try a different search term.`
              : `No products available in ${activeCategory || 'this category'}.`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-3 gap-3 pb-4">
        {filteredProducts?.map((item, i) => (
          <ProductCard data={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
