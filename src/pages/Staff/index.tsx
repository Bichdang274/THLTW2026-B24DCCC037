import { useState } from 'react';
import { 
  ProTable, 
  ProColumns, 
  ModalForm, 
  ProFormText, 
  ProFormDigit, 
  ProFormSelect,
  ProFormTimePicker
} from '@ant-design/pro-components';
import { Button, Popconfirm, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import dayjs from 'dayjs';

interface Staff {
  id: string;
  name: string;
  maxCustomers: number;
  workDays: string[];
  startTime: string;
  endTime: string;
}

export default function StaffPage() {
  const { staffs, setStaffs } = useModel('globalData');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Staff | undefined>(undefined);

  const handleDelete = (id: string) => {
    setStaffs((prev: Staff[]) => prev.filter(item => item.id !== id));
    message.success('Đã xóa nhân viên!');
  };

  const handleFinish = async (values: any) => {
    // Ép kiểu tường minh để tránh lỗi strict mode
    const newStartTime = dayjs(values.startTime).format('HH:mm');
    const newEndTime = dayjs(values.endTime).format('HH:mm');

    if (currentRow) {
      setStaffs((prev: Staff[]) => 
        prev.map(item => item.id === currentRow.id ? { 
          ...item, 
          ...values,
          startTime: newStartTime,
          endTime: newEndTime
        } as Staff : item)
      );
      message.success('Cập nhật thành công!');
    } else {
      const newStaff: Staff = {
        id: Date.now().toString(),
        name: values.name,
        maxCustomers: values.maxCustomers,
        workDays: values.workDays,
        startTime: newStartTime,
        endTime: newEndTime,
      };
      setStaffs((prev: Staff[]) => [...prev, newStaff]);
      message.success('Thêm nhân viên thành công!');
    }
    setModalVisible(false);
    return true;
  };

  const columns: ProColumns<Staff>[] = [
    { title: 'Tên nhân viên', dataIndex: 'name' },
    { title: 'Giới hạn khách/ngày', dataIndex: 'maxCustomers', valueType: 'digit' },
    { 
      title: 'Ngày làm việc', 
      dataIndex: 'workDays',
      render: (_, record: Staff) => (
        <Space size={[0, 4]} wrap>
          {record.workDays.map(day => <Tag color="blue" key={day}>{day}</Tag>)}
        </Space>
      )
    },
    { 
      title: 'Khung giờ', 
      render: (_, record: Staff) => `${record.startTime} - ${record.endTime}` 
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record: Staff) => [
        <Button 
          key="edit" 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          Sửa
        </Button>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Staff>
        headerTitle="Danh sách Nhân viên"
        dataSource={staffs as Staff[]}
        columns={columns}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button 
            key="button" 
            icon={<PlusOutlined />} 
            type="primary" 
            onClick={() => {
              setCurrentRow(undefined);
              setModalVisible(true);
            }}
          >
            Thêm nhân viên
          </Button>
        ]}
      />

      <ModalForm
        title={currentRow ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow ? {
          ...currentRow,
          startTime: dayjs(currentRow.startTime, 'HH:mm'),
          endTime: dayjs(currentRow.endTime, 'HH:mm'),
        } : {}}
        modalProps={{ destroyOnClose: true }}
        onFinish={handleFinish}
      >
        <ProFormText 
          name="name" 
          label="Tên nhân viên" 
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]} 
        />
        <ProFormDigit 
          name="maxCustomers" 
          label="Giới hạn khách/ngày" 
          min={1} 
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]} 
        />
        <ProFormSelect
          name="workDays"
          label="Ngày làm việc trong tuần"
          mode="multiple"
          options={['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(d => ({ label: d, value: d }))}
          rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc!' }]}
        />
        <ProFormTimePicker.RangePicker
          name={['startTime', 'endTime']}
          label="Khung giờ làm việc"
          fieldProps={{ format: 'HH:mm' }}
          rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
        />
      </ModalForm>
    </>
  );
}