'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FaFilePdf, FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaCalendarAlt, FaSearch } from 'react-icons/fa';

// Types
interface Procurement {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';
  coverImage?: string;
  pdfFile?: string;
}

interface AnnounceResult {
  id: string;
  procurementId: string;
  pdfFile: string | null;
  announcedDate: string;
}

export default function Procurement() {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [filteredProcurements, setFilteredProcurements] = useState<Procurement[]>([]);
  const [announceResults, setAnnounceResults] = useState<Record<string, AnnounceResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = procurements.filter(
      (procurement) =>
        procurement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procurement.projectCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProcurements(filtered);
  }, [searchTerm, procurements]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [procurementsResponse, announceResultsResponse] = await Promise.all([
        axios.get<{ procurements: Procurement[] }>('/api/procurement'),
        axios.get<{ announcements: AnnounceResult[] }>('/api/announce-result')
      ]);
      
      setProcurements(procurementsResponse.data.procurements);
      setFilteredProcurements(procurementsResponse.data.procurements);
      
      const resultsRecord = announceResultsResponse.data.announcements.reduce((acc, result) => {
        acc[result.procurementId] = result;
        return acc;
      }, {} as Record<string, AnnounceResult>);
      
      setAnnounceResults(resultsRecord);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openPdf = (pdfUrl: string | undefined) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const getStatusColor = (status: Procurement['status']) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: Procurement['status']) => {
    switch (status) {
      case 'DRAFT':
        return <FaExclamationTriangle className="mr-1" />;
      case 'OPEN':
        return <FaCheckCircle className="mr-1" />;
      case 'CLOSED':
        return <FaTimesCircle className="mr-1" />;
      case 'CANCELLED':
        return <FaTimesCircle className="mr-1" />;
      default:
        return null;
    }
  };

  const renderPdfButton = (pdfUrl: string | undefined, label: string, colorClass: string) => (
    <button
      onClick={() => openPdf(pdfUrl)}
      className={`${colorClass} text-white px-3 py-1 rounded hover:opacity-80 transition duration-300 flex items-center text-sm`}
    >
      <FaFilePdf className="mr-2" />
      {label}
    </button>
  );

  const renderAnnounceResult = (procurement: Procurement) => {
    const result = announceResults[procurement.id];
    if (result) {
      return (
        <div className="flex flex-col items-start">
          <span className="text-sm text-green-600 flex items-center mb-1">
            <FaCheckCircle className="mr-1" /> ประกาศแล้ว
          </span>
          <span className="text-xs text-gray-600 mb-2">
            {new Date(result.announcedDate).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {result.pdfFile && renderPdfButton(result.pdfFile, "ดูผลประกาศ", "bg-green-500")}
        </div>
      );
    } else {
      return (
        <span className="text-sm text-gray-500 flex items-center">
          <FaTimesCircle className="mr-1" /> ยังไม่มีผลประกาศ
        </span>
      );
    }
  };

  const renderProcurementCard = (procurement: Procurement) => (
    <div key={procurement.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-2">
        {procurement.coverImage ? (
          <Image
            src={procurement.coverImage}
            alt={procurement.title}
            width={60}
            height={60}
            className="object-cover rounded mr-4"
          />
        ) : (
          <div className="w-15 h-15 bg-gray-200 rounded flex items-center justify-center text-gray-500 mr-4">
            ไม่มีรูป
          </div>
        )}
        <div>
          <h3 className="font-medium">{procurement.projectCode}</h3>
          <p className="text-sm text-gray-600">{procurement.title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-2">{procurement.description.substring(0, 100)}...</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm flex items-center">
          <FaCalendarAlt className="mr-1 text-gray-400" />
          {new Date(procurement.startDate).toLocaleDateString('th-TH')} - 
          {new Date(procurement.endDate).toLocaleDateString('th-TH')}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusColor(procurement.status)}`}>
          {getStatusIcon(procurement.status)}
          {procurement.status}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        {procurement.pdfFile ? (
          renderPdfButton(procurement.pdfFile, "เอกสารประกาศ", "bg-blue-500")
        ) : (
          <span className="text-gray-500 text-sm">ไม่มีเอกสาร</span>
        )}
        {renderAnnounceResult(procurement)}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2 text-lg">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-xl">{error}</p>
        <button 
          onClick={fetchData} 
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        รายการประกาศจัดซื้อจัดจ้าง
      </h1>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อโครงการหรือรหัสโครงการ"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table view for larger screens */}
      <div className="hidden lg:block overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-3 text-left">รูปภาพ</th>
              <th className="px-4 py-3 text-left">รหัสโครงการ</th>
              <th className="px-4 py-3 text-left">ชื่อโครงการ</th>
              <th className="px-4 py-3 text-left">ระยะเวลา</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th className="px-4 py-3 text-left">เอกสาร</th>
              <th className="px-4 py-3 text-left">ผลประกาศ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcurements.map((procurement) => (
              <tr key={procurement.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {procurement.coverImage ? (
                    <img
                      src={procurement.coverImage}
                      alt={procurement.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      ไม่มีรูป
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">
                  {procurement.projectCode}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{procurement.title}</div>
                  <div className="text-sm text-gray-500">
                    {procurement.description.substring(0, 100)}...
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    {new Date(procurement.startDate).toLocaleDateString(
                      "th-TH"
                    )}
                  </div>
                  <div className="text-gray-500">ถึง</div>
                  <div>
                    {new Date(procurement.endDate).toLocaleDateString("th-TH")}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusColor(
                      procurement.status
                    )}`}
                  >
                    {getStatusIcon(procurement.status)}
                    {procurement.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {procurement.pdfFile ? (
                    renderPdfButton(
                      procurement.pdfFile,
                      "เอกสารประกาศ",
                      "bg-blue-500"
                    )
                  ) : (
                    <span className="text-gray-500 text-sm">ไม่มีเอกสาร</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {renderAnnounceResult(procurement)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for smaller screens */}
      <div className="lg:hidden space-y-4">
        {filteredProcurements.map(renderProcurementCard)}
      </div>
    </div>
  );
}