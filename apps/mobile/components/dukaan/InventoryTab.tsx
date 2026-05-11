import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ShopItem, ShopItemCategory, Language } from '../../types.ts';
import { MOCK_SHOP_ITEMS } from '../../constants.tsx';
import AddEditItemSheet from './AddEditItemSheet.tsx';

const FILTER_CATS: { id: ShopItemCategory | 'all'; en: string; mr: string }[] = [
  { id: 'all',        en: 'All',        mr: 'सर्व'      },
  { id: 'seeds',      en: 'Seeds',      mr: 'बियाणे'   },
  { id: 'fertilizer', en: 'Fertilizer', mr: 'खत'       },
  { id: 'pesticide',  en: 'Pesticide',  mr: 'कीटकनाशक' },
  { id: 'tools',      en: 'Tools',      mr: 'साधने'     },
  { id: 'feed',       en: 'Feed',       mr: 'पशुखाद्य' },
  { id: 'other',      en: 'Other',      mr: 'इतर'       },
];

const STORAGE_KEY = 'swaseva_shop_inventory';

function loadItems(): ShopItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_SHOP_ITEMS;
  } catch { return MOCK_SHOP_ITEMS; }
}

function saveItems(items: ShopItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function InventoryTab({ lang }: { lang: Language }) {
  const isMr = lang === 'mr';
  const [items,     setItems]     = useState<ShopItem[]>(loadItems);
  const [filter,    setFilter]    = useState<ShopItemCategory | 'all'>('all');
  const [showSheet, setShowSheet] = useState(false);
  const [editItem,  setEditItem]  = useState<ShopItem | undefined>();
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const shopProfile = JSON.parse(localStorage.getItem('swaseva_shop_profile') ?? '{}');
  const shopkeeperId = (shopProfile?.shopkeeperId as string) ?? 'my_shop';

  const persist = (next: ShopItem[]) => { setItems(next); saveItems(next); };

  const handleSave = (item: ShopItem) => {
    const next = items.some(i => i.id === item.id)
      ? items.map(i => i.id === item.id ? item : i)
      : [...items, item];
    persist(next);
    setShowSheet(false);
    setEditItem(undefined);
  };

  const handleDelete = (id: string) => {
    persist(items.filter(i => i.id !== id));
    setDeleteId(null);
  };

  const handleToggleActive = (id: string) => {
    persist(items.map(i => i.id === id ? { ...i, isActive: !i.isActive } : i));
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <div className="p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-[rgba(245,240,232,0.5)]">{items.length} {isMr ? 'आयटम' : 'items'}</p>
        <button
          onClick={() => { setEditItem(undefined); setShowSheet(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-[#0A1A0A] active:scale-95 transition-all"
          style={{ background: '#4CAF50' }}
        >
          <Plus size={15} />
          {isMr ? 'आयटम जोडा' : 'Add Item'}
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
        {FILTER_CATS.map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${filter === c.id ? 'bg-[rgba(232,200,74,0.15)] border-[rgba(232,200,74,0.4)] text-[#E8C84A]' : 'border-[rgba(245,240,232,0.12)] text-[rgba(245,240,232,0.45)]'}`}
          >
            {isMr ? c.mr : c.en}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">📦</span>
          <p className="text-[16px] font-semibold text-[rgba(245,240,232,0.6)] mb-2">{isMr ? 'अद्याप कोणतेही आयटम नाहीत' : 'No items yet'}</p>
          <p className="text-[13px] text-[rgba(245,240,232,0.35)]">{isMr ? 'आपले पहिले उत्पादन जोडा →' : 'Add your first product →'}</p>
        </div>
      )}

      {/* Item list */}
      <div className="space-y-3">
        {filtered.map(item => {
          const isLow = item.stockQty <= item.stockThreshold;
          return (
            <div key={item.id} className="rounded-2xl overflow-hidden border border-[rgba(245,240,232,0.08)]"
              style={{ background: '#162B16' }}>
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[rgba(245,240,232,0.05)]">
                  {item.imageUris[0]
                    ? <img src={item.imageUris[0]} className="w-full h-full object-cover" alt="" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌱</div>}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold text-[#F5F0E8] truncate">{isMr ? item.nameMr : item.name}</p>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.08em] uppercase"
                      style={{ background: 'rgba(232,200,74,0.1)', color: '#E8C84A', border: '1px solid rgba(232,200,74,0.2)' }}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-[rgba(245,240,232,0.6)] mt-0.5">₹{item.price} / {item.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[12px] font-semibold ${isLow ? 'text-red-400' : 'text-[rgba(245,240,232,0.45)]'}`}>
                      {isLow && '⚠ '}{isMr ? 'साठा:' : 'Stock:'} {item.stockQty}
                    </span>
                    {item.brand && <span className="text-[11px] text-[rgba(245,240,232,0.35)]">· {item.brand}</span>}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center border-t border-[rgba(245,240,232,0.06)] px-3 py-2 gap-3">
                <button
                  onClick={() => { setEditItem(item); setShowSheet(true); }}
                  className="flex items-center gap-1 text-[12px] text-[rgba(245,240,232,0.5)] active:text-[#E8C84A] transition-colors"
                >
                  <Edit2 size={13} /> {isMr ? 'संपादित करा' : 'Edit'}
                </button>
                <button
                  onClick={() => handleToggleActive(item.id)}
                  role="switch"
                  aria-checked={item.isActive}
                  className="ml-auto flex-shrink-0 relative overflow-hidden rounded-full transition-all active:scale-95"
                  style={{
                    width: 72,
                    height: 26,
                    border: item.isActive
                      ? '1px solid rgba(76,175,80,0.5)'
                      : '1px solid rgba(245,240,232,0.14)',
                    background: 'rgba(10,26,10,0.8)',
                  }}
                >
                  {/* liquid fill layer */}
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg,#2D5A1B,#4CAF50)',
                      transform: item.isActive ? 'translateX(0%)' : 'translateX(-100%)',
                      transition: 'transform 400ms cubic-bezier(0.32,0,0.16,1)',
                    }}
                  />
                  {/* ripple sheen */}
                  {item.isActive && (
                    <span
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 60%)',
                      }}
                    />
                  )}
                  {/* label */}
                  <span
                    className="relative z-10 flex items-center justify-center w-full h-full text-[10px] font-bold tracking-[0.06em] uppercase"
                    style={{
                      color: item.isActive ? '#F5F0E8' : 'rgba(245,240,232,0.35)',
                      transition: 'color 300ms',
                    }}
                  >
                    {item.isActive ? (isMr ? 'सक्रिय' : 'Active') : (isMr ? 'बंद' : 'Off')}
                  </span>
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="text-red-400/50 active:text-red-400 transition-colors ml-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit sheet */}
      {showSheet && (
        <AddEditItemSheet
          lang={lang}
          initial={editItem}
          shopkeeperId={shopkeeperId}
          onSave={handleSave}
          onClose={() => { setShowSheet(false); setEditItem(undefined); }}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6 space-y-4" style={{ background: '#111C11' }}>
            <h3 className="text-[17px] font-semibold text-[#F5F0E8] text-center">{isMr ? 'हा आयटम हटवायचा?' : 'Delete this item?'}</h3>
            <p className="text-[13px] text-[rgba(245,240,232,0.5)] text-center">{isMr ? 'ही क्रिया पूर्ववत केली जाऊ शकत नाही.' : 'This action cannot be undone.'}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-12 rounded-2xl border border-[rgba(245,240,232,0.2)] text-[rgba(245,240,232,0.8)] text-[14px] font-semibold"
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[14px] font-semibold active:scale-95 transition-all"
              >
                {isMr ? 'हटवा' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
