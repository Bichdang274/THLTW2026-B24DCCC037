import { useState } from 'react';
import { 
  ProTable, 
  ModalForm, 
  ProFormTextArea, 
  ProFormSelect,
  ProFormRate,
  ProColumns
} from '@ant-design/pro-components';
import { Button, Rate, Tag, Row, Col, Card, Statistic, message } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

// Khai báo kiểu dữ liệu khắt khe cho TypeScript
interface Staff {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  customer: string;
  staffId: string;
  serviceId: string;
  status: string;
}

interface Review {
  id: string;
  bookingId: string;
  staffId: string;
  rating: number;
  comment: string;
  reply: string;
}

export default function ReviewPage() {
  const { reviews, setReviews, bookings, staffs } = useModel('globalData');
  const [addVisible, setAddVisible] = useState<boolean>(false);
  
  // 1. Logic tính toán đánh giá trung bình của từng nhân viên
  const getStaffAverage = (staffId: string) => {
    const staffReviews = (reviews as Review[]).filter((r: Review) => r.staffId === staffId);
    if (staffReviews.length === 0) return 0;
    
    const sum = staffReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / staffReviews.length).toFixed(1); // Làm tròn 1 chữ số thập phân
  };

  // 2. Logic thông minh: Chỉ cho phép đánh giá các Lịch hẹn "Hoàn thành" & "Chưa đánh giá"
  const eligibleBookings = (bookings as Booking[]).filter((b: Booking) => {
    const isCompleted = b.status === 'Hoàn thành';
    const isNotReviewed = !(reviews as Review[]).some((r: Review) => r.bookingId === b.id);
    return isCompleted && isNotReviewed;
  });

  // Xử lý khi khách gửi đánh giá
  const handleAddReview = async (values: any) => {
    const relatedBooking = (bookings as Booking[]).find((b: Booking) => b.id === values.bookingId);
    if (!relatedBooking) {
      message.error('Lịch hẹn không hợp lệ!');
      return false;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      bookingId: values.bookingId,
      staffId: relatedBooking.staffId, // Tự động map nhân viên từ lịch hẹn sang đánh giá
      rating: values.rating,
      comment: values.comment,
      reply: '',
    };

    setReviews((prev: Review[]) => [...prev, newReview]);
    message.success('Cảm ơn bạn đã gửi đánh giá!');
    setAddVisible(false);
    return true;
  };

  // Xử lý khi nhân viên/cơ sở trả lời đánh giá
  const handleReply = async (reviewId: string, replyContent: string) => {
    setReviews((prev: Review[]) => 
      prev.map((r: Review) => r.id === reviewId ? { ...r, reply: replyContent } : r)
    );
    message.success('Đã gửi phản hồi thành công!');
    return true;
  };

  const columns: ProColumns<Review>[] = [
    { 
      title: 'Khách hàng', 
      dataIndex: 'bookingId',
      render: (_: any, record: Review) => {
        const booking = (bookings as Booking[]).find((b: Booking) => b.id === record.bookingId);
        return booking?.customer || 'Khách ẩn danh';
      }
    },
    { 
      title: 'Nhân viên phục vụ', 
      dataIndex: 'staffId',
      render: (_: any, record: Review) => (staffs as Staff[]).find((s: Staff) => s.id === record.staffId)?.name || 'N/A'
    },
    { 
      title: 'Đánh giá', 
      dataIndex: 'rating',
      render: (_: any, record: Review) => <Rate disabled defaultValue={record.rating} />
    },
    { title: 'Nhận xét', dataIndex: 'comment' },
    { 
      title: 'Phản hồi từ cơ sở', 
      dataIndex: 'reply',
      render: (_: any, record: Review) => record.reply ? <Tag color="blue">{record.reply}</Tag> : <Tag>Chưa phản hồi</Tag>
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_: any, record: Review) => [
        <ModalForm
          key="reply"
          title="Phản hồi đánh giá của khách hàng"
          trigger={<Button type="link" icon={<MessageOutlined />}>Phản hồi</Button>}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values: any) => handleReply(record.id, values.reply)}
        >
          <ProFormTextArea 
            name="reply" 
            label="Nội dung phản hồi" 
            initialValue={record.reply}
            rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]} 
          />
        </ModalForm>
      ],
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* KHU VỰC THỐNG KÊ ĐÁNH GIÁ TRUNG BÌNH */}
      <h3 style={{ marginBottom: 16 }}>Thống kê đánh giá nhân viên</h3>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {(staffs as Staff[]).map((staff: Staff) => (
          <Col span={6} key={staff.id}>
            <Card hoverable bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
              <Statistic 
                title={staff.name} 
                value={getStaffAverage(staff.id)} 
                suffix="/ 5 ⭐️" 
                valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* BẢNG QUẢN LÝ ĐÁNH GIÁ */}
      <ProTable<Review>
        headerTitle="Danh sách Đánh giá"
        dataSource={reviews as Review[]}
        columns={columns}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setAddVisible(true)}
          >
            Mô phỏng Khách Đánh giá
          </Button>
        ]}
      />

      {/* MODAL MÔ PHỎNG KHÁCH HÀNG ĐÁNH GIÁ */}
      <ModalForm
        title="Form Khách hàng gửi đánh giá"
        open={addVisible}
        onOpenChange={setAddVisible}
        modalProps={{ destroyOnClose: true }}
        onFinish={handleAddReview}
      >
        <ProFormSelect 
          name="bookingId" 
          label="Chọn lịch hẹn đã hoàn thành" 
          options={eligibleBookings.map((b: Booking) => ({ 
            label: `Khách: ${b.customer} (Mã lịch: ${b.id})`, 
            value: b.id 
          }))} 
          rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn!' }]} 
          extra={eligibleBookings.length === 0 ? "Chưa có lịch hẹn nào hoàn thành để đánh giá." : "Chỉ hiển thị các lịch hẹn đã Hoàn thành và chưa đánh giá."}
        />
        <ProFormRate 
          name="rating" 
          label="Chấm điểm (Sao)" 
          rules={[{ required: true, message: 'Vui lòng chấm điểm!' }]} 
        />
        <ProFormTextArea 
          name="comment" 
          label="Nhận xét của bạn" 
          rules={[{ required: true, message: 'Vui lòng để lại nhận xét!' }]} 
        />
      </ModalForm>
    </div>
  );
}