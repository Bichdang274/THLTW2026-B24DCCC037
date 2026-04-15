import { useState } from 'react';

// Khai báo kiểu dữ liệu chuẩn, tránh lỗi "implicitly has an 'any' type"
export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  manager: string;
}

export default function useClassroomModel() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'P01', name: 'Phòng 101', capacity: 40, type: 'Lý thuyết', manager: 'Nguyễn Văn A' },
    { id: 'P02', name: 'Phòng Lab 1', capacity: 25, type: 'Thực hành', manager: 'Trần Thị B' },
  ]);

  const addRoom = (room: Room) => {
    setRooms([...rooms, room]);
  };

  const editRoom = (id: string, updatedRoom: Room) => {
    setRooms(rooms.map((r: Room) => (r.id === id ? updatedRoom : r)));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter((r: Room) => r.id !== id));
  };

  return {
    rooms,
    addRoom,
    editRoom,
    deleteRoom,
  };
}