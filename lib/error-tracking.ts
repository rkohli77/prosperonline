// Error tracking utility for chatbot
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
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
      apiKeyPresent: !!process.env.VITE_OPENAI_API_KEY,
      networkStatus: this.getNetworkStatus(),
    };
  }

  async trackError(
    err: Error, 
    context: string, 
    additionalData: Record<string, any> = {}
  ): Promise<void> {
    try {
      const errorData: ErrorData = {
        error: {
          message: err.message,
          stack: err.stack,
          name: err.name,
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

      // Send to Supabase
      const { error } = await supabase
        .from('chatbot_errors')
        .insert({
          id: errorData.sessionId + '_' + Date.now(),
          error_message: errorData.error.message,
          error_stack: errorData.error.stack,
          error_name: errorData.error.name,
          context: errorData.context,
          timestamp: errorData.timestamp,
          user_agent: errorData.userAgent,
          url: errorData.url,
          session_id: errorData.sessionId,
          message_count: errorData.additionalData?.messageCount || 0,
          conversation_length: errorData.additionalData?.conversationLength || 0,
          api_key_present: errorData.additionalData?.apiKeyPresent || false,
          network_status: errorData.additionalData?.networkStatus || 'online',
          user_input: errorData.additionalData?.userInput || null,
          response_time: errorData.additionalData?.responseTime || null,
          additional_data: errorData.additionalData || {}
        });

      if (error) {
        throw error;
      }

      // Also log to console in development
      if (process.env.DEV) {
        console.error('Chatbot Error Tracked:', errorData);
      }
    } catch (trackingError) {
      // Silently fail if error tracking fails
      console.warn('Failed to track error:', trackingError);
    }
  }

  async trackConversation(conversationData: ConversationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          id: conversationData.sessionId + '_' + Date.now(),
          session_id: conversationData.sessionId,
          user_message: conversationData.userMessage,
          bot_response: conversationData.botResponse,
          message_type: conversationData.messageType,
          timestamp: conversationData.timestamp,
          response_time: conversationData.responseTime,
          error_occurred: conversationData.errorOccurred || false,
          error_type: conversationData.errorType,
          user_agent: conversationData.userAgent,
          ip_address: conversationData.ipAddress
        });

      if (error) {
        throw error;
      }

      if (process.env.DEV) {
        console.log('Conversation Tracked:', conversationData);
      }
    } catch (trackingError) {
      console.warn('Failed to track conversation:', trackingError);
    }
  }

  async trackSession(sessionData: SessionData): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .insert({
          session_id: sessionData.sessionId,
          started_at: sessionData.startedAt,
          ended_at: sessionData.endedAt,
          total_messages: sessionData.totalMessages,
          user_agent: sessionData.userAgent,
          ip_address: sessionData.ipAddress,
          last_activity: new Date().toISOString(),
          status: sessionData.status
        });

      if (error) {
        throw error;
      }

      if (process.env.DEV) {
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
