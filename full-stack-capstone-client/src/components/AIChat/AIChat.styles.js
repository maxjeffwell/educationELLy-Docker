import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ChatBubbleButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 1000;
  background-color: ${props => props.theme.blue};
  border: 3px solid ${props => props.theme.orange};
  color: ${props => props.theme.white};
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.orange};
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(40, 115, 180, 0.4);
  }

  ${props =>
    props.$isOpen &&
    `
    background-color: ${props.theme.orange};
  `}
`;

export const ChatWindowContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 380px;
  height: 500px;
  border-radius: 12px;
  z-index: 1000;
  background: ${props => props.theme.white};
  border: 3px solid ${props => props.theme.orange};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 480px) {
    width: calc(100vw - 48px);
    height: calc(100vh - 150px);
    bottom: 100px;
    right: 24px;
  }
`;

export const ChatHeader = styled.div`
  padding: 1rem;
  background: ${props => props.theme.blue};
  border-bottom: 3px solid ${props => props.theme.orange};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: ${props => props.theme.white};
    font-family: 'Roboto', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.white};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #ffffff;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.white};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.blue};
    border-radius: 3px;
  }
`;

export const MessageBubble = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 85%;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;

  ${props =>
    props.$isUser
      ? `
    align-self: flex-end;
    background: ${props.theme.blue};
    color: ${props.theme.white};
    border-bottom-right-radius: 4px;
  `
      : `
    align-self: flex-start;
    background: ${props.theme.green};
    color: #333;
    border-bottom-left-radius: 4px;
  `}
`;

export const InputContainer = styled.form`
  padding: 0.75rem;
  border-top: 2px solid ${props => props.theme.orange};
  background: ${props => props.theme.white};
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

export const StyledInput = styled.textarea`
  flex: 1;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.blue};
  border-radius: 8px;
  resize: none;
  min-height: 40px;
  max-height: 100px;
  background: #ffffff;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.orange};
  }

  &:disabled {
    background: #f0f0f0;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 0.75rem 1rem;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => props.theme.blue};
  color: ${props => props.theme.white};
  border: 2px solid ${props => props.theme.orange};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.orange};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

export const LoadingDots = styled.span`
  display: inline-flex;
  gap: 4px;
  padding: 4px 0;

  span {
    width: 8px;
    height: 8px;
    background: ${props => props.theme.blue};
    border-radius: 50%;
    animation: ${bounce} 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.blue};
  font-family: 'Roboto', sans-serif;
  padding: 2rem 1rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.blue};
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: #666;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 0.5rem;
  font-size: 0.8rem;
  text-align: center;
  background: #ffe6e6;
  border-radius: 4px;
  margin: 0 0.75rem 0.5rem;
`;
