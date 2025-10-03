'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import SchedulePickupModal from '@/components/pickups/SchedulePickupModal';
import PickupDetailsModal from '@/components/pickups/PickupDetailsModal';
import { getAllPickups } from '@/lib/pickupActions';

const PickupsPage = () => {
  const [pickups, setPickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPickups();
  }, []);

  useEffect(() => {
    filterPickups();
  }, [pickups, searchTerm, statusFilter, dateFilter, areaFilter]);

  const loadPickups = async () => {
    try {
      setLoading(true);
      const data = await getAllPickups();
      setPickups(data);
    } catch (error) {
      console.error('Error loading pickups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPickups = () => {
    let filtered = [...pickups];

    if (searchTerm) {
      filtered = filtered.filter(pickup =>
        pickup.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickup.pickup_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickup.phone_number.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(pickup => pickup.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(pickup => {
            const pDate = new Date(pickup.pickup_date);
            return pDate.toDateString() === today.toDateString();
          });
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          filtered = filtered.filter(pickup => {
            const pDate = new Date(pickup.pickup_date);
            return pDate.toDateString() === tomorrow.toDateString();
          });
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          filtered = filtered.filter(pickup => {
            const pDate = new Date(pickup.pickup_date);
            return pDate >= today && pDate <= weekFromNow;
          });
          break;
      }
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(pickup => pickup.area === areaFilter);
    }

    setFilteredPickups(filtered);
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

  const handlePickupClick = (pickup) => {
    setSelectedPickup(pickup);
    setIsDetailsModalOpen(true);
  };

  const pendingPickups = filteredPickups.filter(p => p.status === 'pending' || p.status === 'assigned');
  const completedPickups = filteredPickups.filter(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pickup Management</h1>
            <p className="text-gray-600">Schedule and manage customer pickups</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Back to Counter</Button>
            </Link>
            <Button onClick={() => setIsScheduleModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Pickup
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by customer name, pickup number, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>

          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="suburbs">Suburbs</SelectItem>
              <SelectItem value="uptown">Uptown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Pickups ({filteredPickups.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingPickups.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedPickups.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <PickupList pickups={filteredPickups} onPickupClick={handlePickupClick} loading={loading} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <PickupList pickups={pendingPickups} onPickupClick={handlePickupClick} loading={loading} />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <PickupList pickups={completedPickups} onPickupClick={handlePickupClick} loading={loading} />
        </TabsContent>
      </Tabs>

      <SchedulePickupModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSuccess={loadPickups}
      />

      <PickupDetailsModal
        pickup={selectedPickup}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onUpdate={loadPickups}
      />
    </div>
  );
};

const PickupList = ({ pickups, onPickupClick, loading }) => {
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

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No pickups found</h3>
          <p className="text-gray-500">No pickups match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {pickups.map((pickup) => (
        <Card key={pickup.pickup_id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPickupClick(pickup)}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{pickup.customer_name}</h3>
                  <Badge className={getStatusColor(pickup.status)}>
                    {pickup.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(pickup.pickup_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{pickup.pickup_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{pickup.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{pickup.area}</span>
                  </div>
                </div>

                {pickup.assigned_to && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {pickup.assigned_to}</span>
                  </div>
                )}

                {pickup.notes && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                    {pickup.notes}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-lg">#{pickup.pickup_number}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(pickup.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PickupsPage;