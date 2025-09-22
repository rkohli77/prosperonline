import { useState, useEffect } from "react";
import { trackChatbotError, trackUserMessage, trackApiCall, trackUserInteraction, trackConversation, trackSession } from "@/lib/error-tracking";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Initialize with welcome message and track session
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot" as const,
          text: "Hi! I'm here to help you learn about Prosper Online's digital marketing services. How can I assist you today?"
        }
      ]);

      // Track session start
      trackSession({
        sessionId,
        startedAt: new Date().toISOString(),
        totalMessages: 0,
        userAgent: navigator.userAgent,
        status: 'active'
      });

      // Track initial bot message
      trackConversation({
        sessionId,
        botResponse: "Hi! I'm here to help you learn about Prosper Online's digital marketing services. How can I assist you today?",
        messageType: 'bot',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
  }, [messages.length, sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageToSend = input.trim();
    const newMessages = [...messages, { sender: "user" as const, text: messageToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Track user message
    trackUserMessage();
    trackUserInteraction('message_sent', { messageLength: messageToSend.length });

    // Track user conversation
    trackConversation({
      sessionId,
      userMessage: messageToSend,
      messageType: 'user',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });

    const startTime = Date.now();

    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }));

      // Add system prompt
      const systemPrompt = import.meta.env.VITE_CHATBOT_SYSTEM_PROMPT || 
        "You are a helpful assistant for Prosper Online, a digital marketing agency that helps Canadian businesses grow online. Be friendly, professional, and focus on digital marketing, SEO, lead generation, and analytics services. Keep responses concise and helpful.";

      const allMessages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: messageToSend }
      ];

      // Call OpenAI API
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: allMessages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const responseTime = Date.now() - startTime;

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        throw new Error("No response from OpenAI");
      }

      // Track successful API call
      trackApiCall(true, responseTime);
      trackUserInteraction('api_success', { responseTime, responseLength: reply.length });

      // Track bot response
      trackConversation({
        sessionId,
        botResponse: reply,
        messageType: 'bot',
        timestamp: new Date().toISOString(),
        responseTime,
        userAgent: navigator.userAgent
      });

      setMessages([
        ...newMessages,
        { sender: "bot" as const, text: reply },
      ]);
    } catch (err) {
      const responseTime = Date.now() - startTime;
      
      // Track failed API call
      trackApiCall(false, responseTime);
      
      // Track the error for backend monitoring
      if (err instanceof Error) {
        await trackChatbotError(err, 'chatbot_api_call', {
          userInput: messageToSend,
          responseTime,
          conversationLength: messages.length,
        });
      }
      
      // Don't show technical error details to users
      
      // Determine user-friendly message based on error type
      let userMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly at info@prosperonline.ca";
      let errorType = 'unknown';
      
      if (err instanceof Error) {
        if (err.message.includes("API key")) {
          userMessage = "I'm currently being set up. Please contact us directly at info@prosperonline.ca for immediate assistance.";
          errorType = 'api_key_missing';
        } else if (err.message.includes("fetch")) {
          userMessage = "I'm having trouble connecting to our servers. Please check your internet connection and try again.";
          errorType = 'network_error';
        } else if (err.message.includes("HTTP error")) {
          userMessage = "I'm experiencing some technical difficulties. Please try again in a moment or contact us at info@prosperonline.ca";
          errorType = 'http_error';
        } else if (err.message.includes("No response")) {
          userMessage = "I didn't receive a proper response. Please try rephrasing your question or contact us directly.";
          errorType = 'no_response';
        }
      }
      
      // Track user interaction with error
      trackUserInteraction('error_encountered', { 
        errorType, 
        userMessage, 
        responseTime,
        userInput: messageToSend 
      });

      // Track error response
      trackConversation({
        sessionId,
        botResponse: userMessage,
        messageType: 'bot',
        timestamp: new Date().toISOString(),
        responseTime,
        errorOccurred: true,
        errorType,
        userAgent: navigator.userAgent
      });
      
      setMessages([
        ...newMessages,
        { 
          sender: "bot" as const, 
          text: userMessage
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          trackUserInteraction(isOpen ? 'chat_closed' : 'chat_opened');
        }}
        className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl flex flex-col max-h-[500px]"
          role="dialog"
          aria-labelledby="chat-title"
          aria-describedby="chat-description"
        >
          {/* Header */}
          <div className="bg-accent text-white p-3 rounded-t-lg font-semibold flex justify-between items-center">
            <span id="chat-title">Chat with us</span>
            <button 
              onClick={() => {
                setIsOpen(false);
                trackUserInteraction('chat_closed');
              }}
              className="hover:bg-white/20 rounded p-1 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>


          {/* Messages */}
          <div 
            id="chat-description"
            className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-3 max-h-80"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.sender === "user" 
                      ? "bg-accent text-white" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {msg.sender === "user" ? "You" : "Prosper Online Bot"}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
                  <div className="text-xs font-medium mb-1 opacity-75">Prosper Online Bot</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={loading}
                aria-label="Type your message"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-accent text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;