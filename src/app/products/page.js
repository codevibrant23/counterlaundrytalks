"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Eye, Package, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddProductModal from "@/components/products/AddProductModal";
import EditProductModal from "@/components/products/EditProductModal";
import ProductDetailsModal from "@/components/products/ProductDetailsModal";
import { searchProducts, getAllProducts } from "@/lib/productActions";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      const { products: allProducts, categories: allCategories } = await getAllProducts();
      setProducts(allProducts);
      setCategories(allCategories);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedCategory) {
      loadAllProducts();
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchProducts(searchTerm, selectedCategory, selectedSubCategory);
      setProducts(results);
    } catch (error) {
      console.error("Search failed:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    loadAllProducts();
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
    setShowAddModal(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setShowEditModal(false);
  };

  const getSubCategories = () => {
    const category = categories.find(cat => cat.name === selectedCategory);
    return category ? category.subCategories : [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Counter
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Search, add, and manage your products</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, short codes, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
              {(searchTerm || selectedCategory) && (
                <Button variant="outline" onClick={clearSearch}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubCategory("");
                }}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setSelectedSubCategory("");
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sub Category Filters */}
            {selectedCategory && getSubCategories().length > 0 && (
              <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-gray-200">
                <Button
                  variant={selectedSubCategory === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubCategory("")}
                >
                  All {selectedCategory}
                </Button>
                {getSubCategories().map((subCategory) => (
                  <Button
                    key={subCategory}
                    variant={selectedSubCategory === subCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubCategory(subCategory)}
                  >
                    {subCategory}
                  </Button>
                ))}
              </div>
            )}

            {/* Add Product Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </Card>

        {/* No Results */}
        {products.length === 0 && (searchTerm || selectedCategory) && !loading && (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              No products match your search criteria. Would you like to add a new product?
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </Card>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="text-lg font-bold text-green-600 mb-2">
                      ₹{product.price}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    {product.subCategory && (
                      <Badge variant="outline" className="text-xs">
                        {product.subCategory}
                      </Badge>
                    )}
                  </div>
                  
                  {product.hsn && (
                    <div className="text-xs text-gray-500">
                      HSN: {product.hsn}
                    </div>
                  )}
                  
                  {product.notes && (
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {product.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(product)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
          categories={categories}
        />

        <EditProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
          categories={categories}
        />

        <ProductDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default ProductsPage;