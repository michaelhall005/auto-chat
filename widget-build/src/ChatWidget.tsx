import React, { useEffect, useRef, useState } from 'react';

const ChatWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; from: 'user' | 'bot' }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setMessages((msgs) => [...msgs, { text: userMessage, from: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (data.success) {
                setMessages((msgs) => [...msgs, { text: data.response, from: 'bot' }]);
            } else {
                setMessages((msgs) => [...msgs, { text: "Sorry, I couldn't process your message right now.", from: 'bot' }]);
            }
        } catch (error) {
            console.error('Error calling chat API:', error);
            setMessages((msgs) => [...msgs, { text: "Sorry, I'm having trouble connecting right now.", from: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {open && (
                <div className="w-80 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden mb-2">
                    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                        <span>Chat</span>
                        <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white">×</button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto h-64 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>{msg.text}</div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mb-2 flex justify-start">
                                <div className="px-3 py-2 rounded-lg max-w-xs bg-gray-200 text-gray-900">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="flex border-t bg-white">
                        <input
                            className="flex-1 px-3 py-2 outline-none"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
            <button
                onClick={() => setOpen((v) => !v)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl focus:outline-none"
                aria-label="Open chat"
            >
                💬
            </button>
        </div>
    );
};

export default ChatWidget; 