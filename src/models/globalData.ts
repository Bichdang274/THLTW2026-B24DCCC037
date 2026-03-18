import { useState } from 'react';
import dayjs from 'dayjs';

export default function useGlobalData() {
  const [staffs, setStaffs] = useState<any[]>([
    { 
      id: '1', 
      name: 'Nguyễn Văn A', 
      maxCustomers: 5, 
      workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
      startTime: '09:00',
      endTime: '17:00'
    },
  ]);

  const [services, setServices] = useState<any[]>([
    { id: '1', name: 'Cắt tóc nam', price: 100000, duration: 30 },
    { id: '2', name: 'Gội đầu thảo dược', price: 150000, duration: 45 },
  ]);

  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // LOGIC ĐẶT LỊCH THÔNG MINH
  const addBooking = (newBooking: any) => {
    const staff = staffs.find(s => s.id === newBooking.staffId);
    if (!staff) return { success: false, message: 'Không tìm thấy nhân viên!' };

    // 1. Kiểm tra ngày làm việc trong tuần
    const dayOfWeekMap = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const bookingDayName = dayOfWeekMap[dayjs(newBooking.date).day()];
    if (!staff.workDays.includes(bookingDayName)) {
      return { success: false, message: `Nhân viên ${staff.name} không có lịch làm việc vào ${bookingDayName}!` };
    }

    // 2. Kiểm tra khung giờ làm việc
    if (newBooking.time < staff.startTime || newBooking.time > staff.endTime) {
      return { success: false, message: `Nhân viên ${staff.name} chỉ làm việc từ ${staff.startTime} đến ${staff.endTime}!` };
    }

    // Lọc ra các lịch hẹn của nhân viên này trong cùng ngày (bỏ qua các lịch đã Hủy)
    const staffBookingsToday = bookings.filter(
      b => b.staffId === staff.id && b.date === newBooking.date && b.status !== 'Hủy'
    );

    // 3. Kiểm tra giới hạn khách / ngày
    if (staffBookingsToday.length >= staff.maxCustomers) {
      return { success: false, message: `Nhân viên này đã đạt giới hạn tối đa ${staff.maxCustomers} khách vào ngày ${newBooking.date}!` };
    }

    // 4. Kiểm tra trùng giờ (chặn nếu đã có người đặt đúng giờ đó)
    const isConflict = staffBookingsToday.some(b => b.time === newBooking.time);
    if (isConflict) {
      return { success: false, message: 'Khung giờ này nhân viên đã có lịch hẹn, vui lòng chọn giờ khác!' };
    }

    // Vượt qua mọi bài test -> Lưu lịch hẹn
    const bookingRecord = {
      ...newBooking,
      id: Date.now().toString(),
      status: 'Chờ duyệt', // Trạng thái mặc định ban đầu
    };
    
    setBookings([...bookings, bookingRecord]);
    return { success: true, message: 'Tạo lịch hẹn thành công!' };
  };

  return {
    staffs, setStaffs,
    services, setServices,
    bookings, setBookings, addBooking,
    reviews, setReviews
  };
}