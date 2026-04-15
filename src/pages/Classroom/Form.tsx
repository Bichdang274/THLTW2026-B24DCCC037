import { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Card } from 'antd';
import { useModel, history, useParams } from 'umi';
import type { Room } from '@/models/classroom';

const { Option } = Select;
const MANAGERS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Văn D'];

export default function ClassroomForm() {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const { rooms, addRoom, editRoom } = useModel('classroom' as any) as any;
  
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const currentRoom = rooms.find((r: Room) => r.id === id);
      if (currentRoom) {
        form.setFieldsValue(currentRoom);
      } else {
        message.error('Không tìm thấy dữ liệu phòng học này!');
        history.push('/classrooms');
      }
    }
  }, [id, rooms, form, isEditMode]);

  const onFinish = (values: Room) => {
    if (isEditMode) {
      editRoom(id, values);
      message.success('Cập nhật thông tin thành công!');
    } else {
      addRoom(values);
      message.success('Thêm phòng học mới thành công!');
    }
    history.push('/classrooms');
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card title={isEditMode ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'} style={{ width: 600 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          
          <Form.Item
            name="id"
            label="Mã phòng"
            rules={[
              { required: true, message: 'Vui lòng không để trống mã phòng!' },
              { max: 10, message: 'Mã phòng tối đa 10 ký tự!' },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  const isExist = rooms.some((r: Room) => r.id === value);
                  if (!isEditMode && isExist) {
                    return Promise.reject(new Error('Mã phòng này đã tồn tại trong hệ thống!'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input disabled={isEditMode} placeholder="Ví dụ: P101" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[
              { required: true, message: 'Vui lòng không để trống tên phòng!' },
              { max: 50, message: 'Tên phòng tối đa 50 ký tự!' },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  const oldName = isEditMode ? rooms.find((r: Room) => r.id === id)?.name : '';
                  const isExist = rooms.some((r: Room) => 
                    r.name.toLowerCase() === value.toLowerCase() && value !== oldName
                  );
                  if (isExist) {
                    return Promise.reject(new Error('Tên phòng này đã tồn tại trong hệ thống!'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Ví dụ: Phòng Lý thuyết 1" />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Số chỗ ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập số chỗ ngồi!' },
              { type: 'number', min: 10, max: 200, message: 'Số chỗ ngồi phải từ 10 đến 200!' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng (10 - 200)" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
          >
            <Select placeholder="-- Chọn loại phòng --">
              <Option value="Lý thuyết">Lý thuyết</Option>
              <Option value="Thực hành">Thực hành</Option>
              <Option value="Hội trường">Hội trường</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="manager"
            label="Người phụ trách"
            rules={[{ required: true, message: 'Vui lòng chọn người phụ trách!' }]}
          >
            <Select placeholder="-- Chọn giảng viên --">
              {MANAGERS.map(manager => (
                <Option key={manager} value={manager}>{manager}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 32, textAlign: 'right' }}>
            <Button onClick={() => history.push('/classrooms')} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
}