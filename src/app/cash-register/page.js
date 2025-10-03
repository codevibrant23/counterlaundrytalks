'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, User, Calendar, Plus, Minus, History, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { getCashRegisterStatus, openCashRegister, closeCashRegister, getCashRegisterHistory, addExpense, getCurrentShiftExpenses } from '@/lib/cashRegisterActions';
import AddExpenseModal from '@/components/cash-register/AddExpenseModal';
import AddIncomeModal from '@/components/cash-register/AddIncomeModal';

const CashRegisterPage = () => {
  const [registerStatus, setRegisterStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openData, setOpenData] = useState({
    opening_amount: '',
    notes: ''
  });

  const [closeData, setCloseData] = useState({
    closing_amount: '',
    notes: '',
    expenses_total: 0
  });

  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [status, historyData, expensesData] = await Promise.all([
        getCashRegisterStatus(),
        getCashRegisterHistory(),
        getCurrentShiftExpenses()
      ]);
      setRegisterStatus(status);
      setHistory(historyData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = async () => {
    if (!openData.opening_amount) {
      alert('Please enter opening amount');
      return;
    }

    try {
      const result = await openCashRegister(openData);
      if (result.success) {
        loadData();
        setIsOpenModalOpen(false);
        setOpenData({ opening_amount: '', notes: '' });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Open register error:', error);
      alert('Failed to open cash register');
    }
  };

  const handleCloseRegister = async () => {
    if (!closeData.closing_amount) {
      alert('Please enter closing amount');
      return;
    }

    try {
      const result = await closeCashRegister({
        ...closeData,
        expenses_total: expenses.reduce((sum, exp) => sum + exp.amount, 0)
      });
      if (result.success) {
        loadData();
        setIsCloseModalOpen(false);
        setCloseData({ closing_amount: '', notes: '', expenses_total: 0 });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Close register error:', error);
      alert('Failed to close cash register');
    }
  };

  const handleAddExpense = async () => {
    if (!expenseData.amount || !expenseData.description || !expenseData.category) {
      alert('Please fill all expense fields');
      return;
    }

    try {
      const result = await addExpense({
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      });
      if (result.success) {
        loadData();
        setIsExpenseModalOpen(false);
        setExpenseData({ amount: '', description: '', category: '' });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Add expense error:', error);
      alert('Failed to add expense');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cash Register</h1>
            <p className="text-gray-600">Manage cash register operations</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Counter</Button>
          </Link>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Register Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={registerStatus?.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {registerStatus?.is_open ? 'OPEN' : 'CLOSED'}
                </Badge>
                {registerStatus?.is_open ? (
                  <Button size="sm" variant="destructive" onClick={() => setIsCloseModalOpen(true)}>
                    Close Register
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setIsOpenModalOpen(true)}>
                    Open Register
                  </Button>
                )}
              </div>
              {registerStatus?.is_open && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Opened: {new Date(registerStatus.opened_at).toLocaleString()}</p>
                  <p>By: {registerStatus.opened_by}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {registerStatus?.is_open && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Current Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{registerStatus.current_sales?.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Today&apos;s sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Minus className="w-5 h-5" />
                    Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-red-600">
                      ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => setIsExpenseModalOpen(true)}>
                        <Minus className="w-3 h-3 mr-1" />
                        Expense
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsIncomeModalOpen(true)}>
                        <Plus className="w-3 h-3 mr-1" />
                        Income
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{expenses.length} expenses</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {registerStatus?.is_open && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expected Cash Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Opening Amount</p>
                  <p className="text-lg font-semibold">₹{registerStatus.opening_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sales</p>
                  <p className="text-lg font-semibold text-green-600">+₹{registerStatus.current_sales}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expenses</p>
                  <p className="text-lg font-semibold text-red-600">-₹{expenses.reduce((sum, exp) => sum + exp.amount, 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Total</p>
                  <p className="text-xl font-bold">₹{(registerStatus.opening_amount + registerStatus.current_sales - expenses.reduce((sum, exp) => sum + exp.amount, 0)).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Current Expenses ({expenses.length})</TabsTrigger>
          <TabsTrigger value="history">Register History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-6">
          <ExpensesList expenses={expenses} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryList history={history} />
        </TabsContent>
      </Tabs>

      {/* Open Register Modal */}
      <Dialog open={isOpenModalOpen} onOpenChange={setIsOpenModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Cash Register</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Opening Amount *</Label>
              <Input
                type="number"
                placeholder="Enter opening amount"
                value={openData.opening_amount}
                onChange={(e) => setOpenData(prev => ({ ...prev, opening_amount: e.target.value }))}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Opening notes..."
                value={openData.notes}
                onChange={(e) => setOpenData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpenModalOpen(false)}>Cancel</Button>
              <Button onClick={handleOpenRegister}>Open Register</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Register Modal */}
      <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Cash Register</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-800">
                Expected Amount: ₹{registerStatus ? (registerStatus.opening_amount + registerStatus.current_sales - expenses.reduce((sum, exp) => sum + exp.amount, 0)).toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <Label>Actual Closing Amount *</Label>
              <Input
                type="number"
                placeholder="Enter actual amount in register"
                value={closeData.closing_amount}
                onChange={(e) => setCloseData(prev => ({ ...prev, closing_amount: e.target.value }))}
              />
            </div>
            <div>
              <Label>Closing Notes</Label>
              <Textarea
                placeholder="Closing notes..."
                value={closeData.notes}
                onChange={(e) => setCloseData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCloseRegister} variant="destructive">Close Register</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={loadData}
      />

      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

const ExpensesList = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Minus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses recorded</h3>
          <p className="text-gray-500">No expenses have been added for the current shift.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{expense.description}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="capitalize">{expense.category}</span>
                  <span>{new Date(expense.created_at).toLocaleString()}</span>
                  <span>By: {expense.created_by}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-red-600">₹{expense.amount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const HistoryList = ({ history }) => {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No history available</h3>
          <p className="text-gray-500">No previous cash register sessions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((session) => (
        <Card key={session.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{session.date}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(session.opened_at).toLocaleTimeString()} - {new Date(session.closed_at).toLocaleTimeString()}
                </p>
              </div>
              <Badge className="bg-gray-100 text-gray-800">{session.status.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Opening</p>
                <p className="font-semibold">₹{session.opening_amount}</p>
              </div>
              <div>
                <p className="text-gray-600">Sales</p>
                <p className="font-semibold text-green-600">₹{session.sales}</p>
              </div>
              <div>
                <p className="text-gray-600">Expenses</p>
                <p className="font-semibold text-red-600">₹{session.expenses}</p>
              </div>
              <div>
                <p className="text-gray-600">Closing</p>
                <p className="font-semibold">₹{session.closing_amount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CashRegisterPage;