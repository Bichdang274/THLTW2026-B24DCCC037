import { useState } from 'react';
import { 
  ProTable, 
  ProColumns, 
  ModalForm, 
  ProFormText, 
  ProFormMoney, 
  ProFormDigit 
} from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export default function ServicePage() {
  const { services, setServices } = useModel('globalData');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Service | undefined>(undefined);

  const handleDelete = (id: string) => {
    setServices((prev: Service[]) => prev.filter(item => item.id !== id));
    message.success('Đã xóa dịch vụ!');
  };

  const handleFinish = async (values: Record<string, any>) => {
    if (currentRow) {
      // Logic Sửa
      setServices((prev: Service[]) => 
        prev.map(item => item.id === currentRow.id ? { ...item, ...values } as Service : item)
      );
      message.success('Cập nhật dịch vụ thành công!');
    } else {
      // Logic Thêm mới
      const newService: Service = {
        id: Date.now().toString(),
        name: values.name,
        price: values.price,
        duration: values.duration,
      };
      setServices((prev: Service[]) => [...prev, newService]);
      message.success('Thêm dịch vụ thành công!');
    }
    setModalVisible(false);
    return true;
  };

  const columns: ProColumns<Service>[] = [
    { title: 'Tên dịch vụ', dataIndex: 'name' },
    { 
      title: 'Giá (VNĐ)', 
      dataIndex: 'price', 
      valueType: 'money',
      render: (_, record: Service) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)
    },
    { 
      title: 'Thời gian thực hiện', 
      dataIndex: 'duration', 
      render: (_, record: Service) => `${record.duration} phút` 
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record: Service) => [
        <Button 
          key="edit" 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          Sửa
        </Button>,
        <Popconfirm
          key="delete"
          title="Xóa dịch vụ này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Service>
        headerTitle="Danh sách Dịch vụ"
        dataSource={services as Service[]}
        columns={columns}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button 
            key="button" 
            icon={<PlusOutlined />} 
            type="primary" 
            onClick={() => {
              setCurrentRow(undefined);
              setModalVisible(true);
            }}
          >
            Thêm dịch vụ
          </Button>
        ]}
      />

      <ModalForm
        title={currentRow ? 'Sửa thông tin dịch vụ' : 'Thêm dịch vụ mới'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow || {}}
        modalProps={{ destroyOnClose: true }}
        onFinish={handleFinish}
      >
        <ProFormText 
          name="name" 
          label="Tên dịch vụ" 
          rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]} 
        />
        <ProFormMoney 
          name="price" 
          label="Giá tiền (VNĐ)" 
          min={0}
          locale="vi-VN"
          rules={[{ required: true, message: 'Vui lòng nhập giá!' }]} 
        />
        <ProFormDigit 
          name="duration" 
          label="Thời gian thực hiện (Phút)" 
          min={1} 
          rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]} 
        />
      </ModalForm>
    </>
  );
}