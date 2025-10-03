"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authLogin } from "@/lib/actions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["accessToken"]); // Cookie hook for accessToken

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(""); // Reset any previous errors

    try {
      const response = await authLogin({
        username: email,
        password,
        role: "Counter Operator",
      });
      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }
      // Set the cookie using react-cookie
      setCookie("accessToken", response.accessToken, {
        path: "/",
      });

      // Store user data in localStorage
      if (typeof window !== "undefined") {
        // localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("userData", JSON.stringify(response.userData));
        localStorage.setItem("outletData", JSON.stringify(response.outletData));
      }

      // Redirect after successful login
      router.push("/");
    } catch (e) {
      setError(e.message); // Show error if login fails
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
