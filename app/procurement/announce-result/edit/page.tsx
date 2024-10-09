'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function EditAnnounceResultList() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announce-result');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">แก้ไขประกาศผลการจัดซื้อจัดจ้าง</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">โครงการ</th>
            <th className="border p-2">วันที่ประกาศ</th>
            <th className="border p-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement: any) => (
            <tr key={announcement.id}>
              <td className="border p-2">{announcement.procurement.title}</td>
              <td className="border p-2">{new Date(announcement.announcedDate).toLocaleDateString()}</td>
              <td className="border p-2">
                <Link href={`/procurement/announce-result/edit/${announcement.id}`} className="text-blue-500 hover:underline">
                  แก้ไข
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}