import Image from 'next/image';
import { Eye } from 'lucide-react';
import type { MapPortalDocument } from '../types';
import { getCategoryColor } from '../utils/colorGenerator';

interface MapPortalCardProps {
  document: MapPortalDocument;
  isActive: boolean;
  onClick: () => void;
}

export default function MapPortalCard({
  document: doc,
  isActive,
  onClick,
}: MapPortalCardProps) {
  const categoryColor = getCategoryColor(doc.category.id);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex gap-4 px-4 py-4 text-left transition-all group border-b border-gray-50 last:border-b-0 ${
        isActive
          ? 'bg-orange-50'
          : 'hover:bg-gray-50/60'
      }`}
    >
      {/* Color indicator */}
      <div
        className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold line-clamp-2 leading-snug transition-colors ${
          isActive ? 'text-orange-900' : 'text-gray-800 group-hover:text-gray-900'
        }`}>
          {doc.title}
        </h4>

        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {doc.category.name}
          </span>
          <span className="text-xs text-gray-400 truncate">
            {doc.province}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <time>
            {new Date(doc.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          {doc.viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {doc.viewCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
