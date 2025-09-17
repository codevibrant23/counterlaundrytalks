"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { DollarSign, Clock, User } from "lucide-react";

const CashRegister = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [registerStatus, setRegisterStatus] = useState('closed'); // 'open', 'closed'
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [currentShift, setCurrentShift] = useState(null);

  // Dummy data for demonstration
  const [shiftData] = useState({
    operator: "John Doe",
    openTime: "09:00 AM",
    expectedCash: "5000.00",
    actualCash: "",
    difference: "0.00"
  });

  useEffect(() => {
    const handleOpenCashRegister = () => {
      setIsOpen(true);
    };

    document.addEventListener('openCashRegister', handleOpenCashRegister);
    
    // Check if register needs to be opened at start of shift
    checkRegisterStatus();

    return () => {
      document.removeEventListener('openCashRegister', handleOpenCashRegister);
    };
  }, []);

  const checkRegisterStatus = () => {
    // Check if register was closed yesterday and needs to be opened
    const lastClosed = localStorage.getItem('lastRegisterClosed');
    const today = new Date().toDateString();
    
    if (!lastClosed || new Date(lastClosed).toDateString() !== today) {
      // Show warning that register needs to be opened
      setRegisterStatus('needs_opening');
    }
  };

  const handleOpenRegister = () => {
    if (!openingAmount) {
      alert("Please enter opening amount");
      return;
    }

    const shiftInfo = {
      status: 'open',
      openingAmount: parseFloat(openingAmount),
      openTime: new Date().toLocaleString(),
      operator: shiftData.operator,
      notes: notes
    };

    localStorage.setItem('currentShift', JSON.stringify(shiftInfo));
    setRegisterStatus('open');
    setCurrentShift(shiftInfo);
    
    alert("Cash register opened successfully!");
    setIsOpen(false);
    resetForm();
  };

  const handleCloseRegister = () => {
    if (!closingAmount) {
      alert("Please enter closing amount");
      return;
    }

    const currentShiftData = JSON.parse(localStorage.getItem('currentShift') || '{}');
    const difference = parseFloat(closingAmount) - currentShiftData.openingAmount;

    const closingInfo = {
      ...currentShiftData,
      status: 'closed',
      closingAmount: parseFloat(closingAmount),
      closeTime: new Date().toLocaleString(),
      difference: difference,
      closingNotes: notes
    };

    localStorage.setItem('lastRegisterClosed', new Date().toISOString());
    localStorage.setItem('lastShift', JSON.stringify(closingInfo));
    localStorage.removeItem('currentShift');
    
    setRegisterStatus('closed');
    setCurrentShift(null);
    
    alert(`Cash register closed successfully! Difference: ₹${difference.toFixed(2)}`);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setOpeningAmount('');
    setClosingAmount('');
    setNotes('');
  };

  const isRegisterOpen = registerStatus === 'open';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cash Register Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Register Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isRegisterOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isRegisterOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            
            {currentShift && (
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>Operator: {currentShift.operator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Opened: {currentShift.openTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  <span>Opening Amount: ₹{currentShift.openingAmount}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Register Actions */}
          {!isRegisterOpen ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="openingAmount">Opening Amount (₹)</Label>
                <Input
                  id="openingAmount"
                  type="number"
                  value={openingAmount}
                  onChange={(e) => setOpeningAmount(e.target.value)}
                  placeholder="Enter opening cash amount"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes for this shift..."
                  rows={3}
                />
              </div>

              <Button onClick={handleOpenRegister} className="w-full">
                Open Cash Register
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="closingAmount">Closing Amount (₹)</Label>
                <Input
                  id="closingAmount"
                  type="number"
                  value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)}
                  placeholder="Enter actual cash amount"
                />
              </div>

              <div>
                <Label htmlFor="notes">Closing Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes for closing..."
                  rows={3}
                />
              </div>

              <Button onClick={handleCloseRegister} className="w-full" variant="destructive">
                Close Cash Register
              </Button>
            </div>
          )}

          {/* Warning for new orders */}
          {!isRegisterOpen && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Cash register must be opened before placing new orders.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashRegister;