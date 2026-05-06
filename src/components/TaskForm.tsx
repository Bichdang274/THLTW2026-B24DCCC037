import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import { Task } from '@/models/tasks';

const { Option } = Select;
const { TextArea } = Input;

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Task>) => void;
  initialValues?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...initialValues,
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        status: initialValues?.status || 'Cần làm',
      });
    });
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên Task"
          rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
        >
          <Select>
            <Option value="Cao">Cao</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Thấp">Thấp</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tags" label="Tag">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm tag" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;