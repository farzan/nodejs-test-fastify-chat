import type { Message } from "@shared/types/Messages";

function formatMessage(message: Message, key: number) {
  return <li key={key}>
    {message.sender}: {message.payload.text}
  </li>;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({messages}: MessageListProps) {
  let key = 0;
  const messageFormatted = messages.map((message: Message) => formatMessage(message, key++))
  return <ul>
    {messageFormatted}
  </ul>;
}