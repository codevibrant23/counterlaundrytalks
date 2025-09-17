"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function UserDetails() {
  const router = useRouter();
  
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData")) || {};
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  }, []);

  const outlet = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("outletData")) || {};
    } catch (error) {
      console.error("Error parsing outlet data:", error);
      return {};
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("outletData");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleSettings = () => {
    // Implement settings functionality
    alert("Settings feature - To be implemented");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <div className="text-left">
            <div className="text-sm font-medium">
              {user.name || user.username || "User"}
            </div>
            <div className="text-xs text-gray-500">
              {outlet.location || "Location Unknown"}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
