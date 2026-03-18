import { useState } from 'react';
import { 
  ProTable, 
  ModalForm, 
  ProFormText, 
  ProFormSelect, 
  ProFormDatePicker, 
  ProFormTimePicker,
  ProColumns
} from '@ant-design/pro-components';
import { useModel } from 'umi';
import { Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Staff {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  customer: string;
  staffId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
}

export default function BookingPage() {
  const { bookings, setBookings, staffs, services, addBooking } = useModel('globalData');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Hàm cập nhật trạng thái lịch hẹn
  const updateStatus = (id: string, newStatus: string) => {
    setBookings((prev: Booking[]) => 
      prev.map((b: Booking) => b.id === id ? { ...b, status: newStatus } : b)
    );
    message.success(`Đã chuyển trạng thái thành: ${newStatus}`);
  };

  const columns: ProColumns<Booking>[] = [
    { title: 'Tên khách hàng', dataIndex: 'customer' },
    { 
      title: 'Dịch vụ', 
      dataIndex: 'serviceId',
      render: (_: any, record: Booking) => (services as Service[]).find((s: Service) => s.id === record.serviceId)?.name || 'N/A'
    },
    { 
      title: 'Nhân viên', 
      dataIndex: 'staffId',
      render: (_: any, record: Booking) => (staffs as Staff[]).find((s: Staff) => s.id === record.staffId)?.name || 'N/A'
    },
    { title: 'Ngày hẹn', dataIndex: 'date', valueType: 'date' },
    { title: 'Giờ hẹn', dataIndex: 'time', valueType: 'time' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_: any, record: Booking) => {
        const colorMap: Record<string, string> = {
          'Chờ duyệt': 'warning',
          'Xác nhận': 'processing',
          'Hoàn thành': 'success',
          'Hủy': 'error'
        };
        return <Tag color={colorMap[record.status] || 'default'}>{record.status}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_: any, record: Booking) => {
        // Nút thao tác hiển thị linh hoạt theo trạng thái hiện tại
        if (record.status === 'Chờ duyệt') {
          return [
            <a key="confirm" onClick={() => updateStatus(record.id, 'Xác nhận')}>Xác nhận</a>,
            <a key="cancel" style={{ color: 'red' }} onClick={() => updateStatus(record.id, 'Hủy')}>Hủy</a>,
          ];
        }
        if (record.status === 'Xác nhận') {
          return [
            <a key="done" style={{ color: 'green' }} onClick={() => updateStatus(record.id, 'Hoàn thành')}>Hoàn thành</a>,
            <a key="cancel" style={{ color: 'red' }} onClick={() => updateStatus(record.id, 'Hủy')}>Hủy</a>,
          ];
        }
        return []; // Đã hoàn thành hoặc hủy thì không hiện nút nữa
      },
    },
  ];

  const handleFinishForm = async (values: any) => {
    const formattedData = {
      customer: values.customer,
      staffId: values.staffId,
      serviceId: values.serviceId,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      time: dayjs(values.time).format('HH:mm'),
    };

    // Gọi hàm addBooking bên globalData để kiểm tra các rule
    const result = addBooking(formattedData);

    if (result.success) {
      message.success(result.message);
      setModalVisible(false);
      return true;
    } else {
      // Báo lỗi bằng Toast Message đỏ và KHÔNG đóng modal
      message.error(result.message);
      return false; 
    }
  };

  return (
    <>
      <ProTable<Booking>
        headerTitle="Danh sách Lịch Hẹn"
        dataSource={bookings as Booking[]}
        columns={columns}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setModalVisible(true)}
          >
            Tạo lịch hẹn
          </Button>
        ]}
      />

      <ModalForm
        title="Đặt lịch hẹn mới"
        open={modalVisible}
        onOpenChange={setModalVisible}
        modalProps={{ destroyOnClose: true }}
        onFinish={handleFinishForm}
      >
        <ProFormText 
          name="customer" 
          label="Tên khách hàng" 
          rules={[{ required: true, message: 'Vui lòng nhập tên khách!' }]} 
        />
        <ProFormSelect 
          name="serviceId" 
          label="Chọn dịch vụ" 
          options={(services as Service[]).map(s => ({ label: s.name, value: s.id }))} 
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]} 
        />
        <ProFormSelect 
          name="staffId" 
          label="Chọn nhân viên" 
          options={(staffs as Staff[]).map(s => ({ label: s.name, value: s.id }))} 
          rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]} 
        />
        <ProFormDatePicker 
          name="date" 
          label="Ngày hẹn" 
          fieldProps={{
             disabledDate: (current: any) => current && current < dayjs().startOf('day')
          }}
          rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]} 
        />
        <ProFormTimePicker 
          name="time" 
          label="Giờ hẹn" 
          fieldProps={{ format: 'HH:mm' }} 
          rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]} 
        />
      </ModalForm>
    </>
  );
}