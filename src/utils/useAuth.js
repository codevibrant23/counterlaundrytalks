"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    // In development mode, bypass authentication for testing
    if (process.env.NODE_ENV === 'development') {
      // Set mock user data for development
      if (!localStorage.getItem("userData")) {
        localStorage.setItem("userData", JSON.stringify({
          name: "Demo User",
          username: "demo",
          id: "1"
        }));
      }
      if (!localStorage.getItem("outletData")) {
        localStorage.setItem("outletData", JSON.stringify({
          location: "Demo Outlet - Central Mall",
          id: "1"
        }));
      }
      setIsAuthenticated(true);
      return;
    }

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/login");
    }
  }, [token, router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated;
};

export default useAuth;
