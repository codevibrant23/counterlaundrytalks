'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, LogOut, Save, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

const SettingsPage = () => {
  const [userDetails, setUserDetails] = useState({
    username: 'john_manager',
    email: 'john@laundrytalks.com',
    phone: '+91 9876543210',
    full_name: 'John Manager',
    role: 'Store Manager'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSaveDetails = async () => {
    setLoading(true);
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditMode(false);
      alert('User details updated successfully');
    } catch (error) {
      console.error('Save details error:', error);
      alert('Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeRequest = async () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password || !passwordData.reason) {
      alert('Please fill all fields');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Mock password change request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPasswordModalOpen(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
        reason: ''
      });
      alert('Password change request submitted to admin for approval');
    } catch (error) {
      console.error('Password change error:', error);
      alert('Failed to submit password change request');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Mock logout operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Counter</Button>
            </Link>
          </div>
        </div>

        {/* User Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Details
              </CardTitle>
              {!isEditMode && (
                <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={userDetails.full_name}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={userDetails.username}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={userDetails.email}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditMode}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditMode}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Role</Label>
              <Input
                value={userDetails.role}
                disabled
                className="bg-gray-100"
              />
            </div>

            {isEditMode && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveDetails} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Password</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Request a password change. Admin approval required.
                </p>
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                  <Lock className="w-4 h-4 mr-2" />
                  Request Password Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Logout</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Sign out of your account and return to login screen.
                </p>
                <Button variant="destructive" onClick={() => setIsLogoutModalOpen(true)}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Modal */}
        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Password Change</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Password *</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                />
              </div>
              <div>
                <Label>New Password *</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                />
              </div>
              <div>
                <Label>Confirm New Password *</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                />
              </div>
              <div>
                <Label>Reason for Change *</Label>
                <Input
                  placeholder="Why do you want to change your password?"
                  value={passwordData.reason}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Password change requests require admin approval. 
                  You will be notified once your request is processed.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasswordChangeRequest} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Confirmation Modal */}
        <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to logout? You will need to login again to access the system.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout} disabled={loading}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {loading ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SettingsPage;