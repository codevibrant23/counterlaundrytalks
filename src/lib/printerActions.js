// Printer Settings API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get connected printers
export const getConnectedPrinters = async () => {
  try {
    const mockPrinters = [
      {
        id: 'printer_1',
        name: 'Zebra ZD420 Tag Printer',
        type: 'tag',
        status: 'connected',
        station: 'Counter 1',
        enabled: true
      },
      {
        id: 'printer_2',
        name: 'HP LaserJet Pro Invoice Printer',
        type: 'invoice',
        status: 'connected',
        station: 'Counter 1',
        enabled: true
      },
      {
        id: 'printer_3',
        name: 'Epson TM-T20III Thermal Printer',
        type: 'thermal',
        status: 'connected',
        station: 'Counter 1',
        enabled: false
      },
      {
        id: 'printer_4',
        name: 'Brother QL-820NWB Label Printer',
        type: 'tag',
        status: 'offline',
        station: 'Counter 2',
        enabled: false
      }
    ];

    return mockPrinters;
  } catch (error) {
    console.error('Get connected printers error:', error);
    throw error;
  }
};

// Get stations
export const getStations = async () => {
  try {
    const mockStations = [
      { id: 'station_1', name: 'Counter 1' },
      { id: 'station_2', name: 'Counter 2' },
      { id: 'station_3', name: 'Workshop' },
      { id: 'station_4', name: 'Reception' }
    ];

    return mockStations;
  } catch (error) {
    console.error('Get stations error:', error);
    throw error;
  }
};

// Add new station
export const addStation = async (stationName) => {
  try {
    const newStation = {
      id: `station_${Date.now()}`,
      name: stationName
    };

    return {
      success: true,
      message: 'Station added successfully',
      data: newStation
    };
  } catch (error) {
    console.error('Add station error:', error);
    return {
      error: true,
      message: error.message || 'Failed to add station'
    };
  }
};

// Update printer settings
export const updatePrinterSettings = async (printerId, settings) => {
  try {
    return {
      success: true,
      message: 'Printer settings updated successfully'
    };
  } catch (error) {
    console.error('Update printer settings error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update printer settings'
    };
  }
};

// Test printer
export const testPrinter = async (printerId, printerType) => {
  try {
    // Simulate printer test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: `${printerType} printer test completed successfully`
    };
  } catch (error) {
    console.error('Test printer error:', error);
    return {
      error: true,
      message: error.message || 'Printer test failed'
    };
  }
};

// Get tag printer settings
export const getTagPrinterSettings = async () => {
  try {
    const mockSettings = {
      paper_width: '2in',
      direction: 'vertical',
      barcode_placement: 'bottom',
      text_alignment: 'center',
      gap_between_tags: 1,
      fields: {
        tag_header: { enabled: true, text: 'LaundryTalks', style: 'font-size:20px;font-weight:bold;' },
        order_id: { enabled: true, style: 'font-size:40px;font-weight:600;' },
        unique_code: { enabled: true, style: 'font-size:12px;' },
        customer_name: { enabled: true, style: 'font-size:14px;' },
        area: { enabled: true, style: 'font-size:12px;' },
        order_date: { enabled: true, style: 'font-size:12px;' },
        catalog_name: { enabled: false, style: 'font-size:12px;' },
        item_name: { enabled: true, style: 'font-size:14px;font-weight:500;' },
        color: { enabled: true, style: 'font-size:10px;' },
        brand: { enabled: false, style: 'font-size:10px;' },
        pattern: { enabled: false, style: 'font-size:10px;' },
        defects: { enabled: true, style: 'font-size:10px;color:red;' },
        stains: { enabled: true, style: 'font-size:10px;color:red;' },
        material: { enabled: false, style: 'font-size:10px;' },
        starch: { enabled: true, style: 'font-size:10px;' },
        detergent: { enabled: false, style: 'font-size:10px;' },
        detergent_scent: { enabled: false, style: 'font-size:10px;' },
        wash_temperature: { enabled: false, style: 'font-size:10px;' },
        fabric_softener: { enabled: false, style: 'font-size:10px;' },
        hanger: { enabled: true, style: 'font-size:10px;' },
        box: { enabled: false, style: 'font-size:10px;' },
        fold: { enabled: true, style: 'font-size:10px;' },
        qty: { enabled: true, style: 'font-size:12px;font-weight:500;' },
        notes: { enabled: true, style: 'font-size:10px;' },
        delivery_date: { enabled: true, style: 'font-size:12px;font-weight:500;' }
      }
    };

    return mockSettings;
  } catch (error) {
    console.error('Get tag printer settings error:', error);
    throw error;
  }
};

// Save tag printer settings
export const saveTagPrinterSettings = async (settings) => {
  try {
    return {
      success: true,
      message: 'Tag printer settings saved successfully'
    };
  } catch (error) {
    console.error('Save tag printer settings error:', error);
    return {
      error: true,
      message: error.message || 'Failed to save tag printer settings'
    };
  }
};

// Get invoice templates
export const getInvoiceTemplates = async () => {
  try {
    const mockTemplates = [
      { id: 'template_1', name: 'Standard Invoice', type: 'invoice' },
      { id: 'template_2', name: 'Detailed Invoice', type: 'invoice' },
      { id: 'template_3', name: 'Mini Receipt', type: 'thermal' },
      { id: 'template_4', name: 'Thermal Receipt', type: 'thermal' }
    ];

    return mockTemplates;
  } catch (error) {
    console.error('Get invoice templates error:', error);
    throw error;
  }
};