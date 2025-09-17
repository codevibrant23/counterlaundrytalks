"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Trash2, Plus, Minus, Calendar, Percent, CreditCard, Wallet,
  Truck, MapPin, MessageSquare, Bell, Receipt, Printer, Tag
} from "lucide-react";
import { useCart } from "@/utils/CartContext";
import DatePickerInput from "./DatePickerInput";
import PaymentGateway from "./PaymentGateway";
import OTPVerification from "./OTPVerification";
import PrintReceipt from "./PrintReceipt";
import dayjs from "dayjs";

const EnhancedCart = () => {
  const { cart, clearCart, addToCart, removeFromCart, addDummyData, total: subtotal, totalQuantity, customer } = useCart();

  // Billing states
  const [dueDate, setDueDate] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoCoupon, setPromoCoupon] = useState("");
  const [subscription, setSubscription] = useState("");
  const [credits, setCredits] = useState(0);
  const [tip, setTip] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [taxEnabled, setTaxEnabled] = useState(true);

  // Order notes
  const [customerNotes, setCustomerNotes] = useState("");
  const [workshopNotes, setWorkshopNotes] = useState("");
  const [driverNotes, setDriverNotes] = useState("");

  // Delivery mode
  const [deliveryMode, setDeliveryMode] = useState("walkin");

  // Payment states
  const [payAllOrders, setPayAllOrders] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [advanceAmount, setAdvanceAmount] = useState(0);

  // Notification
  const [notificationMethod, setNotificationMethod] = useState("whatsapp");

  // Modal states
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [orderForPrint, setOrderForPrint] = useState(null);

  // Calculations
  const discountAmount = (subtotal * discount) / 100;
  const taxRate = 0.18;
  const taxAmount = taxEnabled ? (subtotal - discountAmount + deliveryFee) * taxRate : 0;
  const creditsApplied = Math.min(credits, subtotal - discountAmount);
  const finalTotal = subtotal - discountAmount + deliveryFee + taxAmount - creditsApplied + tip;
  const balanceAmount = paymentMethod === "advance" ? finalTotal - advanceAmount : 0;

  const handleSubmit = async () => {
    if (!customer) {
      alert("Please enter customer details to place order.");
      return;
    }

    if (!collectionDate) {
      alert("Please select a collection date.");
      return;
    }

    // Check if credits are being used and OTP verification is required
    if (creditsApplied > 0 && !otpVerified) {
      setShowOTPVerification(true);
      return;
    }

    // Check if payment gateway is required
    if (["card", "upi", "wallet", "netbanking"].includes(paymentMethod)) {
      setShowPaymentGateway(true);
      return;
    }

    // Process order directly for other payment methods
    await processOrder();
  };

  const processOrder = async (paymentData = null) => {
    const orderData = {
      customer_phone: customer,
      order_items: cart.map(item => ({
        product_id: item.id || item.cartId,
        name: item.name || item.item_name,
        quantity: item.quantity,
        price: item.price || item.rate_per_unit,
        customizations: item.customizations || {},
        notes: item.itemNotes || ""
      })),
      due_date: dueDate,
      collection_date: collectionDate,
      discount_percentage: discount,
      promo_coupon: promoCoupon,
      subscription_package: subscription,
      credits_used: creditsApplied,
      tip_amount: tip,
      delivery_mode: deliveryMode,
      delivery_fee: deliveryFee,
      payment_method: paymentMethod,
      advance_amount: advanceAmount,
      pay_all_orders: payAllOrders,
      notification_method: notificationMethod,
      customer_notes: customerNotes,
      workshop_notes: workshopNotes,
      driver_notes: driverNotes,
      tax_enabled: taxEnabled,
      tax_amount: taxAmount,
      subtotal: subtotal,
      total_amount: finalTotal,
      payment_data: paymentData,
      otp_verified: otpVerified
    };

    try {
      // Place order logic here
      console.log("Order Data:", orderData);

      // Set order for printing
      setOrderForPrint(orderData);

      // Clear cart after successful order
      setTimeout(() => {
        handleClear();
        alert("Order placed successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    processOrder(paymentData);
  };

  const handlePaymentFailure = (error) => {
    alert(`Payment failed: ${error.error}`);
  };

  const handleOTPSuccess = (verificationData) => {
    setOtpVerified(true);
    // Continue with order placement
    setTimeout(() => handleSubmit(), 100);
  };

  const handleOTPFailure = (error) => {
    alert(`OTP verification failed: ${error.error}`);
  };

  const handleClear = () => {
    clearCart();
    setDueDate("");
    setCollectionDate("");
    setDiscount(0);
    setPromoCoupon("");
    setSubscription("");
    setCredits(0);
    setTip(0);
    setDeliveryFee(0);
    setCustomerNotes("");
    setWorkshopNotes("");
    setDriverNotes("");
    setDeliveryMode("walkin");
    setPaymentMethod("cash");
    setAdvanceAmount(0);
    setPayAllOrders(false);
    setNotificationMethod("whatsapp");
    setOtpVerified(false);
    setOrderForPrint(null);
  };

  return (
    <Card className="flex-1 flex flex-col rounded-none overflow-auto">
      <CardHeader className="p-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Cart & Billing
          </CardTitle>
          <div className="flex gap-2">
            {cart.length === 0 && (
              <Button variant="outline" size="sm" onClick={addDummyData}>
                Test Data
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={handleClear} disabled={cart.length === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-3">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items in cart</p>
              <Button
                onClick={addDummyData}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Load Test Data
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item, index) => (
                <CartItemCard key={item.cartId || index} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
              ))}
            </div>
          )}
        </div>

        {/* Billing Section */}
        {cart.length > 0 && (
          <div className="border-t p-3 space-y-4 max-h-96 overflow-y-auto">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Due Date</Label>
                <DatePickerInput date={dueDate} setDate={setDueDate} placeholder="Due date" />
              </div>
              <div>
                <Label className="text-xs">Collection Date *</Label>
                <DatePickerInput date={collectionDate} setDate={setCollectionDate} placeholder="Collection date" />
              </div>
            </div>

            {/* Discount & Promo */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Discount (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Promo/Coupon</Label>
                <Input
                  value={promoCoupon}
                  onChange={(e) => setPromoCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="h-8"
                />
              </div>
            </div>

            {/* Subscription & Credits */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Subscription</Label>
                <Select value={subscription} onValueChange={setSubscription}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Credits</Label>
                <Input
                  type="number"
                  min="0"
                  value={credits}
                  onChange={(e) => setCredits(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="Available: 500"
                  className="h-8"
                />
              </div>
            </div>

            {/* Tip & Delivery Fee */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Tip</Label>
                <Input
                  type="number"
                  min="0"
                  value={tip}
                  onChange={(e) => setTip(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Delivery Fee</Label>
                <Input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-8"
                />
              </div>
            </div>

            {/* Delivery Mode */}
            <div>
              <Label className="text-xs">Delivery Mode</Label>
              <Select value={deliveryMode} onValueChange={setDeliveryMode}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walkin">Walk-in & Pickup</SelectItem>
                  <SelectItem value="pickup">Pickup Only</SelectItem>
                  <SelectItem value="delivery">Delivery Only</SelectItem>
                  <SelectItem value="pickup_delivery">Pickup & Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Notes */}
            <div className="space-y-2">
              <Label className="text-xs">Order Notes</Label>
              <Textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Customer notes"
                className="h-16 text-xs"
              />
              <Textarea
                value={workshopNotes}
                onChange={(e) => setWorkshopNotes(e.target.value)}
                placeholder="Workshop notes"
                className="h-16 text-xs"
              />
              <Textarea
                value={driverNotes}
                onChange={(e) => setDriverNotes(e.target.value)}
                placeholder="Driver notes"
                className="h-16 text-xs"
              />
            </div>

            {/* Payment Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch checked={payAllOrders} onCheckedChange={setPayAllOrders} />
                <Label className="text-xs">Pay all pending orders</Label>
              </div>

              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advance">Advance</SelectItem>
                    <SelectItem value="collection">Pay on Collection</SelectItem>
                    <SelectItem value="delivery">Pay on Delivery</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="account">Add to Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "advance" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Advance Amount</Label>
                    <Input
                      type="number"
                      min="0"
                      max={finalTotal}
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(Math.max(0, Math.min(finalTotal, parseFloat(e.target.value) || 0)))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Balance</Label>
                    <Input value={balanceAmount.toFixed(2)} readOnly className="h-8 bg-gray-50" />
                  </div>
                </div>
              )}
            </div>

            {/* Notification */}
            <div>
              <Label className="text-xs">Notification</Label>
              <Select value={notificationMethod} onValueChange={setNotificationMethod}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="none">Don&apos;t Notify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tax Toggle */}
            <div className="flex items-center space-x-2">
              <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
              <Label className="text-xs">Enable Tax (18%)</Label>
            </div>
          </div>
        )}

        {/* Totals & Actions */}
        {cart.length > 0 && (
          <div className="border-t p-3 space-y-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({totalQuantity} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({discount}%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {taxEnabled && (
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
              )}
              {creditsApplied > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Credits Applied</span>
                  <span>-₹{creditsApplied.toFixed(2)}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>₹{tip.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button onClick={handleSubmit} className="h-10">
                <Receipt className="h-4 w-4 mr-2" />
                Place Order
              </Button>
              <Button variant="outline" className="h-10">
                <Tag className="h-4 w-4 mr-2" />
                Print Tags
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Payment Gateway Modal */}
      <PaymentGateway
        isOpen={showPaymentGateway}
        onClose={() => setShowPaymentGateway(false)}
        amount={paymentMethod === "advance" ? advanceAmount : finalTotal}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      {/* OTP Verification Modal */}
      <OTPVerification
        isOpen={showOTPVerification}
        onClose={() => setShowOTPVerification(false)}
        phoneNumber={customer}
        onVerificationSuccess={handleOTPSuccess}
        onVerificationFailure={handleOTPFailure}
      />

      {/* Print Receipt */}
      {orderForPrint && (
        <PrintReceipt
          orderData={orderForPrint}
          onPrint={() => setOrderForPrint(null)}
        />
      )}
    </Card>
  );
};

const CartItemCard = ({ item, addToCart, removeFromCart }) => {
  const itemPrice = item.price || item.rate_per_unit;
  const itemName = item.name || item.item_name;
  const totalPrice = itemPrice * item.quantity;

  return (
    <Card className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{itemName}</h4>
          <div className="text-xs text-gray-600">₹{itemPrice} × {item.quantity}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">₹{totalPrice.toFixed(2)}</div>
          <div className="flex items-center gap-1 mt-1">
            <Button size="sm" variant="outline" onClick={() => removeFromCart(item)} className="h-6 w-6 p-0">
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs w-6 text-center">{item.quantity}</span>
            <Button size="sm" variant="outline" onClick={() => addToCart(item)} className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Show customizations */}
      {item.customizations && Object.keys(item.customizations).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(item.customizations).map(([key, value]) => {
            if (!value || (typeof value === 'boolean' && !value)) return null;
            return (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {typeof value === 'boolean' ? 'Yes' : value}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Show item notes */}
      {item.itemNotes && (
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <MessageSquare className="h-3 w-3 inline mr-1" />
          {item.itemNotes}
        </div>
      )}
    </Card>
  );
};

export default EnhancedCart;