'use client';

import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createIssue } from '@/lib/issueActions';

const CreateIssueModal = ({ isOpen, onClose, onSuccess }) => {
  const [issueData, setIssueData] = useState({
    title: '',
    body: '',
    priority: 'medium',
    category: 'bug',
    attachments: []
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setIssueData({
      title: '',
      body: '',
      priority: 'medium',
      category: 'bug',
      attachments: []
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    setIssueData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
  };

  const removeAttachment = (index) => {
    setIssueData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!issueData.title.trim() || !issueData.body.trim()) {
      alert('Please fill in title and description');
      return;
    }

    setLoading(true);
    try {
      const result = await createIssue(issueData);
      if (result.success) {
        onSuccess();
        onClose();
        resetForm();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Create issue error:', error);
      alert('Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Raise New Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              placeholder="Brief description of the issue"
              value={issueData.title}
              onChange={(e) => setIssueData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={issueData.category} onValueChange={(value) => setIssueData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={issueData.priority} onValueChange={(value) => setIssueData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Description *</Label>
            <Textarea
              placeholder="Detailed description of the issue. Include steps to reproduce if it's a bug."
              value={issueData.body}
              onChange={(e) => setIssueData(prev => ({ ...prev, body: e.target.value }))}
              rows={6}
            />
          </div>

          <div>
            <Label>Attachments</Label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload screenshots, PDFs, or other files
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Files</span>
                  </Button>
                </Label>
              </div>

              {issueData.attachments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Attached Files:</Label>
                  {issueData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your issue will be reviewed by the support team. 
              You will be notified of any updates via email.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Issue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueModal;