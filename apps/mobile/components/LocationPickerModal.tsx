import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';

export interface LocationFilter {
  region: string;
  regionLabel: string;
  regionLabelMr: string;
  radius: number;
}

export const DEFAULT_LOCATION_FILTER: LocationFilter = {
  region: 'all',
  regionLabel: 'All Maharashtra',
  regionLabelMr: 'सर्व महाराष्ट्र',
  radius: 100,
};

const MH_REGIONS = [
  { id: 'all',        label: 'All Maharashtra', labelMr: 'सर्व महाराष्ट्र' },
  { id: 'Pune',       label: 'Pune',            labelMr: 'पुणे'            },
  { id: 'Nashik',     label: 'Nashik',          labelMr: 'नाशिक'           },
  { id: 'Mumbai',     label: 'Mumbai',          labelMr: 'मुंबई'           },
  { id: 'Nagpur',     label: 'Nagpur',          labelMr: 'नागपूर'          },
  { id: 'Aurangabad', label: 'Aurangabad',      labelMr: 'औरंगाबाद'       },
  { id: 'Kolhapur',   label: 'Kolhapur',        labelMr: 'कोल्हापूर'       },
  { id: 'Solapur',    label: 'Solapur',         labelMr: 'सोलापूर'         },
  { id: 'Amravati',   label: 'Amravati',        labelMr: 'अमरावती'         },
  { id: 'Latur',      label: 'Latur',           labelMr: 'लातूर'           },
  { id: 'Jalgaon',    label: 'Jalgaon',         labelMr: 'जळगाव'           },
  { id: 'Satara',     label: 'Satara',          labelMr: 'सातारा'          },
  { id: 'Sangli',     label: 'Sangli',          labelMr: 'सांगली'          },
  { id: 'Akola',      label: 'Akola',           labelMr: 'अकोला'           },
  { id: 'Dhule',      label: 'Dhule',           labelMr: 'धुळे'            },
  { id: 'Nanded',     label: 'Nanded',          labelMr: 'नांदेड'          },
];

interface Props {
  isOpen: boolean;
  current: LocationFilter;
  isMr: boolean;
  onApply: (f: LocationFilter) => void;
  onClose: () => void;
}

export default function LocationPickerModal({ isOpen, current, isMr, onApply, onClose }: Props) {
  const [selectedRegion, setSelectedRegion] = useState(current.region);
  const [radius, setRadius]                 = useState(current.radius);
  const [districtSearch, setDistrictSearch] = useState('');
  const [locating, setLocating]             = useState(false);
  const dragControls = useDragControls();

  // Sync state when modal reopens
  useEffect(() => {
    if (isOpen) {
      setSelectedRegion(current.region);
      setRadius(current.radius);
      setDistrictSearch('');
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
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

  const sliderPct = ((radius - 10) / (500 - 10)) * 100;

  const handleApply = () => {
    const reg = MH_REGIONS.find(r => r.id === selectedRegion) ?? MH_REGIONS[0];
    onApply({ region: reg.id, regionLabel: reg.label, regionLabelMr: reg.labelMr, radius });
    onClose();
  };

  const handleReset = () => {
    setSelectedRegion('all');
    setRadius(100);
    setDistrictSearch('');
  };

  const handleUseCurrentLocation = () => {
    if (locating) return;
    setLocating(true);
    if (!navigator.geolocation) {
      setSelectedRegion('all');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=8`
          );
          const data = await res.json();
          const city = (data.address.county || data.address.city || data.address.town || '').toLowerCase();
          const match = MH_REGIONS.find(r =>
            r.id !== 'all' && city.includes(r.id.toLowerCase())
          );
          setSelectedRegion(match ? match.id : 'all');
        } catch {
          setSelectedRegion('all');
        }
        setLocating(false);
      },
      () => { setSelectedRegion('all'); setLocating(false); },
      { timeout: 10000 }
    );
  };

  const radiusHint = radius <= 50
    ? (isMr ? 'अगदी जवळचे' : 'Hyper-local')
    : radius <= 150
    ? (isMr ? 'जिल्हा स्तर' : 'District level')
    : radius <= 300
    ? (isMr ? 'विभाग स्तर' : 'Division level')
    : (isMr ? 'राज्य-व्यापी' : 'State-wide');

  const filteredRegions = MH_REGIONS.filter(r =>
    r.id === 'all' ||
    r.label.toLowerCase().includes(districtSearch.toLowerCase()) ||
    r.labelMr.includes(districtSearch)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #0F1F0F 0%, #0A1A0A 100%)',
              border: '1px solid rgba(245,240,232,0.09)',
              maxHeight: '92vh',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          >
            {/* Drag handle — only this strip initiates drag */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
              onPointerDown={e => dragControls.start(e)}
              style={{ touchAction: 'none' }}
            >
              <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(245,240,232,0.22)' }} />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-2 pb-4">
              <div>
                <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '22px', letterSpacing: '-0.03em' }}>
                  {isMr ? 'स्थान निवडा' : 'Select Location'}
                </h2>
                <p className="text-[12px] font-light mt-1" style={{ color: 'rgba(245,240,232,0.38)' }}>
                  {isMr ? 'जवळच्या लिस्टिंग आधी पाहा' : 'See nearby listings first'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all mt-1"
                style={{ background: 'rgba(245,240,232,0.07)', touchAction: 'manipulation' }}
                aria-label="Close"
              >
                <X size={16} style={{ color: 'rgba(245,240,232,0.55)' }} />
              </button>
            </div>

            {/* Scrollable content — overscrollBehavior prevents bleed to background */}
            <div
              className="flex-1 overflow-y-auto px-6 pb-2"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            >
              {/* Use current location */}
              <button
                className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-left transition-all mb-5"
                style={{
                  background: 'rgba(45,90,27,0.12)',
                  border: '1px solid rgba(74,140,42,0.28)',
                  touchAction: 'manipulation',
                  opacity: locating ? 0.75 : 1,
                  WebkitTapHighlightColor: 'rgba(74,140,42,0.1)',
                }}
                onClick={handleUseCurrentLocation}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,140,42,0.18)' }}
                >
                  {locating ? (
                    <div
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: '#4A8C2A', borderTopColor: 'transparent' }}
                    />
                  ) : (
                    <Navigation size={17} style={{ color: '#4A8C2A' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#F5F0E8]" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                    {isMr ? 'माझे सध्याचे स्थान' : 'Use current location'}
                  </p>
                  <p className="font-light mt-0.5" style={{ fontSize: '11px', color: 'rgba(245,240,232,0.38)' }}>
                    {locating
                      ? (isMr ? 'GPS शोधत आहे...' : 'Detecting via GPS…')
                      : (isMr ? 'GPS द्वारे स्वयंचलित' : 'Auto-detect via GPS')}
                  </p>
                </div>
                {!locating && (
                  <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.22)', flexShrink: 0 }} />
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'rgba(245,240,232,0.06)' }} />
                <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.22)' }}>
                  {isMr ? 'किंवा जिल्हा निवडा' : 'Or choose a district'}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(245,240,232,0.06)' }} />
              </div>

              {/* District search bar */}
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-2"
                style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}
              >
                <Search size={14} style={{ color: 'rgba(245,240,232,0.3)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={isMr ? 'जिल्हा शोधा...' : 'Search district...'}
                  value={districtSearch}
                  onChange={e => setDistrictSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-light placeholder:text-[rgba(245,240,232,0.22)]"
                  style={{ fontSize: '13px', color: '#F5F0E8' }}
                />
                {districtSearch !== '' && (
                  <button
                    onClick={() => setDistrictSearch('')}
                    style={{ touchAction: 'manipulation', flexShrink: 0 }}
                  >
                    <X size={13} style={{ color: 'rgba(245,240,232,0.3)' }} />
                  </button>
                )}
              </div>

              {/* District list */}
              <div className="flex flex-col mb-5">
                {filteredRegions.map(reg => {
                  const active = selectedRegion === reg.id;
                  return (
                    <button
                      key={reg.id}
                      onClick={() => setSelectedRegion(reg.id)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full text-left active:scale-[0.99]"
                      style={{
                        background: active ? 'rgba(45,90,27,0.22)' : 'transparent',
                        border: active
                          ? '1px solid rgba(74,140,42,0.38)'
                          : '1px solid transparent',
                        marginBottom: '2px',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(45,90,27,0.1)',
                      }}
                      aria-pressed={active}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: active ? '#4A8C2A' : 'rgba(245,240,232,0.15)' }}
                      />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: active ? 500 : 300,
                        color: active ? '#D4C4A0' : 'rgba(245,240,232,0.55)',
                        letterSpacing: '0.01em',
                        flex: 1,
                      }}>
                        {isMr ? reg.labelMr : reg.label}
                      </span>
                      {active && (
                        <span style={{ fontSize: '14px', color: '#4A8C2A' }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Radius slider — slides in when a specific region is chosen */}
              <AnimatePresence>
                {selectedRegion !== 'all' && (
                  <motion.div
                    className="mb-5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div
                      className="p-5 rounded-2xl"
                      style={{ background: 'rgba(245,240,232,0.035)', border: '1px solid rgba(245,240,232,0.08)' }}
                    >
                      {/* Label row */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>
                            {isMr ? 'शोध क्षेत्र' : 'Search Radius'}
                          </p>
                          <p style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(245,240,232,0.3)', marginTop: 4 }}>
                            {radiusHint}
                          </p>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-light text-[#D4C4A0]" style={{ fontSize: '28px', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            {radius}
                          </span>
                          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>
                            km
                          </span>
                        </div>
                      </div>

                      {/* Custom slider */}
                      <style>{`
                        .agri-radius-slider {
                          -webkit-appearance: none;
                          appearance: none;
                          width: 100%;
                          height: 20px;
                          background: transparent;
                          outline: none;
                          cursor: pointer;
                        }
                        .agri-radius-slider::-webkit-slider-runnable-track {
                          height: 6px;
                          border-radius: 99px;
                          background: linear-gradient(
                            to right,
                            #2D5A1B ${sliderPct}%,
                            rgba(245,240,232,0.12) ${sliderPct}%
                          );
                        }
                        .agri-radius-slider::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          width: 26px;
                          height: 26px;
                          border-radius: 50%;
                          background: #D4C4A0;
                          border: 3px solid #0A1A0A;
                          box-shadow: 0 0 0 2.5px #2D5A1B, 0 4px 16px rgba(0,0,0,0.5);
                          margin-top: -10px;
                          cursor: pointer;
                          transition: transform 0.12s ease;
                        }
                        .agri-radius-slider:active::-webkit-slider-thumb {
                          transform: scale(1.2);
                        }
                        .agri-radius-slider::-moz-range-track {
                          height: 6px;
                          border-radius: 99px;
                          background: rgba(245,240,232,0.12);
                        }
                        .agri-radius-slider::-moz-range-progress {
                          height: 6px;
                          border-radius: 99px;
                          background: #2D5A1B;
                        }
                        .agri-radius-slider::-moz-range-thumb {
                          width: 26px;
                          height: 26px;
                          border-radius: 50%;
                          background: #D4C4A0;
                          border: 3px solid #0A1A0A;
                          box-shadow: 0 0 0 2.5px #2D5A1B;
                          cursor: pointer;
                        }
                      `}</style>
                      <input
                        type="range"
                        className="agri-radius-slider"
                        min={10}
                        max={500}
                        step={10}
                        value={radius}
                        onChange={e => setRadius(Number(e.target.value))}
                      />

                      <div className="flex justify-between mt-2">
                        <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>10 km</span>
                        <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>500 km</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixed CTA row */}
            <div
              className="flex gap-3 px-6 py-4"
              style={{
                borderTop: '1px solid rgba(245,240,232,0.06)',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px) + 16px)',
                background: '#0A1A0A',
              }}
            >
              <button
                onClick={handleReset}
                className="h-12 px-6 rounded-full font-medium active:scale-95 transition-all"
                style={{
                  border: '1px solid rgba(245,240,232,0.14)',
                  color: 'rgba(245,240,232,0.5)',
                  fontSize: '13px',
                  touchAction: 'manipulation',
                }}
              >
                {isMr ? 'रीसेट' : 'Reset'}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full font-medium text-[#F5F0E8] active:scale-95 transition-all"
                style={{ background: '#2D5A1B', fontSize: '13px', letterSpacing: '0.04em', touchAction: 'manipulation' }}
              >
                <MapPin size={15} />
                {isMr ? 'लागू करा' : 'Apply Filter'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
