"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scan, Camera, Keyboard, Loader2 } from "lucide-react";

const BarcodeScanner = ({ onBarcodeScanned, loading }) => {
  const [scanMode, setScanMode] = useState("manual"); // manual, camera
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleManualScan();
    }
  };

  const startCameraScanning = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Camera access denied or not available");
      setIsScanning(false);
    }
  };

  const stopCameraScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateCameraScan = () => {
    // Simulate barcode detection for demo
    const mockBarcodes = [
      "ORD001_BILL",
      "ORD002_BILL",
      "ORD003_BILL",
      "ITEM_TAG_001",
      "ITEM_TAG_002"
    ];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    onBarcodeScanned(randomBarcode);
    stopCameraScanning();
  };

  return (
    <div className="space-y-6">
      {/* Scan Mode Selection */}
      <div className="flex gap-2">
        <Button
          variant={scanMode === "manual" ? "default" : "outline"}
          onClick={() => setScanMode("manual")}
          className="flex items-center gap-2"
        >
          <Keyboard className="h-4 w-4" />
          Manual Entry
        </Button>
        <Button
          variant={scanMode === "camera" ? "default" : "outline"}
          onClick={() => setScanMode("camera")}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Camera Scan
        </Button>
      </div>

      {/* Manual Barcode Entry */}
      {scanMode === "manual" && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Scan className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Enter Barcode Manually</h3>
                <p className="text-gray-600">Scan or type the bill barcode or item tag barcode</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Scan or enter barcode here..."
                    className="text-center font-mono"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleManualScan}
                  disabled={!manualBarcode.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Find Order
                    </>
                  )}
                </Button>
              </div>

              {/* Sample Barcodes for Testing */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Test Barcodes:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {["ORD001_BILL", "ORD002_BILL", "ORD003_BILL", "ITEM_TAG_001"].map((code) => (
                    <Button
                      key={code}
                      variant="outline"
                      size="sm"
                      onClick={() => setManualBarcode(code)}
                      className="font-mono text-xs"
                    >
                      {code}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Scanner */}
      {scanMode === "camera" && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Camera Barcode Scanner</h3>
                <p className="text-gray-600">Point camera at barcode to scan</p>
              </div>

              {!isScanning ? (
                <div className="text-center">
                  <Button onClick={startCameraScanning} className="mb-4">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <p className="text-sm text-gray-500">
                    Camera permission required for barcode scanning
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-red-500 border-dashed m-8 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                        Align barcode here
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button onClick={simulateCameraScan} className="bg-green-600 hover:bg-green-700">
                      <Scan className="h-4 w-4 mr-2" />
                      Simulate Scan
                    </Button>
                    <Button variant="outline" onClick={stopCameraScanning}>
                      Stop Camera
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    For demo: Click &apos;Simulate Scan&apos; to test with mock barcode
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarcodeScanner;