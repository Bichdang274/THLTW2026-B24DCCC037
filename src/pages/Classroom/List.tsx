import { useState } from 'react';
import { Table, Button, Space, Modal, message, Form, Input, Select } from 'antd';
import { useModel, history } from 'umi';
import type { Room } from '@/models/classroom';

const { Option } = Select;

export default function ClassroomList() {
  const { rooms, deleteRoom } = useModel('classroom' as any) as any;
  const [form] = Form.useForm();
  const [filterValues, setFilterValues] = useState<any>({});

  const getFilteredRooms = () => {
    let result = [...rooms];
    if (filterValues.keyword) {
      const kw = filterValues.keyword.toLowerCase();
      result = result.filter((r: Room) => 
        r.id.toLowerCase().includes(kw) || r.name.toLowerCase().includes(kw)
      );
    }
    if (filterValues.type) {
      result = result.filter((r: Room) => r.type === filterValues.type);
    }
    if (filterValues.manager) {
      result = result.filter((r: Room) => r.manager.includes(filterValues.manager));
    }
    return result;
  };

  const handleDelete = (record: Room) => {
    if (record.capacity >= 30) {
      message.error('Lỗi: Chỉ cho phép xóa phòng dưới 30 chỗ ngồi!');
      return;
    }

    Modal.confirm({
      title: 'Cảnh báo xóa',
      content: `Bạn có chắc chắn muốn xóa phòng [${record.name}] không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        deleteRoom(record.id);
        message.success('Đã xóa thành công!');
      },
    });
  };

  const columns = [
    { title: 'Mã phòng', dataIndex: 'id', key: 'id' },
    { title: 'Tên phòng', dataIndex: 'name', key: 'name' },
    { 
      title: 'Số chỗ ngồi', 
      dataIndex: 'capacity', 
      key: 'capacity',
      sorter: (a: Room, b: Room) => a.capacity - b.capacity
    },
    { title: 'Loại phòng', dataIndex: 'type', key: 'type' },
    { title: 'Người phụ trách', dataIndex: 'manager', key: 'manager' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Room) => (
        <Space>
          <Button type="link" onClick={() => history.push(`/classrooms/edit/${record.id}`)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách phòng học</h2>
        <Button type="primary" onClick={() => history.push('/classrooms/add')}>
          Thêm phòng học
        </Button>
      </div>

      <Form 
        form={form} 
        layout="inline" 
        style={{ marginBottom: 24 }}
        onValuesChange={(_, allValues) => setFilterValues(allValues)}
      >
        <Form.Item name="keyword">
          <Input placeholder="Tìm mã hoặc tên phòng..." allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="type">
          <Select placeholder="Lọc loại phòng" allowClear style={{ width: 150 }}>
            <Option value="Lý thuyết">Lý thuyết</Option>
            <Option value="Thực hành">Thực hành</Option>
            <Option value="Hội trường">Hội trường</Option>
          </Select>
        </Form.Item>
        <Form.Item name="manager">
          <Input placeholder="Lọc người phụ trách..." allowClear style={{ width: 200 }} />
        </Form.Item>
      </Form>

      <Table 
        columns={columns} 
        dataSource={getFilteredRooms()} 
        rowKey="id" 
        bordered
      />
    </div>
  );
}