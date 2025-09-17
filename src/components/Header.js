"use client"; // Ensure it's a client component

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/lib/fetch";
import { AddProductForm } from "./AddProduct";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = ({ activeCategory }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data.categories);
    }
    fetchCategories();
  }, []);

  const updateQueryParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value); // Update or add the query param
    } else {
      params.delete(key); // Remove the query param if value is empty
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateQueryParams("search", value); // Update the 'search' query param
  };

  const handleCategoryClick = (category) => {
    updateQueryParams("category", category);
  };

  const handleAll = () => {
    updateQueryParams("category", "");
  };

  return (
    <div className="mb-4 space-y-4">
      {/* Search Input */}
      <div className="flex justify-between space-x-2 ">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search menu..."
            className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Price List Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Price List
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert("Standard Price List")}>
              Standard Pricing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Premium Price List")}>
              Premium Pricing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Bulk Price List")}>
              Bulk Pricing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Corporate Price List")}>
              Corporate Pricing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AddProductForm categories={categories}/>
      </div>

      {/* Category Buttons */}
      <div className="flex overflow-x-auto space-x-2">
        <CategoryButton
          category="All"
          isActive={activeCategory == ""}
          onClick={handleAll}
        />
        {categories
          ? categories.map((category, index) => (
              <CategoryButton
                key={index}
                category={category}
                isActive={activeCategory === category}
                onClick={() => handleCategoryClick(category)}
              />
            ))
          : Array(5)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
      </div>
    </div>
  );
};

export default Header;

const CategoryButton = ({ category, isActive, onClick }) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className="flex items-center gap-2"
      onClick={onClick}
    >
      {/* {category.icon && <category.icon className="h-4 w-4" />} */}
      {category}
    </Button>
  );
};
