"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Eye, User, Phone, Mail, MapPin } from "lucide-react";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import EditCustomerModal from "@/components/customers/EditCustomerModal";
import ViewCustomerModal from "@/components/customers/ViewCustomerModal";
import { searchCustomers, getAllCustomers } from "@/lib/customerActions";

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); // name, phone, customerId
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Load all customers on component mount
  useEffect(() => {
    loadAllCustomers();
  }, []);

  const loadAllCustomers = async () => {
    setLoading(true);
    try {
      const allCustomers = await getAllCustomers();
      setCustomers(allCustomers);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchCustomers(searchTerm, searchType);
      setCustomers(results);
    } catch (error) {
      console.error("Search failed:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers([newCustomer, ...customers]);
    setShowAddModal(false);
  };

  const handleCustomerUpdated = (updatedCustomer) => {
    setCustomers(customers.map(c => 
      c.customer_id === updatedCustomer.customer_id ? updatedCustomer : c
    ));
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Search, add, and manage your customers</p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Type Selector */}
            <div className="flex gap-2">
              <Button
                variant={searchType === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("name")}
              >
                Name
              </Button>
              <Button
                variant={searchType === "phone" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("phone")}
              >
                Phone
              </Button>
              <Button
                variant={searchType === "customerId" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("customerId")}
              >
                Customer ID
              </Button>
            </div>

            {/* Search Input */}
            <div className="flex-1 flex gap-2">
              <Input
                placeholder={`Search by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Add Customer Button */}
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        {customers.length === 0 && searchTerm && !loading && (
          <Card className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-4">
              No customers match your search criteria. Would you like to add a new customer?
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
          </Card>
        )}

        {/* Customer List */}
        {customers.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <Card key={customer.customer_id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {customer.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {customer.phone_number}
                    </div>
                    {customer.email && (
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {customer.email}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {customer.city}, {customer.state}
                    </div>
                  </div>
                  <Badge variant={customer.customer_type === "retail" ? "default" : "secondary"}>
                    {customer.customer_type}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  ID: {customer.customer_id}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(customer)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(customer)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        <AddCustomerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCustomerAdded={handleCustomerAdded}
        />

        <EditCustomerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          customer={selectedCustomer}
          onCustomerUpdated={handleCustomerUpdated}
        />

        <ViewCustomerModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          customer={selectedCustomer}
        />
      </div>
    </div>
  );
};

export default CustomersPage;