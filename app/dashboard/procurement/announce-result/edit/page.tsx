'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface AnnounceResult {
  id: string;
  procurement: {
    title: string;
  };
  announcedDate: string;
}

export default function EditAnnounceResultList() {
  const [announcements, setAnnouncements] = useState<AnnounceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ announcements: AnnounceResult[] }>('/api/announce-result');
      setAnnouncements(response.data.announcements);
      setError(null);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบประกาศผลนี้?')) {
      try {
        await axios.delete(`/api/announce-result/${id}`);
        alert('ลบประกาศผลสำเร็จ');
        fetchAnnouncements(); // โหลดข้อมูลใหม่หลังจากลบ
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('เกิดข้อผิดพลาดในการลบประกาศผล');
      }
    }
  };

  if (loading) return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">แก้ไขประกาศผลการจัดซื้อจัดจ้าง</h1>
      {announcements.length > 0 ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">โครงการ</th>
              <th className="border p-2">วันที่ประกาศ</th>
              <th className="border p-2">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td className="border p-2">{announcement.procurement.title}</td>
                <td className="border p-2">{new Date(announcement.announcedDate).toLocaleDateString()}</td>
                <td className="border p-2">
                  <Link href={`/dashboard/procurement/announce-result/edit/${announcement.id}`} className="text-blue-500 hover:underline mr-2">
                    แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-500 hover:underline"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center py-4">ไม่มีข้อมูลประกาศผล</p>
      )}
    </div>
  );
}