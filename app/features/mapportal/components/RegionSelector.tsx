'use client';

import { useState, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { regionData } from '../data/regions';
import type { MapPortalDocument } from '../types';

interface RegionSelectorProps {
  documents: MapPortalDocument[];
  selectedRegion: string | null;
  selectedProvince: string | null;
  onSelectRegion: (regionName: string, provinces: string[]) => void;
  onSelectProvince: (provinceName: string) => void;
  onClearSelection: () => void;
}

export default function RegionSelector({
  documents,
  selectedRegion,
  selectedProvince,
  onSelectRegion,
  onSelectProvince,
  onClearSelection,
}: RegionSelectorProps) {
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  const docCountByProvince = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const doc of documents) {
      if (doc.province) counts[doc.province] = (counts[doc.province] || 0) + 1;
    }
    return counts;
  }, [documents]);

  const filteredRegions = useMemo(() => {
    if (!search.trim()) return regionData;
    const q = search.toLowerCase();
    const result: Record<string, { provinces: string[]; color: string }> = {};
    for (const [name, data] of Object.entries(regionData)) {
      const filtered = data.provinces.filter((p) => p.toLowerCase().includes(q));
      if (filtered.length > 0 || name.toLowerCase().includes(q)) {
        result[name] = { ...data, provinces: filtered.length > 0 ? filtered : data.provinces };
      }
    }
    return result;
  }, [search]);

  const toggleRegion = (regionName: string) => {
    setExpandedRegions((prev) => ({ ...prev, [regionName]: !prev[regionName] }));
  };

  const getRegionDocCount = (provinces: string[]) =>
    provinces.reduce((sum, p) => sum + (docCountByProvince[p] || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input
            type="text"
            placeholder="ค้นหาจังหวัด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 text-base bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-200 placeholder:text-gray-400 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Region list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {Object.entries(filteredRegions).map(([regionName, data]) => {
          const isSelected = selectedRegion === regionName;
          const isExpanded = expandedRegions[regionName] || false;
          const docCount = getRegionDocCount(data.provinces);

          return (
            <div key={regionName} className="rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all hover:shadow-md">
              {/* Region row */}
              <button
                type="button"
                onClick={() => {
                  onSelectRegion(regionName, data.provinces);
                  if (!isExpanded) setExpandedRegions((prev) => ({ ...prev, [regionName]: true }));
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all ${
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: data.color }}
                />
                <span className={`text-base font-bold flex-1 truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {regionName}
                </span>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-sm font-medium tabular-nums ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {docCount > 0 ? docCount : data.provinces.length}
                </span>
                <ChevronDown
                  onClick={(e) => { e.stopPropagation(); toggleRegion(regionName); }}
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-150 ${
                    isExpanded ? 'rotate-180' : ''
                  } ${isSelected ? 'text-white/40' : 'text-gray-300'}`}
                />
              </button>

              {/* Provinces */}
              {isExpanded && (
                <div className="px-2 pb-2 pt-1 bg-gray-50/50">
                  {data.provinces.map((province) => {
                    const isProvSelected = selectedProvince === province;
                    const pCount = docCountByProvince[province] || 0;
                    return (
                      <button
                        key={province}
                        type="button"
                        onClick={() => onSelectProvince(province)}
                        className={`w-full text-left px-4 py-3 text-[15px] rounded-xl transition-all my-0.5 flex items-center justify-between ${
                          isProvSelected
                            ? 'bg-orange-50 text-orange-600 font-semibold'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                        }`}
                      >
                        <span>{province}</span>
                        {pCount > 0 && (
                          <span className={`text-sm tabular-nums ${
                            isProvSelected ? 'text-orange-400' : 'text-gray-300'
                          }`}>
                            {pCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(filteredRegions).length === 0 && (
          <div className="py-12 text-center">
            <p className="text-base text-gray-400">ไม่พบจังหวัดที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
