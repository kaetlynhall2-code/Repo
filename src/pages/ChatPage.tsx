import React from 'react'
import ChatInterface from '../components/ChatInterface'

export default function ChatPage() {
  return (
    <div>
      <h2>Chop Bot — AI Studio</h2>
      <p style={{ color: 'var(--muted)' }}>Ask the Chop Bot to help write product descriptions, marketing copy, or storefront guidance.</p>
      <ChatInterface />
    </div>
  )
}
