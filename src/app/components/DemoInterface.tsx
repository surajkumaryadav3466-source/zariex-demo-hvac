'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PhoneInputRow from './PhoneInputRow';

export default function DemoInterface() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('Dr. Smith');
  const [clinic, setClinic] = useState('Apex Dental');

  useEffect(() => {
    const paramName = searchParams?.get('name');
    const paramClinic = searchParams?.get('clinic');
    if (paramName) setName(decodeURIComponent(paramName));
    if (paramClinic) setClinic(decodeURIComponent(paramClinic));
  }, [searchParams]);

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* ── HEADER ── */}
      <header className="w-full flex items-center justify-between px-6 py-4 flex-shrink-0">
        <span
          className="text-foreground font-mono text-base leading-none tracking-tight"
          style={{ fontSize: '16px', fontWeight: 400 }}
        >
          Zariex.
        </span>
        <span
          className="text-foreground font-mono tracking-wide"
          style={{ fontSize: '13px', fontWeight: 400 }}
        >
          [ SYS_DEMO_v1.2 ]
        </span>
      </header>

      {/* ── MAIN CENTER ── */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col items-center w-full" style={{ gap: '0px' }}>

          {/* 1. STATUS BADGE */}
          <div className="status-pill" style={{ marginBottom: '20px' }}>
            <span className="relative flex items-center justify-center" style={{ width: '8px', height: '8px' }}>
              <span
                className="animate-ping absolute inline-flex rounded-full"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#22c55e',
                  opacity: 0.6,
                }}
              />
              <span
                className="relative inline-flex rounded-full"
                style={{ width: '8px', height: '8px', backgroundColor: '#22c55e' }}
              />
            </span>
            <span className="font-mono text-foreground" style={{ fontSize: '12px', fontWeight: 400 }}>
              Agent Status: Online
            </span>
          </div>

          {/* 2. HEADLINE */}
          <h1
            className="text-foreground text-center leading-snug"
            style={{
              fontSize: 'clamp(18px, 3vw, 28px)',
              fontWeight: 400,
              marginBottom: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Testing interface generated for{' '}
            <strong className="font-mono" style={{ fontWeight: 700 }}>
              {name} // {clinic}
            </strong>
            .
          </h1>

          {/* 3. PHONE INPUT ROW */}
          <PhoneInputRow />

          {/* 4. SUBTEXT */}
          <p
            className="font-mono text-center"
            style={{
              fontSize: '11px',
              color: 'var(--muted-foreground)',
              marginTop: '12px',
              marginBottom: '32px',
            }}
          >
            Experience how our AI Agent handles after-hour emergency calls live.
          </p>

          {/* 5. DIVIDER + STATS */}
          <div className="divider-line" />
          <div
            className="flex items-center justify-center font-mono"
            style={{
              marginTop: '16px',
              fontSize: '11px',
              color: 'var(--muted-foreground)',
              gap: '12px',
            }}
          >
            <span>Avg. Response Time: &lt;2s</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>Uptime: 99.9%</span>
          </div>

        </div>
      </main>
    </div>
  );
}