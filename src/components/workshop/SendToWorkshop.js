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
import { 
  Scan, Send, Printer, MessageSquare, Truck, 
  CheckCircle, AlertCircle, Package, User, Phone 
} from "lucide-react";
import { sendOrderToWorkshop } from "@/lib/workshopActions";

const SendToWorkshop = ({ order, onWorkshopSent, onCancel }) => {
  const [scannedItems, setScannedItems] = useState([]);
  const [currentScan, setCurrentScan] = useState("");
  const [workshopNotes, setWorkshopNotes] = useState("");
  const [requestPickup, setRequestPickup] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState("whatsapp");
  const [loading, setLoading] = useState(false);

  const handleItemScan = () => {
    if (currentScan.trim()) {
      const existingItem = scannedItems.find(item => item.barcode === currentScan);
      if (existingItem) {
        alert("Item already scanned");
        return;
      }

      // Find matching item from order
      const orderItem = order.items?.find(item => 
        item.tag_barcode === currentScan || 
        item.id.toString() === currentScan
      );

      if (orderItem) {
        setScannedItems([...scannedItems, {
          ...orderItem,
          barcode: currentScan,
          scanned_at: new Date().toISOString()
        }]);
        setCurrentScan("");
      } else {
        alert("Item not found in this order");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleItemScan();
    }
  };

  const removeScannedItem = (barcode) => {
    setScannedItems(scannedItems.filter(item => item.barcode !== barcode));
  };

  const handleSubmit = async () => {
    if (scannedItems.length === 0) {
      alert("Please scan at least one item before sending to workshop");
      return;
    }

    if (scannedItems.length !== order.items?.length) {
      const proceed = confirm(
        `Only ${scannedItems.length} of ${order.items?.length} items scanned. Continue anyway?`
      );
      if (!proceed) return;
    }

    setLoading(true);
    try {
      const workshopData = {
        order_id: order.id,
        scanned_items: scannedItems,
        workshop_notes: workshopNotes,
        request_pickup: requestPickup,
        notification_method: notificationMethod,
        sent_by: "Counter Staff", // In real app, get from auth
        sent_at: new Date().toISOString()
      };

      const result = await sendOrderToWorkshop(workshopData);
      
      if (result.success) {
        alert("Order sent to workshop successfully!");
        onWorkshopSent();
      } else {
        alert("Failed to send order to workshop");
      }
    } catch (error) {
      console.error("Send to workshop error:", error);
      alert("An error occurred while sending to workshop");
    } finally {
      setLoading(false);
    }
  };

  const allItemsScanned = scannedItems.length === order.items?.length;

  return (
    <div className="space-y-6">
      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium">Order ID</Label>
              <p className="text-lg font-semibold">{order.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge className="bg-blue-100 text-blue-800">
                {order.status?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{order.customer_name}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{order.customer_phone}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Items ({order.items?.length})</Label>
            <div className="mt-2 space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">Qty: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {scannedItems.find(si => si.id === item.id) ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Scanned
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Scanning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Item Tags
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
                  placeholder="Scan or enter item tag barcode"
                  className="font-mono"
                />
              </div>
              <Button onClick={handleItemScan} disabled={!currentScan.trim()}>
                <Scan className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Test Barcodes */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Test Item Barcodes:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {order.items?.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentScan(`ITEM_${item.id}_TAG`)}
                    className="font-mono text-xs"
                  >
                    ITEM_{item.id}_TAG
                  </Button>
                ))}
              </div>
            </div>

            {/* Scanned Items */}
            {scannedItems.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  Scanned Items ({scannedItems.length}/{order.items?.length})
                </Label>
                <div className="mt-2 space-y-2">
                  {scannedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">Barcode: {item.barcode}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeScannedItem(item.barcode)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allItemsScanned && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">All items scanned successfully!</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workshop Instructions */}
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

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Print challan functionality
              console.log("Print challan for order:", order.id);
              alert("Challan sent to printer!");
            }}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Challan
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || scannedItems.length === 0}
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
                Send to Workshop
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendToWorkshop;