'use client';

import React, { useState } from 'react';
import { X, User, Phone, MapPin, Calendar, Package, DollarSign, FileText, Printer, Send, Truck, RefreshCw, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sendInvoice, assignDelivery, processRefund } from '@/lib/orderActions';
import { getDeliveryPersonnel } from '@/lib/pickupActions';

const OrderDetailsModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [deliveryData, setDeliveryData] = useState({
    type: '',
    assigned_to: '',
    payment_type: ''
  });
  const [refundData, setRefundData] = useState({
    amount: '',
    reason: '',
    payment_mode: ''
  });
  const [loading, setLoading] = useState(false);

  if (!order) return null;

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

  const handleSendInvoice = async (type) => {
    setLoading(true);
    try {
      const result = await sendInvoice(order.order_id, type);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Send invoice error:', error);
      alert('Failed to send invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDelivery = async () => {
    if (!deliveryData.type) {
      alert('Please select delivery type');
      return;
    }

    setLoading(true);
    try {
      const result = await assignDelivery(order.order_id, deliveryData);
      if (result.success) {
        onUpdate();
        alert(result.message);
        setActiveTab('details');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Assign delivery error:', error);
      alert('Failed to assign delivery');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!refundData.amount || !refundData.reason || !refundData.payment_mode) {
      alert('Please fill all refund fields');
      return;
    }

    setLoading(true);
    try {
      const result = await processRefund(order.order_id, refundData);
      if (result.success) {
        onUpdate();
        alert(result.message);
        setActiveTab('details');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Process refund error:', error);
      alert('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - #{order.order_number}</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="refund">Refund</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.phone_number}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span className="text-sm">{order.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Order Date: {new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Pickup Date: {new Date(order.pickup_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>Store: {order.store}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Due Date: {new Date(order.due_date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Items List */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Items ({order.total_items} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.total}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.items.reduce((sum, item) => sum + item.total, 0)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({order.discount}%):</span>
                      <span>-₹{(order.items.reduce((sum, item) => sum + item.total, 0) * order.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {order.promo_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo ({order.promo_code}):</span>
                      <span>-₹{order.promo_amount}</span>
                    </div>
                  )}
                  {order.credits_amount > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Credits Used:</span>
                      <span>-₹{order.credits_amount}</span>
                    </div>
                  )}
                  {order.tip > 0 && (
                    <div className="flex justify-between">
                      <span>Tip:</span>
                      <span>₹{order.tip}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.tax_amount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{order.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type:</span>
                    <span className="capitalize">{order.payment_type}</span>
                  </div>
                  {order.pending_amount > 0 && (
                    <div className="flex justify-between text-red-600 font-medium">
                      <span>Pending Amount:</span>
                      <span>₹{order.pending_amount}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.notes && (
                    <div className="mb-3">
                      <p className="font-medium text-sm">Customer Notes:</p>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  )}
                  {order.workshop_notes && (
                    <div>
                      <p className="font-medium text-sm">Workshop Notes:</p>
                      <p className="text-sm text-gray-600">{order.workshop_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => handleSendInvoice('mini')} disabled={loading}>
                    <FileText className="w-4 h-4 mr-2" />
                    Mini Invoice
                  </Button>
                  <Button className="w-full" onClick={() => handleSendInvoice('full')} disabled={loading}>
                    <FileText className="w-4 h-4 mr-2" />
                    Full Invoice
                  </Button>
                  <Button className="w-full" onClick={() => handleSendInvoice('whatsapp')} disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    WhatsApp Invoice
                  </Button>
                  <Button className="w-full" onClick={() => handleSendInvoice('sms')} disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    SMS Invoice
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Barcode/Tags
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Bill
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Edit Order
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <Ban className="w-4 h-4 mr-2" />
                    Cancel/Void Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Delivery Type</Label>
                  <Select value={deliveryData.type} onValueChange={(value) => setDeliveryData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_pickup">Self Pickup by Customer</SelectItem>
                      <SelectItem value="home_delivery">Home Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {deliveryData.type === 'home_delivery' && (
                  <div>
                    <Label>Assign Delivery Person</Label>
                    <Select value={deliveryData.assigned_to} onValueChange={(value) => setDeliveryData(prev => ({ ...prev, assigned_to: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raj Kumar">Raj Kumar</SelectItem>
                        <SelectItem value="Amit Singh">Amit Singh</SelectItem>
                        <SelectItem value="Suresh Patel">Suresh Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Payment Type</Label>
                  <Select value={deliveryData.payment_type} onValueChange={(value) => setDeliveryData(prev => ({ ...prev, payment_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pay_on_delivery">Pay on Delivery</SelectItem>
                      <SelectItem value="on_account">Add to Account/On Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAssignDelivery} disabled={loading} className="w-full">
                  {loading ? 'Assigning...' : 'Assign Delivery'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refund" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Process Refund</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Refund Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter refund amount"
                    value={refundData.amount}
                    onChange={(e) => setRefundData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Reason for Refund</Label>
                  <Textarea
                    placeholder="Enter reason for refund..."
                    value={refundData.reason}
                    onChange={(e) => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Payment Mode</Label>
                  <Select value={refundData.payment_mode} onValueChange={(value) => setRefundData(prev => ({ ...prev, payment_mode: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleRefund} disabled={loading} className="w-full" variant="destructive">
                  {loading ? 'Processing...' : 'Process Refund'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;