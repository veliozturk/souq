import React, { useState, useEffect } from 'react';
import { FONT, tokens as t } from './tokens.js';
import {
  CompassIllo, PrimaryBtn, SecondaryBtn, Progress, MinimalHeader, FieldLabel,
} from './shared.jsx';

export function ScreenWelcome({ onNext, onLogin }) {
  return (
    <div style={{
      height: '100%', background: t.bg, display: 'flex', flexDirection: 'column',
      paddingTop: 60,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <CompassIllo size={240} />
        <div style={{
          marginTop: 40, fontFamily: FONT,
          fontSize: 13, fontWeight: 600, color: t.orange,
          textTransform: 'uppercase', letterSpacing: 1.2,
        }}>Dubai · الإمارات</div>
        <div style={{
          marginTop: 12, fontFamily: FONT,
          fontSize: 34, fontWeight: 700, color: t.ink,
          letterSpacing: -0.8, lineHeight: 1.1, textAlign: 'center',
        }}>
          Your neighbours<br />have good stuff.
        </div>
        <div style={{
          marginTop: 14, fontFamily: FONT,
          fontSize: 16, color: t.inkDim, textAlign: 'center',
          lineHeight: 1.45, maxWidth: 280,
        }}>
          Buy, sell and swap with people nearby — from Marina to Mirdif.
        </div>
      </div>
      <div style={{ padding: '0 24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PrimaryBtn variant="orange" onClick={onNext}>Get started</PrimaryBtn>
        <div style={{
          textAlign: 'center', fontFamily: FONT, fontSize: 14,
          color: t.inkDim,
        }}>
          Already have an account?{' '}
          <span
            onClick={onLogin}
            style={{ color: t.blue, fontWeight: 600, cursor: 'pointer' }}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
}

export function ScreenPhone({ onNext, onBack, onSkip }) {
  const [digits, setDigits] = useState('50 123 4567');
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={0} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 24px 0' }}>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 700,
          color: t.ink, letterSpacing: -0.6, lineHeight: 1.15,
        }}>What's your<br />mobile number?</div>
        <div style={{
          marginTop: 10, fontFamily: FONT, fontSize: 15,
          color: t.inkDim, lineHeight: 1.45,
        }}>
          We'll send a one-time code to verify your account.
        </div>

        <div style={{ marginTop: 34 }}>
          <FieldLabel>Mobile number</FieldLabel>
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 14px', height: 56, borderRadius: 14,
              background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
              fontFamily: FONT, fontSize: 17, fontWeight: 600,
              color: t.ink,
            }}>
              <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, overflow: 'hidden' }}>
                <rect width="24" height="16" fill="#fff" />
                <rect width="24" height="5.33" fill="#00732F" />
                <rect y="10.67" width="24" height="5.33" fill="#000" />
                <rect width="7" height="16" fill="#FF0000" />
              </svg>
              +971
              <svg width="10" height="6" viewBox="0 0 10 6" style={{ marginLeft: 2 }}>
                <path d="M1 1l4 4 4-4" stroke={t.inkDim} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{
              flex: 1, height: 56, borderRadius: 14, background: '#fff',
              boxShadow: `inset 0 0 0 1.5px ${t.blue}`,
              display: 'flex', alignItems: 'center', padding: '0 18px',
              fontFamily: FONT, fontSize: 20, fontWeight: 500,
              color: t.ink, letterSpacing: 0.3,
            }}>
              <input
                value={digits}
                onChange={(e) => setDigits(e.target.value)}
                inputMode="tel"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: FONT, fontSize: 20, fontWeight: 500,
                  color: t.ink, letterSpacing: 0.3, padding: 0, minWidth: 0,
                }}
              />
              <div style={{
                width: 2, height: 24, background: t.orange,
                marginLeft: 6, animation: 'caret 1s steps(2) infinite',
              }} />
            </div>
          </div>
          <div style={{
            marginTop: 14, display: 'flex', gap: 10, alignItems: 'flex-start',
            fontFamily: FONT, fontSize: 13, color: t.inkDim, lineHeight: 1.45,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="2" y="6" width="12" height="9" rx="2" fill={t.blueSoft} stroke={t.blue} strokeWidth="1.5" />
              <path d="M5 6V4a3 3 0 016 0v2" stroke={t.blue} strokeWidth="1.5" fill="none" />
            </svg>
            Your number stays private. Buyers message you through the app.
          </div>
        </div>
      </div>
      <div style={{ padding: '0 24px 28px' }}>
        <PrimaryBtn onClick={onNext}>Send code</PrimaryBtn>
      </div>
    </div>
  );
}

export function ScreenOTP({ onNext, onBack, onSkip, onChangeNumber }) {
  const [code, setCode] = useState(['4', '7', '2', '1', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(24);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const complete = code.every((d) => d !== '');
  const activeIdx = code.findIndex((d) => d === '');

  const setDigitAt = (i, v) => {
    const next = [...code];
    next[i] = v.replace(/\D/g, '').slice(-1);
    setCode(next);
  };

  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={1} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 24px 0' }}>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 700,
          color: t.ink, letterSpacing: -0.6, lineHeight: 1.15,
        }}>Enter the code<br />we sent you.</div>
        <div style={{
          marginTop: 10, fontFamily: FONT, fontSize: 15,
          color: t.inkDim, lineHeight: 1.45,
        }}>
          Sent to <span style={{ color: t.ink, fontWeight: 600 }}>+971 50 123 4567</span> ·{' '}
          <span
            onClick={onChangeNumber}
            style={{ color: t.blue, fontWeight: 600, cursor: 'pointer' }}
          >
            Change
          </span>
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          {code.map((d, i) => {
            const active = i === (activeIdx === -1 ? code.length - 1 : activeIdx);
            return (
              <div key={i} style={{
                flex: 1, height: 64, maxWidth: 52, borderRadius: 14,
                background: '#fff',
                boxShadow: active
                  ? `inset 0 0 0 2px ${t.blue}`
                  : `inset 0 0 0 1px ${t.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <input
                  value={d}
                  onChange={(e) => setDigitAt(i, e.target.value)}
                  inputMode="numeric"
                  maxLength={1}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    border: 'none', outline: 'none', background: 'transparent',
                    textAlign: 'center',
                    fontFamily: FONT, fontSize: 26, fontWeight: 700,
                    color: t.ink, padding: 0,
                  }}
                />
                {d === '' && active && (
                  <div style={{ width: 2, height: 28, background: t.orange, pointerEvents: 'none' }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 28, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 6,
          fontFamily: FONT, fontSize: 14, color: t.inkDim,
        }}>
          {secondsLeft > 0 ? (
            <>
              Resend code in{' '}
              <span style={{ color: t.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                0:{String(secondsLeft).padStart(2, '0')}
              </span>
            </>
          ) : (
            <span
              onClick={() => setSecondsLeft(24)}
              style={{ color: t.blue, fontWeight: 600, cursor: 'pointer' }}
            >
              Resend code
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: '0 24px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={!complete}>Verify</PrimaryBtn>
      </div>
    </div>
  );
}

export function ScreenProfile({ onNext, onBack, onSkip, name, setName }) {
  const [handle, setHandle] = useState('aisha.m');
  const initial = name.trim().charAt(0).toUpperCase() || 'A';
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={2} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 24px 0' }}>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 700,
          color: t.ink, letterSpacing: -0.6, lineHeight: 1.15,
        }}>Say hello,<br />set a name.</div>
        <div style={{
          marginTop: 10, fontFamily: FONT, fontSize: 15,
          color: t.inkDim, lineHeight: 1.45,
        }}>
          This is how other people will see you.
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 108, height: 108, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.blueSoft} 0%, ${t.orangeSoft} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT, fontSize: 40, fontWeight: 700,
              color: t.blue, letterSpacing: -1,
            }}>{initial}</div>
            <button style={{
              position: 'absolute', right: -2, bottom: -2,
              width: 36, height: 36, borderRadius: '50%',
              background: t.orange, border: `3px solid ${t.bg}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, cursor: 'pointer',
            }}>
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                <path d="M2 4h2.5l1-1.5h5l1 1.5H14v8H2V4z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="8" cy="8" r="2.5" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <FieldLabel>Full name</FieldLabel>
          <div style={{
            height: 56, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1.5px ${t.blue}`,
            display: 'flex', alignItems: 'center', padding: '0 18px',
          }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: FONT, fontSize: 17, fontWeight: 500,
                color: t.ink, padding: 0, minWidth: 0,
              }}
            />
            <div style={{ width: 2, height: 22, background: t.orange, marginLeft: 4 }} />
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <FieldLabel>Username</FieldLabel>
          <div style={{
            height: 56, borderRadius: 14, background: '#fff',
            boxShadow: `inset 0 0 0 1px ${t.line}`,
            display: 'flex', alignItems: 'center', padding: '0 18px',
            fontFamily: FONT, fontSize: 17,
          }}>
            <span style={{ color: t.inkDim }}>@</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/\s/g, '').toLowerCase())}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: FONT, fontSize: 17, fontWeight: 500,
                color: t.ink, padding: 0, marginLeft: 2, minWidth: 0,
              }}
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" fill={t.success} />
              <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{
            marginTop: 8, fontFamily: FONT, fontSize: 13,
            color: t.success, fontWeight: 500,
          }}>Available</div>
        </div>
      </div>
      <div style={{ padding: '16px 24px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={!name.trim() || !handle.trim()}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

const NEIGHBOURHOODS = [
  { name: 'Dubai Marina', sub: '2.1 km away · 4,280 items' },
  { name: 'Downtown Dubai', sub: '5.4 km · 6,120 items' },
  { name: 'Jumeirah', sub: '3.8 km · 2,940 items' },
  { name: 'Business Bay', sub: '4.1 km · 3,550 items' },
  { name: 'JBR', sub: '1.9 km · 1,870 items' },
];

export function ScreenLocation({ onNext, onBack, onSkip, location, setLocation }) {
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader step={3} onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, padding: '12px 24px 0', overflow: 'hidden' }}>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 700,
          color: t.ink, letterSpacing: -0.6, lineHeight: 1.15,
        }}>Where are<br />you based?</div>
        <div style={{
          marginTop: 10, fontFamily: FONT, fontSize: 15,
          color: t.inkDim, lineHeight: 1.45,
        }}>
          We'll show you items and buyers close by.
        </div>

        <button style={{
          marginTop: 22, width: '100%', height: 52, borderRadius: 14,
          background: t.blueSoft, border: 'none',
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px',
          cursor: 'pointer',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke={t.blue} strokeWidth="1.8" />
            <circle cx="10" cy="10" r="3" fill={t.blue} />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke={t.blue} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: FONT, fontSize: 15, fontWeight: 600, color: t.blue,
          }}>Use my current location</span>
        </button>

        <div style={{
          marginTop: 22, fontFamily: FONT, fontSize: 13,
          fontWeight: 600, color: t.inkDim,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>Popular in Dubai</div>

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEIGHBOURHOODS.map((h) => {
            const selected = location === h.name;
            return (
              <button
                key={h.name}
                onClick={() => setLocation(h.name)}
                style={{
                  height: 60, borderRadius: 14, background: '#fff',
                  boxShadow: selected
                    ? `inset 0 0 0 2px ${t.orange}`
                    : `inset 0 0 0 1px ${t.line}`,
                  display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14,
                  border: 'none', textAlign: 'left', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: selected ? t.orange : t.blueSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                    <path d="M8 17c5-5.5 7-9 7-11a7 7 0 10-14 0c0 2 2 5.5 7 11z"
                      fill={selected ? '#fff' : t.blue} />
                    <circle cx="8" cy="6" r="2.3" fill={selected ? t.orange : '#fff'} />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: FONT, fontSize: 15, fontWeight: 600, color: t.ink,
                  }}>{h.name}</div>
                  <div style={{
                    fontFamily: FONT, fontSize: 12, color: t.inkDim, marginTop: 2,
                  }}>{h.sub}</div>
                </div>
                {selected && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: t.orange,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3.5 3.5L11 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '16px 24px 28px', background: t.bg }}>
        <PrimaryBtn onClick={onNext} disabled={!location}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

export function ScreenSuccess({ name, location, onList, onBrowse }) {
  const firstName = (name || '').split(' ')[0] || 'there';
  return (
    <div style={{ height: '100%', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 56 }}><Progress step={5} total={6} /></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{ position: 'relative', width: 180, height: 180, marginBottom: 32 }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="78" fill={t.orangeSoft} />
            <circle cx="90" cy="90" r="54" fill={t.orange} />
            <path d="M68 92l14 14 32-32" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="24" y="40" width="8" height="8" rx="2" fill={t.blue} transform="rotate(20 28 44)" />
            <circle cx="152" cy="46" r="5" fill={t.blue} />
            <rect x="148" y="130" width="10" height="4" rx="2" fill={t.orange} />
            <circle cx="32" cy="136" r="4" fill={t.blue} opacity="0.5" />
            <rect x="12" y="90" width="6" height="6" rx="1" fill={t.orange} opacity="0.7" />
          </svg>
        </div>

        <div style={{
          fontFamily: FONT, fontSize: 32, fontWeight: 700,
          color: t.ink, letterSpacing: -0.7, textAlign: 'center', lineHeight: 1.1,
        }}>You're in,<br />{firstName}.</div>
        <div style={{
          marginTop: 14, fontFamily: FONT, fontSize: 16,
          color: t.inkDim, textAlign: 'center', lineHeight: 1.45, maxWidth: 300,
        }}>
          You're set up in <span style={{ color: t.ink, fontWeight: 600 }}>{location || 'Dubai'}</span>. List your first item and start earning AED.
        </div>

        <div style={{
          marginTop: 28, display: 'flex', gap: 10,
          padding: '12px 16px', borderRadius: 14,
          background: '#fff', boxShadow: `inset 0 0 0 1px ${t.line}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: t.blueSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 13, fontWeight: 800, color: t.blue,
            letterSpacing: -0.3,
          }}>AED</div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: t.ink }}>
              +50 AED welcome credit
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: t.inkDim, marginTop: 2 }}>
              Boost your first listing, on us.
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PrimaryBtn variant="orange" onClick={onList}>List my first item</PrimaryBtn>
        <SecondaryBtn onClick={onBrowse}>Browse the market</SecondaryBtn>
      </div>
    </div>
  );
}
