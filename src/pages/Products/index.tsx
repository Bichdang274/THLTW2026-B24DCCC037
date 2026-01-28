import { Table, Tag, Button } from 'antd';
import { useModel } from 'umi';
import { Product } from '@/models/product';

export default function Products() {
  const { products } = useModel('product');

  const columns = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Danh mục', dataIndex: 'category' },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      render: (_: any, p: Product) => {
        if (p.quantity === 0) return <Tag color="red">Hết hàng</Tag>;
        if (p.quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
        return <Tag color="green">Còn hàng</Tag>;
      },
    },
    { title: 'Thao tác', render: () => <Button>Sửa</Button> },
  ];

  return (
    <>
      <h2>Quản lý sản phẩm</h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}
