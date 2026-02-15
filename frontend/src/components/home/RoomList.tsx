import type { Room } from "@shared/types/Room";

export type OnRoomClick = (room: Room) => void;

interface RoomsProps {
  rooms: Room[],
  onRoomClick: OnRoomClick,
  disabled: boolean,
}

function formatRoom(room: Room, onRoomClick: OnRoomClick, disabled: boolean) {
  return <li
    className={disabled ? 'disabled' : ''}
    key={room.id}
    onClick={() => onRoomClick(room)}
  >{room.title}</li>
}

export default function Rooms({rooms, onRoomClick, disabled}: RoomsProps) {
  const roomsFormatted = rooms.map(room => formatRoom(room, onRoomClick, disabled));

  return <ul>{roomsFormatted}</ul>
}