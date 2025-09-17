"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Scan, Send, Printer, MessageSquare, Truck, 
  CheckCircle, AlertCircle, Package, User, Phone, X
} from "lucide-react";
import { sendMultipleOrdersToWorkshop } from "@/lib/workshopActions";

const MultipleOrdersWorkshop = ({ onWorkshopSent, onCancel }) => {
  const [currentScan, setCurrentScan] = useState("");
  const [scannedOrders, setScannedOrders] = useState(new Map());
  const [workshopNotes, setWorkshopNotes] = useState("");
  const [requestPickup, setRequestPickup] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState("whatsapp");
  const [loading, setLoading] = useState(false);

  const handleItemScan = async () => {
    if (!currentScan.trim()) return;

    try {
      // Mock API call to find item and its order
      const mockItemData = await findItemByBarcode(currentScan);
      
      if (!mockItemData) {
        alert("Item not found");
        return;
      }

      const { item, order } = mockItemData;
      
      // Check if item already scanned
      const orderData = scannedOrders.get(order.id) || {
        order: order,
        scannedItems: [],
        totalItems: order.items.length
      };

      const alreadyScanned = orderData.scannedItems.find(si => si.barcode === currentScan);
      if (alreadyScanned) {
        alert("Item already scanned");
        return;
      }

      // Add item to scanned list
      orderData.scannedItems.push({
        ...item,
        barcode: currentScan,
        scanned_at: new Date().toISOString()
      });

      // Update orders map
      const newScannedOrders = new Map(scannedOrders);
      newScannedOrders.set(order.id, orderData);
      setScannedOrders(newScannedOrders);
      setCurrentScan("");

    } catch (error) {
      console.error("Scan error:", error);
      alert("Error scanning item");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleItemScan();
    }
  };

  const removeScannedItem = (orderId, barcode) => {
    const orderData = scannedOrders.get(orderId);
    if (!orderData) return;

    orderData.scannedItems = orderData.scannedItems.filter(item => item.barcode !== barcode);
    
    if (orderData.scannedItems.length === 0) {
      const newScannedOrders = new Map(scannedOrders);
      newScannedOrders.delete(orderId);
      setScannedOrders(newScannedOrders);
    } else {
      const newScannedOrders = new Map(scannedOrders);
      newScannedOrders.set(orderId, orderData);
      setScannedOrders(newScannedOrders);
    }
  };

  const removeOrder = (orderId) => {
    const newScannedOrders = new Map(scannedOrders);
    newScannedOrders.delete(orderId);
    setScannedOrders(newScannedOrders);
  };

  const handleSubmit = async () => {
    if (scannedOrders.size === 0) {
      alert("Please scan at least one item before sending to workshop");
      return;
    }

    setLoading(true);
    try {
      const workshopData = {
        orders: Array.from(scannedOrders.values()),
        workshop_notes: workshopNotes,
        request_pickup: requestPickup,
        notification_method: notificationMethod,
        sent_by: "Counter Staff",
        sent_at: new Date().toISOString()
      };

      const result = await sendMultipleOrdersToWorkshop(workshopData);
      
      if (result.success) {
        alert(`${scannedOrders.size} orders sent to workshop successfully!`);
        onWorkshopSent();
      } else {
        alert("Failed to send orders to workshop");
      }
    } catch (error) {
      console.error("Send to workshop error:", error);
      alert("An error occurred while sending to workshop");
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return Array.from(scannedOrders.values()).reduce((sum, orderData) => sum + orderData.totalItems, 0);
  };

  const getScannedItemsCount = () => {
    return Array.from(scannedOrders.values()).reduce((sum, orderData) => sum + orderData.scannedItems.length, 0);
  };

  const getOrderProgress = (orderData) => {
    return (orderData.scannedItems.length / orderData.totalItems) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Scanning Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Items for Multiple Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="itemScan">Scan Item Tag Barcode</Label>
                <Input
                  id="itemScan"
                  value={currentScan}
                  onChange={(e) => setCurrentScan(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scan any item tag barcode"
                  className="font-mono"
                  autoFocus
                />
              </div>
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
            {scannedOrders.size > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Scanning Progress</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    {scannedOrders.size} Orders
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {getScannedItemsCount()} of {getTotalItems()} items scanned
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

      {/* Scanned Orders */}
      {scannedOrders.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Scanned Orders ({scannedOrders.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(scannedOrders.entries()).map(([orderId, orderData]) => (
                <Card key={orderId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-semibold text-lg">{orderData.order.id}</h4>
                          <Badge className={
                            orderData.scannedItems.length === orderData.totalItems 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }>
                            {orderData.scannedItems.length === orderData.totalItems ? "Complete" : "Partial"}
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
                      <Progress value={getOrderProgress(orderData)} />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Scanned Items:</Label>
                      {orderData.scannedItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                          <div>
                            <span className="font-medium text-sm">{item.name}</span>
                            <span className="text-gray-600 ml-2 text-xs">({item.barcode})</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeScannedItem(orderId, item.barcode)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workshop Instructions */}
      {scannedOrders.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Workshop Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workshopNotes">Special Instructions</Label>
              <Textarea
                id="workshopNotes"
                value={workshopNotes}
                onChange={(e) => setWorkshopNotes(e.target.value)}
                placeholder="Enter special instructions for workshop..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requestPickup"
                checked={requestPickup}
                onCheckedChange={setRequestPickup}
              />
              <Label htmlFor="requestPickup">Request Pickup from Workshop</Label>
            </div>

            <div>
              <Label htmlFor="notification">Notification Method</Label>
              <Select value={notificationMethod} onValueChange={setNotificationMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="plant_device">Plant Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {scannedOrders.size > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                console.log("Print multiple orders challan:", Array.from(scannedOrders.keys()));
                alert("Challan sent to printer!");
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Challan
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send {scannedOrders.size} Orders to Workshop
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock function to find item by barcode
const findItemByBarcode = async (barcode) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock orders data (same as in workshopActions.js)
  const mockOrders = [
    {
      id: 'ORD001',
      customer_name: 'John Doe',
      customer_phone: '9876543210',
      status: 'ready_for_workshop',
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
      status: 'ready_for_workshop',
      items: [
        { id: 4, name: 'Suit Dry Clean', quantity: 1, tag_barcode: 'ITEM_4_TAG' },
        { id: 5, name: 'Shirt Wash', quantity: 1, tag_barcode: 'ITEM_5_TAG' }
      ]
    },
    {
      id: 'ORD004',
      customer_name: 'Sarah Wilson',
      customer_phone: '9876543213',
      status: 'ready_for_workshop',
      items: [
        { id: 8, name: 'Jeans Wash', quantity: 2, tag_barcode: 'ITEM_8_TAG' },
        { id: 9, name: 'T-shirt Wash', quantity: 1, tag_barcode: 'ITEM_9_TAG' }
      ]
    }
  ];

  // Add more test items
  for (let i = 6; i <= 10; i++) {
    if (barcode === `ITEM_${i}_TAG`) {
      const order = mockOrders.find(o => o.items.some(item => item.tag_barcode === barcode)) || mockOrders[0];
      const item = { id: i, name: `Test Item ${i}`, quantity: 1, tag_barcode: barcode };
      return { item, order };
    }
  }

  // Find item in existing orders
  for (const order of mockOrders) {
    const item = order.items.find(item => item.tag_barcode === barcode);
    if (item) {
      return { item, order };
    }
  }

  return null;
};

export default MultipleOrdersWorkshop;