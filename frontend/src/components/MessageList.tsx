import type { TextMessage } from "@shared/types/Messages";

function formatMessage(message: TextMessage, key: number) {
  return <li key={key}>
    {message.sender}: {message.payload.text}
  </li>;
}

interface MessageListProps {
  messages: TextMessage[];
}

export default function MessageList({messages}: MessageListProps) {
  let key = 0;
  const messageFormatted = messages.map((message: TextMessage) => formatMessage(message, key++))
  return <ul>
    {messageFormatted}
  </ul>;
}