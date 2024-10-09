'use client'

import React, { useEffect, useState } from 'react';
import { Table, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const columns: ColumnsType<User> = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}