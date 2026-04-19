import React, { useState } from 'react';
import { X, MapPin, Navigation, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [radius, setRadius] = useState(current.radius);

  const sliderPct = ((radius - 10) / (500 - 10)) * 100;

  const handleApply = () => {
    const reg = MH_REGIONS.find(r => r.id === selectedRegion) ?? MH_REGIONS[0];
    onApply({ region: reg.id, regionLabel: reg.label, regionLabelMr: reg.labelMr, radius });
    onClose();
  };

  const handleReset = () => {
    setSelectedRegion('all');
    setRadius(100);
  };

  const radiusHint = radius <= 50
    ? (isMr ? 'अगदी जवळचे' : 'Hyper-local')
    : radius <= 150
    ? (isMr ? 'जिल्हा स्तर' : 'District level')
    : radius <= 300
    ? (isMr ? 'विभाग स्तर' : 'Division level')
    : (isMr ? 'राज्य-व्यापी' : 'State-wide');

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
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0F1F0F 0%, #0A1A0A 100%)',
              border: '1px solid rgba(245,240,232,0.09)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(245,240,232,0.18)' }} />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-2 pb-5">
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

            {/* Use current location */}
            <div className="px-6 mb-5">
              <button
                className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-left active:scale-[0.98] transition-all"
                style={{
                  background: 'rgba(45,90,27,0.12)',
                  border: '1px solid rgba(74,140,42,0.28)',
                  touchAction: 'manipulation',
                }}
                onClick={() => setSelectedRegion('all')}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,140,42,0.18)' }}
                >
                  <Navigation size={17} style={{ color: '#4A8C2A' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#F5F0E8]" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                    {isMr ? 'माझे सध्याचे स्थान' : 'Use current location'}
                  </p>
                  <p className="font-light mt-0.5" style={{ fontSize: '11px', color: 'rgba(245,240,232,0.38)' }}>
                    {isMr ? 'GPS द्वारे स्वयंचलित' : 'Auto-detect via GPS'}
                  </p>
                </div>
                <ChevronRight size={14} style={{ color: 'rgba(245,240,232,0.22)', flexShrink: 0 }} />
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-6 mb-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(245,240,232,0.06)' }} />
              <span className="font-medium" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(245,240,232,0.22)', textTransform: 'uppercase' }}>
                {isMr ? 'किंवा जिल्हा निवडा' : 'Or choose a district'}
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(245,240,232,0.06)' }} />
            </div>

            {/* Region grid */}
            <div className="px-6 mb-6">
              <div className="grid grid-cols-3 gap-2">
                {MH_REGIONS.map(reg => {
                  const active = selectedRegion === reg.id;
                  return (
                    <button
                      key={reg.id}
                      onClick={() => setSelectedRegion(reg.id)}
                      className="flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl transition-all active:scale-95"
                      style={{
                        background: active ? 'rgba(45,90,27,0.28)' : 'rgba(245,240,232,0.04)',
                        border: active ? '1px solid rgba(74,140,42,0.48)' : '1px solid rgba(245,240,232,0.07)',
                        touchAction: 'manipulation',
                      }}
                      aria-pressed={active}
                    >
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4A8C2A' }} />
                      )}
                      <span
                        className="truncate font-medium"
                        style={{
                          fontSize: reg.id === 'all' ? '10px' : '11px',
                          letterSpacing: '0.01em',
                          color: active ? '#D4C4A0' : 'rgba(245,240,232,0.5)',
                        }}
                      >
                        {isMr ? reg.labelMr : reg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Radius slider — only when a specific region is chosen */}
            <AnimatePresence>
              {selectedRegion !== 'all' && (
                <motion.div
                  className="px-6 mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="p-5 rounded-2xl"
                    style={{ background: 'rgba(245,240,232,0.035)', border: '1px solid rgba(245,240,232,0.08)' }}
                  >
                    {/* Label row */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>
                          {isMr ? 'शोध क्षेत्र' : 'Search Radius'}
                        </p>
                        <p className="font-light mt-1" style={{ fontSize: '11px', color: 'rgba(245,240,232,0.3)' }}>
                          {radiusHint}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-light text-[#D4C4A0]" style={{ fontSize: '28px', letterSpacing: '-0.04em', lineHeight: 1 }}>
                          {radius}
                        </span>
                        <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>
                          km
                        </span>
                      </div>
                    </div>

                    {/* Slider */}
                    <style>{`
                      .agri-radius-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 20px; background: transparent; outline: none; cursor: pointer; }
                      .agri-radius-slider::-webkit-slider-runnable-track { height: 5px; border-radius: 99px; background: linear-gradient(to right, #2D5A1B ${sliderPct}%, rgba(245,240,232,0.12) ${sliderPct}%); }
                      .agri-radius-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #D4C4A0; border: 3px solid #0A1A0A; box-shadow: 0 0 0 2.5px #2D5A1B, 0 4px 16px rgba(0,0,0,0.5); margin-top: -10px; cursor: pointer; transition: transform 0.1s; }
                      .agri-radius-slider:active::-webkit-slider-thumb { transform: scale(1.18); }
                      .agri-radius-slider::-moz-range-track { height: 5px; border-radius: 99px; background: rgba(245,240,232,0.12); }
                      .agri-radius-slider::-moz-range-progress { height: 5px; border-radius: 99px; background: #2D5A1B; }
                      .agri-radius-slider::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: #D4C4A0; border: 3px solid #0A1A0A; box-shadow: 0 0 0 2.5px #2D5A1B; cursor: pointer; }
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

                    {/* Min/max */}
                    <div className="flex justify-between mt-1">
                      <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>10 km</span>
                      <span style={{ fontSize: '9px', color: 'rgba(245,240,232,0.22)', fontWeight: 500 }}>500 km</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA buttons */}
            <div className="flex gap-3 px-6 pb-safe" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px) + 24px)' }}>
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
