'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, Clock, CheckCircle, Bug, Lightbulb, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import CreateIssueModal from '@/components/issues/CreateIssueModal';
import { getAllIssues, updateIssueStatus } from '@/lib/issueActions';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, statusFilter, priorityFilter]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const data = await getAllIssues();
      setIssues(data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const openIssues = filteredIssues.filter(i => i.status === 'open');
  const inProgressIssues = filteredIssues.filter(i => i.status === 'in_progress');
  const resolvedIssues = filteredIssues.filter(i => i.status === 'resolved');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issue Tracker</h1>
            <p className="text-gray-600">Report and track issues</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Back to Counter</Button>
            </Link>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Raise Issue
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Issues ({filteredIssues.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({openIssues.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressIssues.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedIssues.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <IssuesList issues={filteredIssues} loading={loading} />
        </TabsContent>

        <TabsContent value="open" className="mt-6">
          <IssuesList issues={openIssues} loading={loading} />
        </TabsContent>

        <TabsContent value="in_progress" className="mt-6">
          <IssuesList issues={inProgressIssues} loading={loading} />
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <IssuesList issues={resolvedIssues} loading={loading} />
        </TabsContent>
      </Tabs>

      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadIssues}
      />
    </div>
  );
};

const IssuesList = ({ issues, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No issues found</h3>
          <p className="text-gray-500">No issues match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                {getCategoryIcon(issue.category)}
                <h3 className="font-semibold text-lg">{issue.title}</h3>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(issue.priority)}>
                  {issue.priority.toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{issue.body}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>By: {issue.created_by}</span>
                <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                {issue.attachments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {issue.attachments.length} attachment(s)
                  </span>
                )}
              </div>
              <span>#{issue.id}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IssuesPage;