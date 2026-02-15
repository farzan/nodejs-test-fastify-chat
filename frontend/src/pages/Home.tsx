import type { Room } from '@shared/types/Room';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rooms from '@/components/home/RoomList.js';
import type { OnRoomClick } from '@/components/home/RoomList.js';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [isEnterDisabled, setIsEnterDisabled] = useState<boolean>(true);
  const [newRoomTitle, setNewRoomTitle] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [createRoomError, setCreateRoomError] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const username = e.target.value;
    setUsername(username);
    setIsEnterDisabled(username.length === 0);
  }

  async function updateRoomList() {
    try {
      const res = await fetch('/api/rooms');
      const rooms: Room[] = await res.json();
      console.log(rooms);
      setRooms(rooms);
    } catch (er) {
      console.error('Could not fetch room list:', er);
    }
  }

  useEffect(() => {
    updateRoomList();
  }, []);

  const handleRoomClick: OnRoomClick = (room: Room) => {
    if (isEnterDisabled) {
      alert('Enter your name first')
      return;
    }

    console.log('name is:', username);
    const url = `/room/${room.id}?username=${encodeURIComponent(username)}`;

    navigate(url);
  }

  async function handleNewRoomSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('/api/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newRoomTitle,
      }),
    });

    if (!res.ok) {
      console.log('error creating room');

      setCreateRoomError('Error creating room!');
    } else {
      setCreateRoomError(null);
      await updateRoomList();
    }
  }

  return (
    <>
      <h1>Home</h1>

      <label>
        Your name:
        <input
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="You Name"
        />
      </label>

      <hr/>

      <div>
        <form onSubmit={handleNewRoomSubmit}>
          Create new room:
          <input onChange={e => setNewRoomTitle(e.target.value)} />
          <button
            type='submit'
          >Create room</button>
          <div style={createRoomError ? {} : { display: 'none' }}>{createRoomError ?? ''}</div>
        </form>
      </div>
      <Rooms
        rooms={rooms}
        disabled={isEnterDisabled}
        onRoomClick={handleRoomClick}
      />
    </>
  );
}