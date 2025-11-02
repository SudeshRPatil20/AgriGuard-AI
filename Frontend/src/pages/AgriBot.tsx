import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AgriBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m AgriBot, your AI-powered agricultural assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('pest') || lowerQuery.includes('insect')) {
      return 'For pest management, I recommend integrated pest management (IPM) practices. This includes regular monitoring, using biological controls like beneficial insects, and applying organic pesticides only when necessary. What specific pest are you dealing with?';
    }

    if (lowerQuery.includes('irrigation') || lowerQuery.includes('water')) {
      return 'Proper irrigation is crucial for healthy crops. Consider implementing drip irrigation for water efficiency. Water early morning or late evening to minimize evaporation. The amount depends on your crop type, soil, and climate. What crop are you growing?';
    }

    if (lowerQuery.includes('soil') || lowerQuery.includes('fertilizer')) {
      return 'Soil health is the foundation of successful farming. I recommend conducting a soil test to determine nutrient levels. Based on results, you can apply appropriate organic matter and fertilizers. Our Fertilizer Prediction tool can help with specific recommendations!';
    }

    if (lowerQuery.includes('disease') || lowerQuery.includes('sick') || lowerQuery.includes('leaf')) {
      return 'Plant diseases can significantly impact yields. Early detection is key! You can use our Disease Detection feature to identify issues. Generally, ensure good air circulation, avoid overhead watering, and remove infected plant parts promptly.';
    }

    if (lowerQuery.includes('harvest') || lowerQuery.includes('yield')) {
      return 'Harvest timing is crucial for quality and yield. Look for crop-specific maturity indicators like color, size, and firmness. Harvest during cool parts of the day when possible. What crop are you planning to harvest?';
    }

    if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature')) {
      return 'Weather monitoring is essential for farming decisions. Check our Monitoring Cloud feature for real-time weather data. Plan activities around forecasts, protect crops from extreme conditions, and adjust irrigation based on rainfall.';
    }

    return 'That\'s a great question! I can help you with pest management, irrigation practices, soil health, disease identification, harvest timing, and weather-related farming advice. Could you provide more specific details about what you\'d like to know?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'How do I deal with pests organically?',
    'What is the best irrigation method?',
    'How to improve soil health?',
    'When should I harvest my crops?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AgriBot Q&A
          </h1>
          <p className="text-lg text-gray-600">
            Your AI-powered agricultural assistant
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-400 to-pink-500'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[70%] ${
                    message.sender === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="px-3 py-2 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about farming..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">What I Can Help With</h3>
          <ul className="space-y-2 text-purple-800 text-sm">
            <li>• Pest and disease management strategies</li>
            <li>• Irrigation and water management advice</li>
            <li>• Soil health and fertilization guidance</li>
            <li>• Crop selection and harvest timing</li>
            <li>• Weather-related farming decisions</li>
            <li>• General agricultural best practices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
