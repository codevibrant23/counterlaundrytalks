'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getTagPrinterSettings, saveTagPrinterSettings } from '@/lib/printerActions';

const TagPrinterSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getTagPrinterSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading tag printer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveTagPrinterSettings(settings);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateFieldSetting = (fieldKey, property, value) => {
    setSettings(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldKey]: {
          ...prev.fields[fieldKey],
          [property]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Settings Panel */}
      <div className="space-y-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Paper Width</Label>
              <Select value={settings.paper_width} onValueChange={(value) => updateSetting('paper_width', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5in">1.5 inch</SelectItem>
                  <SelectItem value="2in">2 inch</SelectItem>
                  <SelectItem value="3in">3 inch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Direction</Label>
              <Select value={settings.direction} onValueChange={(value) => updateSetting('direction', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Barcode Placement</Label>
              <Select value={settings.barcode_placement} onValueChange={(value) => updateSetting('barcode_placement', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Text Alignment</Label>
              <Select value={settings.text_alignment} onValueChange={(value) => updateSetting('text_alignment', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gap Between Tags</Label>
              <Input
                type="number"
                value={settings.gap_between_tags}
                onChange={(e) => updateSetting('gap_between_tags', parseInt(e.target.value))}
                min="0"
                max="10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Field Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Field Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(settings.fields).map(([key, field]) => (
              <div key={key} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="capitalize font-medium">
                    {key.replace('_', ' ')}
                  </Label>
                  <Switch
                    checked={field.enabled}
                    onCheckedChange={(enabled) => updateFieldSetting(key, 'enabled', enabled)}
                  />
                </div>
                
                {field.enabled && (
                  <div className="space-y-2">
                    {key === 'tag_header' && (
                      <div>
                        <Label className="text-xs">Header Text</Label>
                        <Input
                          value={field.text || ''}
                          onChange={(e) => updateFieldSetting(key, 'text', e.target.value)}
                          placeholder="Enter header text"
                          className="text-xs"
                        />
                      </div>
                    )}
                    <div>
                      <Label className="text-xs">Style (CSS)</Label>
                      <Textarea
                        value={field.style}
                        onChange={(e) => updateFieldSetting(key, 'style', e.target.value)}
                        placeholder="font-size:12px;font-weight:bold;"
                        rows={2}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Tag Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <TagPreview settings={settings} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TagPreview = ({ settings }) => {
  const mockData = {
    order_id: 'LT240001',
    unique_code: 'UC001',
    customer_name: 'John Doe',
    area: 'Downtown',
    order_date: '25/01/2024',
    catalog_name: 'Premium',
    item_name: 'Cotton Shirt',
    color: 'Blue',
    brand: 'Nike',
    pattern: 'Solid',
    defects: 'Small stain',
    stains: 'Coffee stain',
    material: 'Cotton',
    starch: 'Light',
    detergent: 'Gentle',
    detergent_scent: 'Fresh',
    wash_temperature: 'Cold',
    fabric_softener: 'Yes',
    hanger: 'Yes',
    box: 'No',
    fold: 'Yes',
    qty: '1/3',
    notes: 'Handle with care',
    delivery_date: '27/01/2024'
  };

  const getFieldValue = (key) => {
    if (key === 'tag_header') return settings.fields[key].text || 'LaundryTalks';
    return mockData[key] || '';
  };

  return (
    <div 
      className={`bg-white border border-gray-400 p-2 ${
        settings.paper_width === '1.5in' ? 'w-24' : 
        settings.paper_width === '2in' ? 'w-32' : 'w-48'
      } ${settings.text_alignment === 'center' ? 'text-center' : 'text-left'}`}
      style={{ fontSize: '8px', lineHeight: '1.2' }}
    >
      {settings.barcode_placement === 'top' && (
        <div className="mb-1 text-center">
          <div className="bg-black h-8 w-full mb-1" style={{ 
            background: 'repeating-linear-gradient(90deg, black 0px, black 1px, white 1px, white 2px)' 
          }}></div>
          <div style={{ fontSize: '6px' }}>{mockData.order_id}</div>
        </div>
      )}

      {Object.entries(settings.fields).map(([key, field]) => {
        if (!field.enabled) return null;
        
        const value = getFieldValue(key);
        if (!value) return null;

        return (
          <div key={key} style={{ 
            ...parseStyle(field.style),
            marginBottom: '1px'
          }}>
            {value}
          </div>
        );
      })}

      {settings.barcode_placement === 'bottom' && (
        <div className="mt-1 text-center">
          <div className="bg-black h-8 w-full mb-1" style={{ 
            background: 'repeating-linear-gradient(90deg, black 0px, black 1px, white 1px, white 2px)' 
          }}></div>
          <div style={{ fontSize: '6px' }}>{mockData.order_id}</div>
        </div>
      )}
    </div>
  );
};

const parseStyle = (styleString) => {
  const style = {};
  if (!styleString) return style;
  
  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':');
    if (property && value) {
      const camelProperty = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      style[camelProperty] = value.trim();
    }
  });
  
  return style;
};

export default TagPrinterSettings;