import React from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 loginBg">
      {/* Login Card */}
      <Card className="w-[500px] shadow-lg z-10 rounded-3xl p-4">
        {/* Logo Section */}
        <CardHeader className="py-6">
          <div className="flex justify-center">
            <Image
              src="/new_logo.png"
              alt="Laundry Talks Logo"
              width={250}
              height={50}
            />
          </div>
        </CardHeader>

        {/* Login Content */}
        <CardContent className="pt-4">
          <LoginForm />
        </CardContent>
        <CardFooter className="border-t pt-6 text-center justify-center">
          <div className="text-center">
            <span className="text-gray-600 text-sm">Powered by</span> Vibrant
            Digitech
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
