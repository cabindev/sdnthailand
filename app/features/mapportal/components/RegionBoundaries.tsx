'use client';

import { useMemo } from 'react';
import { GeoJSON, Polygon } from 'react-leaflet';
import thailandOutline from '@/app/data/thailand-outline.json';

// Thailand border color
const BORDER_COLOR = '#6b7280';

// World bounds (outer ring)
const WORLD_OUTER: [number, number][] = [
  [-90, -180], [-90, 180], [90, 180], [90, -180], [-90, -180],
];

export default function RegionBoundaries({
  selectedRegion,
}: {
  selectedRegion: string | null;
}) {
  // Create mask with hole for Thailand
  const maskWithHole = useMemo(() => {
    const thailandFeature = (thailandOutline as GeoJSON.FeatureCollection).features[0];
    const geometry = thailandFeature.geometry as GeoJSON.MultiPolygon;

    // Get all Thailand coordinates (as holes)
    const thailandHoles: [number, number][][] = [];
    geometry.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        // Convert [lng, lat] to [lat, lng] for Leaflet
        const leafletRing = ring.map(([lng, lat]) => [lat, lng] as [number, number]);
        thailandHoles.push(leafletRing);
      });
    });

    // Return outer world + Thailand holes
    return [WORLD_OUTER, ...thailandHoles];
  }, []);

  return (
    <>
      {/* World mask with Thailand hole - dims only outside Thailand */}
      <Polygon
        positions={maskWithHole}
        pathOptions={{
          fillColor: '#d0d7de',
          fillOpacity: 0.6,
          color: BORDER_COLOR,
          weight: 2,
          opacity: 0.7,
          interactive: false,
        }}
      />
    </>
  );
}
