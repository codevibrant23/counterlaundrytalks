"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  MessageCircle,
  Phone,
  Settings,
  RotateCcw,
  DollarSign,
  FileText,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/utils/CartContext";
import { useCustomerForm } from "@/utils/CustomerFormContext";

const QuickActions = () => {
  const { clearCart } = useCart();
  const { resetForm } = useCustomerForm();
  const [notifications] = useState([
    { id: 1, type: "pickup", message: "New pickup request from John Doe", time: "5 min ago" },
    { id: 2, type: "delivery", message: "Order #1234 ready for delivery", time: "10 min ago" },
    { id: 3, type: "workshop", message: "Received items from workshop", time: "15 min ago" },
  ]);

  const handleReset = () => {
    clearCart();
    resetForm();
  };

  const handleSchedulePickup = () => {
    // Implement schedule pickup functionality
    alert("Schedule Pickup feature - To be implemented");
  };

  const handleChatSupport = () => {
    // Implement chat support
    alert("Chat with us feature - To be implemented");
  };

  const handleCallSupport = () => {
    // Implement call support
    window.open("tel:+919876543210");
  };

  const handleOpenCashRegister = () => {
    // This will be handled by the CashRegister component
    document.dispatchEvent(new CustomEvent('openCashRegister'));
  };

  const handlePriceList = () => {
    // Implement price list functionality
    alert("Price List feature - To be implemented");
  };

  const handleCustomerManagement = () => {
    // Open customer management page
    window.open("/customers", "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2 font-semibold">Notifications</div>
          <DropdownMenuSeparator />
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="font-medium text-sm">{notification.message}</div>
              <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
            </DropdownMenuItem>
          ))}
          {notifications.length === 0 && (
            <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Schedule Pickup */}
      <Button variant="outline" size="sm" onClick={handleSchedulePickup}>
        <Calendar className="h-4 w-4 mr-1" />
        Schedule Pickup
      </Button>

      {/* More Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenCashRegister}>
            <DollarSign className="h-4 w-4 mr-2" />
            Cash Register
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePriceList}>
            <FileText className="h-4 w-4 mr-2" />
            Price List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCustomerManagement}>
            <Users className="h-4 w-4 mr-2" />
            Customer Management
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleChatSupport}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with us
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCallSupport}>
            <Phone className="h-4 w-4 mr-2" />
            Call Support
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default QuickActions;