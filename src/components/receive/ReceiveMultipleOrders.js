"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Scan, CheckCircle, AlertCircle, Package, User, Phone, 
  Truck, Home, CreditCard, Receipt, Send, X
} from "lucide-react";
import { receiveMultipleOrdersFromWorkshop } from "@/lib/receiveActions";

const ReceiveMultipleOrders = ({ onOrdersReceived }) => {
  const [currentScan, setCurrentScan] = useState("");
  const [receivedOrders, setReceivedOrders] = useState(new Map());
  const [globalIssueNotes, setGlobalIssueNotes] = useState("");
  const [globalIssueReason, setGlobalIssueReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("scan"); // scan, delivery, complete

  const handleItemScan = async () => {
    if (!currentScan.trim()) return;

    try {
      // Mock finding item and its order
      const mockItemData = await findItemByBarcode(currentScan);
      
      if (!mockItemData) {
        alert("Item not found");
        return;
      }

      const { item, order } = mockItemData;
      
      // Get or create order data
      const orderData = receivedOrders.get(order.id) || {
        order: order,
        scannedItems: [],
        missingItems: [],
        totalItems: order.items.length,
        deliveryMode: "pickup",
        assignedDriver: "",
        paymentType: "cod"
      };

      // Check if already scanned
      const alreadyScanned = orderData.scannedItems.find(si => si.barcode === currentScan);
      if (alreadyScanned) {
        alert("Item already scanned");
        return;
      }

      // Add to scanned items
      orderData.scannedItems.push({
        ...item,
        barcode: currentScan,
        scanned_at: new Date().toISOString()
      });

      // Update orders map
      const newReceivedOrders = new Map(receivedOrders);
      newReceivedOrders.set(order.id, orderData);
      setReceivedOrders(newReceivedOrders);
      setCurrentScan("");

    } catch (error) {
      alert("Error scanning item");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleItemScan();
    }
  };

  const markItemMissing = (orderId, item) => {
    const orderData = receivedOrders.get(orderId);
    if (!orderData) return;

    orderData.missingItems.push(item);
    orderData.scannedItems = orderData.scannedItems.filter(si => si.id !== item.id);

    const newReceivedOrders = new Map(receivedOrders);
    newReceivedOrders.set(orderId, orderData);
    setReceivedOrders(newReceivedOrders);
  };

  const updateOrderDelivery = (orderId, field, value) => {
    const orderData = receivedOrders.get(orderId);
    if (!orderData) return;

    orderData[field] = value;

    const newReceivedOrders = new Map(receivedOrders);
    newReceivedOrders.set(orderId, orderData);
    setReceivedOrders(newReceivedOrders);
  };

  const removeOrder = (orderId) => {
    const newReceivedOrders = new Map(receivedOrders);
    newReceivedOrders.delete(orderId);
    setReceivedOrders(newReceivedOrders);
  };

  const handleNext = () => {
    const hasMissingItems = Array.from(receivedOrders.values()).some(orderData => orderData.missingItems.length > 0);
    
    if (hasMissingItems && (!globalIssueNotes || !globalIssueReason)) {
      alert("Please provide issue notes and reason for missing items");
      return;
    }
    setStep("delivery");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const receiveData = {
        orders: Array.from(receivedOrders.values()),
        global_issue_notes: globalIssueNotes,
        global_issue_reason: globalIssueReason,
        received_by: "Counter Staff",
        received_at: new Date().toISOString()
      };

      const result = await receiveMultipleOrdersFromWorkshop(receiveData);
      
      if (result.success) {
        setStep("complete");
        setTimeout(() => {
          onOrdersReceived();
        }, 2000);
      } else {
        alert("Failed to receive orders");
      }
    } catch (error) {
      alert("Error receiving orders");
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return Array.from(receivedOrders.values()).reduce((sum, orderData) => sum + orderData.totalItems, 0);
  };

  const getScannedItemsCount = () => {
    return Array.from(receivedOrders.values()).reduce((sum, orderData) => sum + orderData.scannedItems.length, 0);
  };

  const getMissingItemsCount = () => {
    return Array.from(receivedOrders.values()).reduce((sum, orderData) => sum + orderData.missingItems.length, 0);
  };

  if (step === "complete") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Orders Received Successfully!</h3>
          <p className="text-gray-600 mb-4">
            {receivedOrders.size} orders have been received and are ready for delivery/pickup
          </p>
          <div className="flex gap-2 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Receipt className="h-4 w-4 mr-2" />
              Print Bills
            </Button>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scanning Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Items from Multiple Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={currentScan}
                onChange={(e) => setCurrentScan(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scan any item tag barcode"
                className="font-mono"
              />
              <Button onClick={handleItemScan} disabled={!currentScan.trim()}>
                <Scan className="h-4 w-4 mr-2" />
                Scan Item
              </Button>
            </div>

            {/* Test Barcodes */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Test Item Barcodes:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from({length: 10}, (_, i) => `ITEM_${i+1}_TAG`).map((code) => (
                  <Button
                    key={code}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentScan(code)}
                    className="font-mono text-xs"
                  >
                    {code}
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {receivedOrders.size > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Receiving Progress</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    {receivedOrders.size} Orders
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-600 font-medium">Scanned: {getScannedItemsCount()}</span>
                  </div>
                  <div>
                    <span className="text-red-600 font-medium">Missing: {getMissingItemsCount()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total: {getTotalItems()}</span>
                  </div>
                </div>
                <Progress 
                  value={getTotalItems() > 0 ? (getScannedItemsCount() / getTotalItems()) * 100 : 0} 
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Received Orders */}
      {receivedOrders.size > 0 && step === "scan" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Received Orders ({receivedOrders.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(receivedOrders.entries()).map(([orderId, orderData]) => (
                <Card key={orderId} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-semibold text-lg">{orderData.order.id}</h4>
                          <Badge className={
                            orderData.scannedItems.length === orderData.totalItems 
                              ? "bg-green-100 text-green-800" 
                              : orderData.missingItems.length > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }>
                            {orderData.scannedItems.length === orderData.totalItems ? "Complete" : 
                             orderData.missingItems.length > 0 ? "Issues" : "Partial"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {orderData.order.customer_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {orderData.order.customer_phone}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOrder(orderId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Items Progress</span>
                        <span>{orderData.scannedItems.length}/{orderData.totalItems}</span>
                      </div>
                      <Progress value={(orderData.scannedItems.length / orderData.totalItems) * 100} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-green-600">Scanned Items</Label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {orderData.scannedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                              <span>{item.name}</span>
                              <Button size="sm" variant="outline" onClick={() => markItemMissing(orderId, item)}>
                                Missing
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-red-600">Missing Items</Label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {orderData.missingItems.map((item, index) => (
                            <div key={index} className="p-2 bg-red-50 rounded text-sm">
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getMissingItemsCount() > 0 && (
                <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                  <div>
                    <Label>Global Issue Reason</Label>
                    <Select value={globalIssueReason} onValueChange={setGlobalIssueReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="damaged">Items Damaged</SelectItem>
                        <SelectItem value="lost">Items Lost</SelectItem>
                        <SelectItem value="not_processed">Not Processed</SelectItem>
                        <SelectItem value="quality_issue">Quality Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Global Issue Notes</Label>
                    <Textarea
                      value={globalIssueNotes}
                      onChange={(e) => setGlobalIssueNotes(e.target.value)}
                      placeholder="Describe the issues..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={receivedOrders.size === 0}>
                  Next: Set Delivery Options
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Options */}
      {step === "delivery" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Set Delivery Options for Each Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from(receivedOrders.entries()).map(([orderId, orderData]) => (
                <Card key={orderId} className="border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">{orderData.order.id} - {orderData.order.customer_name}</h4>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Delivery Mode</Label>
                        <Select 
                          value={orderData.deliveryMode} 
                          onValueChange={(value) => updateOrderDelivery(orderId, "deliveryMode", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pickup">Self Pickup</SelectItem>
                            <SelectItem value="delivery">Home Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {orderData.deliveryMode === "delivery" && (
                        <div>
                          <Label>Assign Driver</Label>
                          <Select 
                            value={orderData.assignedDriver} 
                            onValueChange={(value) => updateOrderDelivery(orderId, "assignedDriver", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select driver" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="driver1">John Driver</SelectItem>
                              <SelectItem value="driver2">Mike Delivery</SelectItem>
                              <SelectItem value="driver3">Sarah Transport</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Payment Type</Label>
                        <Select 
                          value={orderData.paymentType} 
                          onValueChange={(value) => updateOrderDelivery(orderId, "paymentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cod">Pay on Delivery</SelectItem>
                            <SelectItem value="account">Add to Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("scan")}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Processing..." : `Complete ${receivedOrders.size} Orders`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Mock function to find item by barcode
const findItemByBarcode = async (barcode) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockOrders = [
    {
      id: 'ORD001',
      customer_name: 'John Doe',
      customer_phone: '9876543210',
      status: 'in_workshop',
      items: [
        { id: 1, name: 'Shirt Dry Clean', quantity: 2, tag_barcode: 'ITEM_1_TAG' },
        { id: 2, name: 'Trouser Press', quantity: 1, tag_barcode: 'ITEM_2_TAG' },
        { id: 3, name: 'Dress Dry Clean', quantity: 1, tag_barcode: 'ITEM_3_TAG' }
      ]
    },
    {
      id: 'ORD002',
      customer_name: 'Jane Smith',
      customer_phone: '9876543211',
      status: 'in_workshop',
      items: [
        { id: 4, name: 'Suit Dry Clean', quantity: 1, tag_barcode: 'ITEM_4_TAG' },
        { id: 5, name: 'Shirt Wash', quantity: 1, tag_barcode: 'ITEM_5_TAG' }
      ]
    }
  ];

  // Add more test items
  for (let i = 6; i <= 10; i++) {
    if (barcode === `ITEM_${i}_TAG`) {
      const order = mockOrders[0];
      const item = { id: i, name: `Test Item ${i}`, quantity: 1, tag_barcode: barcode };
      return { item, order };
    }
  }

  for (const order of mockOrders) {
    const item = order.items.find(item => item.tag_barcode === barcode);
    if (item) {
      return { item, order };
    }
  }

  return null;
};

export default ReceiveMultipleOrders;