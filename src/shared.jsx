import React from 'react';
import { FONT, tokens as t } from './tokens.js';

export function CompassIllo({ size = 260 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 260 260">
      <circle cx="130" cy="130" r="110" fill={t.blueSoft} />
      <circle cx="130" cy="130" r="78" fill="none" stroke={t.blue} strokeWidth="2" strokeDasharray="2 6" opacity="0.5" />
      <rect x="122" y="30" width="16" height="42" rx="8" fill={t.blue} />
      <rect x="122" y="188" width="16" height="42" rx="8" fill={t.blue} opacity="0.25" />
      <rect x="30" y="122" width="42" height="16" rx="8" fill={t.blue} opacity="0.25" />
      <rect x="188" y="122" width="42" height="16" rx="8" fill={t.blue} opacity="0.25" />
      <circle cx="130" cy="130" r="32" fill={t.orange} />
      <circle cx="130" cy="130" r="10" fill="#fff" />
      <rect x="70" y="70" width="22" height="22" rx="5" fill={t.orange} opacity="0.9" transform="rotate(-12 81 81)" />
      <circle cx="192" cy="88" r="10" fill={t.blue} />
      <rect x="176" y="168" width="18" height="18" rx="4" fill={t.orange} opacity="0.7" />
    </svg>
  );
}

export function PrimaryBtn({ children, variant = 'blue', onClick, disabled }) {
  const bg = variant === 'orange' ? t.orange : t.blue;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height: 54, borderRadius: 16, border: 'none',
        background: disabled ? '#C9D1D9' : bg, color: '#fff',
        fontFamily: FONT, fontSize: 17, fontWeight: 600,
        letterSpacing: -0.2, cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 8px 20px rgba(15,76,129,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: 54, borderRadius: 16,
        border: `1.5px solid ${t.line}`, background: '#fff', color: t.ink,
        fontFamily: FONT, fontSize: 17, fontWeight: 500,
        letterSpacing: -0.2, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function Progress({ step, total = 6 }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 20px', marginTop: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 3,
          background: i <= step ? t.orange : t.line,
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

export function MinimalHeader({ step, total = 6, showBack = true, onBack, onSkip }) {
  return (
    <div style={{ paddingTop: 56, paddingBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px 18px',
      }}>
        {showBack ? (
          <button
            onClick={onBack}
            style={{
              width: 40, height: 40, borderRadius: 12, border: 'none',
              background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M8 2L2 8l6 6" stroke={t.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : <div style={{ width: 40 }} />}
        <div style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 500,
          color: t.inkDim, letterSpacing: 0.2,
        }}>
          Step {step + 1} of {total}
        </div>
        <button
          onClick={onSkip}
          style={{
            fontFamily: FONT, fontSize: 14, fontWeight: 500, color: t.inkDim,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          Skip
        </button>
      </div>
      <Progress step={step} total={total} />
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <div style={{
      fontFamily: FONT, fontSize: 13, fontWeight: 600,
      color: t.inkDim, textTransform: 'uppercase', letterSpacing: 0.8,
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}
