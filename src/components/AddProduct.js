"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react"; // Import icons from lucide-react
import { addProduct } from "@/lib/productActions";

export function AddProductForm({ categories }) {
  const [formData, setFormData] = useState({
    item_name: "",
    rate_per_unit: "",
    category: "",
    subCategory: "",
    notes: "",
    hsn: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      subCategory: "" // Reset subcategory when category changes
    }));
  };

  const handleSubCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      subCategory: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      item_name: "",
      rate_per_unit: "",
      category: "",
      subCategory: "",
      notes: "",
      hsn: ""
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = { ...formData, hsn: formData.hsn || "99712" };

    try {
      const response = await addProduct(data);
      if (response?.error) {
        console.error("Add Product failed:", response.message);
        setError(`Error: ${response.message}`);
      } else {
        // Success: Close modal and reset form
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="bg-slate-400 text-white hover:bg-slate-500"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-600 py-2 text-right">{error}</div>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productName" className="text-right">
                Product Name
              </Label>
              <Input
                required
                id="item_name"
                placeholder="Enter product name"
                className="col-span-3"
                value={formData.item_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                required
                id="rate_per_unit"
                placeholder="Enter price"
                type="number"
                className="col-span-3"
                value={formData.rate_per_unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                onValueChange={handleCategoryChange}
                required
                value={formData.category}
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue
                    placeholder={formData.category || "Select category"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c, i) => (
                    <SelectItem value={c} key={i}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subCategory" className="text-right">
                Sub Category
              </Label>
              <Select
                onValueChange={handleSubCategoryChange}
                value={formData.subCategory}
              >
                <SelectTrigger id="subCategory" className="col-span-3">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                  <SelectItem value="Household">Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hsn" className="text-right">
                HSN Code
              </Label>
              <Input
                id="hsn"
                placeholder="Enter HSN code"
                className="col-span-3"
                value={formData.hsn}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                placeholder="Enter notes"
                className="col-span-3"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" />}
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
