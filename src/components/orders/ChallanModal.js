'use client';

import React from 'react';
import { X, Truck, Package, Calendar, FileText, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ChallanModal = ({ challan, isOpen, onClose }) => {
  if (!challan) return null;

  const getTypeColor = (type) => {
    return type === 'given' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Challan Details - #{challan.challan_number}</span>
            <div className="flex gap-2">
              <Badge className={getTypeColor(challan.type)}>
                {challan.type.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(challan.status)}>
                {challan.status.toUpperCase()}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challan Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Challan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Challan Number</p>
                    <p className="text-sm text-gray-600">{challan.challan_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-gray-600">{new Date(challan.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Created By</p>
                    <p className="text-sm text-gray-600">{challan.created_by}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Items Count</p>
                    <p className="text-sm text-gray-600">{challan.items_count} items</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transfer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{challan.from_location}</p>
                    <p className="text-sm text-gray-600">From</p>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-gray-400" />
                  <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-right">{challan.to_location}</p>
                    <p className="text-sm text-gray-600 text-right">To</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Associated Orders ({challan.orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {challan.orders.map((orderNumber, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">#{orderNumber}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Order
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Challan Created</p>
                    <p className="text-sm text-gray-600">{new Date(challan.date).toLocaleString()}</p>
                  </div>
                </div>
                
                {challan.status === 'in_transit' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">In Transit</p>
                      <p className="text-sm text-gray-600">Items are being transferred</p>
                    </div>
                  </div>
                )}
                
                {challan.status === 'completed' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Transfer Completed</p>
                      <p className="text-sm text-gray-600">Items successfully transferred</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Print Challan
            </Button>
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Track Items
            </Button>
            {challan.status === 'in_transit' && (
              <Button>
                Mark as Received
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallanModal;