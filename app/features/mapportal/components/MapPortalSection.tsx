'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader, MapPin, FileText, Layers, Minus, X, ExternalLink, Map as MapIcon, Palette, ArrowRight } from 'lucide-react';
import { useMapPortalDocuments } from '../hooks/useMapPortalDocuments';
import { regionData, findRegionByProvince } from '../data/regions';
import { getCategoryColor } from '../utils/colorGenerator';
import MapPortalCard from './MapPortalCard';
import RegionSelector from './RegionSelector';

const MapPortalMap = dynamic(
  () => import('./MapPortalMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <Loader className="w-6 h-6 text-gray-400" />
      </div>
    ),
  }
);

const MAPPORTAL_URL = 'https://sdnmapportal.sdnthailand.com';

type TabType = 'regions' | 'documents';

export default function MapPortalSection() {
  const { documents, error, isLoading, mutate } = useMapPortalDocuments();
  const [focusedDocId, setFocusedDocId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('regions');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [highlightColor, setHighlightColor] = useState('#F97316');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hide sidebar on mobile by default
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const validDocs = useMemo(
    () => documents.filter((d) => d.latitude && d.longitude),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    if (selectedProvince) return validDocs.filter((d) => d.province === selectedProvince);
    if (selectedProvinces.length > 0) return validDocs.filter((d) => selectedProvinces.includes(d.province));
    return validDocs;
  }, [validDocs, selectedProvince, selectedProvinces]);

  const provinceStats = useMemo(() => {
    if (!selectedProvince) return null;
    const docs = validDocs.filter((d) => d.province === selectedProvince);
    const categories = new Set(docs.map((d) => d.category.name));
    return { totalDocuments: docs.length, categoryCount: categories.size };
  }, [validDocs, selectedProvince]);

  const uniqueProvinces = useMemo(() => new Set(validDocs.map((d) => d.province)).size, [validDocs]);

  // Extract unique categories for legend
  const categories = useMemo(() => {
    const categoryMap = new Map<number, { id: number; name: string; count: number }>();
    for (const doc of validDocs) {
      const existing = categoryMap.get(doc.category.id);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(doc.category.id, {
          id: doc.category.id,
          name: doc.category.name,
          count: 1,
        });
      }
    }
    return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
  }, [validDocs]);

  const [showLegend, setShowLegend] = useState(false);

  const handleSelectRegion = useCallback((regionName: string, provinces: string[]) => {
    setSelectedRegion(regionName);
    setSelectedProvince(null);
    setSelectedProvinces(provinces);
    setHighlightColor(regionData[regionName]?.color || '#F97316');
    setFocusedDocId(null);
  }, []);

  const handleSelectProvince = useCallback((provinceName: string) => {
    const region = findRegionByProvince(provinceName);
    setSelectedProvince(provinceName);
    setSelectedRegion(region?.regionName || null);
    setSelectedProvinces([provinceName]);
    setHighlightColor(region?.color || '#F97316');
    setFocusedDocId(null);
    setActiveTab('documents');
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRegion(null);
    setSelectedProvince(null);
    setSelectedProvinces([]);
    setHighlightColor('#F97316');
    setFocusedDocId(null);
  }, []);

  const handleDocClick = useCallback((docId: number) => {
    setFocusedDocId((prev) => (prev === docId ? null : docId));
  }, []);

  const handleMapDocClick = useCallback((docId: number) => {
    setFocusedDocId((prev) => (prev === docId ? null : docId));
    setActiveTab('documents');
    setSidebarOpen(true);
  }, []);

  if (isLoading) return <MapPortalSkeleton />;

  if (error) {
    return (
      <div className="relative w-full h-[85vh] bg-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
            <X className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-gray-500 text-sm mb-4">ไม่สามารถโหลดข้อมูลแผนที่ได้</p>
          <button
            type="button"
            onClick={() => mutate()}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[600px]">
      {/* Full-screen Map */}
      <div className="absolute inset-0">
        <MapPortalMap
          documents={validDocs}
          focusedDocId={focusedDocId}
          selectedRegion={selectedRegion}
          selectedProvinces={selectedProvinces}
          highlightColor={highlightColor}
          onDocClick={handleMapDocClick}
        />
      </div>

      {/* Floating toggle button - show only when sidebar is closed */}
      {!sidebarOpen && (
        <div className="absolute top-4 left-4 z-[501]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            title="แสดงชั้นข้อมูล"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile backdrop - tap to close */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-[499] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sliding panel */}
      <div className={`absolute top-3 left-3 bottom-3 z-[500] transition-transform duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
      }`}>
        <div className="h-full w-[calc(100vw-1.5rem)] max-w-[380px] bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl flex flex-col overflow-hidden border border-gray-100/50">
          {/* Header */}
          <div className="px-5 pt-4 pb-3 flex-shrink-0 border-b border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-none">SDN Map Portal</h2>
                  <p className="text-sm text-gray-400 mt-1">ระบบแผนที่ข้อมูลเชิงพื้นที่</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={MAPPORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-300 hover:text-orange-500 rounded-lg hover:bg-gray-50 transition-colors"
                  title="เปิด SDN Map Portal"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="ซ่อนชั้นข้อมูล"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  <span className="font-bold text-gray-700 tabular-nums">{validDocs.length}</span> ข้อมูล
                </span>
                <span className="text-sm text-gray-400">
                  <span className="font-bold text-gray-700 tabular-nums">{uniqueProvinces}</span> จังหวัด
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLegend(!showLegend)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  showLegend
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                สัญลักษณ์
              </button>
            </div>
          </div>

          {/* Legend section */}
          {showLegend && (
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {categories.slice(0, 8).map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(cat.id) }}
                    />
                    <span className="text-xs text-gray-600 truncate">{cat.name}</span>
                    <span className="text-xs text-gray-300 flex-shrink-0">({cat.count})</span>
                  </div>
                ))}
              </div>
              {categories.length > 8 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  +{categories.length - 8} หมวดหมู่อื่น
                </p>
              )}
            </div>
          )}

            {/* Filter indicator */}
            {selectedProvinces.length > 0 && (
              <div className="px-3 pt-2.5 flex-shrink-0">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-orange-50/80">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: highlightColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedProvince || selectedRegion}</p>
                    {selectedProvince && provinceStats && (
                      <p className="text-xs text-gray-400">
                        {provinceStats.totalDocuments > 0
                          ? `${provinceStats.totalDocuments} เอกสาร \u2022 ${provinceStats.categoryCount} หมวดหมู่`
                          : 'ยังไม่มีข้อมูล'}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="p-1.5 text-orange-300 hover:text-orange-600 rounded-full hover:bg-orange-100 transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="px-4 pt-3 flex-shrink-0">
              <div className="flex bg-gray-100/80 rounded-xl p-1.5">
                <TabButton
                  active={activeTab === 'regions'}
                  onClick={() => setActiveTab('regions')}
                  icon={<MapPin className="w-4 h-4" />}
                  label="ภูมิภาค"
                />
                <TabButton
                  active={activeTab === 'documents'}
                  onClick={() => setActiveTab('documents')}
                  icon={<FileText className="w-4 h-4" />}
                  label="เอกสาร"
                  badge={filteredDocs.length !== validDocs.length ? filteredDocs.length : undefined}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden mt-1">
              {activeTab === 'regions' ? (
                <RegionSelector
                  documents={validDocs}
                  selectedRegion={selectedRegion}
                  selectedProvince={selectedProvince}
                  onSelectRegion={handleSelectRegion}
                  onSelectProvince={handleSelectProvince}
                  onClearSelection={handleClearSelection}
                />
              ) : (
                <div className="h-full flex flex-col">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-medium">
                      {selectedProvince || selectedRegion
                        ? `${filteredDocs.length} รายการ`
                        : `ทั้งหมด ${validDocs.length} รายการ`}
                    </p>
                    {(selectedProvince || selectedRegion) && (
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                      >
                        ล้างตัวกรอง
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => (
                        <MapPortalCard
                          key={doc.id}
                          document={doc}
                          isActive={focusedDocId === doc.id}
                          onClick={() => handleDocClick(doc.id)}
                        />
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <FileText className="w-7 h-7 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          {selectedProvince || selectedRegion
                            ? 'ไม่พบเอกสารในพื้นที่ที่เลือก'
                            : 'ไม่พบเอกสาร'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <a
                href={MAPPORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                <MapIcon className="w-4 h-4" />
                ดูแผนที่ทั้งหมด
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 text-base font-semibold rounded-xl transition-all ${
        active
          ? 'text-gray-900 bg-white shadow-sm'
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        {icon}
        {label}
        {badge !== undefined && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500 text-white font-bold leading-none">
            {badge}
          </span>
        )}
      </span>
    </button>
  );
}

function MapPortalSkeleton() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-gray-100">
      <div className="absolute top-3 left-3 bottom-3 z-10 w-[350px] sm:w-[380px] bg-white/95 rounded-2xl shadow-xl overflow-hidden animate-pulse">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-orange-100 rounded-xl" />
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-28" />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="h-4 bg-gray-100 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
        </div>
        <div className="px-4 pt-4">
          <div className="flex bg-gray-100/80 rounded-xl p-1.5 gap-1">
            <div className="flex-1 h-12 bg-white rounded-lg" />
            <div className="flex-1 h-12 bg-gray-50 rounded-lg" />
          </div>
        </div>
        <div className="p-4 space-y-2 mt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-14 bg-gray-50 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    </section>
  );
}
