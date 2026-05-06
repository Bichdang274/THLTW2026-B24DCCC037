import { useState } from 'react';
import { Card, List, Tag, Input, Select, Space, Modal, Typography } from 'antd';

const initialExercises = [
  { id: 1, name: 'Push Up', muscle: 'Chest', difficulty: 'Dễ', cal: 300, desc: 'Bài tập hít đất cơ bản', detail: '1. Nằm sấp... 2. Đẩy người lên...' },
  { id: 2, name: 'Squat', muscle: 'Legs', difficulty: 'Trung bình', cal: 400, desc: 'Tập đùi và mông', detail: '1. Đứng rộng bằng vai... 2. Hạ thấp hông...' },
  { id: 3, name: 'Plank', muscle: 'Core', difficulty: 'Dễ', cal: 200, desc: 'Bài tập tĩnh phần lõi', detail: '1. Chống khủy tay... 2. Giữ thẳng lưng...' }
];

const ExerciseLibrary = () => {
  const [exercises] = useState(initialExercises);
  const [search, setSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState<any>(null);

  const filtered = exercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const getDiffColor = (diff: string) => diff === 'Dễ' ? 'green' : diff === 'Trung bình' ? 'orange' : 'red';

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <Input.Search placeholder="Tìm bài tập" onChange={(e) => setSearch(e.target.value)} allowClear />
        <Select placeholder="Nhóm cơ" style={{ width: 150 }} allowClear>
          <Select.Option value="Chest">Chest</Select.Option>
          <Select.Option value="Legs">Legs</Select.Option>
          <Select.Option value="Core">Core</Select.Option>
        </Select>
      </Space>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={filtered}
        renderItem={item => (
          <List.Item>
            <Card hoverable onClick={() => setSelectedEx(item)}>
              <Card.Meta 
                title={<Space>{item.name} <Tag color={getDiffColor(item.difficulty)}>{item.difficulty}</Tag></Space>}
                description={
                  <>
                    <p style={{ margin: '8px 0' }}>{item.desc}</p>
                    <Tag color="blue">{item.muscle}</Tag>
                    <Tag>{item.cal} kcal/h</Tag>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal title={selectedEx?.name} visible={!!selectedEx} onCancel={() => setSelectedEx(null)} footer={null}>
        <Typography.Paragraph><strong>Nhóm cơ:</strong> {selectedEx?.muscle}</Typography.Paragraph>
        <Typography.Paragraph><strong>Mức độ:</strong> <Tag color={selectedEx ? getDiffColor(selectedEx.difficulty) : ''}>{selectedEx?.difficulty}</Tag></Typography.Paragraph>
        <Typography.Paragraph><strong>Lượng calo trung bình:</strong> {selectedEx?.cal} kcal/h</Typography.Paragraph>
        <Typography.Title level={5}>Hướng dẫn thực hiện</Typography.Title>
        <Typography.Paragraph>{selectedEx?.detail}</Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;