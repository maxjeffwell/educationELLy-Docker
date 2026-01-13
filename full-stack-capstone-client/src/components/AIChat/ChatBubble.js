import React, { useState, useRef, useEffect, useCallback } from 'react';

import {
  ChatBubbleButton,
  ChatWindowContainer,
  ChatHeader,
  CloseButton,
  MessagesContainer,
  MessageBubble,
  InputContainer,
  StyledInput,
  SendButton,
  LoadingDots,
  EmptyState,
  ErrorMessage,
} from './AIChat.styles';
import { API_BASE_URL } from '../../config';
import authService from '../../utils/auth';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      // Get auth token from authService (sessionStorage)
      const token = authService.getToken();

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: trimmedInput },
          ],
          context: {
            app: 'educationelly',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        backend: data.backend,
        model: data.model,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI Chat error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = e => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  return (
    <>
      <ChatBubbleButton
        onClick={toggleChat}
        $isOpen={isOpen}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
        title="AI Assistant"
      >
        {isOpen ? '×' : '💬'}
      </ChatBubbleButton>

      {isOpen && (
        <ChatWindowContainer role="dialog" aria-label="AI Chat">
          <ChatHeader>
            <h3>🤖 AI Assistant</h3>
            <CloseButton onClick={toggleChat} aria-label="Close chat">
              ×
            </CloseButton>
          </ChatHeader>

          <MessagesContainer>
            {messages.length === 0 ? (
              <EmptyState>
                <h4>Welcome!</h4>
                <p>Ask me anything about teaching</p>
                <p>ELL students or education topics.</p>
              </EmptyState>
            ) : (
              messages.map(message => (
                <MessageBubble
                  key={message.id}
                  $isUser={message.role === 'user'}
                >
                  {message.content}
                </MessageBubble>
              ))
            )}

            {isLoading && (
              <MessageBubble $isUser={false}>
                <LoadingDots>
                  <span />
                  <span />
                  <span />
                </LoadingDots>
              </MessageBubble>
            )}

            <div ref={messagesEndRef} />
          </MessagesContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InputContainer onSubmit={handleSubmit}>
            <StyledInput
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isLoading}
              rows={1}
            />
            <SendButton type="submit" disabled={isLoading || !input.trim()}>
              Send
            </SendButton>
          </InputContainer>
        </ChatWindowContainer>
      )}
    </>
  );
};

export default ChatBubble;
