import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  type Message = { sender: "user" | "bot"; text: string };
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I assist you with ProsperOnline today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const trackUserInteraction = (event: string) => {
    console.log(`User interaction: ${event}`);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { sender: "user", text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text, sessionId }),
      });
      const data = await res.json();
      const botMsg: Message = { sender: "bot", text: data.answer || "Sorry, I couldn’t find an answer." };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg: Message = { sender: "bot", text: "Sorry, something went wrong. Please try again." };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
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

      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl flex flex-col max-h-[500px]"
          role="dialog"
          aria-labelledby="chat-title"
          aria-describedby="chat-description"
        >
          <div className="bg-accent text-white p-3 rounded-t-lg font-semibold flex justify-between items-center">
            <span id="chat-title">Chat with us</span>
            <button 
              onClick={() => { setIsOpen(false); trackUserInteraction('chat_closed'); }}
              className="hover:bg-white/20 rounded p-1 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >✖</button>
          </div>

          <div 
            id="chat-description"
            className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-3 max-h-80"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === "user" ? "bg-accent text-white" : "bg-gray-100 text-gray-800"}`}>
                  <div className="text-xs font-medium mb-1 opacity-75">{msg.sender === "user" ? "You" : "Prosper Online Bot"}</div>
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
            <div ref={messagesEndRef} />
          </div>

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
              >Send</button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
