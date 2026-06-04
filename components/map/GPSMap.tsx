'use client';
import React, { useEffect, useRef } from 'react';

interface GPSMapProps {
  path: Array<{ lat: number; lng: number; alt: number }>;
  current: { lat: number; lng: number; alt: number } | null;
}

export default function GPSMap({ path, current }: GPSMapProps) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markerRef  = useRef<any>(null);
  const polyRef    = useRef<any>(null);
  const initRef    = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    if (!mapRef.current) return;
    if (typeof window === 'undefined') return;

    initRef.current = true;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      // Clean up any previous leaflet instance on this DOM node
      const container = mapRef.current as any;
      if (container._leaflet_id) {
        container._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: [20, 77],
        zoom: 10,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#00d4ff;border-radius:50%;border:2px solid #fff;box-shadow:0 0 12px #00d4ff;"></div>`,
        iconSize: [14, 14],
        className: '',
      });

      markerRef.current  = L.marker([20, 77], { icon }).addTo(map);
      polyRef.current    = L.polyline([], { color: '#00d4ff', weight: 2, opacity: 0.6 }).addTo(map);
      leafletRef.current = map;
    });

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
        initRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletRef.current || !current) return;
    if (current.lat == null || current.lng == null) return;
    markerRef.current?.setLatLng([current.lat, current.lng]);
    polyRef.current?.setLatLngs(path.map((p) => [p.lat, p.lng]));
    leafletRef.current.setView([current.lat, current.lng], leafletRef.current.getZoom());
  }, [current, path]);

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 280 }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: 2 }} />
      {current && current.lat != null && current.lng != null && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
          background: 'rgba(10,18,32,0.9)', border: '1px solid var(--border)',
          padding: '8px 12px', borderRadius: 2,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-secondary)',
        }}>
          <div>LAT  <span style={{ color: '#00d4ff' }}>{current.lat.toFixed(6)}°</span></div>
          <div>LNG  <span style={{ color: '#00d4ff' }}>{current.lng.toFixed(6)}°</span></div>
          <div>ALT  <span style={{ color: '#00ff9d' }}>{current.alt?.toFixed(0) ?? '—'} m</span></div>
        </div>
      )}
    </div>
  );
}