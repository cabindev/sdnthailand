'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, FileOutlined } from '@ant-design/icons';

export default function Stats() {
  const [stats, setStats] = useState({ userCount: 0, mediaRequestsThisYear: 0 });

  useEffect(() => {
    axios.get('/api/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <Card>
          <Statistic
            title="จำนวนผู้ใช้ทั้งหมด"
            value={stats.userCount}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card>
          <Statistic
            title="จำนวนคำขอสื่อในปีนี้"
            value={stats.mediaRequestsThisYear}
            prefix={<FileOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}