import * as React from 'react';

const ChatWidget: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<{ text: string; from: 'user' | 'bot' }[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
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
            const response = await fetch('https://auto-chat-nine.vercel.app/api/chat', {
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

    return React.createElement('div', {
        className: "fixed bottom-6 right-6 z-50 flex flex-col items-end"
    }, [
        open && React.createElement('div', {
            key: 'chat-box',
            className: "w-80 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden mb-2"
        }, [
            React.createElement('div', {
                key: 'header',
                className: "bg-blue-600 text-white px-4 py-2 flex justify-between items-center"
            }, [
                React.createElement('span', { key: 'title' }, 'Chat'),
                React.createElement('button', {
                    key: 'close',
                    onClick: () => setOpen(false),
                    'aria-label': "Close chat",
                    className: "text-white"
                }, '×')
            ]),
            React.createElement('div', {
                key: 'messages',
                className: "flex-1 p-4 overflow-y-auto h-64 bg-gray-50"
            }, [
                ...messages.map((msg, idx) =>
                    React.createElement('div', {
                        key: idx,
                        className: `mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`
                    }, React.createElement('div', {
                        className: `px-3 py-2 rounded-lg max-w-xs ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`
                    }, msg.text))
                ),
                isLoading && React.createElement('div', {
                    key: 'loading',
                    className: "mb-2 flex justify-start"
                }, React.createElement('div', {
                    className: "px-3 py-2 rounded-lg max-w-xs bg-gray-200 text-gray-900"
                }, 'Thinking...')),
                React.createElement('div', { key: 'scroll-ref', ref: messagesEndRef })
            ]),
            React.createElement('form', {
                key: 'form',
                onSubmit: handleSend,
                className: "flex border-t bg-white"
            }, [
                React.createElement('input', {
                    key: 'input',
                    className: "flex-1 px-3 py-2 outline-none",
                    type: "text",
                    value: input,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
                    placeholder: "Type your message...",
                    disabled: isLoading
                }),
                React.createElement('button', {
                    key: 'send',
                    type: "submit",
                    className: `px-4 py-2 text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`,
                    disabled: isLoading
                }, isLoading ? '...' : 'Send')
            ])
        ]),
        React.createElement('button', {
            key: 'toggle',
            onClick: () => setOpen((v) => !v),
            className: "bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl focus:outline-none",
            'aria-label': "Open chat"
        }, '💬')
    ]);
};

export default ChatWidget; 