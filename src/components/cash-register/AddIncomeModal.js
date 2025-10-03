'use client';

import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getIncomeReasons, addIncomeReason, addIncomeEntry } from '@/lib/expenseActions';

const AddIncomeModal = ({ isOpen, onClose, onSuccess }) => {
  const [reasons, setReasons] = useState([]);
  const [isAddReasonOpen, setIsAddReasonOpen] = useState(false);
  const [incomeData, setIncomeData] = useState({
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: 'cash',
    notes: ''
  });
  const [reasonData, setReasonData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReasons();
      resetForm();
    }
  }, [isOpen]);

  const loadReasons = async () => {
    try {
      const data = await getIncomeReasons();
      setReasons(data);
    } catch (error) {
      console.error('Error loading income reasons:', error);
    }
  };

  const resetForm = () => {
    setIncomeData({
      amount: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      payment_mode: 'cash',
      notes: ''
    });
  };

  const handleAddReason = async () => {
    if (!reasonData.name.trim()) {
      alert('Please enter reason name');
      return;
    }

    try {
      const result = await addIncomeReason(reasonData);
      if (result.success) {
        loadReasons();
        setIsAddReasonOpen(false);
        setReasonData({ name: '', description: '' });
        setIncomeData(prev => ({ ...prev, reason: result.data.id }));
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Add reason error:', error);
      alert('Failed to add reason');
    }
  };

  const handleAddIncome = async () => {
    if (!incomeData.amount || !incomeData.reason) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await addIncomeEntry({
        ...incomeData,
        amount: parseFloat(incomeData.amount)
      });
      if (result.success) {
        onSuccess();
        onClose();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Add income error:', error);
      alert('Failed to add income');
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
              <TrendingUp className="w-5 h-5" />
              Add Income
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={incomeData.amount}
                onChange={(e) => setIncomeData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div>
              <Label>Received Reason *</Label>
              <div className="flex gap-2">
                <Select value={incomeData.reason} onValueChange={(value) => setIncomeData(prev => ({ ...prev, reason: value }))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem key={reason.id} value={reason.id}>
                        {reason.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => setIsAddReasonOpen(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={incomeData.date}
                onChange={(e) => setIncomeData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <Label>Payment Mode</Label>
              <Select value={incomeData.payment_mode} onValueChange={(value) => setIncomeData(prev => ({ ...prev, payment_mode: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="pay_later">Pay Later</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={incomeData.notes}
                onChange={(e) => setIncomeData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleAddIncome} disabled={loading}>
                {loading ? 'Adding...' : 'Add Income'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Reason Modal */}
      <Dialog open={isAddReasonOpen} onOpenChange={setIsAddReasonOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Income Reason</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                placeholder="Reason name"
                value={reasonData.name}
                onChange={(e) => setReasonData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Reason description"
                value={reasonData.description}
                onChange={(e) => setReasonData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddReasonOpen(false)}>Cancel</Button>
              <Button onClick={handleAddReason}>Add Reason</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddIncomeModal;