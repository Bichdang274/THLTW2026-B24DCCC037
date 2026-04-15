import React, { useState } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Button, Modal, Select } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';

interface Props {
  dispatch: Dispatch;
  application: any;
  club: any;
}

const MemberPage: React.FC<Props> = ({ dispatch, application, club }) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetClub, setTargetClub] = useState<string>();

  // chỉ lấy APPROVED
  const members = application.list.filter(
    (item: any) => item.status === 'APPROVED'
  );

  const columns: ProColumns<any>[] = [
    { title: 'Họ tên', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'CLB', dataIndex: 'club' },
  ];

  return (
    <>
      <Button
        type="primary"
        disabled={!selectedRows.length}
        onClick={() => setModalVisible(true)}
      >
        Chuyển CLB ({selectedRows.length})
      </Button>

      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={members}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
      />

      <Modal
        visible={modalVisible}
        title={`Chuyển ${selectedRows.length} thành viên`}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          dispatch({
            type: 'application/update',
            payload: selectedRows.map((item) => ({
              ...item,
              club: targetClub,
            })),
          });
          setModalVisible(false);
        }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn CLB"
          onChange={(value) => setTargetClub(value)}
        >
          {club.list.map((c: any) => (
            <Select.Option key={c.id} value={c.name}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default connect(({ application, club }: any) => ({
  application,
  club,
}))(MemberPage);