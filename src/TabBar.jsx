import React from 'react';
import { FONT, tokens as t } from './tokens.js';

const TABS = [
  {
    id: 'home', label: 'Home',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M2 10l9-7 9 7v10H2V10z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'saved', label: 'Saved',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 19l-7-5a5 5 0 017-7 5 5 0 017 7l-7 5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  { id: 'sell', label: 'Sell', sell: true },
  {
    id: 'msg', label: 'Inbox', badge: 3,
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 5h16v12H7l-4 3V5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'me', label: 'Me',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke={c} strokeWidth="1.6" />
        <path d="M4 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function TabBar({ active = 'me', onTab }) {
  return (
    <div style={{
      height: 82, paddingBottom: 30, background: '#fff',
      boxShadow: `0 -0.5px 0 ${t.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      flexShrink: 0,
    }}>
      {TABS.map((tab) => {
        if (tab.sell) {
          return (
            <button
              key={tab.id}
              onClick={() => onTab && onTab(tab.id)}
              style={{
                position: 'relative', marginTop: -10,
                border: 'none', background: 'none', padding: 0, cursor: 'pointer',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 18, background: t.orange,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(249,115,22,0.4)',
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 3v16M3 11h16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </button>
          );
        }
        const isActive = tab.id === active;
        const c = isActive ? t.blue : t.inkDim;
        return (
          <button
            key={tab.id}
            onClick={() => onTab && onTab(tab.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              position: 'relative',
              border: 'none', background: 'none', padding: 0, cursor: 'pointer',
            }}
          >
            {tab.icon(c)}
            {tab.badge && (
              <div style={{
                position: 'absolute', top: -4, right: -8,
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                background: t.orange, color: '#fff',
                fontFamily: FONT, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{tab.badge}</div>
            )}
            <div style={{
              fontFamily: FONT, fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: c,
            }}>{tab.label}</div>
          </button>
        );
      })}
    </div>
  );
}
