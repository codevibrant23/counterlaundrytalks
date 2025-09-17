"use client";
import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  ReceiptIndianRupee,
  IndianRupee,
  Percent,
  BadgeIndianRupee,
  HandCoins,
  Plus,
  Minus,
  FileText,
  Download,
  Printer,
} from "lucide-react";
import { useCart } from "@/utils/CartContext";
import { placeOrder } from "@/lib/actions";
import usePrintJS from "@/utils/CustomHook";
import DatePickerInput from "./DatePickerInput";
import dayjs from "dayjs";
import { Switch } from "./ui/switch";
import { useCustomerForm } from "@/utils/CustomerFormContext";

const Cart = () => {
  const {
    cart,
    clearCart,
    addToCart,
    removeFromCart,
    toggleHanger,
    total: subtotal,
    totalQuantity,
    customer,
  } = useCart();
  const { resetForm } = useCustomerForm();
  const handlePrint = usePrintJS();
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [dateOfCollection, setDateOfCollection] = useState("");

  const handlePaymentModeChange = (mode) => {
    setPaymentMode(mode);
  };
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value);
    setDiscount(isNaN(value) || value < 0 ? 0 : value > 100 ? 0 : value);
  };

  const handleSubmit = async () => {
    // Check if cash register is open
    const currentShift = JSON.parse(localStorage.getItem('currentShift') || '{}');
    if (!currentShift.status || currentShift.status !== 'open') {
      alert("Please open the cash register before placing orders.");
      return;
    }

    if (!customer) {
      alert("Please enter customer details to place order.");
      return;
    }

    if (!dateOfCollection) {
      alert("Please select a date of collection.");
      return;
    }

    const orderDetails = {
      customer_phone: customer,
      order_items: cart?.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        hanger: item.hanger || false,
      })),
      date_of_collection: dayjs(dateOfCollection).add(1, "day"),
      discount_percentage: discount,
      mode_of_payment: "cash",
    };
    try {
      const data = await placeOrder(orderDetails);
      if (data?.error) {
        console.error("Order failed:", data.detail);
        alert(`Order failed: ${data.detail}`);
      } else {
        handlePrint(data).then(() => {
          handleClear();
          resetForm(); //Reset Customer Form
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An unexpected error occurred while placing the order.");
    }
  };

  const handleClear = () => {
    clearCart();
    setDateOfCollection("");
    setDiscount(0);
    setPaymentMode("UPI");
  };

  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate; // GST on discounted
  const discountAmount = (subtotal * discount) / 100; // Discount on GST-exclusive total
  const finalTotal = subtotal - discountAmount; // Subtotal after discount

  return (
    <Card className="flex-1 flex flex-col rounded-none overflow-auto pb-3">
      <div className="p-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ReceiptIndianRupee className="h-4 w-4" /> Bill
        </h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          disabled={cart.length === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b font-semibold text-gray-700">
                <th className="w-12 text-left px-1">H</th>
                <th className="text-left">Item</th>
                <th className="w-12 text-right pr-1">Qty</th>
                <th className="w-24">Rate</th>
                <th className="w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <CartItem
                  key={i}
                  item={item}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  toggleHanger={toggleHanger}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer and Input */}
      <div className="px-3 py-1 flex justify-between font-semibold text-md items-end">
        <div>Total items</div>
        <div className="text-lg">{totalQuantity}</div>
      </div>
      <div className="p-3 border-t">
        {/* Date of Collection */}
        <div className="flex items-center gap-10 mb-3">
          <div className="w-48 text-base font-medium flex items-center gap-2">
            <span>Date of Collection</span>
          </div>
          <DatePickerInput
            date={dateOfCollection}
            setDate={setDateOfCollection}
            placeholder="Select Date"
          />
        </div>

        {/* Discount */}
        <div className="flex items-center gap-10 py-3 border-t">
          <div className="w-48 text-base font-medium flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Discount
          </div>
          <Input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={handleDiscountChange}
            className="w-full h-10 text-sm"
            placeholder="0"
          />
        </div>

        {/* Totals */}

        {discount > 0 && (
          <>
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base">Subtotal</span>
                <span className="text-base font-medium">
                  Rs. {subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base">Discount</span>
                <span className="text-base font-medium text-red-600">
                  - Rs. {discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center py-2 text-gray-600 text-sm  border-t">
          <span>
            GST <span className="text-gray-600 text-sm"> *inclusive (18%)</span>
          </span>
          <span className="font-medium">
            Rs. {gstAmount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between items-center text-xl font-bold">
          <span className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Total
          </span>
          <span>Rs. {finalTotal.toLocaleString("en-IN")}</span>
        </div>

        {/* Mode of Payment Section */}
        {/* <div className="flex gap-3">
          <Button
            variant={paymentMode === "UPI" ? "filled" : "outline"}
            className={`flex h-12 items-center gap-2 w-1/2 justify-center ${
              paymentMode === "UPI"
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-transparent text-gray-700 border-gray-300"
            }`}
            onClick={() => handlePaymentModeChange("UPI")}
          >
            <BadgeIndianRupee className="h-5 w-5" />
            UPI
          </Button>
          <Button
            variant={paymentMode === "Cash" ? "filled" : "outline"}
            className={`flex h-12 items-center gap-2 w-1/2 justify-center ${
              paymentMode === "Cash"
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-transparent text-gray-700 border-gray-300"
            }`}
            onClick={() => handlePaymentModeChange("Cash")}
          >
            <HandCoins className="h-5 w-5" />
            Cash
          </Button>
        </div> */}

        <Button
          className="w-full h-10 text-base mt-3"
          disabled={cart.length === 0}
          onClick={handleSubmit}
        >
          Print Bill
        </Button>
      </div>
    </Card>
  );
};

export default Cart;

const CartItem = ({ item, addToCart, removeFromCart, toggleHanger }) => {
  const totalPrice = item.rate_per_unit * item.quantity;

  return (
    <tr className="border-b">
      <td className="py-2">
        <Switch
          id="hanger"
          checked={item.hanger}
          onCheckedChange={(e) => toggleHanger(item.id, e)}
        />
      </td>
      <td className="px-1 py-2 font-medium truncate break-words">
        {item.item_name}
      </td>
      <td className="px-1 py-2 text-center flex items-center gap-2 justify-center">
        <Button
          variant="outline"
          className="h-6 w-6 text-xs"
          onClick={() => removeFromCart(item)}
        >
          <Minus strokeWidth={2.5} />
        </Button>
        <Button className="h-6 w-6 text-xs" onClick={() => addToCart(item)}>
          <Plus strokeWidth={2.5} />
        </Button>
        <div className="text-center w-6 h-6 font-medium rounded-full bg-slate-500 text-white flex items-center justify-center">
          {item.quantity}
        </div>
      </td>
      <td className="px-2 py-2 text-center">
        Rs. {item.rate_per_unit.toLocaleString("en-IN")}
      </td>
      <td className="px-2 py-2 text-center">
        Rs. {totalPrice.toLocaleString("en-IN")}
      </td>
    </tr>
  );
};
