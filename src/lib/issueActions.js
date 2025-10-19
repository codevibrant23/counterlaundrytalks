// Issue API actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get all issues
export const getAllIssues = async () => {
  try {
    const mockIssues = [
      {
        id: 'ISS001',
        title: 'Login page not loading properly',
        body: 'The login page takes too long to load and sometimes shows a blank screen. This happens mostly in the morning hours.',
        status: 'open',
        priority: 'high',
        created_by: 'John Doe',
        created_at: '2024-01-25T10:30:00Z',
        updated_at: '2024-01-25T10:30:00Z',
        attachments: ['screenshot1.png'],
        category: 'bug'
      },
      {
        id: 'ISS002',
        title: 'Add bulk order feature',
        body: 'Need ability to add multiple orders at once for commercial customers. This would save a lot of time during busy hours.',
        status: 'in_progress',
        priority: 'medium',
        created_by: 'Jane Smith',
        created_at: '2024-01-24T14:20:00Z',
        updated_at: '2024-01-25T09:15:00Z',
        attachments: [],
        category: 'feature'
      },
      {
        id: 'ISS003',
        title: 'Printer not working with new tags',
        body: 'The tag printer is not printing the new format correctly. Some fields are missing and barcode is not scanning properly.',
        status: 'resolved',
        priority: 'high',
        created_by: 'Mike Johnson',
        created_at: '2024-01-23T16:45:00Z',
        updated_at: '2024-01-24T11:30:00Z',
        attachments: ['printer_error.pdf', 'tag_sample.jpg'],
        category: 'bug'
      },
      {
        id: 'ISS004',
        title: 'Cash register calculation error',
        body: 'Sometimes the cash register shows wrong total amounts. This happens when there are multiple discounts applied.',
        status: 'open',
        priority: 'critical',
        created_by: 'Sarah Wilson',
        created_at: '2024-01-25T08:15:00Z',
        updated_at: '2024-01-25T08:15:00Z',
        attachments: ['calculation_error.png'],
        category: 'bug'
      }
    ];

    return mockIssues;
  } catch (error) {
    console.error('Get all issues error:', error);
    throw error;
  }
};

// Create new issue
export const createIssue = async (issueData) => {
  try {
    const newIssue = {
      id: `ISS${Date.now().toString().slice(-3)}`,
      ...issueData,
      status: 'open',
      created_by: 'Current User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Issue created successfully',
      data: newIssue
    };
  } catch (error) {
    console.error('Create issue error:', error);
    return {
      error: true,
      message: error.message || 'Failed to create issue'
    };
  }
};

// Update issue status
export const updateIssueStatus = async (issueId, status) => {
  try {
    return {
      success: true,
      message: `Issue status updated to ${status}`
    };
  } catch (error) {
    console.error('Update issue status error:', error);
    return {
      error: true,
      message: error.message || 'Failed to update issue status'
    };
  }
};