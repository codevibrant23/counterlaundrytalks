"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";

const OTPVerification = ({ isOpen, onClose, phoneNumber, onVerificationSuccess, onVerificationFailure }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
      setTimer(30);
      setCanResend(false);
      // Auto-send OTP when dialog opens
      sendOTP();
    }
  }, [isOpen]);

  const sendOTP = async () => {
    setResending(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock OTP generation (in real app, this would be sent via SMS/WhatsApp)
      const mockOTP = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("Mock OTP sent:", mockOTP); // In real app, this would be sent to user's phone

      setTimer(30);
      setCanResend(false);
      setError("");
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock verification (in real app, this would verify against sent OTP)
      // For demo purposes, accept any 4-digit OTP
      if (otp.length === 4) {
        onVerificationSuccess({
          phoneNumber,
          verified: true,
          timestamp: new Date().toISOString()
        });
        onClose();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
      onVerificationFailure({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    setOtp(value);
    setError("");
  };

  const handleResendOTP = () => {
    if (canResend) {
      sendOTP();
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.substring(0, 5)}***${cleaned.substring(8)}`;
    }
    return phone;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Verify OTP</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center">
          {/* Phone Number Display */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              We&apos;ve sent a 4-digit OTP to
            </p>
            <p className="font-medium">{formatPhoneNumber(phoneNumber)}</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={otp}
              onChange={handleOTPChange}
              placeholder="1234"
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Timer and Resend */}
          <div className="space-y-2">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Resend OTP in {timer}s
              </p>
            ) : (
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-sm p-0 h-auto"
              >
                {resending ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Resend OTP
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={verifyOTP}
              className="flex-1"
              disabled={loading || otp.length !== 4}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500">
            Didn&apos;t receive the OTP? Check your messages or try resending.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerification;