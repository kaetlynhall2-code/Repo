import { getToken, setToken, clearToken } from '../lib/auth'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers = opts.headers ? new Headers(opts.headers as HeadersInit) : new Headers()
  const token = localStorage.getItem('jwt_token')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers })
  if (res.status === 401) {
    // token invalid - clear
    localStorage.removeItem('jwt_token')
  }
  return res
}
