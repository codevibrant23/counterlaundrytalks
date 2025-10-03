'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Calendar, Clock, User, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { searchCustomers } from '@/lib/customerActions';
import { schedulePickup, getDeliveryPersonnel, sendNotification } from '@/lib/pickupActions';
import AddCustomerModal from '@/components/customers/AddCustomerModal';

const SchedulePickupModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
  const [formData, setFormData] = useState({
    pickup_date: '',
    pickup_time: '',
    assigned_to: '',
    notes: '',
    area: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDeliveryPersonnel();
      resetForm();
    }
  }, [isOpen]);

  const loadDeliveryPersonnel = async () => {
    try {
      const personnel = await getDeliveryPersonnel();
      setDeliveryPersonnel(personnel);
    } catch (error) {
      console.error('Error loading delivery personnel:', error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedCustomer(null);
    setFormData({
      pickup_date: '',
      pickup_time: '',
      assigned_to: '',
      notes: '',
      area: ''
    });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchCustomers(searchTerm, 'name');
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      area: customer.city?.toLowerCase() || 'downtown'
    }));
    setStep(2);
  };

  const handleSchedule = async () => {
    if (!selectedCustomer || !formData.pickup_date || !formData.pickup_time) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const pickupData = {
        customer_id: selectedCustomer.customer_id,
        customer_name: selectedCustomer.name,
        phone_number: selectedCustomer.phone_number,
        email: selectedCustomer.email,
        address: selectedCustomer.address,
        ...formData
      };

      const result = await schedulePickup(pickupData);
      
      if (result.success) {
        // Send notification
        await sendNotification(result.pickup.pickup_id, 'SMS');
        
        onSuccess();
        onClose();
        alert('Pickup scheduled successfully!');
      } else {
        alert(result.message || 'Failed to schedule pickup');
      }
    } catch (error) {
      console.error('Schedule error:', error);
      alert('Failed to schedule pickup');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomerSuccess = (newCustomer) => {
    setSelectedCustomer(newCustomer);
    setFormData(prev => ({
      ...prev,
      area: newCustomer.city?.toLowerCase() || 'downtown'
    }));
    setIsAddCustomerOpen(false);
    setStep(2);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Pickup</DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="search">Search Customer</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Search by name, phone, or customer ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {searchResults.map((customer) => (
                      <Card key={customer.customer_id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleCustomerSelect(customer)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{customer.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{customer.phone_number}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{customer.city}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">{customer.customer_id}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-600 mb-3">Customer not found?</p>
                <Button variant="outline" onClick={() => setIsAddCustomerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Customer
                </Button>
              </div>
            </div>
          )}

          {step === 2 && selectedCustomer && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">Selected Customer</h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                      Change Customer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedCustomer.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup_date">Pickup Date *</Label>
                  <Input
                    id="pickup_date"
                    type="date"
                    value={formData.pickup_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickup_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="pickup_time">Pickup Time *</Label>
                  <Select value={formData.pickup_time} onValueChange={(value) => setFormData(prev => ({ ...prev, pickup_time: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                      <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                      <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData(prev => ({ ...prev, area: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown</SelectItem>
                      <SelectItem value="suburbs">Suburbs</SelectItem>
                      <SelectItem value="uptown">Uptown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assigned_to">Assign to</Label>
                  <Select value={formData.assigned_to} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personnel" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryPersonnel.map((person) => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name} - {person.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes for Delivery Person</Label>
                <Textarea
                  id="notes"
                  placeholder="Special instructions, landmarks, etc..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSchedule} disabled={loading}>
                  {loading ? 'Scheduling...' : 'Schedule Pickup'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSuccess={handleAddCustomerSuccess}
      />
    </>
  );
};

export default SchedulePickupModal;