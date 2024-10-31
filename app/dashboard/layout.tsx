'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  HomeOutlined
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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/dashboard/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
    {
      key: 'procurement',
      icon: <ShoppingCartOutlined />,
      label: 'Procurement',
      children: [
        { key: '/dashboard/procurement', label: 'ภาพรวมจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/table', label: 'ตารางจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/create', label: '1.1 ประกาศจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/admin', label: '1.2 แก้ไขจัดซื้อจัดจ้าง' },
        { key: '/dashboard/procurement/announce-result/create', label: '2.1 สร้างประกาศผล' },
        { key: '/dashboard/procurement/announce-result/edit', label: '2.2 แก้ไขประกาศผล' },
      ],
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateSelectedKeys = () => {
      const matchingMenuItem = menuItems.find(item => 
        pathname === item.key || 
        (item.children && item.children.some(child => pathname === child.key))
      );
      if (matchingMenuItem) {
        if (matchingMenuItem.children) {
          setOpenKeys([matchingMenuItem.key]);
          const matchingChild = matchingMenuItem.children.find(child => pathname === child.key);
          if (matchingChild) {
            setSelectedKeys([matchingChild.key]);
          } else {
            setSelectedKeys([matchingMenuItem.key]);
          }
        } else {
          setSelectedKeys([matchingMenuItem.key]);
        }
      }
    };

    updateSelectedKeys();
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKeys([key]);
    router.push(key);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const userMenuItems = [
    {
      key: '0',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => router.push('/dashboard/profile')
    },
    {
      key: '1',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleSignOut
    }
  ];

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen"><div className="loading"></div></div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const SiderContent = () => (
    <>
      <div className="logo p-4 flex justify-center items-center">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" />
        </Link>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={menuItems}
        className="border-r-0 custom-menu"
      />
    </>
  );

  return (
    <Layout className="h-screen w-screen overflow-hidden">
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="80"
          width={250}
          className="bg-white border-r border-muted custom-sider"
        >
          <SiderContent />
        </Sider>
      )}
      <Layout>
        <Header className="bg-white p-0 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="text-xl w-16 h-16 custom-button"
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-xl w-16 h-16 custom-button"
              />
            )}
          </div>
          <div className="flex items-center">
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
              <div className="flex items-center cursor-pointer mr-4">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <Avatar icon={<UserOutlined />} className="rounded-full" style={{ width: 32, height: 32 }} />
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-0 p-2 bg-white border-l-2 border-r-2 overflow-y-auto">
          {/* <div className="mb-4 text-2xl font-bold text-foreground">
            {menuItems.find(item => item.key === selectedKeys[0])?.label || 
             menuItems.find(item => item.children?.some(child => child.key === selectedKeys[0]))?.children?.find(child => child.key === selectedKeys[0])?.label}
          </div> */}
          {children}
        </Content>
      </Layout>
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
          width={250}
        >
          <div className="flex justify-end p-4">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerVisible(false)}
              className="text-xl"
            />
          </div>
          <SiderContent />
        </Drawer>
      )}
    </Layout>
  );
}