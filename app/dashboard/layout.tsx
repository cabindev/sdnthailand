'use client'
import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/dashboard/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link href="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleSignOut}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} 
             breakpoint="lg" collapsedWidth="0">
        <div className="logo p-4">
          <Link href="/">
            <h2 className="text-white text-xl font-bold">LOGO</h2>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white p-0 flex justify-between items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-xl w-16 h-16"
          />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Avatar icon={<UserOutlined />} className="mr-4 cursor-pointer" />
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}