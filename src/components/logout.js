"use client";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions";

const Logout = () => {
  const handleLogout = async () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("outletData");
    }

    // Call server action to clear httpOnly cookies
    await logout();
    
    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <Button onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  );
};

export default Logout;
