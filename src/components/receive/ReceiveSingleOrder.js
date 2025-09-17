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
  Truck, Home, CreditCard, Receipt, Send
} from "lucide-react";
import { receiveOrderFromWorkshop, getOrderByChallan } from "@/lib/receiveActions";

const ReceiveSingleOrder = ({ selectedOrder, onOrderReceived, onCancel }) => {
  const [currentScan, setCurrentScan] = useState("");
  const [scannedItems, setScannedItems] = useState([]);
  const [missingItems, setMissingItems] = useState([]);
  const [issueNotes, setIssueNotes] = useState("");
  const [issueReason, setIssueReason] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("pickup");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [paymentType, setPaymentType] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("scan"); // scan, delivery, complete

  const handleChallanScan = async () => {
    if (!currentScan.trim()) return;
    
    setLoading(true);
    try {
      const order = await getOrderByChallan(currentScan);
      if (order) {
        // Auto-populate with found order
        setStep("scan");
      } else {
        alert("Challan not found");
      }
    } catch (error) {
      alert("Error finding challan");
    } finally {
      setLoading(false);
    }
  };

  const handleItemScan = () => {
    if (!currentScan.trim() || !selectedOrder) return;

    const orderItem = selectedOrder.items?.find(item => 
      item.tag_barcode === currentScan || item.id.toString() === currentScan
    );

    if (orderItem) {
      const alreadyScanned = scannedItems.find(item => item.barcode === currentScan);
      if (alreadyScanned) {
        alert("Item already scanned");
        return;
      }

      setScannedItems([...scannedItems, {
        ...orderItem,
        barcode: currentScan,
        scanned_at: new Date().toISOString()
      }]);
      setCurrentScan("");
    } else {
      alert("Item not found in this order");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (selectedOrder) {
        handleItemScan();
      } else {
        handleChallanScan();
      }
    }
  };

  const markItemMissing = (item) => {
    setMissingItems([...missingItems, item]);
    setScannedItems(scannedItems.filter(si => si.id !== item.id));
  };

  const markItemFound = (item) => {
    setScannedItems([...scannedItems, item]);
    setMissingItems(missingItems.filter(mi => mi.id !== item.id));
  };

  const handleNext = () => {
    if (missingItems.length > 0 && (!issueNotes || !issueReason)) {
      alert("Please provide issue notes and reason for missing items");
      return;
    }
    setStep("delivery");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const receiveData = {
        order_id: selectedOrder.id,
        scanned_items: scannedItems,
        missing_items: missingItems,
        issue_notes: issueNotes,
        issue_reason: issueReason,
        delivery_mode: deliveryMode,
        assigned_driver: assignedDriver,
        payment_type: paymentType,
        received_by: "Counter Staff",
        received_at: new Date().toISOString()
      };

      const result = await receiveOrderFromWorkshop(receiveData);
      
      if (result.success) {
        setStep("complete");
        setTimeout(() => {
          onOrderReceived();
        }, 2000);
      } else {
        alert("Failed to receive order");
      }
    } catch (error) {
      alert("Error receiving order");
    } finally {
      setLoading(false);
    }
  };

  if (step === "complete") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Order Received Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Order {selectedOrder?.id} has been received and is ready for {deliveryMode === 'pickup' ? 'customer pickup' : 'delivery'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Receipt className="h-4 w-4 mr-2" />
              Print Bill
            </Button>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedOrder) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <Scan className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Scan Challan or Bill Barcode</h3>
              <p className="text-gray-600">Scan the challan barcode or bill barcode to find the order</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Label htmlFor="challanScan">Challan/Bill Barcode</Label>
              <div className="flex gap-2">
                <Input
                  id="challanScan"
                  value={currentScan}
                  onChange={(e) => setCurrentScan(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scan challan or bill barcode"
                  className="font-mono"
                />
                <Button onClick={handleChallanScan} disabled={!currentScan.trim() || loading}>
                  {loading ? "Searching..." : "Find"}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Test Barcodes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {["CH001_CHALLAN", "CH002_CHALLAN", "ORD001_BILL", "ORD002_BILL"].map((code) => (
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
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <p className="text-lg font-semibold">{selectedOrder.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge className="bg-purple-100 text-purple-800">IN WORKSHOP</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedOrder.customer_name}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{selectedOrder.customer_phone}</span>
              </div>
            </div>
          </div>

          {selectedOrder.workshop_delivery && (
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">
                📦 Workshop/Plant is handling the delivery
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {step === "scan" && (
        <>
          {/* Item Scanning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Scan Items ({scannedItems.length}/{selectedOrder.items?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentScan}
                    onChange={(e) => setCurrentScan(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Scan item tag barcode"
                    className="font-mono"
                  />
                  <Button onClick={handleItemScan} disabled={!currentScan.trim()}>
                    <Scan className="h-4 w-4 mr-2" />
                    Scan
                  </Button>
                </div>

                <Progress value={(scannedItems.length / selectedOrder.items?.length) * 100} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Scanned Items ({scannedItems.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {scannedItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">{item.name}</span>
                          <Button size="sm" variant="outline" onClick={() => markItemMissing(item)}>
                            Mark Missing
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Missing Items ({missingItems.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {missingItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-sm">{item.name}</span>
                          <Button size="sm" variant="outline" onClick={() => markItemFound(item)}>
                            Mark Found
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {missingItems.length > 0 && (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                    <div>
                      <Label>Issue Reason</Label>
                      <Select value={issueReason} onValueChange={setIssueReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="damaged">Item Damaged</SelectItem>
                          <SelectItem value="lost">Item Lost</SelectItem>
                          <SelectItem value="not_processed">Not Processed</SelectItem>
                          <SelectItem value="quality_issue">Quality Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Issue Notes</Label>
                      <Textarea
                        value={issueNotes}
                        onChange={(e) => setIssueNotes(e.target.value)}
                        placeholder="Describe the issue..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={scannedItems.length === 0}>
                    Next: Choose Delivery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {step === "delivery" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Delivery Mode</Label>
              <Select value={deliveryMode} onValueChange={setDeliveryMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Self Pickup by Customer</SelectItem>
                  <SelectItem value="delivery">Home Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {deliveryMode === "delivery" && (
              <div>
                <Label>Assign Driver</Label>
                <Select value={assignedDriver} onValueChange={setAssignedDriver}>
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
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Pay on Delivery</SelectItem>
                  <SelectItem value="account">Add to Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("scan")}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing..." : "Complete Order"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReceiveSingleOrder;