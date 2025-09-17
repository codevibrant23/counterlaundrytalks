"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Smartphone, Wallet, Building } from "lucide-react";

const PaymentGateway = ({ isOpen, onClose, amount, onPaymentSuccess, onPaymentFailure }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [upiId, setUpiId] = useState("");

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "wallet", name: "Digital Wallet", icon: Wallet },
    { id: "netbanking", name: "Net Banking", icon: Building }
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment gateway integration
      const paymentData = {
        method: selectedMethod,
        amount: amount,
        transactionId: `TXN${Date.now()}`,
        status: "success",
        timestamp: new Date().toISOString()
      };

      // Simulate success/failure (90% success rate)
      if (Math.random() > 0.1) {
        onPaymentSuccess(paymentData);
        onClose();
      } else {
        onPaymentFailure({ error: "Payment failed. Please try again." });
      }
    } catch (error) {
      onPaymentFailure({ error: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Gateway</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Display */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">₹{amount?.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Amount to Pay</div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label>Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={selectedMethod === method.id ? "default" : "outline"}
                    onClick={() => setSelectedMethod(method.id)}
                    className="h-16 flex flex-col items-center gap-1"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Payment Details Form */}
          {selectedMethod === "card" && (
            <div className="space-y-3">
              <div>
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({
                    ...prev,
                    number: formatCardNumber(e.target.value)
                  }))}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Expiry</Label>
                  <Input
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      expiry: formatExpiry(e.target.value)
                    }))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 3)
                    }))}
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <Label>Cardholder Name</Label>
                <Input
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
            </div>
          )}

          {selectedMethod === "upi" && (
            <div>
              <Label>UPI ID</Label>
              <Input
                placeholder="user@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {selectedMethod === "wallet" && (
            <div className="space-y-2">
              <Label>Select Wallet</Label>
              <div className="grid grid-cols-3 gap-2">
                {["Paytm", "PhonePe", "GPay"].map((wallet) => (
                  <Button key={wallet} variant="outline" className="h-12">
                    {wallet}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === "netbanking" && (
            <div className="space-y-2">
              <Label>Select Bank</Label>
              <div className="grid grid-cols-2 gap-2">
                {["SBI", "HDFC", "ICICI", "Axis"].map((bank) => (
                  <Button key={bank} variant="outline" className="h-12">
                    {bank}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Badge variant="secondary" className="text-xs">
              🔒 Secure Payment
            </Badge>
            <span>256-bit SSL Encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handlePayment} className="flex-1" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount?.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentGateway;