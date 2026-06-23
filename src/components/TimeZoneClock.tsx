import React, { useEffect, useState } from 'react'

type Props = {
  zones: string[]
  onRemove: (zone: string) => void
  onAdd: (zone: string) => void
}

const COMMON_ZONES = [
  'UTC',
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

function formatTime(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function getOffsetString(timeZone: string, date = new Date()) {
  try {
    const tzDate = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(date)
    const tzName = tzDate.find(p => p.type === 'timeZoneName')?.value ?? ''
    return tzName
  } catch (e) {
    return ''
  }
}

export default function TimeZoneClock({ zones, onRemove, onAdd }: Props) {
  const [now, setNow] = useState(() => new Date())
  const [selectedZone, setSelectedZone] = useState(COMMON_ZONES[0])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="clock-section">
      <div className="controls">
        <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
          {COMMON_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <button onClick={() => onAdd(selectedZone)}>Add zone</button>
      </div>

      <div className="clocks-grid">
        {zones.map(zone => (
          <div className="clock-card" key={zone}>
            <div className="clock-header">
              <h2>{zone}</h2>
              <button className="remove" onClick={() => onRemove(zone)}>✕</button>
            </div>
            <div className="time-display">{formatTime(now, zone)}</div>
            <div className="offset">{getOffsetString(zone, now)}</div>
          </div>
        ))}
      </div>

    </section>
  )
}
