# Chatbot Error Tracking Setup

## Overview

This system tracks chatbot errors and user interactions to help you monitor and fix issues in real-time.

## What Gets Tracked

### 1. **Error Types**
- `api_key_missing` - OpenAI API key not configured
- `network_error` - Network connectivity issues
- `http_error` - HTTP response errors from OpenAI
- `no_response` - Empty response from OpenAI
- `unknown` - Other unexpected errors

### 2. **User Interactions**
- `chat_opened` - User opens the chat
- `chat_closed` - User closes the chat
- `message_sent` - User sends a message
- `api_success` - Successful API call
- `error_encountered` - User encounters an error

### 3. **Performance Metrics**
- Response time for API calls
- Message count per session
- Conversation length
- Network status
- API key presence

## Backend Setup

### 1. **Create API Endpoint**

Add this to your backend (Node.js/Express example):

```javascript
// POST /api/chatbot/errors
app.post('/api/chatbot/errors', (req, res) => {
  const errorData = {
    id: Date.now().toString(),
    ...req.body,
    receivedAt: new Date().toISOString(),
  };
  
  // Store in database
  // Log to monitoring service
  // Send alerts if needed
  
  res.json({ success: true, errorId: errorData.id });
});
```

### 2. **Database Schema**

```sql
CREATE TABLE chatbot_errors (
  id VARCHAR(255) PRIMARY KEY,
  error_message TEXT,
  error_stack TEXT,
  error_name VARCHAR(255),
  context VARCHAR(255),
  timestamp DATETIME,
  user_agent TEXT,
  url VARCHAR(500),
  session_id VARCHAR(255),
  message_count INT,
  conversation_length INT,
  api_key_present BOOLEAN,
  network_status VARCHAR(20),
  user_input TEXT,
  response_time INT,
  additional_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **Monitoring Dashboard**

Create endpoints to view errors:

```javascript
// GET /api/chatbot/errors/stats
app.get('/api/chatbot/errors/stats', (req, res) => {
  // Return error statistics
  // - Total errors
  // - Errors by type
  // - Recent errors
  // - Performance metrics
});

// GET /api/chatbot/errors
app.get('/api/chatbot/errors', (req, res) => {
  // Return paginated error list
  // - Filter by date range
  // - Filter by error type
  // - Search functionality
});
```

## Integration with Monitoring Services

### 1. **Sentry Integration**

```javascript
const Sentry = require('@sentry/node');

app.post('/api/chatbot/errors', (req, res) => {
  const errorData = req.body;
  
  // Send to Sentry
  Sentry.captureException(new Error(errorData.error.message), {
    tags: {
      context: errorData.context,
      errorType: errorData.additionalData?.errorType,
    },
    extra: errorData
  });
  
  // Store in database
  // ...
});
```

### 2. **LogRocket Integration**

```javascript
const LogRocket = require('logrocket');

app.post('/api/chatbot/errors', (req, res) => {
  const errorData = req.body;
  
  // Send to LogRocket
  LogRocket.captureException(new Error(errorData.error.message));
  
  // Store in database
  // ...
});
```

### 3. **Custom Webhook**

```javascript
app.post('/api/chatbot/errors', async (req, res) => {
  const errorData = req.body;
  
  // Send to custom webhook
  await fetch('https://your-webhook-url.com/chatbot-errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData)
  });
  
  // Store in database
  // ...
});
```

## Alerting Setup

### 1. **Error Rate Alerts**

```javascript
// Check error rate every 5 minutes
setInterval(async () => {
  const errorCount = await getErrorCount('5 minutes');
  if (errorCount > 10) {
    sendAlert(`High error rate: ${errorCount} errors in 5 minutes`);
  }
}, 5 * 60 * 1000);
```

### 2. **Critical Error Alerts**

```javascript
app.post('/api/chatbot/errors', (req, res) => {
  const errorData = req.body;
  
  // Check for critical errors
  if (errorData.context === 'api_key_missing') {
    sendAlert('CRITICAL: OpenAI API key is missing!');
  }
  
  if (errorData.additionalData?.errorType === 'http_error') {
    sendAlert('API Error: OpenAI service may be down');
  }
  
  // Store error
  // ...
});
```

## Frontend Configuration

### 1. **Environment Variables**

```env
# .env.local
VITE_OPENAI_API_KEY=your_api_key_here
VITE_CHATBOT_SYSTEM_PROMPT=your_system_prompt_here
```

### 2. **Error Tracking is Automatic**

The error tracking is built into the chatbot component and works automatically. No additional configuration needed on the frontend.

## Monitoring Dashboard Example

```javascript
// Example dashboard data structure
{
  "totalErrors": 45,
  "errorsByType": {
    "api_key_missing": 2,
    "network_error": 15,
    "http_error": 8,
    "no_response": 5,
    "unknown": 15
  },
  "errorsByContext": {
    "chatbot_api_call": 40,
    "user_interaction": 5
  },
  "recentErrors": [
    {
      "id": "1234567890",
      "errorType": "network_error",
      "message": "I'm having trouble connecting to our servers...",
      "timestamp": "2025-01-20T10:30:00Z",
      "userAgent": "Mozilla/5.0...",
      "responseTime": 5000
    }
  ],
  "performanceMetrics": {
    "averageResponseTime": 1200,
    "successRate": 0.85,
    "totalSessions": 150,
    "totalMessages": 450
  }
}
```

## Benefits

### 1. **Proactive Monitoring**
- Know about errors before users complain
- Track error patterns and trends
- Monitor performance metrics

### 2. **Better User Experience**
- Users see friendly error messages
- Technical details are hidden from users
- Fallback contact methods provided

### 3. **Business Intelligence**
- Understand user behavior
- Track conversation patterns
- Monitor chatbot effectiveness

### 4. **Technical Insights**
- API performance monitoring
- Error rate tracking
- System health monitoring

## Security Considerations

1. **Data Privacy**: Don't log sensitive user information
2. **Rate Limiting**: Implement rate limiting on error endpoints
3. **Authentication**: Secure your error tracking endpoints
4. **Data Retention**: Set up data retention policies
5. **GDPR Compliance**: Ensure compliance with privacy regulations

## Next Steps

1. Set up the backend API endpoint
2. Configure your database
3. Integrate with monitoring service
4. Set up alerting
5. Create monitoring dashboard
6. Test the error tracking system


