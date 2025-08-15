import React, { useState, useRef, useEffect } from 'react';
import './ChatGPT.css';

function ChatGPT() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Bonjour, je suis votre assistant financier. Comment puis-je vous aider ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simuler une réponse de l'API
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Je suis en train de traiter votre demande. Cette fonctionnalité sera bientôt disponible avec l\'intégration de l\'API OpenAI.'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Assistant IA</h3>
        <span className="status-indicator">En ligne</span>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.type}`}
          >
            {message.type === 'assistant' && (
              <div className="avatar">AI</div>
            )}
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="avatar">AI</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default ChatGPT; 