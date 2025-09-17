"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  CreditCard, 
  Gift, 
  ShoppingBag,
  IndianRupee,
  Calendar,
  Award,
  Users
} from "lucide-react";
import { getCustomerDetails, getCustomerOrders, getCustomerLedger } from "@/lib/customerActions";

const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
  const [loading, setLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ledger, setLedger] = useState({
    total_amount: 0,
    received_amount: 0,
    pending_amount: 0,
    transactions: []
  });
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    if (customer && isOpen) {
      fetchCustomerData();
    }
  }, [customer, isOpen]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      // Fetch detailed customer information
      const details = await getCustomerDetails(customer.customer_id);
      setCustomerDetails(details);

      // Fetch customer orders
      const orderData = await getCustomerOrders(customer.customer_id);
      setOrders(orderData);

      // Fetch customer ledger
      const ledgerData = await getCustomerLedger(customer.customer_id);
      setLedger(ledgerData);

      // Set loyalty points (mock data for now)
      setLoyaltyPoints(details.loyalty_points || 0);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="ledger">Ledger</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty & Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-base">{customer.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Customer ID</p>
                      <p className="text-base font-mono">{customer.customer_id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Customer Type</p>
                      <Badge variant={customer.customer_type === "retail" ? "default" : "secondary"}>
                        {customer.customer_type}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <p className="text-base">{customer.phone_number}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <p className="text-base">{customer.email || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Registration Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <p className="text-base">{formatDate(customer.created_at || new Date())}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commercial Details */}
              {customer.customer_type === "commercial" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Commercial Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Business Name</p>
                        <p className="text-base">{customer.business_name || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Billing Group</p>
                        <p className="text-base">{customer.billing_group || "Not assigned"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Payment Terms</p>
                        <p className="text-base">{customer.payment_terms || "Not set"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Order Notifications</p>
                        <Badge variant={customer.order_notification ? "default" : "secondary"}>
                          {customer.order_notification ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base">{customer.address || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-base">
                        {[customer.city, customer.state, customer.pin_code, customer.country]
                          .filter(Boolean)
                          .join(", ") || "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Location Type</p>
                      <p className="text-base">{customer.location_type || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Tax Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">GSTIN</p>
                      <p className="text-base font-mono">{customer.gst_number || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Tax Type</p>
                      <p className="text-base">{customer.tax_type || "Not set"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Tax Number</p>
                      <p className="text-base font-mono">{customer.tax_number || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Tax Exempt</p>
                      <Badge variant={customer.tax_exempt ? "destructive" : "default"}>
                        {customer.tax_exempt ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Business Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Discount</p>
                      <p className="text-base">{customer.discount ? `${customer.discount}%` : "None"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Promo/Coupon</p>
                      <p className="text-base">{customer.promo_coupon || "None"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Store</p>
                      <p className="text-base">{customer.store || "Not assigned"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Price List</p>
                      <p className="text-base">{customer.price_list || "Standard"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Subscription</p>
                      <p className="text-base">{customer.subscription_package || "None"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              {customer.preferences && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences & Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base">{customer.preferences}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No orders found for this customer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Order #{order.order_id}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                              <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ledger" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(ledger.total_amount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Received</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(ledger.received_amount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(ledger.pending_amount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {ledger.transactions?.length === 0 ? (
                    <div className="text-center py-8">
                      <IndianRupee className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ledger.transactions?.map((transaction, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loyalty" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Loyalty Points</p>
                        <p className="text-2xl font-bold text-yellow-600">{loyaltyPoints}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Referrals</p>
                        <p className="text-2xl font-bold text-purple-600">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Program Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Loyalty Program</p>
                        <p className="text-sm text-gray-500">Earn points on every purchase</p>
                      </div>
                      <Badge variant={customer.loyalty_program ? "default" : "secondary"}>
                        {customer.loyalty_program ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Referral Program</p>
                        <p className="text-sm text-gray-500">Refer friends and earn rewards</p>
                      </div>
                      <Badge variant={customer.referral_program ? "default" : "secondary"}>
                        {customer.referral_program ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerModal;