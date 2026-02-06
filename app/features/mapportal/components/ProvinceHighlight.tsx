'use client';

import { useEffect, useState, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import thailandGeoJSON from '@/app/data/thailand.json';

const THAILAND_CENTER: [number, number] = [13.7, 100.5];
const DEFAULT_ZOOM = 6;

interface ProvinceHighlightProps {
  selectedProvinces: string[];
  color?: string;
}

export default function ProvinceHighlight({
  selectedProvinces,
  color = '#F97316',
}: ProvinceHighlightProps) {
  const map = useMap();
  const [key, setKey] = useState(0);

  const selectedFeatures = useMemo(() => {
    if (selectedProvinces.length === 0) return [];
    return (thailandGeoJSON as GeoJSON.FeatureCollection).features.filter(
      (f) => selectedProvinces.includes(f.properties?.name_th)
    );
  }, [selectedProvinces]);

  const featureCollection = useMemo(() => {
    if (selectedFeatures.length === 0) return null;
    return {
      type: 'FeatureCollection' as const,
      features: selectedFeatures,
    };
  }, [selectedFeatures]);

  useEffect(() => {
    if (featureCollection && featureCollection.features.length > 0 && map) {
      const layer = L.geoJSON(featureCollection as any);
      const bounds = layer.getBounds();

      map.fitBounds(bounds, {
        paddingTopLeft: [20, 20],
        paddingBottomRight: [20, 20],
        maxZoom: selectedProvinces.length > 1 ? 8 : 11,
        animate: true,
        duration: 1.0,
      });

      setKey((prev) => prev + 1);
    } else if (selectedProvinces.length === 0 && map) {
      map.setView(THAILAND_CENTER, DEFAULT_ZOOM, {
        animate: true,
      });
    }
  }, [featureCollection, map, selectedProvinces.length]);

  if (!featureCollection || selectedFeatures.length === 0) return null;

  const style = {
    fillColor: color,
    fillOpacity: 0.35,
    color,
    weight: 2.5,
    opacity: 0.85,
    interactive: false,
  };

  return (
    <GeoJSON
      key={`province-${key}-${selectedProvinces.join('-')}`}
      data={featureCollection}
      style={style}
    />
  );
}
