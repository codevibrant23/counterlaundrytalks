"use client";

import React from "react";

const PrintReceipt = ({ orderData, onPrint }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Laundry Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .address { font-size: 10px; color: #666; }
        .order-info { margin: 20px 0; }
        .order-info div { margin: 3px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .items-table th, .items-table td { padding: 5px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f5f5f5; font-weight: bold; }
        .total-section { margin-top: 15px; }
        .total-row { display: flex; justify-content: space-between; margin: 3px 0; }
        .total-final { font-weight: bold; font-size: 14px; border-top: 2px solid #000; padding-top: 5px; }
        .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #666; }
        .customizations { font-size: 10px; color: #666; margin-top: 2px; }
        .notes { background-color: #f9f9f9; padding: 8px; margin: 10px 0; border-left: 3px solid #007bff; }
        @media print {
          body { margin: 0; padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">LAUNDRY TALKS</div>
        <div class="address">
          123 Business Street, City - 400001<br>
          Phone: +91 98765 43210 | Email: info@laundrytalks.com
        </div>
      </div>

      <div class="order-info">
        <div><strong>Order ID:</strong> ${orderData.order_id || 'ORD' + Date.now()}</div>
        <div><strong>Date:</strong> ${formatDate(new Date())}</div>
        <div><strong>Customer:</strong> ${orderData.customer_phone}</div>
        <div><strong>Collection Date:</strong> ${formatDate(orderData.collection_date)}</div>
        <div><strong>Delivery Mode:</strong> ${orderData.delivery_mode?.replace('_', ' ').toUpperCase()}</div>
        <div><strong>Payment Method:</strong> ${orderData.payment_method?.toUpperCase()}</div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.order_items?.map(item => `
            <tr>
              <td>
                ${item.name}
                ${item.customizations && Object.keys(item.customizations).length > 0 ? `
                  <div class="customizations">
                    ${Object.entries(item.customizations)
                      .filter(([key, value]) => value && !(typeof value === 'boolean' && !value))
                      .map(([key, value]) => `${key}: ${typeof value === 'boolean' ? 'Yes' : value}`)
                      .join(', ')}
                  </div>
                ` : ''}
                ${item.notes ? `<div class="customizations">Note: ${item.notes}</div>` : ''}
              </td>
              <td>${item.quantity}</td>
              <td>₹${item.price?.toFixed(2)}</td>
              <td>₹${(item.price * item.quantity)?.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span>Subtotal (${orderData.order_items?.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
          <span>₹${orderData.subtotal?.toFixed(2)}</span>
        </div>
        ${orderData.discount_percentage > 0 ? `
          <div class="total-row" style="color: #dc3545;">
            <span>Discount (${orderData.discount_percentage}%):</span>
            <span>-₹${((orderData.subtotal * orderData.discount_percentage) / 100)?.toFixed(2)}</span>
          </div>
        ` : ''}
        ${orderData.delivery_fee > 0 ? `
          <div class="total-row">
            <span>Delivery Fee:</span>
            <span>₹${orderData.delivery_fee?.toFixed(2)}</span>
          </div>
        ` : ''}
        ${orderData.tax_enabled ? `
          <div class="total-row">
            <span>Tax (18%):</span>
            <span>₹${orderData.tax_amount?.toFixed(2)}</span>
          </div>
        ` : ''}
        ${orderData.credits_used > 0 ? `
          <div class="total-row" style="color: #28a745;">
            <span>Credits Applied:</span>
            <span>-₹${orderData.credits_used?.toFixed(2)}</span>
          </div>
        ` : ''}
        ${orderData.tip_amount > 0 ? `
          <div class="total-row">
            <span>Tip:</span>
            <span>₹${orderData.tip_amount?.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="total-row total-final">
          <span>TOTAL:</span>
          <span>₹${orderData.total_amount?.toFixed(2)}</span>
        </div>
        ${orderData.payment_method === 'advance' ? `
          <div class="total-row">
            <span>Advance Paid:</span>
            <span>₹${orderData.advance_amount?.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Balance Due:</span>
            <span>₹${(orderData.total_amount - orderData.advance_amount)?.toFixed(2)}</span>
          </div>
        ` : ''}
      </div>

      ${orderData.customer_notes ? `
        <div class="notes">
          <strong>Customer Notes:</strong><br>
          ${orderData.customer_notes}
        </div>
      ` : ''}

      ${orderData.workshop_notes ? `
        <div class="notes">
          <strong>Workshop Instructions:</strong><br>
          ${orderData.workshop_notes}
        </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for choosing Laundry Talks!</p>
        <p>For any queries, call us at +91 98765 43210</p>
        <p>Visit us: www.laundrytalks.com</p>
      </div>
    </body>
    </html>
  `;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    if (onPrint) {
      onPrint();
    }
  };

  // Auto-print when component mounts
  React.useEffect(() => {
    if (orderData) {
      handlePrint();
    }
  }, [orderData]);

  return null; // This component doesn't render anything visible
};

export default PrintReceipt;