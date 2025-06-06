import * as React from 'react';

const ChatWidget: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<{ text: string; from: 'user' | 'bot' }[]>([
        { text: "Hi! I'm your AI assistant. How can I help you today?", from: 'bot' }
    ]);
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
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontFamily: "'Inter', 'Helvetica Neue', 'Arial', sans-serif"
    };

    const chatBoxStyle: React.CSSProperties = {
        width: '380px',
        height: '600px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        marginBottom: '15px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.8)',
        opacity: open ? 1 : 0,
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        pointerEvents: open ? 'auto' : 'none'
    };

    const headerStyle: React.CSSProperties = {
        background: 'linear-gradient(to right, #6A11CB 0%, #2575FC 100%)',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        position: 'relative'
    };

    const avatarStyle: React.CSSProperties = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontSize: '18px'
    };

    const headerInfoStyle: React.CSSProperties = {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    };

    const nameStyle: React.CSSProperties = {
        fontWeight: '600',
        fontSize: '1.1em',
        marginBottom: '2px'
    };

    const statusStyle: React.CSSProperties = {
        fontSize: '0.8em',
        color: 'rgba(255, 255, 255, 0.8)'
    };

    const closeButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1.5em',
        padding: '0',
        lineHeight: '1',
        opacity: '0.8',
        transition: 'opacity 0.2s'
    };

    const messagesContainerStyle: React.CSSProperties = {
        flexGrow: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column'
    };

    const messageStyle = (isUser: boolean): React.CSSProperties => ({
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: '15px',
        marginBottom: '12px',
        lineHeight: '1.4',
        fontSize: '14px',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? '#e8f0fe' : '#e0e0e0',
        color: isUser ? '#1565c0' : '#333',
        borderBottomRightRadius: isUser ? '5px' : '15px',
        borderBottomLeftRadius: isUser ? '15px' : '5px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        animation: 'messageSlideIn 0.3s ease-out'
    });

    const loadingMessageStyle: React.CSSProperties = {
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: '15px',
        marginBottom: '12px',
        lineHeight: '1.4',
        fontSize: '14px',
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
        color: '#666',
        borderBottomLeftRadius: '5px',
        display: 'flex',
        alignItems: 'center'
    };

    const typingDotsStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center'
    };

    const footerStyle: React.CSSProperties = {
        padding: '15px 20px',
        borderTop: '1px solid #eee',
        backgroundColor: 'white',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px'
    };

    const inputContainerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        borderRadius: '25px',
        padding: '8px 15px',
        transition: 'box-shadow 0.2s ease'
    };

    const inputStyle: React.CSSProperties = {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'none',
        fontSize: '14px',
        padding: '8px 0',
        color: '#333'
    };

    const sendButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: '#6A11CB',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        marginLeft: '10px',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'background-color 0.2s ease',
        opacity: isLoading ? 0.5 : 1
    };

    const toggleButtonStyle: React.CSSProperties = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(to right, #6A11CB 0%, #2575FC 100%)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease',
        transform: open ? 'rotate(135deg)' : 'rotate(0deg)'
    };

    // Add styles to document head for animations
    React.useEffect(() => {
        const styleId = 'chat-widget-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes typingDots {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-4px);
                    }
                }
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background-color: #666;
                    border-radius: 50%;
                    margin: 0 1px;
                    animation: typingDots 1.4s infinite ease-in-out;
                }
                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                .typing-dot:nth-child(3) { animation-delay: 0s; }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const TypingIndicator = () =>
        React.createElement('div', { style: typingDotsStyle }, [
            React.createElement('span', { key: 1, className: 'typing-dot' }),
            React.createElement('span', { key: 2, className: 'typing-dot' }),
            React.createElement('span', { key: 3, className: 'typing-dot' })
        ]);

    const SendIcon = () =>
        React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: '20',
            height: '20',
            stroke: 'currentColor',
            strokeWidth: '2',
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        }, [
            React.createElement('line', { key: 1, x1: '22', y1: '2', x2: '11', y2: '13' }),
            React.createElement('polygon', { key: 2, points: '22,2 15,22 11,13 2,9 22,2' })
        ]);

    const ChatIcon = () =>
        React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: '28',
            height: '28',
            stroke: 'currentColor',
            strokeWidth: '2',
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        }, [
            React.createElement('path', {
                key: 1,
                d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'
            })
        ]);

    return React.createElement('div', { style: containerStyle }, [
        React.createElement('div', {
            key: 'chat-box',
            style: chatBoxStyle
        }, [
            React.createElement('div', {
                key: 'header',
                style: headerStyle
            }, [
                React.createElement('div', {
                    key: 'avatar',
                    style: avatarStyle
                }, '🤖'),
                React.createElement('div', {
                    key: 'info',
                    style: headerInfoStyle
                }, [
                    React.createElement('div', { key: 'name', style: nameStyle }, 'AI Assistant'),
                    React.createElement('div', { key: 'status', style: statusStyle }, 'Online')
                ]),
                React.createElement('button', {
                    key: 'close',
                    onClick: () => setOpen(false),
                    'aria-label': "Close chat",
                    style: closeButtonStyle,
                    onMouseEnter: (e) => {
                        (e.target as HTMLElement).style.opacity = '1';
                    },
                    onMouseLeave: (e) => {
                        (e.target as HTMLElement).style.opacity = '0.8';
                    }
                }, '×')
            ]),
            React.createElement('div', {
                key: 'messages',
                style: messagesContainerStyle
            }, [
                ...messages.map((msg, idx) =>
                    React.createElement('div', {
                        key: idx,
                        style: messageStyle(msg.from === 'user')
                    }, msg.text)
                ),
                isLoading && React.createElement('div', {
                    key: 'loading',
                    style: loadingMessageStyle
                }, React.createElement(TypingIndicator)),
                React.createElement('div', { key: 'scroll-ref', ref: messagesEndRef })
            ]),
            React.createElement('div', {
                key: 'footer',
                style: footerStyle
            }, React.createElement('form', {
                onSubmit: handleSend,
                style: { margin: 0 }
            }, React.createElement('div', {
                style: inputContainerStyle,
                onFocus: (e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(106, 17, 203, 0.2)';
                },
                onBlur: (e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }
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
                    disabled: isLoading,
                    onMouseEnter: (e) => {
                        if (!isLoading) {
                            (e.target as HTMLElement).style.backgroundColor = 'rgba(106, 17, 203, 0.1)';
                        }
                    },
                    onMouseLeave: (e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }
                }, React.createElement(SendIcon))
            ])))
        ]),
        React.createElement('button', {
            key: 'toggle',
            onClick: () => setOpen((v) => !v),
            style: toggleButtonStyle,
            'aria-label': open ? "Close chat" : "Open chat",
            onMouseEnter: (e) => {
                (e.target as HTMLElement).style.transform = `${open ? 'rotate(135deg)' : 'rotate(0deg)'} translateY(-3px)`;
                (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            },
            onMouseLeave: (e) => {
                (e.target as HTMLElement).style.transform = open ? 'rotate(135deg)' : 'rotate(0deg)';
                (e.target as HTMLElement).style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            }
        }, open ? '×' : React.createElement(ChatIcon))
    ]);
};

export default ChatWidget; 