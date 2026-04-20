import React, { useState } from 'react';
import { FONT, tokens as t } from './tokens.js';
import { PrimaryBtn, MinimalHeader, FieldLabel } from './shared.jsx';

function IconCamera({ c = '#fff', s = 22 }) {
  return (
    <svg width={s} height={s * 0.82} viewBox="0 0 22 18" fill="none">
      <rect x="1" y="4" width="20" height="13" rx="2.5" stroke={c} strokeWidth="1.8" />
      <path d="M7 4l1.5-2.5h5L15 4" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="11" cy="10.5" r="3.5" stroke={c} strokeWidth="1.8" />
    </svg>
  );
}

const DRAFTS = [
  { title: 'Mid-century coffee table', meta: 'Draft · 2 photos' },
  { title: 'Road bike · Canyon Endurace', meta: 'Draft · Not priced' },
];

export function ListingStart({ onNewListing, onClose }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: t.ink, letterSpacing: -0.4 }}>
          New listing
        </div>
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: 12, border: 'none', background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M1 1l12 12M13 1L1 13" stroke={t.ink} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '8px 20px 0' }}>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 700,
          color: t.ink, letterSpacing: -0.6, lineHeight: 1.1,
        }}>Let's sell something<br />that's collecting dust.</div>
        <div style={{
          marginTop: 12, fontFamily: FONT, fontSize: 15,
          color: t.inkDim, lineHeight: 1.45,
        }}>
          Most items in Dubai Marina sell in under 3 days.
        </div>

        <button
          onClick={onNewListing}
          style={{
            marginTop: 22, width: '100%', borderRadius: 22, padding: '22px 20px',
            background: `linear-gradient(135deg, ${t.blue} 0%, ${t.blue} 60%, ${t.orange} 140%)`,
            color: '#fff', position: 'relative', overflow: 'hidden',
            border: 'none', textAlign: 'left', cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute', right: -30, top: -30, width: 140, height: 140,
            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', right: 30, bottom: -40, width: 90, height: 90,
            borderRadius: '50%', background: t.orange, opacity: 0.35,
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: FONT, fontSize: 15, opacity: 0.8, fontWeight: 500 }}>
              Start fresh
            </div>
            <div style={{
              fontFamily: FONT, fontSize: 22, fontWeight: 700,
              letterSpacing: -0.3, marginTop: 4, lineHeight: 1.2,
            }}>Create a new listing</div>
            <div style={{
              marginTop: 18, height: 44, borderRadius: 12,
              background: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              color: t.ink, fontFamily: FONT, fontSize: 15, fontWeight: 600,
            }}>
              <IconCamera c={t.blue} s={18} /> Take a photo
            </div>
          </div>
        </button>

        <div style={{
          marginTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <div style={{
            fontFamily: FONT, fontSize: 13, fontWeight: 700,
            color: t.inkDim, textTransform: 'uppercase', letterSpacing: 0.8,
          }}>Your drafts · {DRAFTS.length}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.blue, cursor: 'pointer' }}>
            See all
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DRAFTS.map((d) => (
            <div key={d.title} style={{
              height: 64, borderRadius: 14, background: '#fff',
              boxShadow: `inset 0 0 0 1px ${t.line}`,
              display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: t.blueSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="4" width="18" height="14" rx="2" stroke={t.blue} strokeWidth="1.6" />
                  <path d="M2 14l5-4 4 3 4-5 5 5" stroke={t.blue} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: t.ink }}>{d.title}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: t.orange, marginTop: 2, fontWeight: 500 }}>{d.meta}</div>
              </div>
              <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
                <path d="M1 1l6 6-6 6" stroke={t.inkDim} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PHOTO_FILLS = [
  { hue: '#6B7A8C' },
  { hue: '#D4B896' },
  { hue: '#8FA4B8' },
  { hue: '#B8C4D0' },
];

export function ListingPhotos({ onNext, onBack, onSkip }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={0} total={5} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 20px 0', overflow: 'hidden' }}>
        <div style={{
          fontFamily: FONT, fontSize: 26, fontWeight: 700,
          color: t.ink, letterSpacing: -0.5, lineHeight: 1.15,
        }}>Add some photos.</div>
        <div style={{
          marginTop: 8, fontFamily: FONT, fontSize: 14,
          color: t.inkDim, lineHeight: 1.5,
        }}>
          First photo is the cover. Listings with 4+ photos sell{' '}
          <span style={{ color: t.orange, fontWeight: 600 }}>2.4× faster</span>.
        </div>

        <div style={{
          marginTop: 22, display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
        }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const photo = PHOTO_FILLS[i];
            if (photo) {
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: 12, position: 'relative', overflow: 'hidden',
                  background: `repeating-linear-gradient(135deg, ${photo.hue}, ${photo.hue} 8px, ${photo.hue}dd 8px, ${photo.hue}dd 16px)`,
                }}>
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', top: 6, left: 6, padding: '3px 8px',
                      borderRadius: 6, background: t.orange, color: '#fff',
                      fontFamily: FONT, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 0.6,
                    }}>Cover</div>
                  )}
                  <div style={{
                    position: 'absolute', top: 6, right: 6, width: 22, height: 22,
                    borderRadius: '50%', background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M1 1l8 8M9 1L1 9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              );
            }
            const isAdd = i === 4;
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 12,
                background: isAdd ? t.blueSoft : '#fff',
                boxShadow: isAdd ? 'none' : `inset 0 0 0 1.5px ${t.line}`,
                border: isAdd ? `1.5px dashed ${t.blue}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 4,
                cursor: isAdd ? 'pointer' : 'default',
              }}>
                {isAdd ? (
                  <>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: t.blue,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: t.blue }}>Add</div>
                  </>
                ) : (
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 18, padding: '12px 14px', borderRadius: 12, background: t.orangeSoft,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: t.orange,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M5 1v4M5 7v2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: t.ink, lineHeight: 1.4 }}>
            Shoot in daylight, clean background, show any scratches. It builds trust.
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 20px 28px' }}>
        <PrimaryBtn onClick={onNext}>Continue · 4 photos</PrimaryBtn>
      </div>
    </div>
  );
}

export function ListingDetails({ onNext, onBack, onSkip }) {
  const [title, setTitle] = useState('IKEA Strandmon armchair, beige');
  const [description, setDescription] = useState(
    'Bought 2 years ago, used in a smoke-free apartment in JLT. ' +
    'Small scratch on the right leg (shown in photo 3). No rips, ' +
    'no stains. Pickup from Marina Promenade.'
  );
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={1} total={5} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 20px 0', overflow: 'auto' }}>
        <div style={{
          fontFamily: FONT, fontSize: 26, fontWeight: 700,
          color: t.ink, letterSpacing: -0.5, lineHeight: 1.15,
        }}>What are you selling?</div>

        <div style={{ marginTop: 20 }}>
          <FieldLabel>Title</FieldLabel>
          <div style={{
            height: 56, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1.5px ${t.blue}`,
            display: 'flex', alignItems: 'center', padding: '0 14px 0 18px', gap: 8,
          }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 80))}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: FONT, fontSize: 17, fontWeight: 500, color: t.ink,
                padding: 0, minWidth: 0,
              }}
            />
            <button style={{
              width: 36, height: 36, borderRadius: 10, background: t.orange,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(249,115,22,0.35)', flexShrink: 0,
              border: 'none', padding: 0, cursor: 'pointer',
            }}>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <rect x="4" y="1" width="6" height="10" rx="3" fill="#fff" />
                <path d="M1.5 9a5.5 5.5 0 0011 0M7 14.5V17M4 17h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div style={{
            marginTop: 6, display: 'flex', justifyContent: 'space-between',
            fontFamily: FONT, fontSize: 12, color: t.inkDim,
          }}>
            <span>Type or tap <span style={{ color: t.orange, fontWeight: 600 }}>mic</span> to dictate.</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{title.length} / 80</span>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 14,
          background: `linear-gradient(135deg, ${t.orange} 0%, ${t.orange} 55%, ${t.blue} 180%)`,
          display: 'flex', alignItems: 'center', gap: 12, color: '#fff',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 2.5, flexShrink: 0,
          }}>
            {[10, 18, 24, 14, 8].map((h, i) => (
              <div key={i} style={{
                width: 3, height: h, borderRadius: 2, background: '#fff', opacity: 0.95,
              }} />
            ))}
          </div>
          <div style={{ flex: 1, lineHeight: 1.3 }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700 }}>
              Just say it
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, opacity: 0.9, marginTop: 2 }}>
              "Selling my beige IKEA armchair, like new…"
            </div>
          </div>
          <div style={{
            padding: '7px 12px', borderRadius: 999, background: '#fff',
            color: t.orange, fontFamily: FONT, fontSize: 12, fontWeight: 700,
          }}>Hold to talk</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 600,
              color: t.inkDim, textTransform: 'uppercase', letterSpacing: 0.8,
            }}>Description</div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999, border: 'none',
              background: t.blue, color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(15,76,129,0.28)',
              fontFamily: FONT, fontSize: 12, fontWeight: 700,
              letterSpacing: 0.2,
            }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5z" fill="#fff" />
              </svg>
              Write with AI
            </button>
          </div>
          <div style={{
            minHeight: 128, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            padding: '14px 18px 32px', position: 'relative',
          }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                resize: 'vertical',
                fontFamily: FONT, fontSize: 15, color: t.ink, lineHeight: 1.5,
                padding: 0,
              }}
            />
            <div style={{
              position: 'absolute', left: 14, bottom: 10, display: 'flex',
              alignItems: 'center', gap: 6,
              fontFamily: FONT, fontSize: 11, color: t.blue, fontWeight: 600,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: t.orange,
              }} />
              Drafted by AI from your photos · edit freely
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 20px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={!title.trim()}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { n: 'Furniture', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="8" width="16" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 14v3M15 14v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) },
  { n: 'Electronics', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 18h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) },
  { n: 'Fashion', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 3l-4 3 2 3 2-1v9h8v-9l2 1 2-3-4-3-2 2h-4l-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ) },
  { n: 'Home', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 9l8-6 8 6v8H2V9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ) },
  { n: 'Sports', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 10h15M10 2.5v15" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) },
  { n: 'Kids', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) },
];

const CONDITIONS = ['Brand new', 'Like new', 'Good', 'Fair'];

export function ListingCategory({ onNext, onBack, onSkip }) {
  const [cat, setCat] = useState('Furniture');
  const [cond, setCond] = useState('Like new');
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={2} total={5} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 20px 0', overflow: 'auto' }}>
        <div style={{
          fontFamily: FONT, fontSize: 26, fontWeight: 700,
          color: t.ink, letterSpacing: -0.5, lineHeight: 1.15,
        }}>Category & condition.</div>
        <div style={{ marginTop: 6, fontFamily: FONT, fontSize: 14, color: t.inkDim }}>
          Helps the right buyers find it.
        </div>

        <div style={{
          marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
        }}>
          {CATEGORIES.map((c) => {
            const sel = c.n === cat;
            return (
              <button
                key={c.n}
                onClick={() => setCat(c.n)}
                style={{
                  aspectRatio: '1.1', borderRadius: 14,
                  background: sel ? t.blue : '#fff',
                  boxShadow: sel ? 'none' : `inset 0 0 0 1px ${t.line}`,
                  color: sel ? '#fff' : t.ink,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                {c.icon}
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>{c.n}</div>
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: 24, fontFamily: FONT, fontSize: 13, fontWeight: 700,
          color: t.inkDim, textTransform: 'uppercase', letterSpacing: 0.8,
        }}>Condition</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CONDITIONS.map((c) => {
            const sel = c === cond;
            return (
              <button
                key={c}
                onClick={() => setCond(c)}
                style={{
                  padding: '10px 16px', borderRadius: 999,
                  background: sel ? t.orange : '#fff',
                  color: sel ? '#fff' : t.ink,
                  boxShadow: sel ? 'none' : `inset 0 0 0 1px ${t.line}`,
                  fontFamily: FONT, fontSize: 14, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                }}
              >{c}</button>
            );
          })}
        </div>

        <div style={{
          marginTop: 24, padding: '14px 16px', borderRadius: 14,
          background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: t.blueSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M9 19c5-5.5 7-9 7-11a7 7 0 10-14 0c0 2 2 5.5 7 11z" stroke={t.blue} strokeWidth="1.6" />
              <circle cx="9" cy="8" r="2.3" fill={t.blue} />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: t.ink }}>Pickup from Dubai Marina</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim, marginTop: 2 }}>Change location or offer delivery</div>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
            <path d="M1 1l6 6-6 6" stroke={t.inkDim} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ padding: '14px 20px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={!cat || !cond}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

function Toggle({ on, onChange, colorOn = t.blue }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      style={{
        width: 44, height: 26, borderRadius: 999,
        background: on ? colorOn : '#C9D1D9',
        position: 'relative', flexShrink: 0,
        border: 'none', padding: 0, cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2, width: 22, height: 22,
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transition: 'left 0.15s',
      }} />
    </button>
  );
}

export function ListingPrice({ onNext, onBack, onSkip }) {
  const [price, setPrice] = useState('850');
  const [acceptOffers, setAcceptOffers] = useState(true);
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={3} total={5} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 20px 0', overflow: 'auto' }}>
        <div style={{
          fontFamily: FONT, fontSize: 26, fontWeight: 700,
          color: t.ink, letterSpacing: -0.5, lineHeight: 1.15,
        }}>Set your price.</div>

        <div style={{
          marginTop: 28, borderRadius: 20, background: '#fff',
          boxShadow: `inset 0 0 0 1.5px ${t.blue}`,
          padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            padding: '10px 12px', borderRadius: 10, background: t.blueSoft,
            fontFamily: FONT, fontSize: 13, fontWeight: 800, color: t.blue,
            letterSpacing: -0.2,
          }}>AED</div>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))}
            inputMode="numeric"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: FONT, fontSize: 44, fontWeight: 700, color: t.ink,
              letterSpacing: -1.2, fontVariantNumeric: 'tabular-nums',
              padding: 0, minWidth: 0,
            }}
          />
          <div style={{ width: 3, height: 42, background: t.orange, borderRadius: 2, animation: 'caret 1s steps(2) infinite' }} />
        </div>

        <div style={{
          marginTop: 20, padding: '16px 18px', borderRadius: 16, background: '#fff',
          boxShadow: `inset 0 0 0 1px ${t.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 700,
              color: t.inkDim, textTransform: 'uppercase', letterSpacing: 0.8,
            }}>
              Market range · Marina
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim }}>94 similar items</div>
          </div>
          <div style={{
            marginTop: 14, height: 10, borderRadius: 6, position: 'relative',
            background: `linear-gradient(90deg, ${t.blue} 0%, ${t.orange} 50%, ${t.blue} 100%)`,
            opacity: 0.22,
          }}>
            <div style={{
              position: 'absolute', top: -4, bottom: -4, width: 4,
              borderRadius: 2, background: t.ink, left: '58%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div style={{
            marginTop: 10, display: 'flex', justifyContent: 'space-between',
            fontFamily: FONT, fontSize: 12, color: t.inkDim, fontVariantNumeric: 'tabular-nums',
          }}>
            <span>500</span>
            <span style={{ color: t.orange, fontWeight: 700 }}>Sweet spot · 700–900</span>
            <span>1,400</span>
          </div>
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10, background: t.orangeSoft,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.orange }} />
            <div style={{ fontFamily: FONT, fontSize: 13, color: t.ink }}>
              Likely to sell in <span style={{ fontWeight: 700 }}>3–5 days</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
          }}>
            <Toggle on={acceptOffers} onChange={setAcceptOffers} />
            <div style={{ flex: 1, fontFamily: FONT, fontSize: 15, fontWeight: 500, color: t.ink }}>
              Accept offers
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 20px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={!price}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

export function ListingPreview({ onPublish, onBack, onSkip, onSaveDraft }) {
  const [boost, setBoost] = useState(true);
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={4} total={5} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '0 20px 0', overflow: 'auto' }}>
        <div style={{
          fontFamily: FONT, fontSize: 26, fontWeight: 700,
          color: t.ink, letterSpacing: -0.5, lineHeight: 1.15,
        }}>Looks good?</div>
        <div style={{ marginTop: 6, fontFamily: FONT, fontSize: 14, color: t.inkDim }}>
          Here's how buyers will see it.
        </div>

        <div style={{
          marginTop: 16, borderRadius: 20, background: '#fff',
          boxShadow: `0 10px 30px rgba(20,33,46,0.08), inset 0 0 0 1px ${t.line}`,
          overflow: 'hidden',
        }}>
          <div style={{
            aspectRatio: '1.4', position: 'relative',
            background: 'repeating-linear-gradient(135deg, #8FA4B8, #8FA4B8 10px, #7B93AB 10px, #7B93AB 20px)',
          }}>
            <div style={{
              position: 'absolute', top: 12, left: 12, padding: '5px 10px',
              borderRadius: 8, background: t.orange, color: '#fff',
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.8,
            }}>Like new</div>
            <div style={{
              position: 'absolute', bottom: 12, right: 12, padding: '4px 10px',
              borderRadius: 999, background: 'rgba(0,0,0,0.55)', color: '#fff',
              fontFamily: FONT, fontSize: 11, fontWeight: 600,
            }}>1 / 4</div>
          </div>

          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: t.ink, letterSpacing: -0.3 }}>
                AED 850
              </div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim }}>Posted just now</div>
            </div>
            <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 15, fontWeight: 500, color: t.ink }}>
              IKEA Strandmon armchair, beige
            </div>
            <div style={{
              marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: FONT, fontSize: 12, color: t.inkDim,
            }}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M6 13c3.5-3.8 5-6.3 5-7.7a5 5 0 10-10 0c0 1.4 1.5 3.9 5 7.7z" fill={t.blue} />
              </svg>
              Dubai Marina · Furniture
            </div>

            <div style={{
              marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.line}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.blueSoft}, ${t.orangeSoft})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT, fontSize: 13, fontWeight: 700, color: t.blue,
              }}>A</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: t.ink }}>
                  Aisha · ★ New seller
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 14,
          background: t.blueSoft, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: t.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M7 1l-5 8h4l-1 6 5-8H6l1-6z" fill="#fff" />
            </svg>
          </div>
          <div style={{ flex: 1, fontFamily: FONT, fontSize: 13, color: t.ink, lineHeight: 1.35 }}>
            Use your <span style={{ fontWeight: 700 }}>50 AED welcome credit</span> to boost for 24h?
          </div>
          <Toggle on={boost} onChange={setBoost} colorOn={t.orange} />
        </div>
      </div>

      <div style={{ padding: '14px 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryBtn variant="orange" onClick={onPublish}>Publish listing</PrimaryBtn>
        <div style={{ textAlign: 'center', fontFamily: FONT, fontSize: 14, color: t.inkDim }}>
          Or{' '}
          <span
            onClick={onSaveDraft}
            style={{ color: t.blue, fontWeight: 600, cursor: 'pointer' }}
          >
            save as draft
          </span>
        </div>
      </div>
    </div>
  );
}
