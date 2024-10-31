// app/components/Users.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Table, Switch, message, Avatar, Card, List, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

interface User {
 id: number;
 firstName: string;
 lastName: string;
 email: string;
 role: 'ADMIN' | 'MEMBER';
 image: string | null;
}

export default function Users() {
 const [users, setUsers] = useState<User[]>([]);
 const [loading, setLoading] = useState(true);
 const isMobile = useMediaQuery({ maxWidth: 768 });

 useEffect(() => {
   fetchUsers();
 }, []);

 const fetchUsers = async () => {
   try {
     const response = await axios.get('/api/users');
     setUsers(response.data);
     setLoading(false);
   } catch (error) {
     console.error('Failed to fetch users:', error);
     message.error('Failed to load users');
     setLoading(false);
   }
 };

 const toggleUserRole = async (userId: number, newRole: 'ADMIN' | 'MEMBER') => {
   try {
     await axios.put(`/api/users/${userId}`, { role: newRole });
     message.success('User role updated successfully');
     fetchUsers();
   } catch (error) {
     console.error('Failed to update user role:', error);
     message.error('Failed to update user role');
   }
 };

 const handleDelete = async (userId: number) => {
   try {
     await axios.delete(`/api/users/${userId}`);
     message.success('User deleted successfully');
     fetchUsers();
   } catch (error) {
     console.error('Failed to delete user:', error);
     message.error('Failed to delete user');
   }
 };

 const AvatarComponent = ({ src, alt }: { src: string | null, alt: string }) => (
   <Avatar 
     src={src || '/images/default-avatar.png'} 
     alt={alt}
     style={{ backgroundColor: '#f56a00' }}
   >
     {alt[0]?.toUpperCase()}
   </Avatar>
 );

 const columns: ColumnsType<User> = [
   {
     title: 'Avatar',
     key: 'avatar',
     render: (_, record) => (
       <AvatarComponent 
         src={record.image} 
         alt={`${record.firstName} ${record.lastName}`} 
       />
     ),
   },
   {
     title: 'Name',
     key: 'name',
     render: (_, record) => `${record.firstName} ${record.lastName}`,
   },
   {
     title: 'Email',
     dataIndex: 'email',
     key: 'email',
   },
   {
     title: 'Role',
     key: 'role',
     render: (_, record) => (
       <Switch
         checked={record.role === 'ADMIN'}
         onChange={(checked) => toggleUserRole(record.id, checked ? 'ADMIN' : 'MEMBER')}
         checkedChildren="ADMIN"
         unCheckedChildren="MEMBER"
         className="bg-gray-300"
         style={{ backgroundColor: record.role === 'ADMIN' ? '#1890ff' : undefined }}
       />
     ),
   },
   {
     title: 'Action',
     key: 'action',
     render: (_, record) => (
       <Space size="middle">
         <button 
           onClick={() => handleDelete(record.id)}
           className="text-red-500 hover:text-red-700 transition-colors"
         >
           Delete
         </button>
       </Space>
     ),
   },
 ];

 const renderMobileCard = (user: User) => (
   <Card 
     key={user.id} 
     className="mb-4 shadow-sm hover:shadow-md transition-shadow"
   >
     <Card.Meta
       avatar={
         <AvatarComponent 
           src={user.image} 
           alt={`${user.firstName} ${user.lastName}`} 
         />
       }
       title={`${user.firstName} ${user.lastName}`}
       description={
         <Space direction="vertical" className="w-full">
           <Text>{user.email}</Text>
           <Space className="items-center">
             <Text>Role:</Text>
             <Switch
               checked={user.role === 'ADMIN'}
               onChange={(checked) => toggleUserRole(user.id, checked ? 'ADMIN' : 'MEMBER')}
               checkedChildren="ADMIN"
               unCheckedChildren="MEMBER"
               className="bg-gray-300"
               style={{ backgroundColor: user.role === 'ADMIN' ? '#1890ff' : undefined }}
             />
           </Space>
           <button 
             onClick={() => handleDelete(user.id)}
             className="text-red-500 hover:text-red-700 transition-colors"
           >
             Delete
           </button>
         </Space>
       }
     />
   </Card>
 );

 return (
   <div className="p-4">
     {isMobile ? (
       <List
         dataSource={users}
         renderItem={renderMobileCard}
         loading={loading}
       />
     ) : (
       <Table 
         columns={columns} 
         dataSource={users} 
         loading={loading} 
         rowKey="id"
         className="shadow-sm rounded-lg overflow-hidden"
         pagination={{
           defaultPageSize: 10,
           showSizeChanger: true,
           showTotal: (total) => `Total ${total} users`,
         }}
       />
     )}
   </div>
 );
}