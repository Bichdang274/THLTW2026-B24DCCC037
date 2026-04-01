export interface Member {
  id: number;
  name: string;
  email: string;
}

export interface Club {
  id: number;
  name: string;
  leader: string;
  createdAt: string;
  active: boolean;
  description?: string;
  avatar?: string;
  members?: Member[];
}

export interface ClubState {
  list: Club[];
}

const ClubModel = {
  namespace: 'club',

  state: {
    list: [
      {
        id: 1,
        name: 'CLB IT',
        leader: 'Nguyễn Văn A',
        createdAt: '2024-01-01',
        active: true,
        description: 'CLB công nghệ',
        avatar: 'https://via.placeholder.com/50',
        members: [
          { id: 1, name: 'Member 1', email: 'm1@gmail.com' },
        ],
      },
    ],
  } as ClubState,

  reducers: {
    add(state: ClubState, { payload }: { payload: Club }) {
      return {
        ...state,
        list: [...state.list, { ...payload, id: Date.now() }],
      };
    },

    update(state: ClubState, { payload }: { payload: Club }) {
      return {
        ...state,
        list: state.list.map((item) =>
          item.id === payload.id ? { ...item, ...payload } : item
        ),
      };
    },

    remove(state: ClubState, { payload }: { payload: number }) {
      return {
        ...state,
        list: state.list.filter((item) => item.id !== payload),
      };
    },
  },
};

export default ClubModel;