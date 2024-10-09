'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('/dashboard');
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/dashboard/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
    {
      key: '/dashboard/procurement',
      icon: <ShoppingCartOutlined />,
      label: 'Procurement',
      children: [
        { key: '/dashboard/procurement', label: 'ภาพรวมจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/table', label: 'ตารางจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/create', label: 'ประกาศจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/admin', label: 'แก้ไขจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/announce-result/create', label: 'สร้างประกาศผล' },
        { key: '/dashboard/procurement/announce-result/edit', label: 'แก้ไขประกาศผล' },
        
      ],
    },
  ];

  useEffect(() => {
    const matchingMenuItem = menuItems.find(item => 
      pathname.startsWith(item.key) || 
      (item.children && item.children.some(child => pathname.startsWith(child.key)))
    );
    if (matchingMenuItem) {
      setSelectedKey(matchingMenuItem.key);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    router.push(key);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="0" onClick={() => router.push('/dashboard/profile')}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="1" onClick={handleSignOut}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo p-4">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => handleMenuClick(key as string)}
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
          <Dropdown overlay={userMenu} trigger={["click"]}>
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full object-cover cursor-pointer mr-4"
              />
            ) : (
              <Avatar icon={<UserOutlined />} className="mr-4 cursor-pointer" />
            )}
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}