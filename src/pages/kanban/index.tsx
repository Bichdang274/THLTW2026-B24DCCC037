import React from 'react';
import { connect, Dispatch } from 'umi';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Typography, Tag } from 'antd';
import moment from 'moment';
import { Task } from '@/models/tasks';

const { Title, Text } = Typography;

interface KanbanBoardProps {
  tasks: Task[];
  dispatch: Dispatch;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, dispatch }) => {
  const columns: Record<string, Task[]> = {
    'Cần làm': tasks.filter((t) => t.status === 'Cần làm'),
    'Đang làm': tasks.filter((t) => t.status === 'Đang làm'),
    'Hoàn thành': tasks.filter((t) => t.status === 'Hoàn thành'),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cao': return 'red';
      case 'Trung bình': return 'orange';
      case 'Thấp': return 'green';
      default: return 'blue';
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === draggableId) {
          return { ...task, status: destination.droppableId as Task['status'] };
        }
        return task;
      });
      dispatch({ type: 'tasks/saveTasks', payload: updatedTasks });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '24px', padding: '24px', minHeight: '80vh' }}>
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: '#f0f2f5',
                  padding: '16px',
                  width: '33.33%',
                  borderRadius: '8px',
                }}
              >
                <Title level={4} style={{ marginBottom: 16 }}>{columnId} ({columnTasks.length})</Title>
                {columnTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          marginBottom: '12px',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Card size="small" hoverable>
                          <Text strong>{task.name}</Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                            <Text type="secondary" style={{ fontSize: '12px', float: 'right' }}>
                              {moment(task.deadline).format('DD/MM/YYYY')}
                            </Text>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default connect(({ tasks }: { tasks: { list: Task[] } }) => ({
  tasks: tasks.list,
}))(KanbanBoard);