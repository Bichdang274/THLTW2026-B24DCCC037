import { useState } from 'react';
import { Tag, Card, Progress, Drawer, Button, Form, Input, Select, DatePicker, Segmented, Popconfirm, List, InputNumber, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const initialGoals = [
  { id: 1, name: 'Giảm mỡ bụng', type: 'Giảm cân', target: 70, current: 73, unit: 'kg', deadline: '2026-08-01', status: 'Đang thực hiện' }
];

const Goals = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [filter, setFilter] = useState('Tất cả');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredGoals = filter === 'Tất cả' ? goals : goals.filter(g => g.status === filter);

  const updateCurrent = (id: number, val: number | null) => {
    if (val === null) return;
    setGoals(goals.map(g => g.id === id ? { ...g, current: val } : g));
  };

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Segmented options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']} value={filter} onChange={setFilter as any} />
        </Col>
        <Col><Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>Thêm Mục Tiêu</Button></Col>
      </Row>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={filteredGoals}
        renderItem={item => {
          const percent = Math.min(100, Math.max(0, item.type === 'Giảm cân' 
            ? ((item.current - item.target) / (75 - item.target)) * 100 // Giả lập base weight
            : (item.current / item.target) * 100));

          return (
            <List.Item>
              <Card title={item.name} extra={<Tag>{item.type}</Tag>} actions={[
                <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => setGoals(goals.filter(g => g.id !== item.id))}>
                  <DeleteOutlined key="delete" style={{ color: 'red' }} />
                </Popconfirm>
              ]}>
                <p>Deadline: <strong>{item.deadline}</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span>Hiện tại:</span>
                  <InputNumber value={item.current} onChange={(v) => updateCurrent(item.id, v)} size="small" /> 
                  <span>/ {item.target} {item.unit}</span>
                </div>
                <Progress percent={Math.round(percent)} status={item.status === 'Đã đạt' ? 'success' : 'active'} />
              </Card>
            </List.Item>
          );
        }}
      />

      <Drawer title="Thêm mục tiêu mới" width={400} onClose={() => setVisible(false)} visible={visible} extra={<Button type="primary" onClick={() => form.submit()}>Lưu</Button>}>
        <Form form={form} layout="vertical" onFinish={(vals) => {
          setGoals([...goals, { ...vals, id: Date.now(), deadline: vals.deadline.format('YYYY-MM-DD'), status: 'Đang thực hiện' }]);
          setVisible(false); form.resetFields();
        }}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="Loại"><Select><Select.Option value="Giảm cân">Giảm cân</Select.Option><Select.Option value="Tăng cơ">Tăng cơ</Select.Option></Select></Form.Item>
          <Form.Item name="target" label="Giá trị mục tiêu"><InputNumber style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="current" label="Giá trị hiện tại"><InputNumber style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="unit" label="Đơn vị (VD: kg, km)"><Input /></Form.Item>
          <Form.Item name="deadline" label="Deadline"><DatePicker style={{ width: '100%' }}/></Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Goals;