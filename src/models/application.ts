export type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skill: string;
  club: string;
  reason: string;
  status: StatusType;
  note?: string;
  history?: string[];
}

export interface ApplicationState {
  list: Application[];
}

const ApplicationModel = {
  namespace: 'application',

  state: {
    list: [],
  } as ApplicationState,

  reducers: {
    // ===== ADD =====
    add(state: ApplicationState, { payload }: { payload: Application }) {
      return {
        ...state,
        list: [
          ...state.list,
          {
            ...payload,
            status: 'PENDING',
            history: [
              `Tạo đơn lúc ${new Date().toLocaleString()}`,
            ],
          },
        ],
      };
    },

    // ===== UPDATE (support single + multiple) =====
    update(state: ApplicationState, { payload }: { payload: any }) {
      // update nhiều
      if (Array.isArray(payload)) {
        return {
          ...state,
          list: state.list.map((item) => {
            const found = payload.find((p) => p.id === item.id);
            return found ? { ...item, ...found } : item;
          }),
        };
      }

      // update 1
      return {
        ...state,
        list: state.list.map((item) =>
          item.id === payload.id
            ? {
                ...item,
                ...payload,
                history: [
                  ...(item.history || []),
                  `Cập nhật lúc ${new Date().toLocaleString()}`,
                ],
              }
            : item
        ),
      };
    },

    // ===== DELETE =====
    remove(state: ApplicationState, { payload }: { payload: number }) {
      return {
        ...state,
        list: state.list.filter((item) => item.id !== payload),
      };
    },

    // ===== APPROVE =====
    approve(state: ApplicationState, { payload }: { payload: number[] }) {
      return {
        ...state,
        list: state.list.map((item) =>
          payload.includes(item.id) && item.status === 'PENDING'
            ? {
                ...item,
                status: 'APPROVED',
                history: [
                  ...(item.history || []),
                  `Approved lúc ${new Date().toLocaleString()}`,
                ],
              }
            : item
        ),
      };
    },

    // ===== REJECT =====
    reject(
      state: ApplicationState,
      {
        payload,
      }: { payload: { ids: number[]; reason: string } }
    ) {
      return {
        ...state,
        list: state.list.map((item) =>
          payload.ids.includes(item.id) && item.status === 'PENDING'
            ? {
                ...item,
                status: 'REJECTED',
                note: payload.reason,
                history: [
                  ...(item.history || []),
                  `Rejected lúc ${new Date().toLocaleString()} - ${payload.reason}`,
                ],
              }
            : item
        ),
      };
    },

    // ===== CHANGE CLUB (bulk) =====
    changeClub(
      state: ApplicationState,
      {
        payload,
      }: { payload: { ids: number[]; club: string } }
    ) {
      return {
        ...state,
        list: state.list.map((item) =>
          payload.ids.includes(item.id)
            ? {
                ...item,
                club: payload.club,
                history: [
                  ...(item.history || []),
                  `Chuyển sang CLB ${payload.club} lúc ${new Date().toLocaleString()}`,
                ],
              }
            : item
        ),
      };
    },
  },
};

export default ApplicationModel;