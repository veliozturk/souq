import React, { useState } from 'react';
import { FONT, tokens as t } from './tokens.js';
import { TabBar } from './TabBar.jsx';

function BackBtn({ onBack }) {
  return (
    <button
      onClick={onBack}
      style={{
        width: 38, height: 38, borderRadius: 12, background: '#fff',
        boxShadow: `inset 0 0 0 1px ${t.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
      }}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
        <path d="M8 2L2 8l6 6" stroke={t.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

const ACTIVE_LISTINGS = [
  { title: 'IKEA Strandmon armchair, beige', price: '850', views: 142, msgs: 4, offers: 2, hue: '#D4B896', boosted: true },
  { title: 'Canyon Endurace road bike', price: '4,200', views: 86, msgs: 2, offers: 0, hue: '#6B7A8C' },
  { title: 'Dyson V11 vacuum', price: '1,100', views: 58, msgs: 1, offers: 1, hue: '#8FA4B8' },
  { title: 'Nintendo Switch OLED + 3 games', price: '920', views: 203, msgs: 7, offers: 3, hue: '#B8C4D0' },
];

export function MyListings({ onBack, onOpenListing, onTab }) {
  const [tab, setTab] = useState('active');
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BackBtn onBack={onBack} />
          <div style={{
            flex: 1, fontFamily: FONT, fontSize: 24, fontWeight: 700,
            color: t.ink, letterSpacing: -0.5,
          }}>
            My listings
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 12, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke={t.ink} strokeWidth="1.6" />
              <path d="M11 11l4 4" stroke={t.ink} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {[
            { k: 'Active', v: '4', c: t.blue },
            { k: 'Views 7d', v: '489', c: t.ink },
            { k: 'Earned', v: '3.2k AED', c: t.orange },
          ].map((s) => (
            <div key={s.k} style={{
              flex: 1, background: '#fff', borderRadius: 12, padding: '10px 12px',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 11, color: t.inkDim,
                textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600,
              }}>{s.k}</div>
              <div style={{
                fontFamily: FONT, fontSize: 17, fontWeight: 700, color: s.c,
                marginTop: 2, letterSpacing: -0.3,
              }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', borderBottom: `1px solid ${t.line}` }}>
          {[
            { id: 'active', label: 'Active · 4' },
            { id: 'inactive', label: 'Inactive · 2' },
            { id: 'sold', label: 'Sold · 11' },
          ].map((tb) => {
            const on = tb.id === tab;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                style={{
                  padding: '10px 0', marginRight: 24,
                  fontFamily: FONT, fontSize: 14, fontWeight: on ? 700 : 500,
                  color: on ? t.ink : t.inkDim, position: 'relative',
                  border: 'none', background: 'none', cursor: 'pointer',
                }}
              >
                {tb.label}
                {on && (
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2.5, background: t.orange, borderRadius: 2 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tab === 'active' && ACTIVE_LISTINGS.map((l) => (
          <button
            key={l.title}
            onClick={() => onOpenListing && onOpenListing(l)}
            style={{
              background: '#fff', borderRadius: 14, padding: 10,
              display: 'flex', gap: 12, alignItems: 'center',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
              border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}
          >
            <div style={{
              width: 68, height: 68, borderRadius: 10, flexShrink: 0, position: 'relative',
              background: `repeating-linear-gradient(135deg, ${l.hue}, ${l.hue} 6px, ${l.hue}dd 6px, ${l.hue}dd 12px)`,
            }}>
              {l.boosted && (
                <div style={{
                  position: 'absolute', top: 4, left: 4, padding: '2px 6px',
                  borderRadius: 5, background: t.orange, color: '#fff',
                  fontFamily: FONT, fontSize: 9, fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>Boosted</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT, fontSize: 14, fontWeight: 600, color: t.ink,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{l.title}</div>
              <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: t.blue, marginTop: 3 }}>
                AED {l.price}
              </div>
              <div style={{
                marginTop: 6, display: 'flex', gap: 12,
                fontFamily: FONT, fontSize: 11, color: t.inkDim,
              }}>
                <span>{l.views} views</span>
                <span>{l.msgs} messages</span>
                {l.offers > 0 && <span style={{ color: t.orange, fontWeight: 700 }}>● {l.offers} offers</span>}
              </div>
            </div>
            <div style={{
              alignSelf: 'center', width: 32, height: 32, borderRadius: 8,
              background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="4" viewBox="0 0 14 4">
                <circle cx="2" cy="2" r="1.5" fill={t.inkDim} />
                <circle cx="7" cy="2" r="1.5" fill={t.inkDim} />
                <circle cx="12" cy="2" r="1.5" fill={t.inkDim} />
              </svg>
            </div>
          </button>
        ))}
        {tab !== 'active' && (
          <div style={{
            padding: '40px 16px', textAlign: 'center',
            fontFamily: FONT, fontSize: 13, color: t.inkDim,
          }}>
            {tab === 'inactive' ? 'No inactive listings right now.' : 'Your sold items will appear here.'}
          </div>
        )}
      </div>

      <TabBar active="me" onTab={onTab} />
    </div>
  );
}

export function ListingAdmin({ onBack }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '64px 20px 0', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 10, flexShrink: 0,
      }}>
        <BackBtn onBack={onBack} />
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: t.ink }}>Listing</div>
        <button style={{
          padding: '7px 12px', borderRadius: 10, background: '#fff',
          boxShadow: `inset 0 0 0 1px ${t.line}`,
          fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.blue,
          border: 'none', cursor: 'pointer',
        }}>Share</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 88, height: 88, borderRadius: 14, flexShrink: 0,
            background: 'repeating-linear-gradient(135deg, #D4B896, #D4B896 8px, #C4A680 8px, #C4A680 16px)',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-block', padding: '3px 8px', borderRadius: 6,
              background: '#10B98122', color: '#058A5C',
              fontFamily: FONT, fontSize: 10, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 0.6,
            }}>● Active</div>
            <div style={{
              fontFamily: FONT, fontSize: 17, fontWeight: 700, color: t.ink,
              marginTop: 6, lineHeight: 1.25,
            }}>
              IKEA Strandmon armchair, beige
            </div>
            <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: t.blue, marginTop: 4 }}>
              AED 850
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { k: 'Views', v: '142', sub: '+18 today' },
            { k: 'Saves', v: '23', sub: '16% rate' },
            { k: 'Messages', v: '4', sub: '2 unread', hi: true },
          ].map((s) => (
            <div key={s.k} style={{
              background: s.hi ? t.orange : '#fff', color: s.hi ? '#fff' : t.ink,
              borderRadius: 14, padding: '12px 12px',
              boxShadow: s.hi ? 'none' : `inset 0 0 0 1px ${t.line}`,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 11, opacity: 0.75,
                textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600,
              }}>{s.k}</div>
              <div style={{
                fontFamily: FONT, fontSize: 22, fontWeight: 700,
                letterSpacing: -0.4, marginTop: 2,
              }}>{s.v}</div>
              <div style={{ fontFamily: FONT, fontSize: 11, opacity: 0.8, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 14, background: '#fff',
          boxShadow: `inset 0 0 0 1px ${t.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{
              fontFamily: FONT, fontSize: 12, fontWeight: 700, color: t.inkDim,
              textTransform: 'uppercase', letterSpacing: 0.7,
            }}>Views · last 7 days</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: t.blue, fontWeight: 600, cursor: 'pointer' }}>Details</div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
            {[14, 22, 18, 28, 24, 34, 18].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: h * 1.5, borderRadius: 4,
                  background: i === 5 ? t.orange : t.blue, opacity: i === 5 ? 1 : 0.85,
                }} />
                <div style={{ fontFamily: FONT, fontSize: 10, color: t.inkDim }}>{'SMTWTFS'[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button style={{
            height: 48, borderRadius: 12, background: t.orange, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: FONT, fontSize: 14, fontWeight: 700,
            border: 'none', cursor: 'pointer',
          }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M7 1l-5 8h4l-1 6 5-8H6l1-6z" fill="#fff" />
            </svg>
            Boost · 50 AED
          </button>
          <button style={{
            height: 48, borderRadius: 12, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`, color: t.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: FONT, fontSize: 14, fontWeight: 600,
            border: 'none', cursor: 'pointer',
          }}>
            Edit
          </button>
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          {[
            { label: 'Pause', color: t.ink },
            { label: 'Mark sold', color: t.ink },
            { label: 'Delete', color: '#C53030' },
          ].map((b) => (
            <button
              key={b.label}
              style={{
                flex: 1, height: 44, borderRadius: 12, background: '#fff',
                boxShadow: `inset 0 0 0 1px ${t.line}`, color: b.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT, fontSize: 13, fontWeight: 500,
                border: 'none', cursor: 'pointer',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const THREADS = [
  { name: 'Omar K.', item: 'IKEA Strandmon armchair', last: 'Is 750 AED possible? Can pick up today.', time: '2m', unread: true, hue: '#D4B896', offer: true },
  { name: 'Layla R.', item: 'Nintendo Switch OLED', last: 'Great, see you at Marina Mall at 6.', time: '18m', unread: true, hue: '#B8C4D0' },
  { name: 'Ahmed S.', item: 'Canyon road bike', last: 'Thanks! Will transfer tonight.', time: '1h', unread: true, hue: '#6B7A8C' },
  { name: 'Priya M.', item: 'Dyson V11 vacuum', last: 'You: Sure, it works perfectly.', time: '3h', hue: '#8FA4B8' },
  { name: 'Hassan T.', item: 'IKEA Strandmon armchair', last: 'Is this still available?', time: 'Yesterday', hue: '#D4B896' },
  { name: 'Noura A.', item: 'Nintendo Switch OLED', last: 'You: Yes, comes with 3 games.', time: 'Mon', hue: '#B8C4D0' },
];

export function MessagesInbox({ onOpenChat, onTab }) {
  const [filter, setFilter] = useState('All');
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 20px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: FONT, fontSize: 28, fontWeight: 700,
            color: t.ink, letterSpacing: -0.6,
          }}>Inbox</div>
          <div style={{
            padding: '6px 10px', borderRadius: 999, background: t.orangeSoft,
            fontFamily: FONT, fontSize: 12, fontWeight: 700, color: t.orange,
          }}>3 new</div>
        </div>
        <div style={{
          marginTop: 12, height: 42, borderRadius: 12, background: '#fff',
          boxShadow: `inset 0 0 0 1px ${t.line}`,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          fontFamily: FONT, fontSize: 14, color: t.inkDim,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke={t.inkDim} strokeWidth="1.4" />
            <path d="M9.5 9.5L13 13" stroke={t.inkDim} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Search messages
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          {['All', 'Buying', 'Selling', 'Offers'].map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 14px', borderRadius: 999,
                  background: on ? t.blue : '#fff',
                  color: on ? '#fff' : t.ink,
                  boxShadow: on ? 'none' : `inset 0 0 0 1px ${t.line}`,
                  fontFamily: FONT, fontSize: 12, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                }}
              >{f}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        {THREADS.map((th, i) => (
          <button
            key={th.name + th.item}
            onClick={() => onOpenChat && onOpenChat(th)}
            style={{
              padding: '12px 0', display: 'flex', gap: 12, alignItems: 'center',
              borderBottom: i < THREADS.length - 1 ? `0.5px solid ${t.line}` : 'none',
              border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: `repeating-linear-gradient(135deg, ${th.hue}, ${th.hue} 6px, ${th.hue}dd 6px, ${th.hue}dd 12px)`,
              }} />
              <div style={{
                position: 'absolute', right: -4, bottom: -4,
                width: 24, height: 24, borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
                border: `2px solid ${t.bg}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT, fontSize: 10, fontWeight: 800, color: t.blue,
              }}>{th.name[0]}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{
                  fontFamily: FONT, fontSize: 14,
                  fontWeight: th.unread ? 700 : 600, color: t.ink,
                }}>{th.name}</div>
                <div style={{
                  fontFamily: FONT, fontSize: 11,
                  color: th.unread ? t.orange : t.inkDim,
                  fontWeight: th.unread ? 700 : 500,
                }}>{th.time}</div>
              </div>
              <div style={{
                fontFamily: FONT, fontSize: 11, color: t.inkDim, marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>on · {th.item}</div>
              <div style={{
                marginTop: 3, fontFamily: FONT, fontSize: 13,
                color: th.unread ? t.ink : t.inkDim,
                fontWeight: th.unread ? 500 : 400,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {th.offer && (
                  <span style={{
                    padding: '2px 6px', borderRadius: 5, background: t.orange, color: '#fff',
                    fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>Offer</span>
                )}
                <span style={{
                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{th.last}</span>
              </div>
            </div>
            {th.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.orange, flexShrink: 0 }} />}
          </button>
        ))}
      </div>

      <TabBar active="msg" onTab={onTab} />
    </div>
  );
}

function Bubble({ text, them }) {
  return (
    <div style={{
      alignSelf: them ? 'flex-start' : 'flex-end', maxWidth: '78%',
      padding: '10px 14px',
      borderRadius: them ? '18px 18px 18px 6px' : '18px 18px 6px 18px',
      background: them ? '#fff' : t.blue,
      color: them ? t.ink : '#fff',
      boxShadow: them ? `inset 0 0 0 1px ${t.line}` : 'none',
      fontFamily: FONT, fontSize: 14, lineHeight: 1.35,
    }}>{text}</div>
  );
}

export function ChatScreen({ onBack }) {
  const [draft, setDraft] = useState('');
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '62px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: 11, background: '#fff',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
            }}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path d="M7 1L1 7l6 6" stroke={t.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 14, fontWeight: 800, color: t.blue,
            flexShrink: 0,
          }}>O</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: t.ink }}>Omar K.</div>
            <div style={{
              fontFamily: FONT, fontSize: 11, color: t.success, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.success }} /> Active now
            </div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 11, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="4" viewBox="0 0 14 4">
              <circle cx="2" cy="2" r="1.5" fill={t.ink} />
              <circle cx="7" cy="2" r="1.5" fill={t.ink} />
              <circle cx="12" cy="2" r="1.5" fill={t.ink} />
            </svg>
          </div>
        </div>
      </div>

      <div style={{
        margin: '14px 16px 8px', padding: 10, borderRadius: 12,
        background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
        display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 9, flexShrink: 0,
          background: 'repeating-linear-gradient(135deg, #D4B896, #D4B896 6px, #C4A680 6px, #C4A680 12px)',
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.ink }}>IKEA Strandmon armchair</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: t.blue, fontWeight: 700, marginTop: 2 }}>AED 850</div>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 11, color: t.blue, fontWeight: 600, cursor: 'pointer' }}>View</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          textAlign: 'center', fontFamily: FONT, fontSize: 11,
          color: t.inkDim, margin: '4px 0',
        }}>Today</div>

        <Bubble text="Hi! Is this armchair still available?" them />
        <Bubble text="Yes, still available — just posted 2 days ago." />
        <Bubble text="Great. Is 750 AED possible? I can pick up today from Marina." them />

        <div style={{
          alignSelf: 'flex-start', maxWidth: '82%',
          borderRadius: '18px 18px 18px 6px', overflow: 'hidden',
          background: '#fff', boxShadow: `inset 0 0 0 1.5px ${t.orange}`,
        }}>
          <div style={{ padding: '10px 14px 8px' }}>
            <div style={{
              fontFamily: FONT, fontSize: 11, color: t.orange, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 0.7,
            }}>Offer</div>
            <div style={{
              fontFamily: FONT, fontSize: 22, fontWeight: 700, color: t.ink,
              letterSpacing: -0.4, marginTop: 2,
            }}>
              AED 750
              <span style={{
                fontSize: 13, color: t.inkDim, fontWeight: 500,
                textDecoration: 'line-through', marginLeft: 4,
              }}>850</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim, marginTop: 2 }}>Pickup · today, 6pm</div>
          </div>
          <div style={{ display: 'flex', borderTop: `1px solid ${t.line}` }}>
            <button style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              fontFamily: FONT, fontSize: 13, fontWeight: 700, color: t.inkDim,
              borderRight: `1px solid ${t.line}`,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>Decline</button>
            <button style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              fontFamily: FONT, fontSize: 13, fontWeight: 700, color: t.blue,
              borderRight: `1px solid ${t.line}`,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>Counter</button>
            <button style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              fontFamily: FONT, fontSize: 13, fontWeight: 800, color: t.orange,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>Accept</button>
          </div>
        </div>

        <div style={{
          alignSelf: 'flex-start', padding: '10px 14px',
          borderRadius: '18px 18px 18px 6px',
          background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
          display: 'flex', gap: 4,
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: t.inkDim, opacity: 0.5 - i * 0.15,
            }} />
          ))}
        </div>
      </div>

      <div style={{
        padding: '10px 12px 26px', background: t.bg,
        display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
      }}>
        <button style={{
          width: 36, height: 36, borderRadius: 11, background: t.blueSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          border: 'none', padding: 0, cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke={t.blue} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div style={{
          flex: 1, height: 40, borderRadius: 20, background: '#fff',
          boxShadow: `inset 0 0 0 1px ${t.line}`,
          display: 'flex', alignItems: 'center', padding: '0 14px',
        }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: FONT, fontSize: 13, color: t.ink,
              padding: 0, minWidth: 0,
            }}
          />
        </div>
        <button
          disabled={!draft.trim()}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: draft.trim() ? t.orange : '#C9D1D9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: 'none', padding: 0, cursor: draft.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8l12-6-5 14-2-5-5-3z" fill="#fff" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const OFFERS = [
  { buyer: 'Omar K.', item: 'IKEA Strandmon armchair', listed: 850, offer: 750, status: 'new', hue: '#D4B896', time: '2m' },
  { buyer: 'Sara D.', item: 'Dyson V11 vacuum', listed: 1100, offer: 950, status: 'new', hue: '#8FA4B8', time: '28m' },
  { buyer: 'Rashid N.', item: 'Canyon road bike', listed: 4200, offer: 3900, status: 'countered', hue: '#6B7A8C', time: '2h' },
  { buyer: 'Fatima L.', item: 'Nintendo Switch OLED', listed: 920, offer: 850, status: 'expiring', hue: '#B8C4D0', time: 'Expires 4h' },
  { buyer: 'Yusuf K.', item: 'IKEA Strandmon armchair', listed: 850, offer: 600, status: 'declined', hue: '#D4B896', time: 'Yesterday' },
];

export function OffersInbox({ onBack }) {
  const statusMap = {
    new: { bg: t.orange, fg: '#fff', label: 'New' },
    countered: { bg: t.blueSoft, fg: t.blue, label: 'Countered' },
    expiring: { bg: '#FEF3C7', fg: '#92400E', label: 'Expiring' },
    declined: { bg: t.line, fg: t.inkDim, label: 'Declined' },
  };
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BackBtn onBack={onBack} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: FONT, fontSize: 24, fontWeight: 700,
              color: t.ink, letterSpacing: -0.5,
            }}>Offers</div>
            <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 13, color: t.inkDim }}>
              2 new · 1 expiring today
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {OFFERS.map((o, i) => {
          const s = statusMap[o.status];
          const pctDown = Math.round((1 - o.offer / o.listed) * 100);
          return (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, padding: 12,
              boxShadow: o.status === 'new' ? `inset 0 0 0 2px ${t.orange}` : `inset 0 0 0 1px ${t.line}`,
              display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: 11, flexShrink: 0,
                background: `repeating-linear-gradient(135deg, ${o.hue}, ${o.hue} 6px, ${o.hue}dd 6px, ${o.hue}dd 12px)`,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 8,
                }}>
                  <div style={{
                    fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.ink,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{o.buyer}</div>
                  <div style={{
                    padding: '2px 7px', borderRadius: 5, background: s.bg, color: s.fg,
                    fontFamily: FONT, fontSize: 9, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0,
                  }}>{s.label}</div>
                </div>
                <div style={{
                  fontFamily: FONT, fontSize: 11, color: t.inkDim, marginTop: 1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{o.item}</div>
                <div style={{
                  marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6,
                }}>
                  <div style={{
                    fontFamily: FONT, fontSize: 17, fontWeight: 700, color: t.ink, letterSpacing: -0.3,
                  }}>AED {o.offer.toLocaleString()}</div>
                  <div style={{
                    fontFamily: FONT, fontSize: 11, color: t.inkDim, textDecoration: 'line-through',
                  }}>{o.listed.toLocaleString()}</div>
                  <div style={{
                    fontFamily: FONT, fontSize: 11,
                    color: pctDown > 20 ? '#C53030' : t.inkDim, fontWeight: 600,
                  }}>−{pctDown}%</div>
                  <div style={{ flex: 1 }} />
                  <div style={{
                    fontFamily: FONT, fontSize: 10,
                    color: o.status === 'expiring' ? '#C53030' : t.inkDim, fontWeight: 600,
                  }}>{o.time}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileScreen({ onMyListings, onOffers, onTab }) {
  const groups = [
    {
      header: 'Selling',
      rows: [
        { label: 'My listings', right: '4 active', onClick: onMyListings, ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke={t.blue} strokeWidth="1.5" />
            <path d="M2 9l3-2 3 2 3-3 3 3" stroke={t.blue} strokeWidth="1.5" fill="none" />
          </svg>
        ), iconBg: t.blueSoft },
        { label: 'Offers', right: '2 new', hi: true, onClick: onOffers, ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L8 2l6 6-6 6-6-6z" stroke={t.orange} strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1" fill={t.orange} />
          </svg>
        ), iconBg: t.orangeSoft },
        { label: 'Wallet', right: '1,420 AED', ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="12" height="9" rx="1.5" stroke={t.blue} strokeWidth="1.5" />
            <circle cx="11" cy="8.5" r="1.2" fill={t.blue} />
          </svg>
        ), iconBg: t.blueSoft },
      ],
    },
    {
      header: 'Buying',
      rows: [
        /*{ label: 'Saved items', right: '23', ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 14l-5-4a3.5 3.5 0 115-5 3.5 3.5 0 115 5l-5 4z" stroke={t.blue} strokeWidth="1.5" />
          </svg>
        ), iconBg: t.blueSoft }, */
        { label: 'Purchase history', ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h2l2 8h7l2-6H5" stroke={t.blue} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </svg>
        ), iconBg: t.blueSoft },
      ],
    },
    {
      header: 'Account',
      rows: [
        { label: 'Notifications', ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 10V7a5 5 0 0110 0v3l1 2H2l1-2z" stroke={t.blue} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        ), iconBg: t.blueSoft },
        { label: 'Location · Dubai Marina', ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 15c4-4.5 6-7 6-9a6 6 0 10-12 0c0 2 2 4.5 6 9z" stroke={t.blue} strokeWidth="1.5" />
          </svg>
        ), iconBg: t.blueSoft },
        { label: 'Verification', right: '✓ Verified', rightColor: t.success, ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7V3l6-2z" stroke={t.blue} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        ), iconBg: t.blueSoft },
        { label: 'Help & support', ic: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={t.blue} strokeWidth="1.5" />
            <path d="M6 6.5A2 2 0 018 4.5a2 2 0 011 3.5c-.5.3-1 .5-1 1M8 11.5v.01" stroke={t.blue} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ), iconBg: t.blueSoft },
      ],
    },
  ];
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{
          padding: '64px 20px 20px',
          background: `linear-gradient(180deg, ${t.blue} 0%, ${t.blue} 70%, ${t.orange} 220%)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -20, width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT, fontSize: 22, fontWeight: 800, color: t.blue,
              border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0,
            }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT, fontSize: 19, fontWeight: 700, letterSpacing: -0.3,
              }}>Aisha Al Mansouri</div>
              <div style={{
                fontFamily: FONT, fontSize: 12, opacity: 0.85, marginTop: 2,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                @aisha.m · <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>★ 4.9 · 11 sold</span>
              </div>
              <div style={{
                marginTop: 6, display: 'inline-flex', padding: '3px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.18)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              }}>
                ✓ ID VERIFIED · DUBAI MARINA
              </div>
            </div>
            <button style={{
              padding: '7px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.22)',
              fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#fff',
              border: 'none', cursor: 'pointer',
            }}>
              Edit
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {groups.map((g, gi) => (
            <div key={g.header} style={{ marginBottom: 18 }}>
              <div style={{
                padding: '0 20px 8px',
                fontFamily: FONT, fontSize: 11, fontWeight: 700, color: t.inkDim,
                textTransform: 'uppercase', letterSpacing: 0.8,
              }}>{g.header}</div>
              <div style={{
                margin: '0 16px', background: '#fff', borderRadius: 14,
                boxShadow: `inset 0 0 0 1px ${t.line}`, overflow: 'hidden',
              }}>
                {g.rows.map((r, ri) => (
                  <button
                    key={r.label}
                    onClick={r.onClick}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      borderBottom: ri < g.rows.length - 1 ? `0.5px solid ${t.line}` : 'none',
                      border: 'none', background: 'none', cursor: r.onClick ? 'pointer' : 'default',
                      textAlign: 'left', width: '100%',
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, background: r.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {r.ic}
                    </div>
                    <div style={{
                      flex: 1, fontFamily: FONT, fontSize: 14, fontWeight: 500, color: t.ink,
                    }}>{r.label}</div>
                    {r.right && (
                      <div style={{
                        fontFamily: FONT, fontSize: 12,
                        fontWeight: r.hi ? 800 : 500,
                        color: r.hi ? t.orange : (r.rightColor || t.inkDim),
                      }}>{r.right}</div>
                    )}
                    <svg width="7" height="12" viewBox="0 0 7 12">
                      <path d="M1 1l5 5-5 5" stroke={t.inkDim} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="me" onTab={onTab} />
    </div>
  );
}
