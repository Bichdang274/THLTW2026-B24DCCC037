import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { Column } from '@ant-design/charts';

const ReportPage = ({ application, club }: any) => {
  const list = application.list;

  // ===== tổng =====
  const totalClub = club.list.length;
  const pending = list.filter((i: any) => i.status === 'PENDING').length;
  const approved = list.filter((i: any) => i.status === 'APPROVED').length;
  const rejected = list.filter((i: any) => i.status === 'REJECTED').length;

  // ===== chart data =====
  const data: any[] = [];

  club.list.forEach((c: any) => {
    ['PENDING', 'APPROVED', 'REJECTED'].forEach((status) => {
      data.push({
        club: c.name,
        type: status,
        value: list.filter(
          (i: any) => i.club === c.name && i.status === status
        ).length,
      });
    });
  });

  const config = {
    data,
    xField: 'club',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
  };

  return (
    <>
      <Card title="Tổng quan">
        <p>Số CLB: {totalClub}</p>
        <p>Pending: {pending}</p>
        <p>Approved: {approved}</p>
        <p>Rejected: {rejected}</p>
      </Card>

      <Card title="Thống kê theo CLB">
        <Column {...config} />
      </Card>
    </>
  );
};

export default connect(({ application, club }: any) => ({
  application,
  club,
}))(ReportPage);