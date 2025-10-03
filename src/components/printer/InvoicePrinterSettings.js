'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getInvoiceTemplates } from '@/lib/printerActions';

const InvoicePrinterSettings = ({ type }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [fields, setFields] = useState({
    company_logo: { enabled: true, label: 'Company Logo' },
    company_name: { enabled: true, label: 'Company Name' },
    company_address: { enabled: true, label: 'Company Address' },
    company_phone: { enabled: true, label: 'Company Phone' },
    company_email: { enabled: true, label: 'Company Email' },
    gst_number: { enabled: true, label: 'GST Number' },
    invoice_number: { enabled: true, label: 'Invoice Number' },
    invoice_date: { enabled: true, label: 'Invoice Date' },
    customer_name: { enabled: true, label: 'Customer Name' },
    customer_phone: { enabled: true, label: 'Customer Phone' },
    customer_address: { enabled: type === 'invoice', label: 'Customer Address' },
    customer_gst: { enabled: type === 'invoice', label: 'Customer GST' },
    order_number: { enabled: true, label: 'Order Number' },
    order_date: { enabled: true, label: 'Order Date' },
    pickup_date: { enabled: true, label: 'Pickup Date' },
    delivery_date: { enabled: true, label: 'Delivery Date' },
    items_list: { enabled: true, label: 'Items List' },
    item_quantity: { enabled: true, label: 'Item Quantity' },
    item_price: { enabled: true, label: 'Item Price' },
    item_total: { enabled: true, label: 'Item Total' },
    subtotal: { enabled: true, label: 'Subtotal' },
    discount: { enabled: true, label: 'Discount' },
    promo_code: { enabled: true, label: 'Promo Code' },
    tax_amount: { enabled: true, label: 'Tax Amount' },
    total_amount: { enabled: true, label: 'Total Amount' },
    payment_method: { enabled: true, label: 'Payment Method' },
    payment_status: { enabled: true, label: 'Payment Status' },
    pending_amount: { enabled: true, label: 'Pending Amount' },
    notes: { enabled: type === 'invoice', label: 'Notes' },
    terms_conditions: { enabled: type === 'invoice', label: 'Terms & Conditions' },
    footer_text: { enabled: true, label: 'Footer Text' },
    qr_code: { enabled: type === 'thermal', label: 'QR Code for Payment' },
    barcode: { enabled: false, label: 'Order Barcode' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [type]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getInvoiceTemplates();
      const filteredTemplates = data.filter(template => template.type === type);
      setTemplates(filteredTemplates);
      if (filteredTemplates.length > 0) {
        setSelectedTemplate(filteredTemplates[0].id);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${type === 'invoice' ? 'Invoice' : 'Thermal'} printer settings saved successfully`);
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateFieldSetting = (fieldKey, enabled) => {
    setFields(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        enabled
      }
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Settings Panel */}
      <div className="space-y-6">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Template Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Select Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Field Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Fields to Include</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(fields).map(([key, field]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm">{field.label}</Label>
                <Switch
                  checked={field.enabled}
                  onCheckedChange={(enabled) => updateFieldSetting(key, enabled)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {type === 'invoice' ? 'Invoice' : 'Thermal Receipt'} Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border border-gray-300 p-4 rounded-lg">
              {type === 'invoice' ? (
                <InvoicePreview fields={fields} />
              ) : (
                <ThermalPreview fields={fields} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InvoicePreview = ({ fields }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white text-xs" style={{ fontSize: '10px' }}>
      {/* Header */}
      {fields.company_logo.enabled && (
        <div className="text-center mb-2">
          <div className="w-16 h-8 bg-gray-200 mx-auto rounded"></div>
        </div>
      )}
      
      {fields.company_name.enabled && (
        <div className="text-center font-bold text-lg mb-1">LaundryTalks</div>
      )}
      
      {fields.company_address.enabled && (
        <div className="text-center text-xs mb-1">123 Business Street, City, State 12345</div>
      )}
      
      <div className="text-center text-xs mb-2">
        {fields.company_phone.enabled && <span>Phone: +91 9876543210</span>}
        {fields.company_email.enabled && <span> | Email: info@laundrytalks.com</span>}
      </div>

      {fields.gst_number.enabled && (
        <div className="text-center text-xs mb-3">GST: 27AABCU9603R1ZX</div>
      )}

      <hr className="my-2" />

      {/* Invoice Details */}
      <div className="flex justify-between mb-2">
        {fields.invoice_number.enabled && <span>Invoice: #INV001</span>}
        {fields.invoice_date.enabled && <span>Date: 25/01/2024</span>}
      </div>

      {/* Customer Details */}
      <div className="mb-2">
        <div className="font-semibold">Bill To:</div>
        {fields.customer_name.enabled && <div>John Doe</div>}
        {fields.customer_phone.enabled && <div>+91 9876543210</div>}
        {fields.customer_address.enabled && <div>123 Main Street, Apartment 4B</div>}
        {fields.customer_gst.enabled && <div>GST: 27AABCU9603R1ZY</div>}
      </div>

      {/* Order Details */}
      <div className="mb-2">
        {fields.order_number.enabled && <div>Order: #LT240001</div>}
        {fields.pickup_date.enabled && <div>Pickup: 26/01/2024</div>}
        {fields.delivery_date.enabled && <div>Delivery: 28/01/2024</div>}
      </div>

      <hr className="my-2" />

      {/* Items */}
      {fields.items_list.enabled && (
        <div className="mb-2">
          <div className="flex justify-between font-semibold border-b">
            <span>Item</span>
            {fields.item_quantity.enabled && <span>Qty</span>}
            {fields.item_price.enabled && <span>Price</span>}
            {fields.item_total.enabled && <span>Total</span>}
          </div>
          <div className="flex justify-between">
            <span>Shirt Wash</span>
            {fields.item_quantity.enabled && <span>3</span>}
            {fields.item_price.enabled && <span>₹50</span>}
            {fields.item_total.enabled && <span>₹150</span>}
          </div>
          <div className="flex justify-between">
            <span>Trouser Press</span>
            {fields.item_quantity.enabled && <span>2</span>}
            {fields.item_price.enabled && <span>₹75</span>}
            {fields.item_total.enabled && <span>₹150</span>}
          </div>
        </div>
      )}

      <hr className="my-2" />

      {/* Totals */}
      <div className="space-y-1">
        {fields.subtotal.enabled && (
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹300.00</span>
          </div>
        )}
        {fields.discount.enabled && (
          <div className="flex justify-between text-green-600">
            <span>Discount (10%):</span>
            <span>-₹30.00</span>
          </div>
        )}
        {fields.tax_amount.enabled && (
          <div className="flex justify-between">
            <span>Tax (18%):</span>
            <span>₹48.60</span>
          </div>
        )}
        {fields.total_amount.enabled && (
          <div className="flex justify-between font-bold text-lg border-t pt-1">
            <span>Total:</span>
            <span>₹318.60</span>
          </div>
        )}
      </div>

      <hr className="my-2" />

      {/* Payment Details */}
      <div className="space-y-1">
        {fields.payment_method.enabled && (
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span>Cash</span>
          </div>
        )}
        {fields.payment_status.enabled && (
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-600">Paid</span>
          </div>
        )}
      </div>

      {fields.notes.enabled && (
        <div className="mt-2">
          <div className="font-semibold">Notes:</div>
          <div className="text-xs">Handle with care. Thank you for your business!</div>
        </div>
      )}

      {fields.terms_conditions.enabled && (
        <div className="mt-2 text-xs">
          <div className="font-semibold">Terms & Conditions:</div>
          <div>Items not collected within 30 days will be donated to charity.</div>
        </div>
      )}

      {fields.footer_text.enabled && (
        <div className="text-center mt-3 text-xs">
          Thank you for choosing LaundryTalks!
        </div>
      )}
    </div>
  );
};

const ThermalPreview = ({ fields }) => {
  return (
    <div className="w-48 mx-auto bg-white text-xs font-mono" style={{ fontSize: '9px', lineHeight: '1.2' }}>
      {/* Header */}
      {fields.company_name.enabled && (
        <div className="text-center font-bold mb-1">LAUNDRYTALKS</div>
      )}
      
      {fields.company_address.enabled && (
        <div className="text-center mb-1">123 Business St, City</div>
      )}
      
      {fields.company_phone.enabled && (
        <div className="text-center mb-2">Ph: +91 9876543210</div>
      )}

      <div className="text-center">================================</div>

      {/* Receipt Details */}
      <div className="flex justify-between">
        {fields.invoice_number.enabled && <span>Receipt: #R001</span>}
      </div>
      {fields.invoice_date.enabled && (
        <div>Date: 25/01/2024 10:30 AM</div>
      )}

      <div>================================</div>

      {/* Customer */}
      {fields.customer_name.enabled && <div>Customer: John Doe</div>}
      {fields.customer_phone.enabled && <div>Phone: +91 9876543210</div>}
      {fields.order_number.enabled && <div>Order: #LT240001</div>}

      <div>================================</div>

      {/* Items */}
      {fields.items_list.enabled && (
        <div>
          <div>ITEMS:</div>
          <div className="flex justify-between">
            <span>Shirt Wash x3</span>
            <span>₹150.00</span>
          </div>
          <div className="flex justify-between">
            <span>Trouser Press x2</span>
            <span>₹150.00</span>
          </div>
        </div>
      )}

      <div>--------------------------------</div>

      {/* Totals */}
      {fields.subtotal.enabled && (
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹300.00</span>
        </div>
      )}
      {fields.discount.enabled && (
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>-₹30.00</span>
        </div>
      )}
      {fields.tax_amount.enabled && (
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>₹48.60</span>
        </div>
      )}
      
      <div>================================</div>
      
      {fields.total_amount.enabled && (
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>₹318.60</span>
        </div>
      )}

      {fields.payment_method.enabled && (
        <div className="flex justify-between">
          <span>Payment:</span>
          <span>CASH</span>
        </div>
      )}

      {fields.delivery_date.enabled && (
        <div>Delivery: 28/01/2024</div>
      )}

      <div>================================</div>

      {fields.qr_code.enabled && (
        <div className="text-center">
          <div className="w-16 h-16 bg-black mx-auto mb-1" style={{
            background: 'repeating-conic-gradient(black 0deg 90deg, white 90deg 180deg)'
          }}></div>
          <div>Scan to Pay</div>
        </div>
      )}

      {fields.footer_text.enabled && (
        <div className="text-center mt-2">
          Thank you! Visit again!
        </div>
      )}
    </div>
  );
};

export default InvoicePrinterSettings;