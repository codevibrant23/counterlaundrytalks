'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, Truck, FileText, Calendar, Phone, MapPin, User, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import ChallanModal from '@/components/orders/ChallanModal';
import { getAllOrders, getChallans, updateOrderStatus } from '@/lib/orderActions';

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);
  const [challans, setChallans] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, challansData] = await Promise.all([
        getAllOrders(),
        getChallans()
      ]);
      setOrders(ordersData);
      setChallans(challansData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone_number.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'cleaned': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'pickup': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        loadData();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleChallanClick = (challan) => {
    setSelectedChallan(challan);
    setIsChallanModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage orders and track status</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Counter</Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by order number, customer name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="cleaned">Cleaned</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Orders ({filteredOrders.length})</TabsTrigger>
          <TabsTrigger value="challans">Challans ({challans.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <OrdersList 
            orders={filteredOrders} 
            onOrderClick={handleOrderClick}
            onStatusChange={handleStatusChange}
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="challans" className="mt-6">
          <ChallansList 
            challans={challans} 
            onChallanClick={handleChallanClick}
            loading={loading} 
          />
        </TabsContent>
      </Tabs>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onUpdate={loadData}
      />

      <ChallanModal
        challan={selectedChallan}
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
      />
    </div>
  );
};

const OrdersList = ({ orders, onOrderClick, onStatusChange, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'cleaned': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'pickup': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'processing': 'cleaning',
      'cleaning': 'cleaned',
      'cleaned': 'ready',
      'ready': 'pickup',
      'pickup': 'delivered',
      'delivered': 'completed'
    };
    return statusFlow[currentStatus];
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">No orders match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.order_id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg cursor-pointer text-blue-600 hover:text-blue-800" 
                      onClick={() => onOrderClick(order)}>
                    #{order.order_number}
                  </h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                  {getNextStatus(order.status) && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onStatusChange(order.order_id, getNextStatus(order.status))}
                    >
                      Mark as {getNextStatus(order.status)}
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{order.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{order.store}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{order.total_items} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{order.total_amount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">Due: {new Date(order.due_date).toLocaleDateString()}</span>
                  {order.pending_amount > 0 && (
                    <Badge variant="destructive">₹{order.pending_amount} Pending</Badge>
                  )}
                  {order.payment_status === 'paid' && (
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ChallansList = ({ challans, onChallanClick, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {challans.map((challan) => (
        <Card key={challan.challan_id} className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => onChallanClick(challan)}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">#{challan.challan_number}</h3>
                  <Badge className={challan.type === 'given' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {challan.type.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{challan.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>{challan.from_location} → {challan.to_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{challan.items_count} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(challan.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{challan.orders.length} orders</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderDetailsPage;