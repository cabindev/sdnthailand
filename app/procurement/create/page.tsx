'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateProcurement() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectCode: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'OPEN',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (coverImage) formDataToSend.append('coverImage', coverImage);
    if (pdfFile) formDataToSend.append('pdfFile', pdfFile);

    try {
      await axios.post('/api/procurement', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/dashboard/procurement');
    } catch (error) {
      console.error('Error creating procurement:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">สร้างประกาศจัดซื้อจัดจ้างใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700 mb-1">รหัสโครงการ</label>
            <input
              type="text"
              id="projectCode"
              name="projectCode"
              value={formData.projectCode}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงการ</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่ม</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="OPEN">เปิด</option>
            <option value="CLOSED">ปิด</option>
            <option value="CANCELLED">ยกเลิก</option>
          </select>
        </div>
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">รูปภาพปก</label>
          <input
            type="file"
            id="coverImage"
            onChange={(e) => handleFileChange(e, setCoverImage)}
            accept="image/*"
            className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">ไฟล์ PDF</label>
          <input
            type="file"
            id="pdfFile"
            onChange={(e) => handleFileChange(e, setPdfFile)}
            accept=".pdf"
            className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm">
            สร้างประกาศ
          </button>
        </div>
      </form>
    </div>
  );
}