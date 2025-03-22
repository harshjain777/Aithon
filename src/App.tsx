import { useState } from 'react';
import { MessageCircle, Send, Bot, X, Maximize2, Minimize2, BarChart2 } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { Analytics } from './components/Analytics';
import { ChatMessage } from './components/ChatMessage';
import { cn } from './lib/utils';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      content: input,
      role: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: crypto.randomUUID(),
        content: 'Thank you for your message. I am processing your request.',
        role: 'assistant' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Chat with IntelliSupport</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={cn(
            "bg-white rounded-lg shadow-xl flex flex-col transition-all duration-200",
            isExpanded ? "w-[800px] h-[600px]" : "w-[400px] h-[500px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h2 className="font-semibold">IntelliSupport</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex">
            {/* Chat messages */}
            <div className={cn(
              "flex-1 flex flex-col",
              showAnalytics && isExpanded ? "w-1/2" : "w-full"
            )}>
              {/* 3D Animation */}
              <div className="h-32 bg-gray-50 border-b">
                <Spline scene="https://prod.spline.design/example-scene.splinecode" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Analytics panel */}
            {showAnalytics && isExpanded && (
              <div className="w-1/2 border-l p-4">
                <Analytics />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}