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

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const chatBoxStyle: React.CSSProperties = {
        width: '320px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        marginBottom: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '600'
    };

    const closeButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '0',
        lineHeight: '1'
    };

    const messagesStyle: React.CSSProperties = {
        height: '250px',
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: '#f9fafb'
    };

    const messageStyle = (isUser: boolean): React.CSSProperties => ({
        marginBottom: '8px',
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start'
    });

    const messageBubbleStyle = (isUser: boolean): React.CSSProperties => ({
        padding: '8px 12px',
        borderRadius: '12px',
        maxWidth: '70%',
        fontSize: '14px',
        lineHeight: '1.4',
        backgroundColor: isUser ? '#2563eb' : '#e5e7eb',
        color: isUser ? 'white' : '#374151'
    });

    const formStyle: React.CSSProperties = {
        display: 'flex',
        borderTop: '1px solid #e5e7eb'
    };

    const inputStyle: React.CSSProperties = {
        flex: 1,
        padding: '12px',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        backgroundColor: 'transparent'
    };

    const sendButtonStyle: React.CSSProperties = {
        padding: '12px 16px',
        backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
        color: 'white',
        border: 'none',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    };

    const toggleButtonStyle: React.CSSProperties = {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s'
    };

    return React.createElement('div', { style: containerStyle }, [
        open && React.createElement('div', {
            key: 'chat-box',
            style: chatBoxStyle
        }, [
            React.createElement('div', {
                key: 'header',
                style: headerStyle
            }, [
                React.createElement('span', { key: 'title' }, 'Chat'),
                React.createElement('button', {
                    key: 'close',
                    onClick: () => setOpen(false),
                    'aria-label': "Close chat",
                    style: closeButtonStyle
                }, '×')
            ]),
            React.createElement('div', {
                key: 'messages',
                style: messagesStyle
            }, [
                ...messages.map((msg, idx) =>
                    React.createElement('div', {
                        key: idx,
                        style: messageStyle(msg.from === 'user')
                    }, React.createElement('div', {
                        style: messageBubbleStyle(msg.from === 'user')
                    }, msg.text))
                ),
                isLoading && React.createElement('div', {
                    key: 'loading',
                    style: messageStyle(false)
                }, React.createElement('div', {
                    style: messageBubbleStyle(false)
                }, 'Thinking...')),
                React.createElement('div', { key: 'scroll-ref', ref: messagesEndRef })
            ]),
            React.createElement('form', {
                key: 'form',
                onSubmit: handleSend,
                style: formStyle
            }, [
                React.createElement('input', {
                    key: 'input',
                    style: inputStyle,
                    type: "text",
                    value: input,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
                    placeholder: "Type your message...",
                    disabled: isLoading
                }),
                React.createElement('button', {
                    key: 'send',
                    type: "submit",
                    style: sendButtonStyle,
                    disabled: isLoading
                }, isLoading ? '...' : 'Send')
            ])
        ]),
        React.createElement('button', {
            key: 'toggle',
            onClick: () => setOpen((v) => !v),
            style: toggleButtonStyle,
            'aria-label': "Open chat",
            onMouseEnter: (e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
            },
            onMouseLeave: (e) => {
                (e.target as HTMLElement).style.backgroundColor = '#2563eb';
            }
        }, '💬')
    ]);
};

export default ChatWidget; 