import React, { useState } from 'react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { Language } from '../types.ts';
import SectionReveal from './atoms/SectionReveal.tsx';

interface CropCalendarScreenProps {
  lang: Language;
  onBack: () => void;
}

// ── Data ──────────────────────────────────────────────────────────────────────
type Season = 'kharif' | 'rabi' | 'zaid';
type Phase  = 'sow' | 'grow' | 'harvest';

interface Crop {
  name: string;
  nameMr: string;
  season: Season;
  // month indices (0=Jan, 5=Jun, etc.)
  sow:     number[];
  grow:    number[];
  harvest: number[];
}

const CROPS: Crop[] = [
  // Kharif — sown June onwards
  { name: 'Rice',       nameMr: 'भात',      season: 'kharif', sow:[5,6],    grow:[7,8],    harvest:[9,10]  },
  { name: 'Soybean',    nameMr: 'सोयाबीन',  season: 'kharif', sow:[5,6],    grow:[7,8],    harvest:[8,9]   },
  { name: 'Cotton',     nameMr: 'कापूस',    season: 'kharif', sow:[4,5],    grow:[6,9],    harvest:[10,11] },
  { name: 'Groundnut',  nameMr: 'भुईमूग',   season: 'kharif', sow:[5,6],    grow:[7,8],    harvest:[8,9]   },
  { name: 'Bajra',      nameMr: 'बाजरी',    season: 'kharif', sow:[5,6],    grow:[7,8],    harvest:[8,9]   },
  { name: 'Tur Dal',    nameMr: 'तूर',      season: 'kharif', sow:[5,6],    grow:[7,10],   harvest:[11,0]  },
  // Rabi — sown Oct onwards
  { name: 'Wheat',      nameMr: 'गहू',      season: 'rabi',   sow:[9,10],   grow:[11,0],   harvest:[1,2]   },
  { name: 'Gram',       nameMr: 'हरभरा',    season: 'rabi',   sow:[9,10],   grow:[11,0],   harvest:[1,2]   },
  { name: 'Onion',      nameMr: 'कांदा',    season: 'rabi',   sow:[9,10],   grow:[11,0],   harvest:[1,2]   },
  { name: 'Sunflower',  nameMr: 'सूर्यफूल', season: 'rabi',   sow:[9,10],   grow:[11,0],   harvest:[1,2]   },
  // Zaid — summer crop
  { name: 'Watermelon', nameMr: 'कलिंगड',   season: 'zaid',   sow:[1,2],    grow:[3,4],    harvest:[4,5]   },
  { name: 'Cucumber',   nameMr: 'काकडी',    season: 'zaid',   sow:[1,2],    grow:[3,4],    harvest:[4,5]   },
];

const SEASON_META: Record<Season, { label: string; labelMr: string; color: string; bg: string; border: string }> = {
  kharif: { label: 'Kharif', labelMr: 'खरीफ', color: '#4A8C2A', bg: 'rgba(74,140,42,0.12)',  border: 'rgba(74,140,42,0.25)'  },
  rabi:   { label: 'Rabi',   labelMr: 'रब्बी', color: '#D4C4A0', bg: 'rgba(212,196,160,0.1)', border: 'rgba(212,196,160,0.2)' },
  zaid:   { label: 'Zaid',   labelMr: 'उन्हाळी',color: '#7EB3FF', bg: 'rgba(126,179,255,0.1)', border: 'rgba(126,179,255,0.2)' },
};

const PHASE_OPACITY: Record<Phase, number> = {
  sow:     1.0,
  grow:    0.45,
  harvest: 0.75,
};

const MONTHS_EN = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const MONTHS_MR = ['जा','फे','मा','अ','मे','जू','जु','ऑ','से','ऑ','न','डि'];

function getPhase(crop: Crop, month: number): Phase | null {
  if (crop.sow.includes(month))     return 'sow';
  if (crop.grow.includes(month))    return 'grow';
  if (crop.harvest.includes(month)) return 'harvest';
  return null;
}

// ── CropRow ──────────────────────────────────────────────────────────────────
function CropRow({ crop, isMr, currentMonth }: { crop: Crop; isMr: boolean; currentMonth: number }) {
  const meta = SEASON_META[crop.season];
  return (
    <div className="flex items-center gap-2">
      <p
        className="font-light flex-shrink-0"
        style={{ width: 72, fontSize: '11px', color: 'rgba(245,240,232,0.7)', textAlign: 'right' }}
      >
        {isMr ? crop.nameMr : crop.name}
      </p>
      <div className="flex gap-0.5 flex-1">
        {MONTHS_EN.map((_, m) => {
          const phase = getPhase(crop, m);
          const isCurrent = m === currentMonth;
          return (
            <div
              key={m}
              style={{
                flex: 1,
                height: 20,
                borderRadius: 3,
                background: phase
                  ? `rgba(${hexToRgb(meta.color)}, ${PHASE_OPACITY[phase]})`
                  : 'rgba(245,240,232,0.04)',
                outline: isCurrent ? '1.5px solid rgba(245,240,232,0.4)' : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CropCalendarScreen({ lang, onBack }: CropCalendarScreenProps) {
  const isMr = lang === Language.MARATHI;
  const currentMonth = new Date().getMonth();
  const [activeSeason, setActiveSeason] = useState<Season | 'all'>('all');

  const visibleCrops = activeSeason === 'all'
    ? CROPS
    : CROPS.filter(c => c.season === activeSeason);

  return (
    <div className="px-5 pt-8 pb-28 space-y-6" style={{ minHeight: '100vh' }}>

      {/* Header */}
      <SectionReveal>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.5)] active:scale-90 transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-0.5">
              {isMr ? 'महाराष्ट्र पीक माहिती' : 'Maharashtra Crop Guide'}
            </p>
            <h1 className="font-light text-[#F5F0E8]" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
              {isMr ? 'पीक दिनदर्शिका' : 'Crop Calendar'}
            </h1>
          </div>
        </div>
      </SectionReveal>

      {/* Current month banner */}
      <SectionReveal delay={60}>
        <div
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{ background: '#111C11', border: '1px solid rgba(74,140,42,0.2)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(74,140,42,0.12)', border: '1px solid rgba(74,140,42,0.25)' }}
          >
            <Sprout size={18} style={{ color: '#4A8C2A' }} />
          </div>
          <div>
            <p className="font-medium text-[#F5F0E8]" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
              {isMr ? 'सध्याचा महिना' : 'Current Month'} —{' '}
              {new Date().toLocaleString(isMr ? 'mr-IN' : 'en-IN', { month: 'long' })}
            </p>
            <p className="font-light text-[rgba(245,240,232,0.45)] mt-0.5" style={{ fontSize: '12px' }}>
              {isMr
                ? 'पांढऱ्या बॉर्डरने सध्याचा महिना दाखवला आहे'
                : 'White outline marks the current month in the grid below'}
            </p>
          </div>
        </div>
      </SectionReveal>

      {/* Season filter chips */}
      <SectionReveal delay={100}>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'kharif', 'rabi', 'zaid'] as const).map(s => {
            const active = activeSeason === s;
            const meta   = s === 'all' ? null : SEASON_META[s];
            return (
              <button
                key={s}
                onClick={() => setActiveSeason(s)}
                className="px-4 py-1.5 rounded-full border text-[11px] font-medium transition-all active:scale-95"
                style={{
                  touchAction: 'manipulation',
                  background: active ? (meta?.bg ?? 'rgba(245,240,232,0.1)') : 'transparent',
                  border: `1px solid ${active ? (meta?.border ?? 'rgba(245,240,232,0.2)') : 'rgba(245,240,232,0.1)'}`,
                  color: active ? (meta?.color ?? '#F5F0E8') : 'rgba(245,240,232,0.4)',
                }}
              >
                {s === 'all'
                  ? (isMr ? 'सर्व' : 'All')
                  : (isMr ? SEASON_META[s].labelMr : SEASON_META[s].label)}
              </button>
            );
          })}
        </div>
      </SectionReveal>

      {/* Legend */}
      <SectionReveal delay={120}>
        <div className="flex gap-4 flex-wrap">
          {(['sow','grow','harvest'] as Phase[]).map(phase => (
            <div key={phase} className="flex items-center gap-1.5">
              <div
                style={{
                  width: 14, height: 10, borderRadius: 2,
                  background: `rgba(74,140,42,${PHASE_OPACITY[phase]})`,
                }}
              />
              <span style={{ fontSize: '10px', color: 'rgba(245,240,232,0.45)', fontWeight: 400 }}>
                {isMr
                  ? phase === 'sow' ? 'पेरणी' : phase === 'grow' ? 'वाढ' : 'कापणी'
                  : phase === 'sow' ? 'Sow' : phase === 'grow' ? 'Grow' : 'Harvest'}
              </span>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Grid */}
      <SectionReveal delay={150}>
        <div
          className="rounded-2xl overflow-hidden p-4"
          style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.07)' }}
        >
          {/* Month header */}
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 72 }} />
            <div className="flex gap-0.5 flex-1">
              {(isMr ? MONTHS_MR : MONTHS_EN).map((m, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '8px',
                    fontWeight: i === currentMonth ? 600 : 400,
                    color: i === currentMonth ? '#D4C4A0' : 'rgba(245,240,232,0.3)',
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Crop rows grouped by season */}
          {(['kharif','rabi','zaid'] as Season[]).map(season => {
            const crops = visibleCrops.filter(c => c.season === season);
            if (!crops.length) return null;
            const meta = SEASON_META[season];
            return (
              <div key={season} className="mb-4">
                <p
                  className="text-[9px] font-medium tracking-[0.15em] uppercase mb-2 px-1"
                  style={{ color: meta.color }}
                >
                  {isMr ? meta.labelMr : meta.label}
                </p>
                <div className="space-y-1.5">
                  {crops.map(crop => (
                    <CropRow key={crop.name} crop={crop} isMr={isMr} currentMonth={currentMonth} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionReveal>

      {/* Source note */}
      <SectionReveal delay={200}>
        <p className="text-center opacity-25" style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {isMr ? 'स्रोत: महाराष्ट्र कृषी विभाग' : 'Source: Maharashtra Agriculture Dept.'}
        </p>
      </SectionReveal>
    </div>
  );
}
