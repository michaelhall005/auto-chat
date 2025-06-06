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
    (ReactDOM as any).render(<ChatWidget />, container);
}; 