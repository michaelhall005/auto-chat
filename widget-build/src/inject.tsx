import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ChatWidget from './ChatWidget';

// Expose a global function to inject the widget
(window as any).initChatWidget = function (options?: { containerId?: string }) {
    const containerId = options?.containerId || 'chat-widget-container';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }

    // Use React 18's createRoot if available, fallback to render for compatibility
    const ReactDOMClient = (ReactDOM as any).createRoot ? ReactDOM : null;
    if (ReactDOMClient && (ReactDOM as any).createRoot) {
        const root = (ReactDOM as any).createRoot(container);
        root.render(React.createElement(ChatWidget));
    } else {
        (ReactDOM as any).render(React.createElement(ChatWidget), container);
    }
}; 