import React, { useEffect, useState } from 'react'
import TimeZoneClock from './components/TimeZoneClock'
import ChatPage from './pages/ChatPage'

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

  const [tab, setTab] = useState<'clock' | 'chat' | 'home'>('home')

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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Drop-$hop Homy$4 Life</h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Marketplace demo — Clock, Chat, Seller tools</p>
        </div>
        <nav>
          <button onClick={() => setTab('home')} style={{ marginRight: 8 }}>Home</button>
          <button onClick={() => setTab('clock')} style={{ marginRight: 8 }}>Clocks</button>
          <button onClick={() => setTab('chat')}>Chop Bot</button>
        </nav>
      </header>

      <div style={{ marginTop: 18 }}>
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
            onClick={() => { setZones(DEFAULT_ZONES) }}
            style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
          >
            Reset zones
          </button>
        </div>

        {tab === 'home' && (
          <main>
            <h2>Welcome</h2>
            <p style={{ color: 'var(--muted)' }}>Use the navigation to open the multi-timezone clocks or talk to the Chop Bot AI Studio.</p>
          </main>
        )}

        {tab === 'clock' && (
          <main>
            <TimeZoneClock zones={zones} onRemove={handleRemoveZone} onAdd={handleAddZone} hour12={hour12} />
          </main>
        )}

        {tab === 'chat' && (
          <main>
            <ChatPage />
          </main>
        )}
      </div>

      <footer style={{ marginTop: 18, color: 'var(--muted)' }}>
        <small>Demo — React + TypeScript + Vite</small>
      </footer>
    </div>
  )
}
