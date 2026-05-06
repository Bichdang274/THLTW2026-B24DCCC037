import { Effect, Reducer } from 'umi';

export interface Task {
  id: string;
  name: string;
  description?: string;
  deadline: string | null;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  status: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
  tags?: string[];
}

export interface TasksModelState {
  list: Task[];
}

export interface TasksModelType {
  namespace: 'tasks';
  state: TasksModelState;
  reducers: {
    saveTasks: Reducer<TasksModelState>;
  };
  effects: {
    addTask: Effect;
    updateTask: Effect;
    deleteTask: Effect;
  };
}

const TasksModel: TasksModelType = {
  namespace: 'tasks',
  state: {
    list: JSON.parse(localStorage.getItem('kanban_tasks') || '[]'),
  },
  reducers: {
    saveTasks(state, { payload }) {
      localStorage.setItem('kanban_tasks', JSON.stringify(payload));
      return { ...state, list: payload } as TasksModelState;
    },
  },
  effects: {
    *addTask({ payload }, { put, select }) {
      const { list } = yield select((state: any) => state.tasks);
      const newTask: Task = { ...payload, id: Date.now().toString() };
      yield put({ type: 'saveTasks', payload: [...list, newTask] });
    },
    *updateTask({ payload }, { put, select }) {
      const { list } = yield select((state: any) => state.tasks);
      const updatedList = list.map((task: Task) => (task.id === payload.id ? payload : task));
      yield put({ type: 'saveTasks', payload: updatedList });
    },
    *deleteTask({ payload }, { put, select }) {
      const { list } = yield select((state: any) => state.tasks);
      const updatedList = list.filter((task: Task) => task.id !== payload);
      yield put({ type: 'saveTasks', payload: updatedList });
    },
  },
};

export default TasksModel;