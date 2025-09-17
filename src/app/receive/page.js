"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, Search, Package, ArrowLeft, 
  Clock, CheckCircle, AlertCircle, Truck
} from "lucide-react";
import Link from "next/link";
import ReceiveSingleOrder from "@/components/receive/ReceiveSingleOrder";
import ReceiveMultipleOrders from "@/components/receive/ReceiveMultipleOrders";
import OrderSearchReceive from "@/components/receive/OrderSearchReceive";
import { getWorkshopOrders } from "@/lib/receiveActions";

const ReceivePage = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await getWorkshopOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelected = (order) => {
    setSelectedOrder(order);
    setActiveTab("single");
  };

  const handleOrderReceived = () => {
    setSelectedOrder(null);
    loadOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_workshop": return "bg-purple-100 text-purple-800";
      case "ready_for_pickup": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Counter
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receive from Workshop</h1>
          <p className="text-gray-600">Receive completed orders from workshop and prepare for delivery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
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
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Ready for Pickup</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'ready_for_pickup').length}</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Receive Orders from Workshop</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <Scan className="h-4 w-4" />
                  Single Order
                </TabsTrigger>
                <TabsTrigger value="multiple" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Multiple Orders
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Orders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="mt-6">
                <ReceiveSingleOrder 
                  selectedOrder={selectedOrder}
                  onOrderReceived={handleOrderReceived}
                  onCancel={() => setSelectedOrder(null)}
                />
              </TabsContent>

              <TabsContent value="multiple" className="mt-6">
                <ReceiveMultipleOrders 
                  onOrdersReceived={handleOrderReceived}
                />
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                <OrderSearchReceive 
                  orders={orders}
                  onOrderSelected={handleOrderSelected}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Orders in Workshop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orders.filter(o => o.status === 'in_workshop').slice(0, 5).map((order) => (
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
                    <Button 
                      size="sm" 
                      onClick={() => handleOrderSelected(order)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Receive from Workshop
                    </Button>
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

export default ReceivePage;