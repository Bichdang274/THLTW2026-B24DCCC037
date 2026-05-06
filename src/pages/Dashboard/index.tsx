
import { Card, Col, Row, Statistic, Timeline } from 'antd';
import { Column, Line } from '@ant-design/charts';

const Dashboard = () => {
  const workoutData = [
    { week: 'Tuần 1', workouts: 3 }, { week: 'Tuần 2', workouts: 5 },
    { week: 'Tuần 3', workouts: 4 }, { week: 'Tuần 4', workouts: 6 },
  ];
  const weightData = [
    { date: '01/05', weight: 75 }, { date: '10/05', weight: 74.5 },
    { date: '20/05', weight: 74 }, { date: '30/05', weight: 73.2 },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="Tổng buổi tập (Tháng)" value={18} suffix="buổi" /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng calo đã đốt" value={4500} suffix="kcal" /></Card></Col>
        <Col span={6}><Card><Statistic title="Chuỗi ngày tập (Streak)" value={5} suffix="ngày" /></Card></Col>
        <Col span={6}><Card><Statistic title="Mục tiêu hoàn thành" value={80} suffix="%" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Số buổi tập theo tuần" style={{ marginBottom: 16 }}>
            <Column data={workoutData} xField="week" yField="workouts" height={250} />
          </Card>
          <Card title="Thay đổi cân nặng theo thời gian">
            <Line data={weightData} xField="date" yField="weight" height={250} smooth />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="5 buổi tập gần nhất">
            <Timeline>
              <Timeline.Item color="green">Yoga - 60 phút (Hôm nay)</Timeline.Item>
              <Timeline.Item color="blue">Chạy bộ - 45 phút (Hôm qua)</Timeline.Item>
              <Timeline.Item color="red">HIIT - 30 phút (3 ngày trước)</Timeline.Item>
              <Timeline.Item>Strength - 45 phút (4 ngày trước)</Timeline.Item>
              <Timeline.Item>Đạp xe - 60 phút (6 ngày trước)</Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;