import { useState } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  X,
  Maximize2,
  Minimize2,
  BarChart2,
} from "lucide-react";
import { Analytics } from "../components/Analytics";
import { ChatMessage } from "../components/ChatMessage";
import { cn } from "../lib/utils";
import axios from "axios";

export default function Intelli() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(), // Changed from crypto.randomUUID() for better browser support
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            Authorization: `Bearer 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`, // Use environment variable
            "Content-Type": "application/json",
          },
        }
      );

      const assistantMessage = {
        id: Date.now(),
        content: response.data.choices[0].message.content,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = {
        id: Date.now(),
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Chat Support</span>
        </button>
      ) : (
        <div className="w-[95vw] max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-white" />
              <h2 className="text-lg font-semibold text-white">IntelliSupport</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="rounded-lg p-2 text-white hover:bg-black/10"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-2 text-white hover:bg-black/10"
              >
                {isExpanded ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-white hover:bg-black/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[70vh] max-h-[600px] flex-col md:flex-row">
            {/* Chat Section */}
            <div className={cn("flex flex-1 flex-col", showAnalytics && "md:w-1/2")}>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {loading && (
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      <span>Thinking...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Analytics Panel */}
            {showAnalytics && (
              <div className="w-full border-t bg-gray-50 md:w-1/2 md:border-l">
                <div className="h-full overflow-y-auto p-4">
                  <Analytics />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}