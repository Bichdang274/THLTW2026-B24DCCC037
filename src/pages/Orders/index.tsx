import { Table, Select } from 'antd';
import { useModel } from 'umi';
import { Order } from '@/models/order';

export default function Orders() {
  const { orders, updateStatus } = useModel('order');

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    {
      title: 'Số SP',
      render: (_: any, o: Order) => o.products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: (v: number) => v.toLocaleString(),
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      render: (_: any, o: Order) => (
        <Select
          value={o.status}
          onChange={v => updateStatus(o.id, v)}
          options={[
            { value: 'Chờ xử lý' },
            { value: 'Đang giao' },
            { value: 'Hoàn thành' },
            { value: 'Đã hủy' },
          ]}
        />
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
  ];

  return (
    <>
      <h2>Quản lý đơn hàng</h2>
      <Table rowKey="id" columns={columns} dataSource={orders} />
    </>
  );
}
