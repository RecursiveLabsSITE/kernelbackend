'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'kernel';
  content: string;
  timestamp: Date;
  kernelName?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedKernel, setSelectedKernel] = useState('marcus-aurelius');
  const [kernels, setKernels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch kernels on mount
  useEffect(() => {
    const fetchKernels = async () => {
      try {
        const res = await fetch('/api/kernels');
        const data = await res.json();
        setKernels(data);
        if (data.length > 0) {
          setSelectedKernel(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch kernels:', error);
      }
    };
    fetchKernels();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulate kernel response (in production, this would call an AI API)
      const selectedKernelData = kernels.find((k) => k.id === selectedKernel);
      const kernelName = selectedKernelData?.name || 'Kernel';

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate contextual response based on kernel
      const responses: { [key: string]: string[] } = {
        'marcus-aurelius': [
          'The obstacle is the way. What troubles you is merely an opportunity to practice virtue.',
          'You must distinguish between what is in your control and what is not. Focus your energy wisely.',
          'Remember, you are but a small part of a greater whole. Act with wisdom and compassion.',
          'The mind adapts and converts to its own purposes any obstacle to its action.',
        ],
        'cleopatra-vii': [
          'Power is not merely held—it is wielded with intelligence and grace.',
          'A ruler must understand both the hearts of her people and the minds of her enemies.',
          'Diplomacy and strategy are the true weapons of a sovereign.',
          'I have learned that survival requires both strength and the wisdom to know when to compromise.',
        ],
      };

      const kernelResponses = responses[selectedKernel] || responses['marcus-aurelius'];
      const response = kernelResponses[Math.floor(Math.random() * kernelResponses.length)];

      const kernelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'kernel',
        content: response,
        timestamp: new Date(),
        kernelName,
      };

      setMessages((prev) => [...prev, kernelMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '280px',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Conversations
          </h2>
          <button
            onClick={() => setMessages([])}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
          >
            + New Chat
          </button>
        </div>

        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Select Kernel
            </p>
            {kernels.map((kernel) => (
              <button
                key={kernel.id}
                onClick={() => {
                  setSelectedKernel(kernel.id);
                  setMessages([]);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '8px',
                  backgroundColor: selectedKernel === kernel.id ? '#e0e7ff' : '#fff',
                  border: selectedKernel === kernel.id ? '1px solid #6366f1' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: selectedKernel === kernel.id ? '600' : '500',
                  color: selectedKernel === kernel.id ? '#4f46e5' : '#111827',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (selectedKernel !== kernel.id) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedKernel !== kernel.id) {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
              >
                {kernel.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fff',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            {kernels.find((k) => k.id === selectedKernel)?.name || 'Chat'}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
            {kernels.find((k) => k.id === selectedKernel)?.description || 'Start a conversation'}
          </p>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#fafafa',
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  opacity: 0.3,
                }}
              >
                💬
              </div>
              <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center' }}>
                Start a conversation with {kernels.find((k) => k.id === selectedKernel)?.name || 'a kernel'}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '12px',
                }}
              >
                {message.role === 'kernel' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}
                  >
                    K
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '60%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: message.role === 'user' ? '#4f46e5' : '#e5e7eb',
                    color: message.role === 'user' ? '#fff' : '#111827',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    wordWrap: 'break-word',
                  }}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#111827',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}
                  >
                    U
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fff',
          }}
        >
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4f46e5')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: loading || !input.trim() ? '#d1d5db' : '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && input.trim()) {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
