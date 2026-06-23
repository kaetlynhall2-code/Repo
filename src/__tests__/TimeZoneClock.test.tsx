import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TimeZoneClock from '../components/TimeZoneClock'

test('renders provided zone names', () => {
  const zones = ['UTC', 'Europe/London']
  render(<TimeZoneClock zones={zones} onRemove={() => {}} onAdd={() => {}} />)
  expect(screen.getByText('UTC')).toBeInTheDocument()
  expect(screen.getByText('Europe/London')).toBeInTheDocument()
})
