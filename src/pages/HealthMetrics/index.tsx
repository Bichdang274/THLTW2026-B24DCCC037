import  { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Space, Tag, Popconfirm, DatePicker, Card } from 'antd';


const HealthMetrics = () => {
  const [data, setData] = useState([
    { id: 1, date: '2026-05-01', weight: 75, height: 175, hr: 65, sleep: 7.5 }
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getBMIInfo = (weight: number, heightCm: number) => {
    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { value: bmi, color: 'blue', label: 'Thiếu cân' };
    if (bmiNum <= 24.9) return { value: bmi, color: 'green', label: 'Bình thường' };
    if (bmiNum <= 29.9) return { value: bmi, color: 'gold', label: 'Thừa cân' };
    return { value: bmi, color: 'red', label: 'Béo phì' };
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date' },
    { title: 'Cân nặng (kg)', dataIndex: 'weight' },
    { title: 'Chiều cao (cm)', dataIndex: 'height' },
    {
      title: 'BMI', key: 'bmi',
      render: (_: any, record: any) => {
        const bmi = getBMIInfo(record.weight, record.height);
        return <Tag color={bmi.color}>{bmi.value} - {bmi.label}</Tag>;
      }
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'hr' },
    { title: 'Giờ ngủ', dataIndex: 'sleep' },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: any) => (
        <Space>
           <Popconfirm title="Xóa chỉ số này?" onConfirm={() => setData(data.filter(d => d.id !== record.id))}>
             <Button type="link" danger>Xóa</Button>
           </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>Thêm chỉ số</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal title="Thêm chỉ số sức khỏe" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={(vals) => {
          setData([{ ...vals, id: Date.now(), date: vals.date.format('YYYY-MM-DD') }, ...data]);
          setIsModalVisible(false);
          form.resetFields();
        }}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="hr" label="Nhịp tim nghỉ (bpm)"><InputNumber style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="sleep" label="Giờ ngủ (tiếng)"><InputNumber style={{ width: '100%' }}/></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default HealthMetrics;