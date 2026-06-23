export function saveToken(token) {
  localStorage.setItem('jwt_token', token)
}

export function getToken() {
  return localStorage.getItem('jwt_token')
}

export function clearToken() {
  localStorage.removeItem('jwt_token')
}
