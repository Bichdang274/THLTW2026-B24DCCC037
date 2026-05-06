import React from 'react';
import { connect } from 'umi';
import { Card, Col, Row, Statistic } from 'antd';
import moment from 'moment';
import { Task } from '@/models/tasks';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Hoàn thành').length;
  const overdueTasks = tasks.filter(
    (task) => task.status !== 'Hoàn thành' && moment(task.deadline).isBefore(moment(), 'day')
  ).length;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số Task" value={totalTasks} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đã hoàn thành" value={completedTasks} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Quá hạn" value={overdueTasks} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ tasks }: { tasks: { list: Task[] } }) => ({
  tasks: tasks.list,
}))(Dashboard);