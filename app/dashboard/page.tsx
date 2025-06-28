'use client'

import React from 'react';
import Stats from '../components/Stats';
import UsersPage from '../components/Users';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Stats />
      <div className="mt-8">
        <UsersPage />
      </div>
    </div>
  );
}