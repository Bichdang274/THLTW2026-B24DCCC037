
import { useModel } from 'umi';
import { Col, Row, Statistic, Table, Tag } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { CalendarOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Staff {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  serviceId: string;
  staffId: string;
  status: string;
  date: string;
}

export default function DashboardPage() {
  const { bookings, services, staffs } = useModel('globalData');

  const todayStr = dayjs().format('YYYY-MM-DD');
  const currentMonthStr = dayjs().format('YYYY-MM');


  const bookingsToday = (bookings as Booking[]).filter((b: Booking) => b.date === todayStr);
  const completedBookings = (bookings as Booking[]).filter((b: Booking) => b.status === 'Hoàn thành');
  
  const totalRevenue = completedBookings.reduce((sum: number, b: Booking) => {
    const service = (services as Service[]).find((s: Service) => s.id === b.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const revenueByStaff = (staffs as Staff[]).map((staff: Staff) => {
    const staffBookings = completedBookings.filter((b: Booking) => b.staffId === staff.id);
    const revenue = staffBookings.reduce((sum: number, b: Booking) => {
      const service = (services as Service[]).find((s: Service) => s.id === b.serviceId);
      return sum + (service?.price || 0);
    }, 0);
    return { staffName: staff.name, totalBookings: staffBookings.length, revenue };
  }).sort((a, b) => b.revenue - a.revenue); 


  const revenueByService = (services as Service[]).map((service: Service) => {
    const serviceBookings = completedBookings.filter((b: Booking) => b.serviceId === service.id);
    const revenue = serviceBookings.length * service.price;
    return { serviceName: service.name, totalUsed: serviceBookings.length, revenue };
  }).sort((a, b) => b.revenue - a.revenue);


  const bookingsThisMonth = (bookings as Booking[]).filter((b: Booking) => b.date.startsWith(currentMonthStr));
  const groupedByDate = bookingsThisMonth.reduce((acc: Record<string, number>, b: Booking) => {
    acc[b.date] = (acc[b.date] || 0) + 1;
    return acc;
  }, {});
  
  const bookingsByDateData = Object.keys(groupedByDate).map(date => ({
    date,
    count: groupedByDate[date]
  })).sort((a, b) => a.date.localeCompare(b.date));


  const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <ProCard hoverable bordered>
            <Statistic 
              title="Lịch hẹn hôm nay" 
              value={bookingsToday.length} 
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} 
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard hoverable bordered>
            <Statistic 
              title="Tổng lịch đã hoàn thành" 
              value={completedBookings.length} 
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard hoverable bordered>
            <Statistic 
              title="Tổng doanh thu toàn hệ thống" 
              value={totalRevenue} 
              prefix={<DollarOutlined style={{ color: '#cf1322' }} />} 
              formatter={(val) => formatMoney(Number(val))}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
            />
          </ProCard>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <ProCard title="🏆 Top Doanh Thu Nhân Viên" headerBordered bordered>
            <Table 
              dataSource={revenueByStaff} 
              rowKey="staffName"
              pagination={false}
              columns={[
                { title: 'Nhân viên', dataIndex: 'staffName', key: 'staffName', render: (text) => <b>{text}</b> },
                { title: 'Số ca hoàn thành', dataIndex: 'totalBookings', key: 'totalBookings', render: (val) => <Tag color="blue">{val} ca</Tag> },
                { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (val) => <span style={{ color: 'green', fontWeight: 'bold' }}>{formatMoney(val)}</span> }
              ]}
            />
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="🔥 Dịch Vụ Bán Chạy" headerBordered bordered>
            <Table 
              dataSource={revenueByService} 
              rowKey="serviceName"
              pagination={false}
              columns={[
                { title: 'Tên dịch vụ', dataIndex: 'serviceName', key: 'serviceName', render: (text) => <b>{text}</b> },
                { title: 'Lượt sử dụng', dataIndex: 'totalUsed', key: 'totalUsed', render: (val) => <Tag color="orange">{val} lượt</Tag> },
                { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (val) => <span style={{ color: 'green', fontWeight: 'bold' }}>{formatMoney(val)}</span> }
              ]}
            />
          </ProCard>
        </Col>
      </Row>

      <ProCard title={`📈 Số lượng lịch hẹn trong tháng ${currentMonthStr}`} headerBordered bordered>
        <Table 
          dataSource={bookingsByDateData} 
          rowKey="date"
          pagination={{ pageSize: 5 }}
          columns={[
            { title: 'Ngày', dataIndex: 'date', key: 'date', render: (text) => <Tag color="cyan">{text}</Tag> },
            { 
              title: 'Tổng số lịch hẹn', 
              dataIndex: 'count', 
              key: 'count', 
              render: (val) => <span>{val} lịch</span> 
            }
          ]}
        />
      </ProCard>

    </div>
  );
}