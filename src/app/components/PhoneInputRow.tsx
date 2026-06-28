'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AsYouType } from 'libphonenumber-js';

type CallState = 'default' | 'calling' | 'connected';

const formatToE164 = (phone: string, countryCode: string): string => {
  // Remove everything except digits
  const digitsOnly = phone.replace(/\D/g, '');
  // Remove leading zeros
  const cleaned = digitsOnly.replace(/^0+/, '');
  // Remove country code digits if already prefixed
  const countryDigits = countryCode.replace(/\D/g, '');
  const numberWithoutCountry = cleaned.startsWith(countryDigits)
    ? cleaned.slice(countryDigits.length)
    : cleaned;
  // Return in E.164 format
  return `+${countryDigits}${numberWithoutCountry}`;
};

export default function PhoneInputRow() {
  const [rawPhone, setRawPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [callState, setCallState] = useState<CallState>('default');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const formatter = new AsYouType('US');
      const formatted = formatter.input(val);
      setRawPhone(val);
      setFormattedPhone(formatted);
    },
    []
  );

  const handleMakeCall = async () => {
    if (!rawPhone || rawPhone.trim() === '') {
      alert('Please enter a phone number');
      return;
    }

    setCallState('calling');

    const formattedNumber = formatToE164(rawPhone, '1');

    try {
      const response = await fetch('/api/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedNumber }),
      });

      const data = await response.json();

      if (data.success) {
        timerRef.current = setTimeout(() => {
          setCallState('connected');
        }, 8000);
      } else {
        setCallState('default');
        alert('Call failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setCallState('default');
      alert('Something went wrong. Please try again.');
    }
  };

  if (callState === 'calling') {
    return (
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{ maxWidth: '520px', minHeight: '48px', gap: '12px' }}
      >
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span
            className="font-mono text-foreground"
            style={{ fontSize: '14px', color: '#22c55e' }}
          >
            The call is being made...
          </span>
        </div>
      </div>
    );
  }

  if (callState === 'connected') {
    return (
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{ maxWidth: '520px', minHeight: '48px' }}
      >
        <span
          className="font-mono text-center"
          style={{ fontSize: '15px', fontWeight: 700, color: '#22c55e' }}
        >
          Thank you for seeing the demo of Zariex AI Agent.
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col items-center"
      style={{ maxWidth: '520px' }}
    >
      <div
        className="input-unified w-full flex items-stretch overflow-visible relative"
        style={{ maxWidth: '520px' }}
      >
        {/* [A] STATIC +1 LABEL */}
        <div
          className="flex items-center justify-center font-mono"
          style={{
            width: '60px',
            flexShrink: 0,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            fontSize: '14px',
            borderRight: '1px solid #333333',
            userSelect: 'none',
            cursor: 'default',
          }}
        >
          +1
        </div>

        {/* [B] PHONE INPUT */}
        <input
          type="tel"
          value={formattedPhone}
          onChange={handlePhoneChange}
          placeholder="Enter phone number..."
          className="flex-1 bg-transparent text-foreground font-mono outline-none px-3"
          style={{
            fontSize: '14px',
            color: 'var(--foreground)',
            caretColor: 'var(--foreground)',
          }}
          aria-label="Phone number"
        />

        {/* [C] CALL BUTTON */}
        <button
          onClick={handleMakeCall}
          className="call-btn-base flex items-center justify-center px-4 flex-shrink-0"
          style={{
            borderRadius: '0 8px 8px 0',
            minWidth: '110px',
            height: '100%',
            fontSize: '13px',
          }}
          aria-label="Call"
        >
          <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700 }}>
            ▶ Call
          </span>
        </button>
      </div>
    </div>
  );
}