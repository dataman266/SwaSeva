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

// Maharashtra center as default map view
const DEFAULT_LAT = 19.7515;
const DEFAULT_LNG = 75.7139;

interface Props {
  isOpen: boolean;
  current: LocationFilter;
  isMr: boolean;
  onApply: (f: LocationFilter) => void;
  onClose: () => void;
}

function makeMarkerIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center">
        <div style="
          position:absolute;inset:0;
          background:rgba(45,90,27,0.25);
          border-radius:50%;
          animation:locPulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position:relative;
          width:20px;height:20px;
          background:#2D5A1B;
          border:3px solid #D4C4A0;
          border-radius:50%;
          box-shadow:0 2px 10px rgba(0,0,0,0.5);
        "></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export default function LocationPickerModal({ isOpen, current, isMr, onApply, onClose }: Props) {
  const [radius, setRadius] = useState(current.radius);
  const [pinLabel, setPinLabel]   = useState<string | null>(
    current.region !== 'all' ? current.regionLabel : null
  );
  const [pinLabelMr, setPinLabelMr] = useState<string | null>(
    current.region !== 'all' ? current.regionLabelMr : null
  );
  const [pinLat, setPinLat] = useState<number | null>(current.lat ?? null);
  const [pinLng, setPinLng] = useState<number | null>(current.lng ?? null);
  const [locating, setLocating]   = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const mapDivRef  = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<L.Map | null>(null);
  const markerRef  = useRef<L.Marker | null>(null);
  const dragControls = useDragControls();

  // Sync when reopened
  useEffect(() => {
    if (isOpen) {
      setRadius(current.radius);
      setPinLabel(current.region !== 'all' ? current.regionLabel : null);
      setPinLabelMr(current.region !== 'all' ? current.regionLabelMr : null);
      setPinLat(current.lat ?? null);
      setPinLng(current.lng ?? null);
    }
  }, [isOpen]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Reverse-geocode a coordinate and update pin label
  const geocodeLatLng = async (lat: number, lng: number) => {
    setGeocoding(true);
    setPinLat(lat);
    setPinLng(lng);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=12&accept-language=en`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const d = await res.json();
      const label =
        d.address.village ||
        d.address.suburb ||
        d.address.neighbourhood ||
        d.address.town ||
        d.address.city_district ||
        d.address.city ||
        d.address.county ||
        d.address.state ||
        'Selected area';
      const district = d.address.county || d.address.state_district || '';
      const state    = d.address.state || '';
      const full = [label, district, state].filter(Boolean).join(', ');
      setPinLabel(full);
      setPinLabelMr(full);
    } catch {
      setPinLabel('Selected area');
      setPinLabelMr('निवडलेले क्षेत्र');
    }
    setGeocoding(false);
  };

  // Init / destroy Leaflet map
  useEffect(() => {
    if (!isOpen) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    // Wait for spring animation to settle before measuring container
    const timer = setTimeout(() => {
      if (!mapDivRef.current || mapRef.current) return;

      const initLat = pinLat ?? DEFAULT_LAT;
      const initLng = pinLng ?? DEFAULT_LNG;

      const map = L.map(mapDivRef.current, {
        center: [initLat, initLng],
        zoom: pinLat ? 13 : 7,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Attribution (small, bottom-left)
      L.control.attribution({ prefix: '© OSM', position: 'bottomleft' }).addTo(map);

      const marker = L.marker([initLat, initLng], {
        draggable: true,
        icon: makeMarkerIcon(),
      }).addTo(map);

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        geocodeLatLng(lat, lng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        geocodeLatLng(e.latlng.lat, e.latlng.lng);
      });

      map.invalidateSize();
      mapRef.current = map;
      markerRef.current = marker;
    }, 380);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleUseCurrentLocation = () => {
    if (locating || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          mapRef.current.setView([lat, lng], 14, { animate: true });
        }
        geocodeLatLng(lat, lng);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleOk = () => {
    if (pinLabel && pinLat != null && pinLng != null) {
      onApply({
        region: pinLabel,
        regionLabel: pinLabel,
        regionLabelMr: pinLabelMr ?? pinLabel,
        radius,
        lat: pinLat,
        lng: pinLng,
      });
    } else {
      onApply({ ...DEFAULT_LOCATION_FILTER, radius });
    }
    onClose();
  };

  const sliderPct = ((radius - 10) / (500 - 10)) * 100;

  const radiusHint =
    radius <= 25  ? (isMr ? 'अगदी जवळचे' : 'Hyper-local') :
    radius <= 75  ? (isMr ? 'शहर स्तर'  : 'City level')   :
    radius <= 200 ? (isMr ? 'जिल्हा स्तर' : 'District level') :
                    (isMr ? 'विभाग-व्यापी' : 'Region-wide');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Global styles for pulse + slider */}
          <style>{`
            @keyframes locPulse {
              0%,100% { transform:scale(1); opacity:0.5; }
              50%      { transform:scale(1.7); opacity:0.1; }
            }
            .agri-slider {
              -webkit-appearance:none; appearance:none;
              width:100%; height:22px;
              background:transparent; outline:none; cursor:pointer;
            }
            .agri-slider::-webkit-slider-runnable-track {
              height:6px; border-radius:99px;
              background:linear-gradient(to right,#2D5A1B ${sliderPct}%,rgba(245,240,232,0.13) ${sliderPct}%);
            }
            .agri-slider::-webkit-slider-thumb {
              -webkit-appearance:none;
              width:28px; height:28px; border-radius:50%;
              background:#D4C4A0; border:3px solid #0A1A0A;
              box-shadow:0 0 0 2.5px #2D5A1B,0 4px 16px rgba(0,0,0,0.5);
              margin-top:-11px; cursor:pointer; transition:transform .12s ease;
            }
            .agri-slider:active::-webkit-slider-thumb { transform:scale(1.22); }
            .agri-slider::-moz-range-track {
              height:6px; border-radius:99px; background:rgba(245,240,232,0.13);
            }
            .agri-slider::-moz-range-progress {
              height:6px; border-radius:99px; background:#2D5A1B;
            }
            .agri-slider::-moz-range-thumb {
              width:28px; height:28px; border-radius:50%;
              background:#D4C4A0; border:3px solid #0A1A0A;
              box-shadow:0 0 0 2.5px #2D5A1B; cursor:pointer;
            }
            .leaflet-container { font-family:inherit; }
            .leaflet-control-attribution { font-size:8px !important; opacity:0.4; background:rgba(10,26,10,0.6) !important; color:#F5F0E8 !important; }
            .leaflet-control-attribution a { color:#D4C4A0 !important; }
          `}</style>

          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(5px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.45 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] flex flex-col overflow-hidden"
            style={{
              background: '#0F1F0F',
              border: '1px solid rgba(245,240,232,0.09)',
              height: '90dvh',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 330, damping: 34 }}
          >
            {/* ── Drag handle ────────────────────────────── */}
            <div
              className="flex justify-center pt-3 pb-2 select-none flex-shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={e => dragControls.start(e)}
              style={{ touchAction: 'none' }}
            >
              <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(245,240,232,0.22)' }} />
            </div>

            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-start justify-between px-5 pt-1 pb-3 flex-shrink-0">
              <div>
                <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '20px', letterSpacing: '-0.03em' }}>
                  {isMr ? 'स्थान निवडा' : 'Select Location'}
                </h2>
                <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.38)', marginTop: 2 }}>
                  {isMr ? 'नकाशावर टाचणी ड्रॅग करा किंवा टॅप करा' : 'Drag the pin or tap anywhere on the map'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                style={{ background: 'rgba(245,240,232,0.07)', touchAction: 'manipulation' }}
                aria-label="Close"
              >
                <X size={16} style={{ color: 'rgba(245,240,232,0.55)' }} />
              </button>
            </div>

            {/* ── Map ────────────────────────────────────── */}
            <div className="relative flex-shrink-0" style={{ height: '44%' }}>
              <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />

              {/* My Location overlay button */}
              <button
                onClick={handleUseCurrentLocation}
                className="absolute bottom-3 right-3 z-[9999] flex items-center gap-2 px-3.5 py-2.5 rounded-xl active:scale-95 transition-all"
                style={{
                  background: '#0F1F0F',
                  border: '1px solid rgba(74,140,42,0.55)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                  touchAction: 'manipulation',
                }}
              >
                {locating ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#4A8C2A', borderTopColor: 'transparent' }}
                  />
                ) : (
                  <Locate size={14} style={{ color: '#4A8C2A' }} />
                )}
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#D4C4A0', letterSpacing: '0.02em' }}>
                  {locating
                    ? (isMr ? 'शोधत आहे…' : 'Locating…')
                    : (isMr ? 'माझे स्थान' : 'My Location')}
                </span>
              </button>
            </div>

            {/* ── Selected area display ──────────────────── */}
            <div
              className="px-5 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(245,240,232,0.07)', borderBottom: '1px solid rgba(245,240,232,0.07)' }}
            >
              <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', marginBottom: 6 }}>
                {isMr ? 'निवडलेला प्रदेश / क्षेत्र' : 'Selected Region / Area'}
              </p>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} style={{ color: '#4A8C2A', flexShrink: 0 }} />
                {geocoding ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: '#4A8C2A', borderTopColor: 'transparent' }}
                    />
                    <span style={{ fontSize: '13px', color: 'rgba(245,240,232,0.4)', fontWeight: 300 }}>
                      {isMr ? 'पत्ता शोधत आहे…' : 'Finding address…'}
                    </span>
                  </div>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    fontWeight: pinLabel ? 400 : 300,
                    color: pinLabel ? '#F5F0E8' : 'rgba(245,240,232,0.3)',
                    lineHeight: 1.35,
                  }}>
                    {pinLabel
                      ? (isMr ? pinLabelMr ?? pinLabel : pinLabel)
                      : (isMr ? 'नकाशावर टाचणी ठेवा किंवा माझे स्थान दाबा' : 'Tap on the map or press My Location')}
                  </p>
                )}
              </div>
            </div>

            {/* ── Radius slider ──────────────────────────── */}
            <div className="px-5 py-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>
                    {isMr ? 'शोध क्षेत्र (त्रिज्या)' : 'Search Radius'}
                  </p>
                  <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.3)', marginTop: 4 }}>
                    {radiusHint}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1, color: '#D4C4A0' }}>
                    {radius}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>
                    km
                  </span>
                </div>
              </div>

              <input
                type="range"
                className="agri-slider"
                min={10}
                max={500}
                step={5}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
              />
              <div className="flex justify-between mt-2">
                <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>10 km</span>
                <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>500 km</span>
              </div>
            </div>

            {/* Spacer to push CTA to bottom */}
            <div className="flex-1" />

            {/* ── CTA buttons ───────────────────────────── */}
            <div
              className="flex gap-3 px-5 py-4 flex-shrink-0"
              style={{
                borderTop: '1px solid rgba(245,240,232,0.06)',
                background: '#0A1A0A',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom,0px) + 16px)',
              }}
            >
              <button
                onClick={onClose}
                className="flex-1 h-13 rounded-full font-medium active:scale-95 transition-all"
                style={{
                  height: 52,
                  border: '1px solid rgba(245,240,232,0.16)',
                  color: 'rgba(245,240,232,0.6)',
                  fontSize: '15px',
                  touchAction: 'manipulation',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                onClick={handleOk}
                className="flex-1 flex items-center justify-center gap-2 rounded-full font-medium text-[#F5F0E8] active:scale-95 transition-all"
                style={{
                  height: 52,
                  background: '#2D5A1B',
                  fontSize: '15px',
                  letterSpacing: '0.03em',
                  touchAction: 'manipulation',
                }}
              >
                <MapPin size={16} />
                {isMr ? 'ठीक आहे' : 'OK'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
