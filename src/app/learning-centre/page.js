'use client';

import React, { useState } from 'react';
import { BookOpen, Play, FileText, HelpCircle, Search, ChevronRight, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const LearningCentrePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const guides = [
    {
      id: 1,
      title: 'Getting Started with Counter Operations',
      description: 'Learn the basics of using the counter system for daily operations',
      duration: '5 min read',
      category: 'basics',
      steps: 8,
      image: '/guide1.jpg'
    },
    {
      id: 2,
      title: 'Managing Customer Orders',
      description: 'Complete guide on creating, editing, and tracking customer orders',
      duration: '7 min read',
      category: 'orders',
      steps: 12,
      image: '/guide2.jpg'
    },
    {
      id: 3,
      title: 'Cash Register Management',
      description: 'How to open, close, and manage cash register operations',
      duration: '4 min read',
      category: 'finance',
      steps: 6,
      image: '/guide3.jpg'
    },
    {
      id: 4,
      title: 'Printer Setup and Configuration',
      description: 'Step-by-step guide to configure printers for tags and invoices',
      duration: '6 min read',
      category: 'setup',
      steps: 10,
      image: '/guide4.jpg'
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Quick Order Processing',
      description: 'Learn how to process orders quickly during busy hours',
      duration: '2:30',
      category: 'orders',
      thumbnail: '/video1.jpg',
      url: '#'
    },
    {
      id: 2,
      title: 'Customer Management Tips',
      description: 'Best practices for managing customer information',
      duration: '3:15',
      category: 'customers',
      thumbnail: '/video2.jpg',
      url: '#'
    },
    {
      id: 3,
      title: 'Troubleshooting Common Issues',
      description: 'How to resolve common problems you might encounter',
      duration: '2:45',
      category: 'troubleshooting',
      thumbnail: '/video3.jpg',
      url: '#'
    }
  ];

  const infographics = [
    {
      id: 1,
      title: 'Order Lifecycle Flow',
      description: 'Visual representation of complete order process',
      category: 'process',
      image: '/infographic1.jpg'
    },
    {
      id: 2,
      title: 'Payment Processing Steps',
      description: 'Step-by-step payment handling process',
      category: 'finance',
      image: '/infographic2.jpg'
    },
    {
      id: 3,
      title: 'Quality Control Checklist',
      description: 'Quality assurance process for garment handling',
      category: 'quality',
      image: '/infographic3.jpg'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I add a new customer to the system?',
      answer: 'Click on the "Add Customer" button in the customer section, fill in the required details like name, phone number, and address, then click "Save Customer".',
      category: 'customers'
    },
    {
      id: 2,
      question: 'What should I do if the printer is not working?',
      answer: 'First, check if the printer is connected and has paper. Go to Printer Settings, select your printer, and click "Test Print". If it still doesn\'t work, contact technical support.',
      category: 'technical'
    },
    {
      id: 3,
      question: 'How do I process a refund?',
      answer: 'Go to the order details, click on the "Refund" tab, enter the refund amount and reason, select the payment mode, and click "Process Refund".',
      category: 'orders'
    },
    {
      id: 4,
      question: 'Can I edit an order after it\'s been placed?',
      answer: 'Yes, you can edit orders that are still in "Processing" status. Click on the order, select "Edit Order", make your changes, and submit for admin approval.',
      category: 'orders'
    },
    {
      id: 5,
      question: 'How do I close the cash register at end of shift?',
      answer: 'Go to Cash Register, click "Close Register", enter the actual cash amount in the drawer, add any closing notes, and click "Close Register".',
      category: 'finance'
    }
  ];

  const troubleshooting = [
    {
      id: 1,
      issue: 'Login page not loading',
      solution: 'Clear browser cache and cookies, then try again. If problem persists, contact IT support.',
      category: 'login'
    },
    {
      id: 2,
      issue: 'Orders not saving properly',
      solution: 'Check internet connection. Ensure all required fields are filled. Try refreshing the page and re-entering the order.',
      category: 'orders'
    },
    {
      id: 3,
      issue: 'Printer not responding',
      solution: 'Check printer connection, ensure it has paper and ink. Restart the printer and test from Printer Settings.',
      category: 'printing'
    },
    {
      id: 4,
      issue: 'Cash register calculations wrong',
      solution: 'Verify all discounts and taxes are applied correctly. Check if there are any pending transactions affecting the total.',
      category: 'finance'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Centre</h1>
            <p className="text-gray-600">Guides, tutorials, and resources to help you</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Counter</Button>
          </Link>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search guides, videos, FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="guides">Step-by-Step Guides</TabsTrigger>
          <TabsTrigger value="videos">Tutorial Videos</TabsTrigger>
          <TabsTrigger value="infographics">Infographics</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{guide.duration}</span>
                    </div>
                    <Badge variant="outline">{guide.steps} steps</Badge>
                  </div>
                  <Button className="w-full mt-3" variant="outline">
                    <span>Read Guide</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center relative">
                    <Play className="w-8 h-8 text-gray-400" />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  <Button className="w-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="infographics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infographics.map((infographic) => (
              <Card key={infographic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{infographic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{infographic.description}</p>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    View Infographic
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                      <Badge variant="outline" className="mt-2">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="troubleshooting" className="mt-6">
          <div className="space-y-4">
            {troubleshooting.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-red-700">Issue: {item.issue}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Solution:</strong> {item.solution}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningCentrePage;