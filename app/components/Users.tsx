'use client'
import React, { useState, useEffect } from 'react';
import { UserIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  image: string | null;
}

// Custom Toast Component
const Toast = ({ message, type, onClose }: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void;
}) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`}>
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">×</button>
    </div>
  </div>
);

// Custom Toggle Switch Component
const ToggleSwitch = ({ 
  checked, 
  onChange, 
  checkedLabel, 
  uncheckedLabel 
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkedLabel: string;
  uncheckedLabel: string;
}) => (
  <div className="flex items-center space-x-2">
    <span className={`text-sm ${!checked ? 'font-medium' : 'text-gray-500'}`}>
      {uncheckedLabel}
    </span>
    <button
      onClick={() => onChange(!checked)}
      className={`${
        checked ? 'bg-orange-500' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
    <span className={`text-sm ${checked ? 'font-medium' : 'text-gray-500'}`}>
      {checkedLabel}
    </span>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
);

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast('Failed to load users', 'error');
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: number, newRole: 'ADMIN' | 'MEMBER') => {
    try {
      await axios.put(`/api/users/${userId}`, { role: newRole });
      showToast('User role updated successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      showToast('Failed to update user role', 'error');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/api/users/${userId}`);
      showToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const UserAvatar = ({ src, alt }: { src: string | null; alt: string }) => (
    <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <UserIcon className="h-6 w-6 text-white" />
      )}
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {isMobile ? (
        // Mobile Card View
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-start space-x-3">
                <UserAvatar 
                  src={user.image} 
                  alt={`${user.firstName} ${user.lastName}`} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <div className="mt-2">
                    <ToggleSwitch
                      checked={user.role === 'ADMIN'}
                      onChange={(checked) => toggleUserRole(user.id, checked ? 'ADMIN' : 'MEMBER')}
                      checkedLabel="ADMIN"
                      uncheckedLabel="MEMBER"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop Table View
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserAvatar 
                        src={user.image} 
                        alt={`${user.firstName} ${user.lastName}`} 
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch
                      checked={user.role === 'ADMIN'}
                      onChange={(checked) => toggleUserRole(user.id, checked ? 'ADMIN' : 'MEMBER')}
                      checkedLabel="ADMIN"
                      uncheckedLabel="MEMBER"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}