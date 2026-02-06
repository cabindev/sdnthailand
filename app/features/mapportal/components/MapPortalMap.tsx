'use client';

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import type { MapPortalDocument } from '../types';
import { getCategoryColor } from '../utils/colorGenerator';
import ProvinceHighlight from './ProvinceHighlight';
import RegionBoundaries from './RegionBoundaries';
import 'leaflet/dist/leaflet.css';

const THAILAND_CENTER: [number, number] = [13.7, 100.5];
const DEFAULT_ZOOM = 6;
const MAPPORTAL_URL = 'https://sdnmapportal.sdnthailand.com';

// Add pulse animation CSS
function addPulseStyles() {
  if (typeof document === 'undefined') return;
  const styleId = 'mapportal-pulse-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @keyframes marker-pulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.5); opacity: 0.3; }
    }
    .pulse-marker-container {
      background: transparent !important;
      border: none !important;
    }
    .pulse-marker-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .pulse-marker-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid;
      animation: marker-pulse 1.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

// Create pulsing marker icon
function createPulseIcon(color: string) {
  if (typeof window === 'undefined') return null;

  const L = require('leaflet');
  return L.divIcon({
    className: 'pulse-marker-container',
    html: `
      <div style="position: relative; width: 16px; height: 16px;">
        <div class="pulse-marker-ring" style="border-color: ${color};"></div>
        <div class="pulse-marker-dot" style="background-color: ${color};"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

interface MapPortalMapProps {
  documents: MapPortalDocument[];
  focusedDocId: number | null;
  selectedRegion?: string | null;
  selectedProvinces?: string[];
  highlightColor?: string;
  onDocClick?: (docId: number) => void;
}

export default function MapPortalMap({
  documents,
  focusedDocId,
  selectedRegion = null,
  selectedProvinces = [],
  highlightColor = '#F97316',
  onDocClick,
}: MapPortalMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const hasFilter = selectedProvinces.length > 0;

  // Find the latest document ID
  const latestDocId = documents.length > 0 ? documents[0].id : null;

  // Add pulse animation styles
  useEffect(() => {
    addPulseStyles();
  }, []);

  // Popup content component
  const PopupContent = ({ doc, color, isLatest }: { doc: MapPortalDocument; color: string; isLatest: boolean }) => (
    <div className="min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-[10px] font-medium text-gray-500">{doc.category.name}</span>
        {isLatest && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded">
            NEW
          </span>
        )}
      </div>
      <h4 className="font-bold text-sm mb-1 text-gray-900 leading-snug">{doc.title}</h4>
      <p className="text-xs text-gray-400 mb-1">
        {[doc.amphoe, doc.province].filter(Boolean).join(', ')}
      </p>
      <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
        <time>
          {new Date(doc.createdAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        {doc.viewCount > 0 && <span>{doc.viewCount} views</span>}
      </div>
      <a
        href={MAPPORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline"
      >
        ดูใน SDN Map Portal
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );

  return (
    <MapContainer
      ref={mapRef}
      center={THAILAND_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Default region boundaries with colors + world mask */}
      <RegionBoundaries selectedRegion={selectedRegion} />

      {/* Selected province polygon highlight */}
      <ProvinceHighlight
        selectedProvinces={selectedProvinces}
        color={highlightColor}
      />

      {/* Document markers */}
      {documents.map((doc) => {
        const isInFilter = !hasFilter || selectedProvinces.includes(doc.province);
        const isFocused = focusedDocId === doc.id;
        const isLatest = doc.id === latestDocId;
        const color = getCategoryColor(doc.category.id);

        // Use pulsing Marker for latest document
        if (isLatest && isInFilter) {
          const pulseIcon = createPulseIcon(color);
          if (!pulseIcon) return null;

          return (
            <Marker
              key={doc.id}
              position={[doc.latitude, doc.longitude]}
              icon={pulseIcon}
              eventHandlers={
                onDocClick
                  ? { click: () => onDocClick(doc.id) }
                  : undefined
              }
            >
              <Popup>
                <PopupContent doc={doc} color={color} isLatest={isLatest} />
              </Popup>
            </Marker>
          );
        }

        // Use CircleMarker for other documents
        return (
          <CircleMarker
            key={doc.id}
            center={[doc.latitude, doc.longitude]}
            radius={isFocused ? 10 : isInFilter ? 7 : 4}
            pathOptions={{
              color: isFocused ? '#ffffff' : color,
              fillColor: color,
              fillOpacity: isFocused ? 1 : isInFilter ? 0.9 : 0.2,
              weight: isFocused ? 3 : isInFilter ? 1.5 : 0.5,
            }}
            eventHandlers={
              onDocClick
                ? { click: () => onDocClick(doc.id) }
                : undefined
            }
          >
            <Popup>
              <PopupContent doc={doc} color={color} isLatest={isLatest} />
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
