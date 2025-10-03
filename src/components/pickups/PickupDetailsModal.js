'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MapPin, Phone, Mail, MessageSquare, Truck, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { updatePickup, cancelPickup, reschedulePickup, getDeliveryPersonnel, sendNotification } from '@/lib/pickupActions';

const PickupDetailsModal = ({ pickup, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
  const [editData, setEditData] = useState({});
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleData, setRescheduleData] = useState({
    pickup_date: '',
    pickup_time: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pickup) {
      loadDeliveryPersonnel();
      setEditData({
        pickup_date: pickup.pickup_date,
        pickup_time: pickup.pickup_time,
        assigned_to: pickup.assigned_to,
        notes: pickup.notes,
        area: pickup.area
      });
      setActiveTab('details');
      setIsEditing(false);
    }
  }, [isOpen, pickup]);

  const loadDeliveryPersonnel = async () => {
    try {
      const personnel = await getDeliveryPersonnel();
      setDeliveryPersonnel(personnel);
    } catch (error) {
      console.error('Error loading delivery personnel:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updatePickup(pickup.pickup_id, editData);
      if (result.success) {
        onUpdate();
        setIsEditing(false);
        alert('Pickup updated successfully!');
      } else {
        alert(result.message || 'Failed to update pickup');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update pickup');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    setLoading(true);
    try {
      const result = await cancelPickup(pickup.pickup_id, cancelReason);
      if (result.success) {
        onUpdate();
        onClose();
        alert('Pickup cancelled successfully!');
      } else {
        alert(result.message || 'Failed to cancel pickup');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel pickup');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.pickup_date || !rescheduleData.pickup_time || !rescheduleData.reason.trim()) {
      alert('Please fill in all reschedule fields');
      return;
    }

    setLoading(true);
    try {
      const result = await reschedulePickup(
        pickup.pickup_id,
        rescheduleData.pickup_date,
        rescheduleData.pickup_time,
        rescheduleData.reason
      );
      if (result.success) {
        onUpdate();
        setActiveTab('details');
        alert('Pickup rescheduled successfully!');
      } else {
        alert(result.message || 'Failed to reschedule pickup');
      }
    } catch (error) {
      console.error('Reschedule error:', error);
      alert('Failed to reschedule pickup');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (type) => {
    setLoading(true);
    try {
      const result = await sendNotification(pickup.pickup_id, type);
      if (result.success) {
        alert(`${type} notification sent successfully!`);
      } else {
        alert(result.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Notification error:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  if (!pickup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pickup Details - #{pickup.pickup_number}</span>
            <Badge className={getStatusColor(pickup.status)}>
              {pickup.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'actions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{pickup.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{pickup.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{pickup.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{pickup.area}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">{pickup.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Pickup Information</CardTitle>
                  {!isEditing && pickup.status === 'pending' && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Pickup Date</Label>
                        <Input
                          type="date"
                          value={editData.pickup_date}
                          onChange={(e) => setEditData(prev => ({ ...prev, pickup_date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label>Pickup Time</Label>
                        <Select value={editData.pickup_time} onValueChange={(value) => setEditData(prev => ({ ...prev, pickup_time: value }))}>
                          <SelectTrigger>
                            <SelectValue />
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
                        <Label>Area</Label>
                        <Select value={editData.area} onValueChange={(value) => setEditData(prev => ({ ...prev, area: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="downtown">Downtown</SelectItem>
                            <SelectItem value="suburbs">Suburbs</SelectItem>
                            <SelectItem value="uptown">Uptown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Assign to</Label>
                        <Select value={editData.assigned_to} onValueChange={(value) => setEditData(prev => ({ ...prev, assigned_to: value }))}>
                          <SelectTrigger>
                            <SelectValue />
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
                      <Label>Notes</Label>
                      <Textarea
                        value={editData.notes}
                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(pickup.pickup_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{pickup.pickup_time}</span>
                    </div>
                    {pickup.assigned_to && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>Assigned to: {pickup.assigned_to}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Area: {pickup.area}</span>
                    </div>
                    {pickup.notes && (
                      <div className="col-span-2">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium text-sm">Notes:</p>
                            <p className="text-sm text-gray-600">{pickup.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            {pickup.status !== 'completed' && pickup.status !== 'cancelled' && (
              <>
                {/* Reschedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Reschedule Pickup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>New Date</Label>
                        <Input
                          type="date"
                          value={rescheduleData.pickup_date}
                          onChange={(e) => setRescheduleData(prev => ({ ...prev, pickup_date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label>New Time</Label>
                        <Select value={rescheduleData.pickup_time} onValueChange={(value) => setRescheduleData(prev => ({ ...prev, pickup_time: value }))}>
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
                    <div>
                      <Label>Reason for Reschedule</Label>
                      <Textarea
                        placeholder="Please provide reason for rescheduling..."
                        value={rescheduleData.reason}
                        onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <Button onClick={handleReschedule} disabled={loading}>
                      {loading ? 'Rescheduling...' : 'Reschedule Pickup'}
                    </Button>
                  </CardContent>
                </Card>

                <Separator />

                {/* Cancel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      Cancel Pickup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Cancellation Reason</Label>
                      <Textarea
                        placeholder="Please provide reason for cancellation..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                      {loading ? 'Cancelling...' : 'Cancel Pickup'}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {pickup.status === 'cancelled' && (
              <Card>
                <CardContent className="p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Pickup Cancelled</h3>
                  {pickup.cancellation_reason && (
                    <p className="text-gray-600">Reason: {pickup.cancellation_reason}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {pickup.status === 'completed' && (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Pickup Completed</h3>
                  <p className="text-gray-600">This pickup has been successfully completed.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => handleSendNotification('SMS')} disabled={loading}>
                    <Phone className="w-4 h-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button variant="outline" onClick={() => handleSendNotification('Email')} disabled={loading}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" onClick={() => handleSendNotification('WhatsApp')} disabled={loading}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Notification will include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Pickup date and time</li>
                    <li>Assigned delivery person</li>
                    <li>Contact information</li>
                    <li>Special instructions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PickupDetailsModal;