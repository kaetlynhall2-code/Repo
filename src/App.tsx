import React, { useState } from 'react'
import TimeZoneClock from './components/TimeZoneClock'

const initialZones = [
  'UTC',
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Tokyo',
]

export default function App() {
  const [zones, setZones] = useState<string[]>(initialZones)

  return (
    <div className="app">
      <header>
        <h1>Drop-$hop Homy$4 Life — Time Zone Clock</h1>
        <p>Digital clocks that show the current time in different time zones.</p>
      </header>

      <main>
        <TimeZoneClock zones={zones} onRemove={(zone) => setZones(zones.filter(z => z !== zone))} onAdd={(zone) => { if (!zones.includes(zone)) setZones([...zones, zone]) }} />
      </main>

      <footer>
        <small>Built as a demo component — React + TypeScript + Vite</small>
      </footer>
    </div>
  )
}
