import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, X, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  label: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableDropdown({
  label, placeholder = 'Select…', options, value, onChange, error, required, disabled,
}: SearchableDropdownProps) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState('');
  const searchRef             = useRef<HTMLInputElement>(null);

  const selected = options.find(o => o.value === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? options.filter(o => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
    else setQuery('');
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: '#E8C84A' }}>
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(true)}
          className="flex items-center justify-between w-full px-4 rounded-2xl text-left transition-colors"
          style={{
            height: 52,
            background: '#162B16',
            border: `1px solid ${error ? '#EF4444' : 'rgba(245,240,232,0.1)'}`,
            color: selected ? '#F5F0E8' : 'rgba(245,240,232,0.35)',
            fontSize: 14,
            opacity: disabled ? 0.5 : 1,
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown size={16} style={{ color: 'rgba(245,240,232,0.4)', flexShrink: 0 }} />
        </button>
        {error && (
          <p className="text-[11px] text-red-400" role="alert">{error}</p>
        )}
      </div>

      {/* Full-screen modal picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[500] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="mt-auto flex flex-col rounded-t-3xl overflow-hidden"
              style={{ background: '#0D1A0D', maxHeight: '80vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle + header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="absolute left-1/2 -translate-x-1/2 top-3 w-10 h-1 rounded-full bg-[rgba(245,240,232,0.15)]" />
                <p className="text-[13px] font-medium text-[#F5F0E8] mt-2">{label}</p>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full mt-2"
                  style={{ background: 'rgba(245,240,232,0.08)' }}
                  aria-label="Close"
                >
                  <X size={15} style={{ color: 'rgba(245,240,232,0.6)' }} />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pb-3">
                <div
                  className="flex items-center gap-2.5 px-3.5 rounded-xl"
                  style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)', height: 44 }}
                >
                  <Search size={16} style={{ color: 'rgba(245,240,232,0.3)', flexShrink: 0 }} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="flex-1 bg-transparent border-none outline-none text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.25)] font-light"
                    style={{ fontSize: 14 }}
                    aria-label={`Search ${label}`}
                  />
                  {query && (
                    <button onClick={() => setQuery('')} aria-label="Clear search">
                      <X size={13} style={{ color: 'rgba(245,240,232,0.35)' }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Options list */}
              <div className="overflow-y-auto flex-1 pb-safe" role="listbox" aria-label={label}>
                {filtered.length === 0 ? (
                  <p className="text-center py-10 text-[rgba(245,240,232,0.3)] text-sm font-light">
                    No results for "{query}"
                  </p>
                ) : (
                  filtered.map(option => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => { onChange(option.value); setOpen(false); }}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors active:bg-[rgba(45,90,27,0.2)]"
                        style={{
                          borderBottom: '1px solid rgba(245,240,232,0.05)',
                          background: isSelected ? 'rgba(45,90,27,0.15)' : 'transparent',
                        }}
                      >
                        <span style={{ fontSize: 14, color: isSelected ? '#E8C84A' : '#F5F0E8', fontWeight: isSelected ? 500 : 300 }}>
                          {option.label}
                        </span>
                        {isSelected && <Check size={15} style={{ color: '#2E7D32' }} />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
