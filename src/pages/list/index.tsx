import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Table, Button, Space, Tag, Input, Select, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import TaskForm from '@/components/TaskForm';
import { Task } from '@/models/tasks';

const { Option } = Select;

interface TaskListProps {
  tasks: Task[];
  dispatch: Dispatch;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, dispatch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Task) => {
    setEditingTask(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'tasks/deleteTask', payload: id });
  };

  const handleSubmit = (values: Partial<Task>) => {
    if (editingTask) {
      dispatch({ type: 'tasks/updateTask', payload: values });
    } else {
      dispatch({ type: 'tasks/addTask', payload: values });
    }
    setIsModalVisible(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchName = task.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter ? task.status === statusFilter : true;
    return matchName && matchStatus;
  });

  const columns: ColumnsType<Task> = [
    {
      title: 'Tên Task',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Hoàn thành' ? 'green' : status === 'Đang làm' ? 'blue' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priority === 'Cao' ? 'red' : priority === 'Trung bình' ? 'orange' : 'green'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => moment(a.deadline as string).unix() - moment(b.deadline as string).unix(),
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags && tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Sửa</a>
          <Popconfirm title="Xóa task này?" onConfirm={() => handleDelete(record.id)}>
            <a style={{ color: 'red' }}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm Task mới
        </Button>
        <Input.Search
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="Cần làm">Cần làm</Option>
          <Option value="Đang làm">Đang làm</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={filteredTasks} rowKey="id" />
      <TaskForm
        visible={isModalVisible}
        initialValues={editingTask}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(({ tasks }: { tasks: { list: Task[] } }) => ({
  tasks: tasks.list,
}))(TaskList);