"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import useAuth from "@/utils/useAuth";
import Cookies from "universal-cookie"; // Import universal-cookie
import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions";

const Logout = () => {
  const cookies = new Cookies();
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      // localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("outletData");
    }

    cookies.remove("token", { path: "/" }); // Specify the path where the cookie was set
    logout();
    // Redirect to login page or a public page
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  );
};

export default Logout;
