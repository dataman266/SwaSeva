import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Language, ShopItem } from '../../types.ts';

const MOCK_REVENUE_7D = [4200, 7800, 3100, 9200, 6400, 11800, 8500];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS_MR = ['सोम', 'मंगळ', 'बुध', 'गुरू', 'शुक्र', 'शनि', 'रवि'];

const MOCK_ORDERS = [
  { id: 'ord_1', buyer: 'Farmer R.', product: 'Hybrid Tomato Seeds', amount: 560, status: 'pending', time: '2h ago' },
  { id: 'ord_2', buyer: 'Farmer M.', product: 'NPK 19:19:19', amount: 2300, status: 'dispatched', time: '5h ago' },
  { id: 'ord_3', buyer: 'Farmer S.', product: 'Hand Sprayer 16L', amount: 1850, status: 'delivered', time: '1d ago' },
  { id: 'ord_4', buyer: 'Farmer P.', product: 'Cotton Seed BG-II', amount: 920, status: 'pending', time: '1d ago' },
  { id: 'ord_5', buyer: 'Farmer K.', product: 'Chlorpyrifos EC', amount: 840, status: 'delivered', time: '2d ago' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; labelMr: string }> = {
  pending:    { bg: 'rgba(245,197,24,0.15)', color: '#F5C518', label: 'Pending',    labelMr: 'प्रलंबित' },
  dispatched: { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', label: 'Dispatched', labelMr: 'पाठवले'   },
  delivered:  { bg: 'rgba(74,140,42,0.15)',  color: '#4CAF50', label: 'Delivered',  labelMr: 'वितरित'   },
};

function loadInventory(): ShopItem[] {
  try {
    const raw = localStorage.getItem('swaseva_shop_inventory');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function DashboardTab({ lang, onGoToInventory }: { lang: Language; onGoToInventory: () => void }) {
  const isMr = lang === 'mr';
  const inventory = loadInventory();
  const lowStock = inventory.filter(i => i.stockQty <= i.stockThreshold);
  const maxRev = Math.max(...MOCK_REVENUE_7D);
  const dayLabels = isMr ? DAY_LABELS_MR : DAY_LABELS_EN;

  const statCards = [
    { label: isMr ? 'आजचे उत्पन्न' : "Today's Revenue",   value: '₹8,500',   sub: '+12% vs yesterday' },
    { label: isMr ? 'मासिक उत्पन्न' : 'Monthly Revenue',   value: '₹1,24,000', sub: 'April 2026'       },
    { label: isMr ? 'एकूण ऑर्डर्स' : 'Total Orders',       value: '47',        sub: 'This month'       },
    { label: isMr ? 'प्रलंबित वितरण' : 'Pending Deliveries', value: '5',       sub: 'Need action'      },
  ];

  const topProducts = [
    { name: 'Hybrid Tomato Seeds', sold: 28, revenue: '₹7,840' },
    { name: 'NPK 19:19:19',        sold: 14, revenue: '₹16,100' },
    { name: 'Hand Sprayer 16L',    sold:  9, revenue: '₹16,650' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Sample data notice */}
      <div className="px-3 py-2 rounded-xl text-[11px] text-[rgba(245,240,232,0.45)] text-center"
        style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}>
        {isMr ? '📊 नमुना डेटा — वास्तविक डेटा लवकरच येईल' : '📊 Sample data — real data coming soon'}
      </div>

      {/* 2×2 stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[rgba(245,240,232,0.4)] mb-1">{card.label}</p>
            <p className="text-[22px] font-light text-[#F5F0E8]" style={{ letterSpacing: '-0.02em' }}>{card.value}</p>
            <p className="text-[10px] text-[rgba(245,240,232,0.35)] mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 7-day SVG bar chart */}
      <div className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.4)] mb-4">
          {isMr ? '७ दिवसांचे उत्पन्न' : '7-Day Revenue'}
        </p>
        <svg viewBox="0 0 280 100" className="w-full" style={{ height: 100 }}>
          {MOCK_REVENUE_7D.map((rev, i) => {
            const barH = (rev / maxRev) * 80;
            const x = i * 40 + 4;
            const y = 88 - barH;
            return (
              <g key={i}>
                <rect x={x} y={y} width={28} height={barH} rx={4}
                  fill={i === 6 ? '#E8C84A' : 'rgba(74,140,42,0.6)'} />
                <text x={x + 14} y={98} textAnchor="middle" fontSize={8} fill="rgba(245,240,232,0.35)">
                  {dayLabels[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Top 3 Products */}
      <div className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.4)] mb-3">
          {isMr ? 'शीर्ष उत्पादने' : 'Top Products'}
        </p>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[rgba(245,240,232,0.3)] w-5">{i + 1}</span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#F5F0E8]">{p.name}</p>
                <p className="text-[11px] text-[rgba(245,240,232,0.4)]">{p.sold} {isMr ? 'विकले' : 'sold'}</p>
              </div>
              <span className="text-[13px] font-semibold text-[#E8C84A]">{p.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-[#F5C518]" />
            <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#F5C518]">
              {isMr ? 'कमी साठा इशारा' : 'Low Stock Alert'}
            </p>
          </div>
          <div className="space-y-2 mb-3">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="text-[13px] text-[#F5F0E8]">{isMr ? item.nameMr : item.name}</p>
                <span className="text-[12px] font-semibold text-red-400">{item.stockQty} {isMr ? 'शिल्लक' : 'left'}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onGoToInventory}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#F5C518] border border-[rgba(245,197,24,0.3)] active:scale-95 transition-all"
          >
            {isMr ? 'साठा पुन्हा भरा →' : 'Restock →'}
          </button>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-2xl p-4" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}>
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[rgba(245,240,232,0.4)] mb-3">
          {isMr ? 'अलीकडील ऑर्डर्स' : 'Recent Orders'}
        </p>
        <div className="space-y-3">
          {MOCK_ORDERS.map(order => {
            const st = STATUS_STYLE[order.status];
            return (
              <div key={order.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#F5F0E8] truncate">{order.product}</p>
                  <p className="text-[11px] text-[rgba(245,240,232,0.4)]">{order.buyer} · {order.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] font-semibold text-[#F5F0E8]">₹{order.amount}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
                    style={{ background: st.bg, color: st.color }}>
                    {isMr ? st.labelMr : st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
