"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authLogin } from "@/lib/actions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('role', 'Counter Operator');

    try {
      const response = await authLogin({
        username: email,
        password,
        role: "Counter Operator",
      });
      
      if (!response?.success) {
        setError(response?.message || 'Login failed');
        setLoading(false);
        return;
      }
      
      // Store user data in localStorage
      if (typeof window !== "undefined") {
        if (response.userData) {
          localStorage.setItem("userData", JSON.stringify(response.userData));
        }
        if (response.outletData) {
          localStorage.setItem("outletData", JSON.stringify(response.outletData));
        }
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleLogin}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
