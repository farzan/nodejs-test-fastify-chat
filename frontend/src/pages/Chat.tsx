import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { Message } from "@shared/types/Messages";
import MessageList from "./MessageList";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  // const [incomingMessage, setIncomingMessage] = useState<string>('');

  const [name] = useState<string | null>(() => {
    return location?.state?.name;
  });

  useEffect(() => {
    if (!name) {
      console.log('Username is not available; redirecting to Home');

      navigate('/');
    }
  }, [name, navigate]);

  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    console.log('Name changed to:', name); // Check what name is

    if (!name) {
      return;
    }

    const url = new URL('ws://localhost:5173/ws');
    url.searchParams.set('name', name);
    const ws = new WebSocket(url.href);
    wsRef.current = ws;

    ws.onopen = () => console.log('WS connection opened');
    ws.onmessage = (e) => {
      console.log('Incoming message: ', e.data);
      const messageObj: Message = JSON.parse(e.data);
      console.log(messageObj);
      // messageList.push(messageObj);
      setMessageList(prev => [...prev, messageObj]);
      console.log(messageList);

      // setIncomingMessage(`${messageObj.sender}: ${messageObj.payload.text}`);
    };
    ws.onclose = () => console.log('WS connection closed');
    ws.onerror = (err) => console.error('WS error: ', err);

    return () => {
      ws.close();
    }
  }, [name, messageList]);

  function sendMessage() {
    if (!wsRef.current || !name) {
      return;
    }

    const messageObj: Message = {
      type: "message",
      sender: name,
      payload: {
        text: message,
      }
    };
    const messageJSON = JSON.stringify(messageObj);

    wsRef.current.send(messageJSON);
  }

  return (
    <>
      <h1>Chat</h1>
      <div>
        <div>{name}</div>

        <MessageList messages={messageList} />

        <div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>

        {/* <div>Received: {incomingMessage}</div> */}

        <button
          onClick={sendMessage}
        >Send</button>
      </div>
    </>
  )
}