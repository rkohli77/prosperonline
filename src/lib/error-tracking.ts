// Error tracking utility for chatbot
interface ErrorData {
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  context: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

interface ConversationData {
  sessionId: string;
  userMessage?: string;
  botResponse?: string;
  messageType: 'user' | 'bot';
  timestamp: string;
  responseTime?: number;
  errorOccurred?: boolean;
  errorType?: string;
  userAgent: string;
  ipAddress?: string;
}

interface SessionData {
  sessionId: string;
  startedAt: string;
  endedAt?: string;
  totalMessages: number;
  userAgent: string;
  ipAddress?: string;
  status: 'active' | 'ended' | 'timeout';
}

interface ChatbotErrorContext {
  messageCount: number;
  conversationLength: number;
  lastMessageTime?: string;
  userInput?: string;
  apiKeyPresent: boolean;
  networkStatus: 'online' | 'offline';
}

class ErrorTracker {
  private sessionId: string;
  private messageCount: number = 0;
  private conversationStartTime: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.conversationStartTime = new Date().toISOString();
  }

  private generateSessionId(): string {
    return `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNetworkStatus(): 'online' | 'offline' {
    return navigator.onLine ? 'online' : 'offline';
  }

  private getAdditionalContext(): ChatbotErrorContext {
    return {
      messageCount: this.messageCount,
      conversationLength: Date.now() - new Date(this.conversationStartTime).getTime(),
      lastMessageTime: new Date().toISOString(),
      apiKeyPresent: !!import.meta.env.VITE_OPENAI_API_KEY,
      networkStatus: this.getNetworkStatus(),
    };
  }

  async trackError(
    error: Error, 
    context: string, 
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    try {
      const errorData: ErrorData = {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.sessionId,
        additionalData: {
          ...this.getAdditionalContext(),
          ...additionalData,
        },
      };

      // Send to backend
      await fetch('http://localhost:3001/api/chatbot/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });

      // Also log to console in development
      if (import.meta.env.DEV) {
        console.error('Chatbot Error Tracked:', errorData);
      }
    } catch (trackingError) {
      // Silently fail if error tracking fails
      console.warn('Failed to track error:', trackingError);
    }
  }

  async trackConversation(conversationData: ConversationData): Promise<void> {
    try {
      await fetch('http://localhost:3001/api/chatbot/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData),
      });

      if (import.meta.env.DEV) {
        console.log('Conversation Tracked:', conversationData);
      }
    } catch (trackingError) {
      console.warn('Failed to track conversation:', trackingError);
    }
  }

  async trackSession(sessionData: SessionData): Promise<void> {
    try {
      await fetch('http://localhost:3001/api/chatbot/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (import.meta.env.DEV) {
        console.log('Session Tracked:', sessionData);
      }
    } catch (trackingError) {
      console.warn('Failed to track session:', trackingError);
    }
  }

  trackUserMessage(): void {
    this.messageCount++;
  }

  trackApiCall(success: boolean, responseTime?: number): void {
    this.trackError(
      new Error(`API Call ${success ? 'Success' : 'Failed'}`),
      'api_call_metrics',
      { success, responseTime }
    );
  }

  trackUserInteraction(action: string, data: any = {}): void {
    this.trackError(
      new Error(`User Interaction: ${action}`),
      'user_interaction',
      { action, ...data }
    );
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Convenience functions
export const trackChatbotError = (error: Error, context: string, additionalData?: Record<string, any>) => {
  return errorTracker.trackError(error, context, additionalData);
};

export const trackConversation = (conversationData: ConversationData) => {
  return errorTracker.trackConversation(conversationData);
};

export const trackSession = (sessionData: SessionData) => {
  return errorTracker.trackSession(sessionData);
};

export const trackUserMessage = () => {
  errorTracker.trackUserMessage();
};

export const trackApiCall = (success: boolean, responseTime?: number) => {
  errorTracker.trackApiCall(success, responseTime);
};

export const trackUserInteraction = (action: string, data?: any) => {
  errorTracker.trackUserInteraction(action, data);
};
