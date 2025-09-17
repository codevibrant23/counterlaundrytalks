"use client";

import React from "react";
import { MapPin, Store } from "lucide-react";

const OutletInfo = () => {
  // Dummy data - replace with actual outlet data
  const outletData = {
    name: "Laundry Talks - Central Mall",
    location: "Central Mall, MG Road, Bangalore",
    status: "Open"
  };

  return (
    <div className="flex flex-col text-sm">
      <div className="flex items-center gap-2 font-semibold text-gray-800">
        <Store className="h-4 w-4 text-blue-600" />
        <span>{outletData.name}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          outletData.status === 'Open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {outletData.status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 mt-1">
        <MapPin className="h-3 w-3" />
        <span>{outletData.location}</span>
      </div>
    </div>
  );
};

export default OutletInfo;