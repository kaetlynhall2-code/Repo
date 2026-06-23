import React, { useEffect, useState } from 'react'

type Props = {
  zones: string[]
  onRemove: (zone: string) => void
  onAdd: (zone: string) => void
  hour12?: boolean
}

// A small curated list of IANA time zones for the picker. Expand as needed.
const ALL_ZONES = [
  'UTC',
  'Africa/Cairo',
  'America/Los_Angeles',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Sao_Paulo',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Australia/Sydney',
  'Pacific/Auckland'
]

function formatTime(date: Date, timeZone?: string, hour12 = false) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12
    }).format(date)
  } catch {
    return 'Invalid TZ'
  }
}

function formatDate(date: Date, timeZone?: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date)
  } catch {
    return ''
  }
}

function getOffsetString(timeZone: string, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(date)
    const tzName = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
    return tzName
  } catch {
    return ''
  }
}

export default function TimeZoneClock({ zones, onRemove, onAdd, hour12 = false }: Props) {
  const [now, setNow] = useState<Date>(() => new Date())
  const [query, setQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!query) return setSuggestions([])
    const q = query.toLowerCase()
    const matches = ALL_ZONES.filter((z) => z.toLowerCase().includes(q)).slice(0, 10)
    setSuggestions(matches)
  }, [query])

  return (
    <section className="clock-section">
      <div className="controls" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            aria-label="Search time zones"
            placeholder="Search time zones (e.g. London, Tokyo)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'var(--text)', flex: 1 }}
          />
          <select
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'var(--text)' }}
          >
            <option value="">Quick select</option>
            {ALL_ZONES.slice(0, 12).map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
          <button onClick={() => {
            if (query) onAdd(query)
          }}>Add zone</button>
        </div>

        {suggestions.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => { onAdd(s); setQuery(''); setSuggestions([]) }} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)', color: 'var(--text)' }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="clocks-grid">
        {zones.map((zone) => (
          <div className="clock-card" key={zone}>
            <div className="clock-header">
              <h2>{zone}</h2>
              <button className="remove" onClick={() => onRemove(zone)}>
                ✕
              </button>
            </div>

            <div className="time-display">{formatTime(now, zone, hour12)}</div>
            <div className="offset">{getOffsetString(zone, now)}</div>
            <div style={{ color: 'var(--muted)', marginTop: 6 }}>{formatDate(now, zone)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
