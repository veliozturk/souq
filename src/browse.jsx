import React, { useState } from 'react';
import { FONT, tokens as t } from './tokens.js';
import { TabBar } from './TabBar.jsx';

function Chip({ children }) {
  return (
    <div style={{
      padding: '4px 10px', borderRadius: 999,
      background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
      fontFamily: FONT, fontSize: 11, fontWeight: 600, color: t.ink,
    }}>{children}</div>
  );
}

function Stat({ k, v }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: t.ink, whiteSpace: 'nowrap' }}>{v}</div>
      <div style={{ fontFamily: FONT, fontSize: 10, color: t.inkDim, fontWeight: 500, marginTop: 1 }}>{k}</div>
    </div>
  );
}

const HOME_CATS = [
  { n: 'Furniture', c: '#D4B896' },
  { n: 'Electronics', c: '#8FA4B8' },
  { n: 'Fashion', c: '#E8B4B8' },
  { n: 'Sports', c: '#9BB89C' },
  { n: 'Kids', c: '#F4C988' },
];

const HOME_ITEMS = [
  { t: 'Herman Miller Aeron', p: '3,200', loc: 'Downtown', hue: '#6B7A8C', saved: true, boost: true },
  { t: 'Leather sofa, 3-seat', p: '1,800', loc: 'Marina · 0.8km', hue: '#A08060' },
  { t: 'iPhone 15 Pro · 256gb', p: '2,650', loc: 'JBR · 1.4km', hue: '#B8C4D0', new: true },
  { t: 'Dyson Airwrap', p: '1,100', loc: 'Business Bay', hue: '#E8B4B8' },
  { t: 'Brompton folding bike', p: '2,900', loc: 'JLT', hue: '#9BB89C' },
  { t: 'Nintendo Switch OLED', p: '920', loc: 'Marina · 0.3km', hue: '#D4B896', boost: true },
];

export function BrowseHome({ location = 'Dubai Marina', onOpenItem, onOpenCategory, onOpenSearch, onTab }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 16px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: t.inkDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Browsing</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <svg width="12" height="14" viewBox="0 0 12 14">
                <path d="M6 13c3.5-3.8 5-6.3 5-7.7a5 5 0 10-10 0c0 1.4 1.5 3.9 5 7.7z" fill={t.orange} />
              </svg>
              <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: t.ink, letterSpacing: -0.3 }}>{location}</div>
              <svg width="10" height="6" viewBox="0 0 10 6">
                <path d="M1 1l4 4 4-4" stroke={t.ink} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: '#fff',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 10V7a5 5 0 0110 0v3l1 2H2l1-2z" stroke={t.ink} strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <div style={{
                position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                borderRadius: '50%', background: t.orange, border: '2px solid #fff',
              }} />
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSearch}
          style={{
            marginTop: 12, width: '100%', height: 46, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
            border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke={t.inkDim} strokeWidth="1.4" />
            <path d="M10.5 10.5l3.5 3.5" stroke={t.inkDim} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, fontFamily: FONT, fontSize: 14, color: t.inkDim, textAlign: 'left' }}>
            Search items, brands, categories
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: t.blueSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h10M4 7h6M6 11h2" stroke={t.blue} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '8px 0 8px' }}>
          <div style={{ display: 'flex', gap: 14, padding: '0 16px', overflowX: 'auto' }}>
            {HOME_CATS.map((c, i) => (
              <button
                key={c.n}
                onClick={() => onOpenCategory && onOpenCategory(c.n)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  flexShrink: 0, border: 'none', background: 'none', padding: 0, cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: c.c,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: i === 0 ? `0 0 0 2px ${t.orange}, 0 0 0 4px #fff inset` : 'none',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 16,
                    background: 'rgba(255,255,255,0.3)',
                  }} />
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(255,255,255,0.9)',
                    position: 'relative',
                  }} />
                </div>
                <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: i === 0 ? t.orange : t.ink }}>{c.n}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '4px 16px 10px' }}>
          <div style={{
            height: 92, borderRadius: 16, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(115deg, ${t.blue} 0%, ${t.blue} 55%, ${t.orange} 130%)`,
            display: 'flex', alignItems: 'center', padding: '0 18px', color: '#fff',
          }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ position: 'absolute', right: 20, bottom: -30, width: 60, height: 60, borderRadius: '50%', background: t.orange, opacity: 0.5 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, opacity: 0.85, textTransform: 'uppercase' }}>Ramadan clearance</div>
              <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, letterSpacing: -0.3, marginTop: 2, lineHeight: 1.1 }}>Up to 60% off in<br />your neighbourhood</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '4px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: t.ink, letterSpacing: -0.2 }}>
            Near you
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: t.blue, cursor: 'pointer' }}>See all</div>
        </div>

        <div style={{ padding: '0 12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {HOME_ITEMS.map((it) => (
            <button
              key={it.t}
              onClick={() => onOpenItem && onOpenItem(it)}
              style={{
                background: '#fff', borderRadius: 14, overflow: 'hidden',
                boxShadow: `inset 0 0 0 1px ${t.line}`,
                border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{
                aspectRatio: '1', position: 'relative',
                background: `repeating-linear-gradient(135deg, ${it.hue}, ${it.hue} 8px, ${it.hue}dd 8px, ${it.hue}dd 16px)`,
              }}>
                {it.boost && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6, padding: '2px 6px',
                    borderRadius: 5, background: t.orange, color: '#fff',
                    fontFamily: FONT, fontSize: 9, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>Boosted</div>
                )}
                {it.new && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6, padding: '2px 6px',
                    borderRadius: 5, background: t.blue, color: '#fff',
                    fontFamily: FONT, fontSize: 9, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>New</div>
                )}
                <div style={{
                  position: 'absolute', top: 6, right: 6, width: 26, height: 26,
                  borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 14l-5-4a3.5 3.5 0 115-5 3.5 3.5 0 115 5l-5 4z"
                      fill={it.saved ? t.orange : 'none'}
                      stroke={it.saved ? t.orange : t.ink} strokeWidth="1.6" />
                  </svg>
                </div>
              </div>
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: t.blue, letterSpacing: -0.2 }}>AED {it.p}</div>
                <div style={{
                  fontFamily: FONT, fontSize: 12, fontWeight: 500, color: t.ink, marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.t}</div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: t.inkDim, marginTop: 2 }}>{it.loc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <TabBar active="home" onTab={onTab} />
    </div>
  );
}

const RESULT_ITEMS = [
  { t: 'IKEA Strandmon armchair, beige', p: '850', was: '1,200', loc: 'Marina · 0.3km', ago: '2d', seller: 'Aisha · ★4.9', hue: '#D4B896' },
  { t: 'West Elm velvet armchair, teal', p: '1,400', loc: 'Downtown · 4.8km', ago: '5h', seller: 'Rami · ★4.7', hue: '#4A7B8C', new: true },
  { t: 'Muji oak dining chair × 4', p: '1,200', loc: 'JLT · 1.8km', ago: '1d', seller: 'Priya · ★5.0', hue: '#B89874', offer: true },
  { t: 'Mid-century modern lounge chair', p: '2,100', was: '2,600', loc: 'Jumeirah', ago: '3d', seller: 'Khalid · ★4.8', hue: '#8B6F4E' },
];

export function CategoryResults({ query = 'armchair', onBack, onOpenItem, onTab }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '62px 16px 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              width: 38, height: 38, borderRadius: 12, background: '#fff',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="9" height="14" viewBox="0 0 9 14">
              <path d="M7 1L1 7l6 6" stroke={t.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{
            flex: 1, height: 38, borderRadius: 12, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
          }}>
            <svg width="13" height="13" viewBox="0 0 15 15">
              <circle cx="6.5" cy="6.5" r="5" stroke={t.inkDim} strokeWidth="1.4" fill="none" />
              <path d="M10.5 10.5l3.5 3.5" stroke={t.inkDim} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: FONT, fontSize: 13, color: t.ink, fontWeight: 500 }}>{query}</div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto' }}>
          {[
            { l: 'Filters', c: t.blue, icon: true },
            { l: 'Marina', active: true },
            { l: 'Under 1,500', active: true },
            { l: 'Like new' },
            { l: 'Delivery' },
          ].map((f) => (
            <div key={f.l} style={{
              padding: '6px 11px', borderRadius: 999,
              background: f.icon ? t.blue : (f.active ? t.orangeSoft : '#fff'),
              color: f.icon ? '#fff' : (f.active ? t.orange : t.ink),
              boxShadow: (f.icon || f.active) ? 'none' : `inset 0 0 0 1px ${t.line}`,
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
              cursor: 'pointer',
            }}>
              {f.icon && (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M1 2h8M2 5h6M4 8h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {f.l}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim }}>
            <span style={{ color: t.ink, fontWeight: 700 }}>248</span> items
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: t.blue, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            Sort: Closest first
            <svg width="8" height="6" viewBox="0 0 10 6">
              <path d="M1 1l4 4 4-4" stroke={t.blue} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RESULT_ITEMS.map((it, i) => (
          <button
            key={it.t}
            onClick={() => onOpenItem && onOpenItem(it)}
            style={{
              background: '#fff', borderRadius: 14, padding: 10, display: 'flex', gap: 12,
              boxShadow: i === 0 ? `inset 0 0 0 1.5px ${t.blue}` : `inset 0 0 0 1px ${t.line}`,
              border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}
          >
            <div style={{
              width: 96, height: 96, borderRadius: 11, flexShrink: 0, position: 'relative',
              background: `repeating-linear-gradient(135deg, ${it.hue}, ${it.hue} 7px, ${it.hue}dd 7px, ${it.hue}dd 14px)`,
            }}>
              {it.new && (
                <div style={{
                  position: 'absolute', top: 4, left: 4, padding: '2px 6px',
                  borderRadius: 4, background: t.blue, color: '#fff',
                  fontFamily: FONT, fontSize: 9, fontWeight: 800,
                }}>NEW</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: t.blue, letterSpacing: -0.3 }}>AED {it.p}</div>
                {it.was && (
                  <div style={{ fontFamily: FONT, fontSize: 11, color: t.inkDim, textDecoration: 'line-through' }}>{it.was}</div>
                )}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: t.ink, marginTop: 2, lineHeight: 1.25 }}>{it.t}</div>
              <div style={{
                marginTop: 6, fontFamily: FONT, fontSize: 11, color: t.inkDim,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="10" height="12" viewBox="0 0 12 14">
                  <path d="M6 13c3.5-3.8 5-6.3 5-7.7a5 5 0 10-10 0c0 1.4 1.5 3.9 5 7.7z" fill={t.inkDim} />
                </svg>
                {it.loc} · {it.ago}
              </div>
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontFamily: FONT, fontSize: 11, color: t.inkDim }}>{it.seller}</div>
                {it.offer && (
                  <div style={{
                    padding: '1px 6px', borderRadius: 4, background: t.orangeSoft, color: t.orange,
                    fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: 0.4,
                  }}>ACCEPTS OFFERS</div>
                )}
              </div>
            </div>
            <div style={{ alignSelf: 'flex-start' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 14l-5-4a3.5 3.5 0 115-5 3.5 3.5 0 115 5l-5 4z" fill="none" stroke={t.inkDim} strokeWidth="1.5" />
              </svg>
            </div>
          </button>
        ))}
      </div>
      <TabBar active="home" onTab={onTab} />
    </div>
  );
}

export function ItemDetail({ onBack, onSeller, onMessage, onOffer }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 60, left: 0, right: 0, padding: '4px 14px',
        zIndex: 10, display: 'flex', justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="9" height="14" viewBox="0 0 9 14">
            <path d="M7 1L1 7l6 6" stroke={t.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10 5V3a1 1 0 00-1-1H2a1 1 0 00-1 1v7a1 1 0 001 1h2M5 13h7a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v6a1 1 0 001 1z"
                stroke={t.ink} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 14l-5-4a3.5 3.5 0 115-5 3.5 3.5 0 115 5l-5 4z" fill="none" stroke={t.ink} strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: 320, position: 'relative', flexShrink: 0,
          background: 'repeating-linear-gradient(135deg, #D4B896, #D4B896 10px, #C4A680 10px, #C4A680 20px)',
        }}>
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
            {[1, 0, 0, 0].map((v, i) => (
              <div key={i} style={{ width: v ? 16 : 5, height: 5, borderRadius: 3, background: v ? '#fff' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
          <div style={{
            position: 'absolute', bottom: 10, right: 12, padding: '3px 8px',
            borderRadius: 999, background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontFamily: FONT, fontSize: 11, fontWeight: 600,
          }}>1 / 4</div>
        </div>

        <div style={{ padding: '16px 18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: t.ink, letterSpacing: -0.6, whiteSpace: 'nowrap' }}>AED 850</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: t.inkDim, textDecoration: 'line-through' }}>1,200</div>
            <div style={{
              padding: '2px 7px', borderRadius: 5, background: t.orangeSoft, color: t.orange,
              fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: 0.4,
            }}>−29%</div>
          </div>
          <div style={{
            fontFamily: FONT, fontSize: 17, fontWeight: 600, color: t.ink, marginTop: 4, lineHeight: 1.25,
          }}>
            IKEA Strandmon armchair, beige
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <Chip>Like new</Chip>
            <Chip>Furniture</Chip>
            <Chip>Pickup</Chip>
          </div>

          <div style={{ marginTop: 14, fontFamily: FONT, fontSize: 13, color: t.ink, lineHeight: 1.5 }}>
            Bought 2 years ago, used in a smoke-free apartment in JLT. Small scratch on the right leg. No rips, no stains…
            <span style={{ color: t.blue, fontWeight: 600, cursor: 'pointer' }}> more</span>
          </div>

          <button
            onClick={onSeller}
            style={{
              marginTop: 16, padding: '12px 14px', borderRadius: 14, background: '#fff',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              border: 'none', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT, fontSize: 16, fontWeight: 800, color: t.blue, flexShrink: 0,
            }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: t.ink }}>Aisha Al M.</div>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1l1.7 1.3 2.1-.3.3 2.1 1.3 1.7L10.6 7.4l-.3 2.1-2.1.3L6.5 11.3 4.8 9.8l-2.1-.3L2.4 7.4 1 6.5l1.4-1.7L2.7 2.7l2.1-.3L6.5 1z" fill={t.blue} />
                  <path d="M4.5 6.5l1.5 1.5L9 5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: t.inkDim, marginTop: 1 }}>★ 4.9 · 11 sold · Typically replies in 2h</div>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: t.blue, fontWeight: 700 }}>View</div>
          </button>

          <div style={{
            marginTop: 10, padding: '10px 12px', borderRadius: 12, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
              flexShrink: 0,
            }}>
              <div style={{ position: 'absolute', top: 6, left: 0, right: 0, height: 1.5, background: t.line }} />
              <div style={{ position: 'absolute', top: 18, left: 0, right: 0, height: 1.5, background: t.line }} />
              <div style={{ position: 'absolute', top: 30, left: 0, right: 0, height: 1.5, background: t.line }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 10, height: 10, borderRadius: '50%', background: t.orange, border: '2px solid #fff',
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.ink }}>Dubai Marina</div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: t.inkDim, marginTop: 1 }}>0.3 km · Pickup near Marina Walk</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '12px 14px 26px', background: '#fff',
        boxShadow: `0 -0.5px 0 ${t.line}`,
        display: 'flex', gap: 8, flexShrink: 0,
      }}>
        <button style={{
          width: 52, height: 52, borderRadius: 14, background: t.blueSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          border: 'none', padding: 0, cursor: 'pointer',
        }}>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M8 14l-5-4a3.5 3.5 0 115-5 3.5 3.5 0 115 5l-5 4z" fill="none" stroke={t.blue} strokeWidth="1.8" />
          </svg>
        </button>
        <button
          onClick={onMessage}
          style={{
            flex: 1, height: 52, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1.5px ${t.blue}`, color: t.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: FONT, fontSize: 15, fontWeight: 700,
            border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 2h14v9H5l-4 3V2z" stroke={t.blue} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          Message
        </button>
        <button
          onClick={onOffer}
          style={{
            flex: 1, height: 52, borderRadius: 14, background: t.orange, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: FONT, fontSize: 15, fontWeight: 700,
            boxShadow: '0 8px 18px rgba(249,115,22,0.32)',
            border: 'none', cursor: 'pointer',
          }}
        >
          Make offer
        </button>
      </div>
    </div>
  );
}

const SELLER_ITEMS = [
  { p: '850', t: 'IKEA armchair', hue: '#D4B896' },
  { p: '1,100', t: 'Dyson V11', hue: '#8FA4B8' },
  { p: '4,200', t: 'Canyon bike', hue: '#6B7A8C' },
  { p: '920', t: 'Switch OLED', hue: '#B8C4D0' },
  { p: '450', t: 'Ceramic lamp', hue: '#D4A8A0' },
  { p: '280', t: 'Books bundle', hue: '#A0B890' },
];

export function SellerProfile({ onBack, onMessage }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 60, left: 0, right: 0, padding: '4px 14px',
        zIndex: 10, display: 'flex', justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="9" height="14" viewBox="0 0 9 14">
            <path d="M7 1L1 7l6 6" stroke={t.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="4" viewBox="0 0 14 4">
            <circle cx="2" cy="2" r="1.5" fill={t.ink} />
            <circle cx="7" cy="2" r="1.5" fill={t.ink} />
            <circle cx="12" cy="2" r="1.5" fill={t.ink} />
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{
          padding: '96px 20px 16px',
          background: `linear-gradient(180deg, ${t.blue} 0%, ${t.blue} 70%, ${t.bg} 100%)`,
          color: '#fff', position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', left: -40, bottom: 0, width: 110, height: 110, borderRadius: '50%', background: t.orange, opacity: 0.2 }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT, fontSize: 30, fontWeight: 800, color: t.blue,
              border: '4px solid rgba(255,255,255,0.25)',
            }}>A</div>
            <div style={{
              marginTop: 10, fontFamily: FONT, fontSize: 20, fontWeight: 700,
              letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Aisha Al M.
              <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1l1.7 1.3 2.1-.3.3 2.1 1.3 1.7L10.6 7.4l-.3 2.1-2.1.3L6.5 11.3 4.8 9.8l-2.1-.3L2.4 7.4 1 6.5l1.4-1.7L2.7 2.7l2.1-.3L6.5 1z" fill="#fff" />
                <path d="M4.5 6.5l1.5 1.5L9 5" stroke={t.blue} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, opacity: 0.85, marginTop: 2 }}>
              @aisha.m · Dubai Marina · Joined 2024
            </div>

            <div style={{
              marginTop: 14, display: 'flex', gap: 14, padding: '12px 14px',
              borderRadius: 14, background: '#fff',
              boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
            }}>
              <Stat k="Rating" v="★ 4.9" />
              <Stat k="Sold" v="11" />
              <Stat k="Active" v="6" />
              <Stat k="Reply" v="~2h" />
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 8, width: '100%' }}>
              <button style={{
                flex: 1, height: 44, borderRadius: 12,
                background: '#fff', color: t.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: FONT, fontSize: 13, fontWeight: 700,
                boxShadow: `inset 0 0 0 1.5px ${t.blue}`,
                border: 'none', cursor: 'pointer',
              }}>
                Follow
              </button>
              <button
                onClick={onMessage}
                style={{
                  flex: 1, height: 44, borderRadius: 12, background: t.orange, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontFamily: FONT, fontSize: 13, fontWeight: 700,
                  boxShadow: '0 6px 14px rgba(249,115,22,0.32)',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M1 2h14v9H5l-4 3V2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                Message
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${t.line}`, padding: '0 20px' }}>
          {['Listings · 6', 'Sold · 11', 'Reviews · 9'].map((tab, i) => {
            const on = i === 0;
            return (
              <div key={tab} style={{
                padding: '12px 0', marginRight: 22,
                fontFamily: FONT, fontSize: 13, fontWeight: on ? 700 : 500,
                color: on ? t.ink : t.inkDim, position: 'relative',
                cursor: 'pointer',
              }}>
                {tab}
                {on && (
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2.5, background: t.orange, borderRadius: 2 }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {SELLER_ITEMS.map((it) => (
            <div key={it.t} style={{
              borderRadius: 10, overflow: 'hidden', background: '#fff',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
            }}>
              <div style={{
                aspectRatio: '1',
                background: `repeating-linear-gradient(135deg, ${it.hue}, ${it.hue} 6px, ${it.hue}dd 6px, ${it.hue}dd 12px)`,
              }} />
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: t.blue }}>AED {it.p}</div>
                <div style={{
                  fontFamily: FONT, fontSize: 10, color: t.ink,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.t}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 20px 18px' }}>
          <div style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 700, color: t.inkDim,
            textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
          }}>
            Recent review
          </div>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '12px 14px',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: t.ink }}>Omar K.</div>
              <div style={{ fontFamily: FONT, fontSize: 10, color: t.inkDim }}>2w</div>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: t.orange, marginTop: 2, letterSpacing: 1 }}>★★★★★</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: t.ink, marginTop: 4, lineHeight: 1.4 }}>
              Exactly as described. Quick, friendly pickup at Marina.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const QUICK_REPLIES = [
  'Is this still available?',
  'Can I see more photos?',
  'Would you accept a lower offer?',
  'Can I pick up today?',
  'Is delivery possible?',
];

export function SendMessage({ onDismiss, onSend, onSave }) {
  const [message, setMessage] = useState(
    "Hi Aisha! Is this still available? I'm nearby in Marina and could pick up this evening."
  );
  const [activeReply, setActiveReply] = useState(0);
  return (
    <div style={{
      height: '100%', background: 'rgba(20,33,46,0.55)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div
        onClick={onDismiss}
        style={{ flex: 1, cursor: 'pointer' }}
      />
      <div style={{
        background: t.bg, borderRadius: '24px 24px 0 0',
        padding: '12px 0 26px', boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
      }}>
        <div
          onClick={onDismiss}
          style={{ width: 40, height: 4, background: t.line, borderRadius: 2, margin: '0 auto 12px', cursor: 'pointer' }}
        />

        <div style={{ padding: '0 20px' }}>
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: t.ink, letterSpacing: -0.4 }}>
            Message Aisha
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim, marginTop: 2 }}>
            Replies in ~2h · English, Arabic
          </div>

          <div style={{
            marginTop: 14, padding: 10, borderRadius: 12, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 9, flexShrink: 0,
              background: 'repeating-linear-gradient(135deg, #D4B896, #D4B896 6px, #C4A680 6px, #C4A680 12px)',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.ink }}>IKEA Strandmon armchair</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: t.blue, fontWeight: 700, marginTop: 1 }}>AED 850</div>
            </div>
          </div>

          <div style={{
            marginTop: 18, fontFamily: FONT, fontSize: 12, fontWeight: 700,
            color: t.inkDim, textTransform: 'uppercase', letterSpacing: 0.8,
          }}>
            Quick messages
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_REPLIES.map((q, i) => {
              const on = i === activeReply;
              return (
                <button
                  key={q}
                  onClick={() => { setActiveReply(i); setMessage(`Hi Aisha! ${q}`); }}
                  style={{
                    padding: '8px 12px', borderRadius: 999,
                    background: on ? t.blueSoft : '#fff',
                    color: on ? t.blue : t.ink,
                    boxShadow: on ? `inset 0 0 0 1.5px ${t.blue}` : `inset 0 0 0 1px ${t.line}`,
                    fontFamily: FONT, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {on && '✓ '}{q}
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: 18, minHeight: 108, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1.5px ${t.blue}`,
            padding: '12px 14px 40px', position: 'relative',
          }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                resize: 'none',
                fontFamily: FONT, fontSize: 14, color: t.ink, lineHeight: 1.45, padding: 0,
              }}
            />
            <div style={{
              position: 'absolute', bottom: 8, right: 10, display: 'flex', gap: 6,
            }}>
              <button style={{
                width: 28, height: 28, borderRadius: 8, background: t.blueSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', padding: 0, cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5z" fill={t.blue} />
                </svg>
              </button>
              <button style={{
                width: 28, height: 28, borderRadius: 8, background: t.orange,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', padding: 0, cursor: 'pointer',
              }}>
                <svg width="11" height="13" viewBox="0 0 14 18" fill="none">
                  <rect x="4" y="1" width="6" height="10" rx="3" fill="#fff" />
                  <path d="M1.5 9a5.5 5.5 0 0011 0M7 14.5V17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div style={{
            marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-start',
            padding: '10px 12px', borderRadius: 10, background: t.blueSoft,
            fontFamily: FONT, fontSize: 11, color: t.ink, lineHeight: 1.4,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" style={{ marginTop: 1, flexShrink: 0 }} fill="none">
              <path d="M8 1l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7V3l6-2z" stroke={t.blue} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <div>
              <span style={{ fontWeight: 700 }}>Keep it on Souq.</span> Don't share phone, bank details or WhatsApp until you're ready to meet.
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button
              onClick={onSave}
              style={{
                flex: 1, height: 50, borderRadius: 14, background: '#fff',
                boxShadow: `inset 0 0 0 1.5px ${t.blue}`, color: t.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT, fontSize: 14, fontWeight: 700,
                border: 'none', cursor: 'pointer',
              }}
            >
              Save for later
            </button>
            <button
              onClick={onSend}
              disabled={!message.trim()}
              style={{
                flex: 1.3, height: 50, borderRadius: 14,
                background: message.trim() ? t.orange : '#C9D1D9',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: FONT, fontSize: 14, fontWeight: 700,
                boxShadow: message.trim() ? '0 8px 18px rgba(249,115,22,0.32)' : 'none',
                border: 'none', cursor: message.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l12-6-5 14-2-5-5-3z" fill="#fff" />
              </svg>
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
