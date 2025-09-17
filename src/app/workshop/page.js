"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, Search, Send, ArrowLeft, Package, 
  Clock, CheckCircle, AlertCircle, Printer
} from "lucide-react";
import Link from "next/link";
import BarcodeScanner from "@/components/workshop/BarcodeScanner";
import OrderSearch from "@/components/workshop/OrderSearch";
import SendToWorkshop from "@/components/workshop/SendToWorkshop";
import MultipleOrdersWorkshop from "@/components/workshop/MultipleOrdersWorkshop";
import { getOrders, getOrderByBarcode } from "@/lib/workshopActions";

const WorkshopPage = () => {
  const [activeTab, setActiveTab] = useState("scan");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async (barcode) => {
    setLoading(true);
    try {
      const order = await getOrderByBarcode(barcode);
      if (order) {
        setSelectedOrder(order);
        setActiveTab("send");
      } else {
        alert("Order not found for this barcode");
      }
    } catch (error) {
      console.error("Barcode scan error:", error);
      alert("Failed to find order");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelected = (order) => {
    setSelectedOrder(order);
    setActiveTab("send");
  };

  const handleWorkshopSent = () => {
    setSelectedOrder(null);
    setActiveTab("scan");
    loadOrders(); // Refresh orders
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "ready_for_workshop": return "bg-blue-100 text-blue-800";
      case "in_workshop": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workshop Management</h1>
          <p className="text-gray-600">Send orders to workshop and track processing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Ready for Workshop</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'ready_for_workshop').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">In Workshop</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'in_workshop').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Send Orders to Workshop</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="scan" className="flex items-center gap-2">
                  <Scan className="h-4 w-4" />
                  Scan Barcode
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Orders
                </TabsTrigger>
                <TabsTrigger value="multiple" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Multiple Orders
                </TabsTrigger>
                <TabsTrigger value="send" className="flex items-center gap-2" disabled={!selectedOrder}>
                  <Send className="h-4 w-4" />
                  Send to Workshop
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="mt-6">
                <BarcodeScanner 
                  onBarcodeScanned={handleBarcodeScanned}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                <OrderSearch 
                  orders={orders}
                  onOrderSelected={handleOrderSelected}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="multiple" className="mt-6">
                <MultipleOrdersWorkshop 
                  onWorkshopSent={handleWorkshopSent}
                  onCancel={() => setActiveTab("scan")}
                />
              </TabsContent>

              <TabsContent value="send" className="mt-6">
                {selectedOrder ? (
                  <SendToWorkshop 
                    order={selectedOrder}
                    onWorkshopSent={handleWorkshopSent}
                    onCancel={() => {
                      setSelectedOrder(null);
                      setActiveTab("scan");
                    }}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No order selected. Please scan barcode or search for an order.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer_name} - {order.customer_phone}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{order.items_count} items</span>
                    {order.status === 'ready_for_workshop' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderSelected(order)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Send to Workshop
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkshopPage;