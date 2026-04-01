import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Switch,
  DatePicker,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';

// ===== TYPE =====
interface Member {
  id: number;
  name: string;
  email: string;
}

interface Club {
  id: number;
  name: string;
  leader: string;
  createdAt: string;
  active: boolean;
  description?: string;
  avatar?: string;
  members?: Member[];
}

interface ClubState {
  list: Club[];
}

interface Props {
  dispatch: Dispatch;
  club: ClubState;
}

// ===== COMPONENT =====
const ClubPage: React.FC<Props> = ({ dispatch, club }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Club | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (current) {
      form.setFieldsValue(current);
    } else {
      form.resetFields();
    }
  }, [current]);

  const handleDelete = (id: number) => {
    dispatch({
      type: 'club/remove',
      payload: id,
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    dispatch({
      type: current ? 'club/update' : 'club/add',
      payload: current
        ? { ...current, ...values }
        : { ...values, id: Date.now() },
    });

    setVisible(false);
  };

  const columns: ProColumns<Club>[] = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      render: (_: any, record: Club) => (
        <img src={record.avatar} width={50} />
      ),
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'createdAt',
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      render: (_: any, record: Club) => (record.active ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_: any, record: Club) => [
        <a
          key="edit"
          onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}
        >
          Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <a>Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Club>
        columns={columns}
        dataSource={club.list}
        rowKey="id"
        search={{ filterType: 'light' }}
        pagination={{ pageSize: 5 }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setCurrent(null);
              setVisible(true);
            }}
          >
            Thêm CLB
          </Button>,
        ]}
      />

      <Modal
        visible={visible}
        title={current ? 'Sửa CLB' : 'Thêm CLB'}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="leader" label="Chủ nhiệm">
            <Input />
          </Form.Item>

          <Form.Item name="createdAt" label="Ngày thành lập">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// ===== CONNECT =====
export default connect(
  ({ club }: { club: ClubState }) => ({ club }),
)(ClubPage);