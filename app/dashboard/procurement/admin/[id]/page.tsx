'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface ProcurementData {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';
  coverImage: string | null;
  pdfFile: string | null;
}

export default function EditProcurement() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<ProcurementData>({
    id: '',
    projectCode: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    coverImage: null,
    pdfFile: null,
  });
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcurement = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/procurement/${id}`);
        const data = response.data;
        setFormData({
          ...data,
          startDate: formatDateForInput(data.startDate),
          endDate: formatDateForInput(data.endDate),
        });
      } catch (error) {
        console.error('Error fetching procurement:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProcurement();
    }
  }, [id]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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
      if (value !== null && key !== 'coverImage' && key !== 'pdfFile') {
        formDataToSend.append(key, value.toString());
      }
    });
    if (newCoverImage) formDataToSend.append('coverImage', newCoverImage);
    if (newPdfFile) formDataToSend.append('pdfFile', newPdfFile);

    try {
      await axios.put(`/api/procurement/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/dashboard/procurement/admin');
    } catch (error) {
      console.error('Error updating procurement:', error);
    }
  };

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">แก้ไขประกาศจัดซื้อจัดจ้าง</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectCode" className="block mb-2">รหัสโครงการ</label>
          <input
            type="text"
            id="projectCode"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="title" className="block mb-2">ชื่อโครงการ</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2">รายละเอียด</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label htmlFor="startDate" className="block mb-2">วันที่เริ่ม</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-2">วันที่สิ้นสุด</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-2">สถานะ</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="DRAFT">ร่าง</option>
            <option value="OPEN">เปิด</option>
            <option value="CLOSED">ปิด</option>
            <option value="CANCELLED">ยกเลิก</option>
          </select>
        </div>
        <div>
          <label htmlFor="coverImage" className="block mb-2">รูปภาพปก</label>
          {formData.coverImage && (
            <Image
              src={formData.coverImage}
              alt="Cover Image"
              width={200}
              height={200}
              className="mb-2"
            />
          )}
          <input
            type="file"
            id="coverImage"
            onChange={(e) => handleFileChange(e, setNewCoverImage)}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="pdfFile" className="block mb-2">ไฟล์ PDF</label>
          {formData.pdfFile && (
            <a href={formData.pdfFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-2 block">
              ดูไฟล์ PDF ปัจจุบัน
            </a>
          )}
          <input
            type="file"
            id="pdfFile"
            onChange={(e) => handleFileChange(e, setNewPdfFile)}
            accept=".pdf"
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}