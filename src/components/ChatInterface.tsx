import React, { useState } from 'react'

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export default function ChatInterface({ initialMessages = [] }: { initialMessages?: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE || ''

  async function send() {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const resp = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages })
      })
      const data = await resp.json()
      const assistantText = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.message ?? 'No response'
      setMessages((m) => [...m, { role: 'assistant', content: assistantText }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting server' }])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-root" style={{ maxWidth: 780 }}>
      <div className="messages" style={{ minHeight: 240, background: '#071021', padding: 12, borderRadius: 8 }}>
        {messages.length === 0 && <div style={{ color: 'var(--muted)' }}>Start a conversation with the Chop Bot.</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{m.role}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          aria-label="Chat input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'var(--text)' }}
          disabled={loading}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ padding: '8px 12px', borderRadius: 8 }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
