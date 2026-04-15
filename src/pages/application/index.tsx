import React, { useState } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';

interface Props {
  dispatch: Dispatch;
  application: any;
}

const Page: React.FC<Props> = ({ dispatch, application }) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // ===== columns =====
  const columns: ProColumns<any>[] = [
    { title: 'Họ tên', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender' },
    { title: 'CLB', dataIndex: 'club' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueEnum: {
        PENDING: { text: 'Pending' },
        APPROVED: { text: 'Approved' },
        REJECTED: { text: 'Rejected' },
      },
    },
    {
      title: 'Thao tác',
      render: (_, record) => [
        <a
          key="approve"
          onClick={() =>
            dispatch({
              type: 'application/approve',
              payload: [record.id],
            })
          }
        >
          Duyệt
        </a>,

        <a
          key="reject"
          onClick={() => {
            setSelectedRows([record]);
            setRejectModal(true);
          }}
        >
          Từ chối
        </a>,

        <Popconfirm
          key="delete"
          title="Xóa?"
          onConfirm={() =>
            dispatch({
              type: 'application/remove',
              payload: record.id,
            })
          }
        >
          <a>Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      {/* BULK ACTION */}
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          disabled={!selectedRows.length}
          onClick={() =>
            dispatch({
              type: 'application/approve',
              payload: selectedRows.map((i) => i.id),
            })
          }
        >
          Duyệt {selectedRows.length} đơn
        </Button>

        <Button
          danger
          disabled={!selectedRows.length}
          onClick={() => setRejectModal(true)}
          style={{ marginLeft: 8 }}
        >
          Từ chối {selectedRows.length} đơn
        </Button>
      </div>

      {/* TABLE */}
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={application.list}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
      />

      {/* MODAL REJECT */}
      <Modal
        visible={rejectModal}
        title="Nhập lý do từ chối"
        onCancel={() => setRejectModal(false)}
        onOk={() => {
          if (!rejectReason) {
            message.error('Phải nhập lý do');
            return;
          }

          dispatch({
            type: 'application/reject',
            payload: {
              ids: selectedRows.map((i) => i.id),
              reason: rejectReason,
            },
          });

          setRejectModal(false);
          setRejectReason('');
        }}
      >
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default connect(({ application }: any) => ({ application }))(Page);