'use client'
import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8} className="mb-4">
          <Card>
            <Statistic
              title="Total Users"
              value={10294}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} className="mb-4">
          <Card>
            <Statistic
              title="Active Users"
              value={8741}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} className="mb-4">
          <Card>
            <Statistic
              title="Revenue"
              value={34743}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
      <Card title="User Growth" className="mt-4">
        <p>Here you can add a chart component</p>
      </Card>
    </div>
  );
}