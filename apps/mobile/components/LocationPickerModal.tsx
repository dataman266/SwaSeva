import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Locate } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import L from 'leaflet';

export interface LocationFilter {
  region: string;
  regionLabel: string;
  regionLabelMr: string;
  radius: number;
  lat?: number;
  lng?: number;
}

export const DEFAULT_LOCATION_FILTER: LocationFilter = {
  region: 'all',
  regionLabel: 'All India',
  regionLabelMr: 'सर्व भारत',
  radius: 50,
};

const DEFAULT_LAT = 19.7515;
const DEFAULT_LNG = 75.7139;
const MAP_H       = 210; // px — fixed map height

interface Props {
  isOpen: boolean;
  current: LocationFilter;
  isMr: boolean;
  onApply: (f: LocationFilter) => void;
  onClose: () => void;
}

function markerIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;background:rgba(45,90,27,.22);border-radius:50%;animation:locPulse 2s ease-in-out infinite"></div>
      <div style="position:relative;width:20px;height:20px;background:#2D5A1B;border:3px solid #D4C4A0;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,.5)"></div>
    </div>`,
    iconSize: [44, 44], iconAnchor: [22, 22],
  });
}

export default function LocationPickerModal({ isOpen, current, isMr, onApply, onClose }: Props) {
  const [radius, setRadius]         = useState(current.radius);
  const [pinLabel, setPinLabel]     = useState<string | null>(current.region !== 'all' ? current.regionLabel    : null);
  const [pinLabelMr, setPinLabelMr] = useState<string | null>(current.region !== 'all' ? current.regionLabelMr : null);
  const [pinLat, setPinLat]         = useState<number | null>(current.lat ?? null);
  const [pinLng, setPinLng]         = useState<number | null>(current.lng ?? null);
  const [locating, setLocating]     = useState(false);
  const [geocoding, setGeocoding]   = useState(false);

  const mapDivRef    = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map    | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);
  const circleRef    = useRef<L.Circle | null>(null);
  const radiusRef    = useRef(radius);
  const dragControls = useDragControls();

  useEffect(() => { radiusRef.current = radius; }, [radius]);

  useEffect(() => {
    if (!isOpen) return;
    setRadius(current.radius);
    setPinLabel(current.region !== 'all' ? current.regionLabel    : null);
    setPinLabelMr(current.region !== 'all' ? current.regionLabelMr : null);
    setPinLat(current.lat ?? null);
    setPinLng(current.lng ?? null);
  }, [isOpen]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow    = isOpen ? 'hidden' : '';
    document.body.style.touchAction = isOpen ? 'none'   : '';
    return () => { document.body.style.overflow = ''; document.body.style.touchAction = ''; };
  }, [isOpen]);

  // Update circle radius live
  useEffect(() => {
    circleRef.current?.setRadius(radius * 1000);
  }, [radius]);

  const upsertCircle = (lat: number, lng: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
      circleRef.current.setRadius(radiusRef.current * 1000);
    } else {
      circleRef.current = L.circle([lat, lng], {
        radius: radiusRef.current * 1000,
        color: '#4A8C2A', fillColor: '#2D5A1B',
        fillOpacity: 0.12, weight: 2, opacity: 0.7,
      }).addTo(map);
    }
  };

  const geocode = async (lat: number, lng: number) => {
    setPinLat(lat); setPinLng(lng);
    upsertCircle(lat, lng);
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=12`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const d = await res.json();
      const name = d.address.village || d.address.suburb || d.address.neighbourhood ||
        d.address.town || d.address.city_district || d.address.city ||
        d.address.county || d.address.state || 'Selected area';
      const parts = [name, d.address.county || d.address.state_district, d.address.state]
        .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
      const full = parts.join(', ');
      setPinLabel(full); setPinLabelMr(full);
    } catch {
      setPinLabel('Selected area'); setPinLabelMr('निवडलेले क्षेत्र');
    }
    setGeocoding(false);
  };

  // Map lifecycle
  useEffect(() => {
    if (!isOpen) {
      mapRef.current?.remove();
      mapRef.current = null; markerRef.current = null; circleRef.current = null;
      return;
    }
    const t = setTimeout(() => {
      if (!mapDivRef.current || mapRef.current) return;
      const lat0 = pinLat ?? DEFAULT_LAT, lng0 = pinLng ?? DEFAULT_LNG;

      const map = L.map(mapDivRef.current, {
        center: [lat0, lng0], zoom: pinLat ? 11 : 7,
        zoomControl: false, attributionControl: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      L.control.attribution({ prefix: '© OSM', position: 'bottomleft' }).addTo(map);

      // Draw circle immediately
      circleRef.current = L.circle([lat0, lng0], {
        radius: radiusRef.current * 1000,
        color: '#4A8C2A', fillColor: '#2D5A1B',
        fillOpacity: 0.12, weight: 2, opacity: 0.7,
      }).addTo(map);

      const mk = L.marker([lat0, lng0], { draggable: true, icon: markerIcon() }).addTo(map);
      mk.on('drag',    () => circleRef.current?.setLatLng(mk.getLatLng()));
      mk.on('dragend', () => { const { lat, lng } = mk.getLatLng(); geocode(lat, lng); });
      map.on('click',  (e: L.LeafletMouseEvent) => { mk.setLatLng(e.latlng); geocode(e.latlng.lat, e.latlng.lng); });

      map.invalidateSize();
      mapRef.current = map; markerRef.current = mk;
    }, 380);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleGPS = () => {
    if (locating || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        markerRef.current?.setLatLng([lat, lng]);
        mapRef.current?.setView([lat, lng], 13, { animate: true });
        geocode(lat, lng);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleOk = () => {
    onApply(pinLabel && pinLat != null && pinLng != null
      ? { region: pinLabel, regionLabel: pinLabel, regionLabelMr: pinLabelMr ?? pinLabel, radius, lat: pinLat, lng: pinLng }
      : { ...DEFAULT_LOCATION_FILTER, radius }
    );
    onClose();
  };

  const pct  = ((radius - 10) / 490) * 100;
  const hint =
    radius <= 25  ? (isMr ? 'अगदी जवळचे'  : 'Hyper-local')   :
    radius <= 75  ? (isMr ? 'शहर स्तर'    : 'City level')     :
    radius <= 200 ? (isMr ? 'जिल्हा स्तर' : 'District level') :
                    (isMr ? 'विभाग-व्यापी' : 'Region-wide');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            @keyframes locPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.8);opacity:.07}}
            .agsl{-webkit-appearance:none;appearance:none;width:100%;height:24px;background:transparent;outline:none;cursor:pointer}
            .agsl::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:linear-gradient(to right,#2D5A1B ${pct}%,rgba(245,240,232,.14) ${pct}%)}
            .agsl::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:#D4C4A0;border:3px solid #0A1A0A;box-shadow:0 0 0 2.5px #2D5A1B,0 4px 16px rgba(0,0,0,.5);margin-top:-11px;cursor:pointer;transition:transform .12s}
            .agsl:active::-webkit-slider-thumb{transform:scale(1.22)}
            .agsl::-moz-range-track{height:6px;border-radius:99px;background:rgba(245,240,232,.14)}
            .agsl::-moz-range-progress{height:6px;border-radius:99px;background:#2D5A1B}
            .agsl::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:#D4C4A0;border:3px solid #0A1A0A;box-shadow:0 0 0 2.5px #2D5A1B;cursor:pointer}
            .leaflet-control-attribution{font-size:8px!important;opacity:.3;background:rgba(10,26,10,.6)!important;color:#F5F0E8!important}
            .leaflet-control-attribution a{color:#D4C4A0!important}
          `}</style>

          {/* Backdrop */}
          <motion.div className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(5px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
          />

          {/* Outer motion layer — spring + drag only, no overflow */}
          <motion.div
            drag="y" dragControls={dragControls} dragListener={false}
            dragConstraints={{ top: 0 }} dragElastic={{ top: 0, bottom: 0.45 }}
            onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 600) onClose(); }}
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ height: '88vh' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 330, damping: 34 }}
          >
            {/*
              Inner card uses CSS GRID — 5 rows:
                [handle][header][map][1fr scrollable][CTA]
              Grid guarantees the 1fr middle takes exactly the leftover space.
              overflow:hidden on the grid container clips any stray overflow.
            */}
            <div
              className="rounded-t-[28px] h-full"
              style={{
                background: '#0F1F0F',
                border: '1px solid rgba(245,240,232,0.09)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateRows: `36px auto ${MAP_H}px 1fr auto`,
              }}
            >

              {/* Row 1 — Drag handle (36px) */}
              <div
                className="flex justify-center items-center select-none cursor-grab active:cursor-grabbing"
                onPointerDown={e => dragControls.start(e)}
                style={{ touchAction: 'none' }}
              >
                <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(245,240,232,0.22)' }} />
              </div>

              {/* Row 2 — Header (auto) */}
              <div className="flex items-start justify-between px-5 pb-3">
                <div>
                  <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '20px', letterSpacing: '-0.03em' }}>
                    {isMr ? 'स्थान निवडा' : 'Select Location'}
                  </h2>
                  <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.38)', marginTop: 2 }}>
                    {isMr ? 'नकाशावर टाचणी ड्रॅग करा किंवा टॅप करा' : 'Drag the pin or tap anywhere on the map'}
                  </p>
                </div>
                <button onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all"
                  style={{ background: 'rgba(245,240,232,0.07)', touchAction: 'manipulation' }}
                  aria-label="Close"
                >
                  <X size={16} style={{ color: 'rgba(245,240,232,0.55)' }} />
                </button>
              </div>

              {/* Row 3 — Map (MAP_H px) */}
              <div className="relative" style={{ height: MAP_H }}>
                <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
                <button onClick={handleGPS}
                  className="absolute bottom-3 right-3 z-[9999] flex items-center gap-2 px-3.5 py-2.5 rounded-xl active:scale-95 transition-all"
                  style={{ background: '#0F1F0F', border: '1px solid rgba(74,140,42,0.6)', boxShadow: '0 4px 18px rgba(0,0,0,.5)', touchAction: 'manipulation' }}
                >
                  {locating
                    ? <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#4A8C2A', borderTopColor: 'transparent' }} />
                    : <Locate size={14} style={{ color: '#4A8C2A' }} />}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#D4C4A0' }}>
                    {locating ? (isMr ? 'शोधत…' : 'Locating…') : (isMr ? 'माझे स्थान' : 'My Location')}
                  </span>
                </button>
              </div>

              {/* Row 4 — Scrollable middle (1fr = remaining space) */}
              <div style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>

                {/* Selected area */}
                <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(245,240,232,0.07)', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', marginBottom: 6 }}>
                    {isMr ? 'निवडलेला प्रदेश / क्षेत्र' : 'Selected Region / Area'}
                  </p>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} style={{ color: '#4A8C2A', flexShrink: 0, marginTop: 1 }} />
                    {geocoding ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: '#4A8C2A', borderTopColor: 'transparent' }} />
                        <span style={{ fontSize: '13px', color: 'rgba(245,240,232,0.4)', fontWeight: 300 }}>
                          {isMr ? 'पत्ता शोधत आहे…' : 'Finding address…'}
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: '14px', fontWeight: pinLabel ? 400 : 300, color: pinLabel ? '#F5F0E8' : 'rgba(245,240,232,0.3)', lineHeight: 1.4 }}>
                        {pinLabel
                          ? (isMr ? pinLabelMr ?? pinLabel : pinLabel)
                          : (isMr ? 'नकाशावर टॅप करा किंवा माझे स्थान दाबा' : 'Tap on map or press My Location')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Radius slider */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>
                        {isMr ? 'शोध क्षेत्र (त्रिज्या)' : 'Search Radius'}
                      </p>
                      <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.3)', marginTop: 4 }}>{hint}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1, color: '#D4C4A0' }}>{radius}</span>
                      <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>km</span>
                    </div>
                  </div>
                  <input type="range" className="agsl" min={10} max={500} step={5} value={radius}
                    onChange={e => setRadius(Number(e.target.value))} />
                  <div className="flex justify-between mt-2">
                    <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>10 km</span>
                    <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>500 km</span>
                  </div>
                </div>

              </div>{/* end scrollable */}

              {/* Row 5 — CTA (auto height, always visible) */}
              <div
                style={{
                  display: 'flex', gap: 12, padding: '16px 20px',
                  paddingBottom: 'max(20px, env(safe-area-inset-bottom,0px) + 16px)',
                  borderTop: '1px solid rgba(245,240,232,0.09)',
                  background: '#0A1A0A',
                }}
              >
                <button onClick={onClose}
                  style={{ flex: 1, height: 52, borderRadius: 99, border: '1px solid rgba(245,240,232,0.2)', color: 'rgba(245,240,232,0.7)', fontSize: 15, fontWeight: 500, background: 'transparent', cursor: 'pointer', touchAction: 'manipulation' }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button onClick={handleOk}
                  style={{ flex: 1, height: 52, borderRadius: 99, background: '#2D5A1B', color: '#F5F0E8', fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, touchAction: 'manipulation' }}
                >
                  <MapPin size={16} />
                  {isMr ? 'ठीक आहे' : 'OK'}
                </button>
              </div>

            </div>{/* end grid */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
