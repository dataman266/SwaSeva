import React, { useState } from 'react';
import { Language } from '../../types.ts';

const ORDERS = [
  { id: 'ord_1', buyer: 'Farmer Ramesh P.', buyerLocation: 'Nashik',   product: 'Hybrid Tomato Seeds', qty: '2 packets', amount: 560,  status: 'pending',    ts: '2026-04-29 10:30' },
  { id: 'ord_2', buyer: 'Farmer Mahesh K.', buyerLocation: 'Pune',     product: 'NPK 19:19:19',        qty: '2 bags',    amount: 2300, status: 'dispatched',  ts: '2026-04-29 07:15' },
  { id: 'ord_3', buyer: 'Farmer Suresh T.', buyerLocation: 'Satara',   product: 'Hand Sprayer 16L',    qty: '1 piece',   amount: 1850, status: 'delivered',   ts: '2026-04-28 16:00' },
  { id: 'ord_4', buyer: 'Farmer Prakash N.',buyerLocation: 'Solapur',  product: 'Cotton Seed BG-II',   qty: '1 packet',  amount: 920,  status: 'pending',    ts: '2026-04-28 11:20' },
  { id: 'ord_5', buyer: 'Farmer Kishor D.', buyerLocation: 'Kolhapur', product: 'Chlorpyrifos EC',     qty: '2 litres',  amount: 840,  status: 'delivered',   ts: '2026-04-27 09:45' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; labelMr: string }> = {
  pending:    { bg: 'rgba(245,197,24,0.15)', color: '#F5C518', label: 'Pending',    labelMr: 'प्रलंबित' },
  dispatched: { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', label: 'Dispatched', labelMr: 'पाठवले'   },
  delivered:  { bg: 'rgba(74,140,42,0.15)',  color: '#4CAF50', label: 'Delivered',  labelMr: 'वितरित'   },
};

export default function OrdersTab({ lang }: { lang: Language }) {
  const isMr = lang === 'mr';
  const [expanded, setExpanded] = useState<string | null>(null);

  if (ORDERS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">📋</span>
        <p className="text-[16px] font-semibold text-[rgba(245,240,232,0.6)]">{isMr ? 'अद्याप कोणत्याही ऑर्डर नाहीत' : 'No orders yet'}</p>
        <p className="text-[13px] text-[rgba(245,240,232,0.35)] mt-1">{isMr ? 'तुमच्या ऑर्डर्स इथे दिसतील' : 'Your orders will appear here'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {ORDERS.map(order => {
        const st = STATUS_STYLE[order.status];
        const isOpen = expanded === order.id;
        return (
          <div key={order.id} className="rounded-2xl overflow-hidden border border-[rgba(245,240,232,0.08)]"
            style={{ background: '#162B16' }}>
            <button
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[rgba(245,240,232,0.04)] transition-colors"
              onClick={() => setExpanded(isOpen ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#F5F0E8] truncate">{order.product}</p>
                <p className="text-[12px] text-[rgba(245,240,232,0.45)] mt-0.5">{order.buyer}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[14px] font-semibold text-[#F5F0E8]">₹{order.amount}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: st.bg, color: st.color }}>
                  {isMr ? st.labelMr : st.label}
                </span>
              </div>
              <span className="text-[rgba(245,240,232,0.3)] ml-1 text-[11px]">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 border-t border-[rgba(245,240,232,0.06)] pt-3 space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[rgba(245,240,232,0.45)]">{isMr ? 'प्रमाण' : 'Qty'}</span>
                  <span className="text-[#F5F0E8]">{order.qty}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[rgba(245,240,232,0.45)]">{isMr ? 'ठिकाण' : 'Location'}</span>
                  <span className="text-[#F5F0E8]">{order.buyerLocation}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[rgba(245,240,232,0.45)]">{isMr ? 'वेळ' : 'Time'}</span>
                  <span className="text-[#F5F0E8]">{order.ts}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
