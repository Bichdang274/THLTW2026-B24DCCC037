import  { useState } from 'react';
import {Card, Table, Button, Space, Modal, Form, Input, Select, DatePicker, Popconfirm, Tag, InputNumber } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const initialData = [
  { id: 1, date: '2026-05-01', type: 'Cardio', duration: 45, cal: 350, notes: 'Chạy nhẹ nhàng', status: 'Hoàn thành' },
  { id: 2, date: '2026-05-05', type: 'Yoga', duration: 60, cal: 200, notes: 'Giãn cơ', status: 'Hoàn thành' },
];

const WorkoutLog = () => {
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleFinish = (values: any) => {
    const newRecord = { ...values, id: Date.now(), date: values.date.format('YYYY-MM-DD') };
    setData([...data, newRecord]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Loại bài tập', dataIndex: 'type', key: 'type' },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration' },
    { title: 'Calo đốt', dataIndex: 'cal', key: 'cal' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Hoàn thành' ? 'green' : 'red'}>{s}</Tag> },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => { form.setFieldsValue({ ...record, date: moment(record.date) }); setIsModalVisible(true); }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Tìm theo tên" allowClear />
        <Select placeholder="Loại bài tập" style={{ width: 120 }} allowClear>
          <Select.Option value="Cardio">Cardio</Select.Option>
          <Select.Option value="Strength">Strength</Select.Option>
          <Select.Option value="Yoga">Yoga</Select.Option>
          <Select.Option value="HIIT">HIIT</Select.Option>
        </Select>
        <RangePicker />
        <Button type="primary" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>Thêm buổi tập</Button>
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal title="Buổi tập" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
            <Select><Select.Option value="Cardio">Cardio</Select.Option><Select.Option value="Strength">Strength</Select.Option><Select.Option value="Yoga">Yoga</Select.Option></Select>
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="cal" label="Calo đốt"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái"><Select><Select.Option value="Hoàn thành">Hoàn thành</Select.Option><Select.Option value="Bỏ lỡ">Bỏ lỡ</Select.Option></Select></Form.Item>
          <Form.Item name="notes" label="Ghi chú"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default WorkoutLog;