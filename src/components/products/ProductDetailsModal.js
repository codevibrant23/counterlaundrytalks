"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/utils/CartContext";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [editablePrice, setEditablePrice] = useState(product?.price || 0);
  const [itemNotes, setItemNotes] = useState("");
  
  // Product customization options
  const [selectedOptions, setSelectedOptions] = useState({
    upcharges: "",
    color: "",
    brand: "",
    pattern: "",
    defects: "",
    stains: "",
    material: "",
    hanger: false,
    box: false,
    fold: false,
    starch: "",
    detergent: "",
    detergentScent: "",
    washTemperature: "",
    fabricSoftener: ""
  });

  // Mock dropdown options - these would come from panel configuration
  const dropdownOptions = {
    upcharges: ["Alteration", "Repair", "Express Service", "Stain Treatment"],
    colors: ["White", "Black", "Blue", "Red", "Green", "Yellow", "Pink", "Purple"],
    brands: ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Levi's"],
    patterns: ["Solid", "Striped", "Checkered", "Floral", "Polka Dot"],
    defects: ["Tear", "Stain", "Fade", "Shrinkage", "Button Missing"],
    stains: ["Oil", "Food", "Ink", "Blood", "Sweat", "Mud"],
    materials: ["Cotton", "Polyester", "Silk", "Wool", "Linen", "Denim"],
    starch: ["Light", "Medium", "Heavy", "No Starch"],
    detergents: ["Regular", "Sensitive", "Eco-Friendly", "Premium"],
    detergentScents: ["Fresh", "Lavender", "Citrus", "Unscented"],
    washTemperatures: ["Cold", "Warm", "Hot"],
    fabricSofteners: ["Regular", "Extra Soft", "Hypoallergenic", "None"]
  };

  React.useEffect(() => {
    if (product) {
      setEditablePrice(product.price);
      setQuantity(1);
      setItemNotes("");
      setSelectedOptions({
        upcharges: "",
        color: "",
        brand: "",
        pattern: "",
        defects: "",
        stains: "",
        material: "",
        hanger: false,
        box: false,
        fold: false,
        starch: "",
        detergent: "",
        detergentScent: "",
        washTemperature: "",
        fabricSoftener: ""
      });
    }
  }, [product]);

  if (!product) return null;

  const handleOptionChange = (option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handlePriceChange = (value) => {
    const newPrice = parseFloat(value);
    if (newPrice >= product.price) {
      setEditablePrice(newPrice);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      price: editablePrice,
      quantity,
      itemNotes,
      customizations: selectedOptions,
      // Create unique ID for cart items with different customizations
      cartId: `${product.id}_${Date.now()}_${JSON.stringify(selectedOptions)}`
    };
    
    addToCart(cartItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {product.name}
            <Badge variant="secondary">{product.category}</Badge>
            {product.subCategory && <Badge variant="outline">{product.subCategory}</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Base Price</Label>
                  <div className="text-lg font-semibold text-gray-600">₹{product.price}</div>
                </div>
                <div>
                  <Label htmlFor="editablePrice">Current Price *</Label>
                  <Input
                    id="editablePrice"
                    type="number"
                    step="0.01"
                    min={product.price}
                    value={editablePrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Min: ₹{product.price}</p>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Total</Label>
                  <div className="text-lg font-bold text-green-600">₹{(editablePrice * quantity).toFixed(2)}</div>
                </div>
              </div>
              
              {product.hsn && (
                <div>
                  <Label>HSN Code</Label>
                  <div className="text-sm text-gray-600">{product.hsn}</div>
                </div>
              )}
              
              {product.notes && (
                <div>
                  <Label>Product Notes</Label>
                  <div className="text-sm text-gray-600">{product.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Item Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Add any special instructions for this item"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customization Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upcharges/Services */}
              <div>
                <Label htmlFor="upcharges">Upcharges/Top-up Services</Label>
                <Select value={selectedOptions.upcharges} onValueChange={(value) => handleOptionChange("upcharges", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.upcharges.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Item Properties */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Color</Label>
                  <Select value={selectedOptions.color} onValueChange={(value) => handleOptionChange("color", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.colors.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Brand</Label>
                  <Select value={selectedOptions.brand} onValueChange={(value) => handleOptionChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.brands.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pattern</Label>
                  <Select value={selectedOptions.pattern} onValueChange={(value) => handleOptionChange("pattern", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.patterns.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Material</Label>
                  <Select value={selectedOptions.material} onValueChange={(value) => handleOptionChange("material", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.materials.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Defects</Label>
                  <Select value={selectedOptions.defects} onValueChange={(value) => handleOptionChange("defects", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select defects" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.defects.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Stains</Label>
                  <Select value={selectedOptions.stains} onValueChange={(value) => handleOptionChange("stains", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stains" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.stains.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Packaging Options */}
              <div>
                <h4 className="font-medium mb-3">Packaging Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hanger"
                      checked={selectedOptions.hanger}
                      onCheckedChange={(checked) => handleOptionChange("hanger", checked)}
                    />
                    <Label htmlFor="hanger">Hanger</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="box"
                      checked={selectedOptions.box}
                      onCheckedChange={(checked) => handleOptionChange("box", checked)}
                    />
                    <Label htmlFor="box">Box</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fold"
                      checked={selectedOptions.fold}
                      onCheckedChange={(checked) => handleOptionChange("fold", checked)}
                    />
                    <Label htmlFor="fold">Fold</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Washing Options */}
              <div>
                <h4 className="font-medium mb-3">Washing Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Starch</Label>
                    <Select value={selectedOptions.starch} onValueChange={(value) => handleOptionChange("starch", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select starch level" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.starch.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Detergent</Label>
                    <Select value={selectedOptions.detergent} onValueChange={(value) => handleOptionChange("detergent", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select detergent" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.detergents.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Detergent Scent</Label>
                    <Select value={selectedOptions.detergentScent} onValueChange={(value) => handleOptionChange("detergentScent", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scent" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.detergentScents.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Wash Temperature</Label>
                    <Select value={selectedOptions.washTemperature} onValueChange={(value) => handleOptionChange("washTemperature", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select temperature" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.washTemperatures.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Fabric Softener</Label>
                    <Select value={selectedOptions.fabricSoftener} onValueChange={(value) => handleOptionChange("fabricSoftener", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric softener" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.fabricSofteners.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart (₹{(editablePrice * quantity).toFixed(2)})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;