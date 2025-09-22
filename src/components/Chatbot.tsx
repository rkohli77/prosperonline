import { useState, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot" as const,
          text: "Hi! I'm here to help you learn about Prosper Online's digital marketing services. How can I assist you today?"
        }
      ]);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageToSend = input.trim();
    const newMessages = [...messages, { sender: "user" as const, text: messageToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        throw new Error("No response from OpenAI");
      }

      setMessages([
        ...newMessages,
        { sender: "bot" as const, text: reply },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      
      setMessages([
        ...newMessages,
        { 
          sender: "bot" as const, 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly at info@prosperonline.ca" 
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
        onClick={() => setIsOpen(!isOpen)}
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
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-2 text-xs text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

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