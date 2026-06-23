import React, { useEffect, useState } from 'react'
import TimeZoneClock from './components/TimeZoneClock'

const DEFAULT_ZONES = [
  'UTC',
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Tokyo'
]

const STORAGE_KEY_ZONES = 'drop_shop_homys_zones_v1'
const STORAGE_KEY_HOUR12 = 'drop_shop_homys_hour12_v1'

export default function App() {
  const [zones, setZones] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ZONES)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.every((z) => typeof z === 'string')) {
          return parsed
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_ZONES
  })

  const [hour12, setHour12] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HOUR12)
      if (raw !== null) return raw === 'true'
    } catch {
      // ignore
    }
    return false // default to 24-hour
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ZONES, JSON.stringify(zones))
    } catch {
      // ignore storage errors
    }
  }, [zones])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HOUR12, hour12 ? 'true' : 'false')
    } catch {
      // ignore
    }
  }, [hour12])

  function handleAddZone(zone: string) {
    setZones((prev) => (prev.includes(zone) ? prev : [...prev, zone]))
  }

  function handleRemoveZone(zone: string) {
    setZones((prev) => prev.filter((z) => z !== zone))
  }

  return (
    <div className="app">
      <header>
        <h1>Drop-$hop Homy$4 Life — Time Zone Clock</h1>
        <p>Digital clocks showing current time in different time zones.</p>
      </header>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ color: 'var(--muted)' }}>
          <input
            type="checkbox"
            checked={hour12}
            onChange={(e) => setHour12(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Use 12-hour format
        </label>
        <button
          onClick={() => {
            setZones(DEFAULT_ZONES)
          }}
          style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        >
          Reset zones
        </button>
      </div>

      <main>
        <TimeZoneClock zones={zones} onRemove={handleRemoveZone} onAdd={handleAddZone} hour12={hour12} />
      </main>

      <footer>
        <small>Demo — React + TypeScript + Vite</small>
      </footer>
    </div>
  )
}
