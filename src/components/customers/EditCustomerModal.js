"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Save } from "lucide-react";
import { updateCustomer } from "@/lib/customerActions";

const EditCustomerModal = ({ isOpen, onClose, customer, onCustomerUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    customer_type: "retail",
    business_name: "",
    billing_group: "",
    payment_terms: "",
    order_notification: false,
    address: "",
    city: "",
    state: "",
    pin_code: "",
    country: "",
    location_type: "",
    gst_number: "",
    tax_type: "",
    tax_number: "",
    tax_exempt: false,
    discount: "",
    promo_coupon: "",
    store: "",
    price_list: "",
    subscription_package: "",
    loyalty_program: false,
    referral_program: false,
    preferences: ""
  });

  useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        name: customer.name || "",
        phone_number: customer.phone_number || "",
        email: customer.email || "",
        customer_type: customer.customer_type || "retail",
        business_name: customer.business_name || "",
        billing_group: customer.billing_group || "",
        payment_terms: customer.payment_terms || "",
        order_notification: customer.order_notification || false,
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        pin_code: customer.pin_code || "",
        country: customer.country || "",
        location_type: customer.location_type || "",
        gst_number: customer.gst_number || "",
        tax_type: customer.tax_type || "",
        tax_number: customer.tax_number || "",
        tax_exempt: customer.tax_exempt || false,
        discount: customer.discount || "",
        promo_coupon: customer.promo_coupon || "",
        store: customer.store || "",
        price_list: customer.price_list || "",
        subscription_package: customer.subscription_package || "",
        loyalty_program: customer.loyalty_program || false,
        referral_program: customer.referral_program || false,
        preferences: customer.preferences || ""
      });
      setError("");
    }
  }, [customer, isOpen]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!formData.name || !formData.phone_number) {
      setError("Name and phone number are required");
      setLoading(false);
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      const result = await updateCustomer(customer.customer_id, formData);
      if (result.error) {
        setError(result.message || "Failed to update customer");
      } else {
        onCustomerUpdated(result.customer);
      }
    } catch (error) {
      setError("An error occurred while updating the customer");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Customer</DialogTitle>
          <p className="text-sm text-gray-600">Customer ID: {customer.customer_id} (Cannot be changed)</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleChange("phone_number", e.target.value)}
                    placeholder="Enter WhatsApp number"
                    maxLength="10"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Should be on WhatsApp for communication</p>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_type">Customer Type *</Label>
                  <Select value={formData.customer_type} onValueChange={(value) => handleChange("customer_type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail (D2C Customers)</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commercial Details */}
          {formData.customer_type === "commercial" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commercial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => handleChange("business_name", e.target.value)}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billing_group">Billing Group</Label>
                    <Select value={formData.billing_group} onValueChange={(value) => handleChange("billing_group", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group1">Group 1</SelectItem>
                        <SelectItem value="group2">Group 2</SelectItem>
                        <SelectItem value="group3">Group 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <Select value={formData.payment_terms} onValueChange={(value) => handleChange("payment_terms", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15_days">15 Days</SelectItem>
                        <SelectItem value="30_days">30 Days</SelectItem>
                        <SelectItem value="45_days">45 Days</SelectItem>
                        <SelectItem value="60_days">60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="order_notification"
                      checked={formData.order_notification}
                      onCheckedChange={(checked) => handleChange("order_notification", checked)}
                    />
                    <Label htmlFor="order_notification">Order Notification</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select value={formData.city} onValueChange={(value) => handleChange("city", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pin_code">Pin Code</Label>
                  <Input
                    id="pin_code"
                    value={formData.pin_code}
                    onChange={(e) => handleChange("pin_code", e.target.value)}
                    placeholder="Enter pin code"
                    maxLength="6"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="location_type">Location Type</Label>
                <Select value={formData.location_type} onValueChange={(value) => handleChange("location_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gst_number">GSTIN</Label>
                  <Input
                    id="gst_number"
                    value={formData.gst_number}
                    onChange={(e) => handleChange("gst_number", e.target.value)}
                    placeholder="Enter GST number"
                  />
                </div>
                <div>
                  <Label htmlFor="tax_type">Tax Type</Label>
                  <Select value={formData.tax_type} onValueChange={(value) => handleChange("tax_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gst">GST</SelectItem>
                      <SelectItem value="vat">VAT</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tax_number">Tax Number</Label>
                  <Input
                    id="tax_number"
                    value={formData.tax_number}
                    onChange={(e) => handleChange("tax_number", e.target.value)}
                    placeholder="Enter tax number"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tax_exempt"
                    checked={formData.tax_exempt}
                    onCheckedChange={(checked) => handleChange("tax_exempt", checked)}
                  />
                  <Label htmlFor="tax_exempt">Tax Exempt</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Select value={formData.discount} onValueChange={(value) => handleChange("discount", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="promo_coupon">Promo/Coupon</Label>
                  <Select value={formData.promo_coupon} onValueChange={(value) => handleChange("promo_coupon", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select promo/coupon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome10">WELCOME10</SelectItem>
                      <SelectItem value="first20">FIRST20</SelectItem>
                      <SelectItem value="loyalty15">LOYALTY15</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="store">Store</Label>
                  <Select value={formData.store} onValueChange={(value) => handleChange("store", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Store</SelectItem>
                      <SelectItem value="branch1">Branch 1</SelectItem>
                      <SelectItem value="branch2">Branch 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price_list">Price List</Label>
                  <Select value={formData.price_list} onValueChange={(value) => handleChange("price_list", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subscription_package">Subscription Package</Label>
                  <Select value={formData.subscription_package} onValueChange={(value) => handleChange("subscription_package", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="loyalty_program"
                    checked={formData.loyalty_program}
                    onCheckedChange={(checked) => handleChange("loyalty_program", checked)}
                  />
                  <Label htmlFor="loyalty_program">Enroll in Loyalty Program</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="referral_program"
                    checked={formData.referral_program}
                    onCheckedChange={(checked) => handleChange("referral_program", checked)}
                  />
                  <Label htmlFor="referral_program">Enroll in Referral Program</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="preferences">Notes/Special Instructions</Label>
                <Textarea
                  id="preferences"
                  value={formData.preferences}
                  onChange={(e) => handleChange("preferences", e.target.value)}
                  placeholder="Enter any special instructions or notes for this customer"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Update Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerModal;