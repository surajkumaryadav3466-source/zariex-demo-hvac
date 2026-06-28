'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { COUNTRIES, CountryEntry } from '../data/countries';

interface CountrySelectorProps {
  selected: CountryEntry;
  onChange: (country: CountryEntry) => void;
}

export default function CountrySelector({ selected, onChange }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search)
      )
    : COUNTRIES;

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
    setSearch('');
  }, []);

  const handleSelect = useCallback(
    (country: CountryEntry) => {
      onChange(country);
      setOpen(false);
      setSearch('');
    },
    [onChange]
  );

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0"
      style={{ width: '110px' }}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center justify-between w-full h-full px-3 font-mono text-foreground bg-transparent outline-none"
        style={{ fontSize: '13px', gap: '6px' }}
        aria-label="Select country code"
        aria-expanded={open}
      >
        <span style={{ fontSize: '16px', lineHeight: 1 }}>{selected.flag}</span>
        <span className="font-mono" style={{ fontSize: '13px', color: 'var(--foreground)' }}>
          {selected.dial}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
            flexShrink: 0,
          }}
        >
          <path
            d="M1.5 3.5L5 7L8.5 3.5"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="country-dropdown">
          {/* Search */}
          <div style={{ position: 'sticky', top: 0, backgroundColor: 'var(--input)', zIndex: 10 }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="search-input-dropdown"
              aria-label="Search country"
            />
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div
              className="font-mono text-center"
              style={{ padding: '12px', fontSize: '12px', color: 'var(--muted-foreground)' }}
            >
              No results
            </div>
          ) : (
            filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className="dropdown-item-hover w-full flex items-center text-left font-mono"
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  gap: '8px',
                  color: selected.code === country.code ? 'var(--foreground)' : 'var(--muted-foreground)',
                  backgroundColor: selected.code === country.code ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
                aria-label={`${country.name} ${country.dial}`}
              >
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{country.flag}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {country.name}
                </span>
                <span style={{ flexShrink: 0, color: 'var(--muted-foreground)', fontSize: '11px' }}>
                  {country.dial}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}