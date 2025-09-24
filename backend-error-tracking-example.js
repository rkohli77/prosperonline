// Backend Error Tracking Example
// This is an example of how to implement error tracking on your backend

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const errors = [];

// Error tracking endpoint
app.post('/api/chatbot/errors', (req, res) => {
  try {
    const errorData = {
      id: Date.now().toString(),
      ...req.body,
      receivedAt: new Date().toISOString(),
    };
    
    // Store error
    errors.push(errorData);
    
    // Log to console (replace with proper logging service)
    console.log('Chatbot Error:', {
      type: errorData.context,
      message: errorData.error.message,
      timestamp: errorData.timestamp,
      userAgent: errorData.userAgent,
      url: errorData.url,
    });
    
    // Optional: Send to external monitoring service
    // await sendToMonitoringService(errorData);
    
    res.status(200).json({ success: true, errorId: errorData.id });
  } catch (err) {
    console.error('Failed to track error:', err);
    res.status(500).json({ success: false, message: 'Failed to track error' });
  }
});

// Get error statistics
app.get('/api/chatbot/errors/stats', (req, res) => {
  const stats = {
    totalErrors: errors.length,
    errorsByType: {},
    errorsByContext: {},
    recentErrors: errors.slice(-10),
  };
  
  errors.forEach(error => {
    // Count by error type
    const errorType = error.error?.name || 'Unknown';
    stats.errorsByType[errorType] = (stats.errorsByType[errorType] || 0) + 1;
    
    // Count by context
    const context = error.context || 'Unknown';
    stats.errorsByContext[context] = (stats.errorsByContext[context] || 0) + 1;
  });
  
  res.json(stats);
});

// Get all errors (with pagination)
app.get('/api/chatbot/errors', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedErrors = errors.slice(startIndex, endIndex);
  
  res.json({
    errors: paginatedErrors,
    pagination: {
      page,
      limit,
      total: errors.length,
      pages: Math.ceil(errors.length / limit),
    },
  });
});

// Health check
app.get('/api/chatbot/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    errorCount: errors.length 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Error tracking server running on port ${PORT}`);
});

// Example: Send to external monitoring service
async function sendToMonitoringService(errorData) {
  // Example integrations:
  
  // 1. Sentry
  // const Sentry = require('@sentry/node');
  // Sentry.captureException(new Error(errorData.error.message), {
  //   tags: { context: errorData.context },
  //   extra: errorData
  // });
  
  // 2. LogRocket
  // const LogRocket = require('logrocket');
  // LogRocket.captureException(new Error(errorData.error.message));
  
  // 3. Custom webhook
  // await fetch('https://your-webhook-url.com/chatbot-errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorData)
  // });
  
  // 4. Database storage
  // await db.collection('chatbot_errors').insertOne(errorData);
}


