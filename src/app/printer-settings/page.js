'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Settings, TestTube, Plus, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import TagPrinterSettings from '@/components/printer/TagPrinterSettings';
import InvoicePrinterSettings from '@/components/printer/InvoicePrinterSettings';
import { getConnectedPrinters, getStations, addStation, updatePrinterSettings, testPrinter } from '@/lib/printerActions';

const PrinterSettingsPage = () => {
  const [printers, setPrinters] = useState([]);
  const [stations, setStations] = useState([]);
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [testingPrinter, setTestingPrinter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [printersData, stationsData] = await Promise.all([
        getConnectedPrinters(),
        getStations()
      ]);
      setPrinters(printersData);
      setStations(stationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async () => {
    if (!newStationName.trim()) {
      alert('Please enter station name');
      return;
    }

    try {
      const result = await addStation(newStationName);
      if (result.success) {
        loadData();
        setIsAddStationOpen(false);
        setNewStationName('');
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Add station error:', error);
      alert('Failed to add station');
    }
  };

  const handlePrinterToggle = async (printerId, enabled) => {
    try {
      const result = await updatePrinterSettings(printerId, { enabled });
      if (result.success) {
        setPrinters(prev => prev.map(p => 
          p.id === printerId ? { ...p, enabled } : p
        ));
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Update printer error:', error);
      alert('Failed to update printer settings');
    }
  };

  const handleTestPrinter = async (printer) => {
    setTestingPrinter(printer.id);
    try {
      const result = await testPrinter(printer.id, printer.type);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Test printer error:', error);
      alert('Printer test failed');
    } finally {
      setTestingPrinter(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tag': return '🏷️';
      case 'invoice': return '📄';
      case 'thermal': return '🧾';
      default: return '🖨️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
            <h1 className="text-2xl font-bold text-gray-900">Printer Settings</h1>
            <p className="text-gray-600">Configure printers and templates</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Counter</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="printers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="printers">Printers ({printers.length})</TabsTrigger>
          <TabsTrigger value="tag-settings">Tag Printer</TabsTrigger>
          <TabsTrigger value="invoice-settings">Invoice Printer</TabsTrigger>
          <TabsTrigger value="thermal-settings">Thermal Printer</TabsTrigger>
        </TabsList>

        <TabsContent value="printers" className="mt-6">
          <div className="grid gap-6">
            {/* Station Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Stations</CardTitle>
                  <Button size="sm" onClick={() => setIsAddStationOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Station
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stations.map((station) => (
                    <Badge key={station.id} variant="outline" className="px-3 py-1">
                      {station.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Printers List */}
            <div className="grid gap-4">
              {printers.map((printer) => (
                <Card key={printer.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getTypeIcon(printer.type)}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{printer.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{printer.type} Printer</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <Badge className={getStatusColor(printer.status)}>
                            {printer.status.toUpperCase()}
                          </Badge>
                          <span>Station: {printer.station}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={printer.enabled}
                              onCheckedChange={(enabled) => handlePrinterToggle(printer.id, enabled)}
                            />
                            <Label className="text-sm">
                              {printer.enabled ? 'Enabled' : 'Disabled'}
                            </Label>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestPrinter(printer)}
                            disabled={testingPrinter === printer.id || printer.status !== 'connected'}
                          >
                            <TestTube className="w-4 h-4 mr-2" />
                            {testingPrinter === printer.id ? 'Testing...' : 'Test Print'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tag-settings" className="mt-6">
          <TagPrinterSettings />
        </TabsContent>

        <TabsContent value="invoice-settings" className="mt-6">
          <InvoicePrinterSettings type="invoice" />
        </TabsContent>

        <TabsContent value="thermal-settings" className="mt-6">
          <InvoicePrinterSettings type="thermal" />
        </TabsContent>
      </Tabs>

      {/* Add Station Modal */}
      <Dialog open={isAddStationOpen} onOpenChange={setIsAddStationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Station</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Station Name *</Label>
              <Input
                placeholder="Enter station name"
                value={newStationName}
                onChange={(e) => setNewStationName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddStationOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStation}>Add Station</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrinterSettingsPage;