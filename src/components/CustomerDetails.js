"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getCustomerByPhone } from "@/lib/customerActions";
import { AlertCircle, CheckCircle, Edit, Eye } from "lucide-react";
import { addCustomer } from "@/lib/actions";
import { useCart } from "@/utils/CartContext";
import { useCustomerForm } from "@/utils/CustomerFormContext";

const isValidPhone = (number) => {
  // Regex for validating Indian phone numbers
  const phoneRegex = /^[6-9][0-9]{9}$/;
  return phoneRegex.test(number);
};

const CustomerForm = () => {
  const { resetFormTrigger } = useCustomerForm(); // Listen for reset trigger
  const { setCustomerContact } = useCart();
  const [phone, setPhone] = useState("");
  //   const [isMessageVisible, setIsMessageVisible] = useState(false); // State for controlling visibility

  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    address: "",
    gst_number: "",
    reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    handleReset();
  }, [resetFormTrigger]);

  const handleSearch = async () => {
    setLoading(true);
    setSuccessMessage("");
    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number!");
      setLoading(false);
      return;
    }
    setError("");
    const response = await getCustomerByPhone(phone); // Call to getCustomerByPhone API
    setLoading(false);

    if (response.error) {
      setCustomer(null);
      setIsNewCustomer(true);
      setFormData({ name: "", state: "", address: "", gst_number: "", reference: "" });
    } else {
      const existingCustomer = response.customer;
      setCustomer(existingCustomer);
      setCustomerContact(phone);
      setIsNewCustomer(false);
      //   setIsMessageVisible(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isNewCustomer) {
      // New customer data
      const customerData = {
        phone_number: phone,
        ...formData,
      };

      try {
        const response = await addCustomer(customerData); // Add customer API call

        if (!response.error) {
          setSuccessMessage("Customer added successfully!");
          setCustomer(response.customer); // Set added customer details
          setIsNewCustomer(false); // Disable the new customer form after adding
          setCustomerContact(phone);
          //   handleSearch(); // Trigger search again to fetch the newly added customer
        } else {
          setError(response.detail); // Set error message from API
        }
      } catch (error) {
        setError("An error occurred while adding the customer!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setPhone("");
    setError("");
    setCustomer(null);
    setIsNewCustomer(false);
    setFormData({
      name: "",
      state: "",
      address: "",
      gst_number: "",
      reference: "",
    });
    setSuccessMessage("");
  };

  return (
    <Card className="p-6 space-y-4 mb-4">
      {/* Phone Number Input */}
      <div className="flex gap-2 items-center">
        <h2 className="text-lg font-bold w-56">Customer Search</h2>
        <div className="w-full">
          <Input
            type="number"
            id="phone"
            name="phone_number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
            placeholder="Enter phone number"
            maxLength="10"
            className="border-2"
          />
          {/* Validation Error */}
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-44" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="text-green-500 flex items-center gap-2 mt-1">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Existing Customer Details */}
      {customer && !isNewCustomer && (
        <div className="p-4 bg-green-100 rounded">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Customer Found:
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('/customers', '_blank')}
                className="text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('/customers', '_blank')}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </div>
          </div>
          
          {/* Show only name and phone as requested */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex gap-2">
              <strong>Name:</strong>
              <span>{customer.name || "-"}</span>
            </div>
            <div className="flex gap-2">
              <strong>Phone Number:</strong>
              <span>{customer.phone_number || "-"}</span>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Form */}
      {isNewCustomer && (
        <>
          <div className="px-4 py-1 bg-red-100 rounded flex gap-3 items-center text-gray-600">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>Customer Not Found! Enter details below to add.</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 border-t border-gray-200 pt-3 mt-1"
          >
            <div className="flex gap-3">
              <div className="w-full">
                <Label htmlFor="name">
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="w-full">
                <Label htmlFor="state">
                  State<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-full">
                <Label htmlFor="address">
                  Address<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="w-full">
                <Label htmlFor="gst_number">GST number</Label>
                <Input
                  type="text"
                  id="gst_number"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-full">
                <Label htmlFor="address">Reference</Label>
                <Input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="Enter reference"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Customer"}
            </Button>
          </form>
        </>
      )}
      {error && (
        <div className="text-red-500 flex items-center gap-2 mt-1">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </Card>
  );
};

export default CustomerForm;
