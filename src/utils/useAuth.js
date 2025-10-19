"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const cookies = new Cookies();
  const token = cookies.get("accessToken") || cookies.get("token");

  useEffect(() => {
    console.log('Auth check - token:', token);
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/login");
    }
  }, [token, router]);

  return isAuthenticated;
};

export default useAuth;
