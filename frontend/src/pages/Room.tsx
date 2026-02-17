import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { TextMessage, RoomInfo } from "@shared/types/Messages";
import { MessageSchema } from "@shared/types/MessageSchemas";
import MessageList from "@/components/MessageList";
import type { Room } from "@shared/types/Room";

export default function Chat() {
  const navigate = useNavigate();

  const params = useParams<{roomId: string}>();
  const roomId = Number(params.roomId);
  const [room, setRoom] = useState<Room | null>();
  const [searchParams] = useSearchParams();


  const [outgoingMessage, setOutgoingMessage] = useState<string>('');
  const [messageList, setMessageList] = useState<TextMessage[]>([]);

  const name = searchParams.get('username');

  useEffect(() => {
    if (!name) {
      console.log('Username is not available; redirecting to Home');

      navigate('/');
    }
    if (!roomId) {
      console.log('Invalid room Id; redirecting to Home');

      navigate('/');
    }
  }, [name, navigate]);

  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    console.log('Name changed to:', name); // Check what name is

    if (!name || !roomId) {
      return;
    }

    const url = new URL(`ws://localhost:5173/ws/room/${roomId}`);
    url.searchParams.set('name', name);
    const ws = new WebSocket(url.href);
    wsRef.current = ws;

    ws.onopen = () => console.log('WS connection opened');
    ws.onmessage = (e) => {
      console.log('Incoming message: ', e.data);

      // const messageJSON = JSON.parse(e.data);
      const message = MessageSchema.parse(JSON.parse(e.data));
      console.log('message object:', message);

      switch (message.type) {
        case 'message':
          setMessageList(prev => [...prev, message as TextMessage]);
          console.log(messageList);
          break;
        case 'room_info':
          const roomInfo: RoomInfo = message;
          setRoom(roomInfo.payload.room);
          break;
        case 'error':
          console.log(`Error: ${message.payload.error}`);

          break;
        default:
          console.log('Error: Unknown message');
      }
    };
    ws.onclose = () => console.log('WS connection closed');
    ws.onerror = (err) => console.error('WS error: ', err);

    return () => {
      ws.close();
    }
  }, [name, roomId]);

  function sendMessage() {
    if (!wsRef.current || !name) {
      return;
    }

    const messageObj: TextMessage = {
      type: "message",
      sender: name,
      roomId: roomId,
      payload: {
        text: outgoingMessage,
      }
    };
    const messageJSON = JSON.stringify(messageObj);

    wsRef.current.send(messageJSON);
  }

  function handleBack() {
    navigate('/')
  }

  return (
    <>
      <div onClick={handleBack}>&lt; Back</div>

      <h1>{room?.title}</h1>

      <div>
        <div>{name}</div>

        <MessageList messages={messageList} />

        <div>
          <textarea
            value={outgoingMessage}
            onChange={e => setOutgoingMessage(e.target.value)}
          />
        </div>

        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  )
}