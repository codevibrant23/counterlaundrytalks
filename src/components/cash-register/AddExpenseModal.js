'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getExpenseCategories, addExpenseCategory, addExpenseEntry, getStaffList } from '@/lib/expenseActions';

const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    purpose: '',
    category: '',
    staff: '',
    vendor_name: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: 'cash'
  });
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
      resetForm();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [categoriesData, staffData] = await Promise.all([
        getExpenseCategories(),
        getStaffList()
      ]);
      setCategories(categoriesData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const resetForm = () => {
    setExpenseData({
      amount: '',
      purpose: '',
      category: '',
      staff: '',
      vendor_name: '',
      date: new Date().toISOString().split('T')[0],
      payment_mode: 'cash'
    });
  };

  const handleAddCategory = async () => {
    if (!categoryData.name.trim()) {
      alert('Please enter category name');
      return;
    }

    try {
      const result = await addExpenseCategory(categoryData);
      if (result.success) {
        loadData();
        setIsAddCategoryOpen(false);
        setCategoryData({ name: '', description: '' });
        setExpenseData(prev => ({ ...prev, category: result.data.id }));
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Add category error:', error);
      alert('Failed to add category');
    }
  };

  const handleAddExpense = async () => {
    if (!expenseData.amount || !expenseData.purpose || !expenseData.category) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await addExpenseEntry({
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      });
      if (result.success) {
        onSuccess();
        onClose();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Add expense error:', error);
      alert('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Add Expense
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={expenseData.amount}
                onChange={(e) => setExpenseData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div>
              <Label>Purpose *</Label>
              <Textarea
                placeholder="Describe the expense purpose"
                value={expenseData.purpose}
                onChange={(e) => setExpenseData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={2}
              />
            </div>

            <div>
              <Label>Category *</Label>
              <div className="flex gap-2">
                <Select value={expenseData.category} onValueChange={(value) => setExpenseData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Staff</Label>
              <Select value={expenseData.staff} onValueChange={(value) => setExpenseData(prev => ({ ...prev, staff: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Vendor Name</Label>
              <Input
                placeholder="Enter vendor name"
                value={expenseData.vendor_name}
                onChange={(e) => setExpenseData(prev => ({ ...prev, vendor_name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={expenseData.date}
                onChange={(e) => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <Label>Payment Mode</Label>
              <Select value={expenseData.payment_mode} onValueChange={(value) => setExpenseData(prev => ({ ...prev, payment_mode: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="pay_later">Pay Later</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleAddExpense} disabled={loading}>
                {loading ? 'Adding...' : 'Add Expense'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                placeholder="Category name"
                value={categoryData.name}
                onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Category description"
                value={categoryData.description}
                onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddExpenseModal;