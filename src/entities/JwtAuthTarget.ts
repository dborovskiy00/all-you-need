import type { TypedStorage } from './Storage'

export interface JwtPayload {
  exp?: number
  iat?: number
  sub?: string
}

export type JwtAuthCallback<TPayload extends JwtPayload> = 
  (event: JwtAuthEvent<TPayload>) => void

export type JwtAuthEvent<TPayload extends JwtPayload> =
  | { type: 'login'; token: string; payload?: TPayload }
  | { type: 'logout' }
  | { type: 'expired' }
  | { type: 'refresh'; token: string; payload?: TPayload }

export interface JwtAuthTargetConfig<THeaders extends Record<string, string>> {
  storage: TypedStorage
  headersFormat?: (token: string) => THeaders
}

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const defaultHeadersForm = (token: string): Record<string, string> => ({
  'Authorization': `Bearer ${token}`,
})

export class JwtAuthTarget<
  TPayload extends JwtPayload,
  THeaders extends Record<string, string>,
> {
  readonly storage: TypedStorage
  readonly headersFormat?: (token: string) => THeaders

  private readonly subscribers = new Set<JwtAuthCallback<TPayload>>()

  constructor(config: JwtAuthTargetConfig<THeaders>) {
    this.storage = config.storage
    this.headersFormat = config.headersFormat
  }

  setToken(token: string): void {
    const payload = decodeJwtPayload(token) as TPayload | null ?? undefined

    this.storage.set(TOKEN_KEY, token)
    this.notify({ type: 'login', token, payload })
  }

  getToken(): string | null {
    return this.storage.get<string>(TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return this.storage.get<string>(REFRESH_TOKEN_KEY)
  }

  setRefreshToken(token: string): void {
    this.storage.set(REFRESH_TOKEN_KEY, token)
  }

  removeRefreshToken(): void {
    this.storage.remove(REFRESH_TOKEN_KEY)
  }

  removeToken(): void {
    this.storage.remove(TOKEN_KEY)
    this.storage.remove(REFRESH_TOKEN_KEY)
    this.notify({ type: 'logout' })
  }

  isAuthenticated(leewaySeconds = 0): boolean {
    const token = this.getToken()

    if (!token) {
      return false
    }

    return !isJwtExpired(token, leewaySeconds)
  }

  isExpired(leewaySeconds = 0): boolean {
    const token = this.getToken()

    if (!token) {
      return true
    }

    return isJwtExpired(token, leewaySeconds)
  }

  getAuthHeaders(): THeaders | null {
    const token = this.getToken()

    if (!token) {
      return null
    }

    return this.headersFormat?.(token) ?? defaultHeadersForm(token) as THeaders;
  }

  getPayload(): TPayload | null {
    const token = this.getToken()

    if (!token) {
      return null
    }

    return decodeJwtPayload(token) as TPayload | null
  }

  subscribe(callback: JwtAuthCallback<TPayload>): () => void {
    this.subscribers.add(callback)

    return () => {
      this.subscribers.delete(callback)
    }
  }

  refreshToken(token: string): void {
    const payload = decodeJwtPayload(token) as TPayload | null ?? undefined

    this.storage.set(TOKEN_KEY, token)
    this.notify({ type: 'refresh', token, payload })
  }

  markExpired(): void {
    this.notify({ type: 'expired' })
  }

  private notify(event: JwtAuthEvent<TPayload>): void {
    for (const cb of this.subscribers) {
      cb(event)
    }
  }
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4

  if (pad) {
    base64 += '='.repeat(4 - pad)
  }

  try {
    return atob(base64)
  } catch {
    return ''
  }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')

  if (parts.length !== 3) {
    return null
  }

  try {
    const payloadStr = base64UrlDecode(parts[1]!)

    if (!payloadStr) {
      return null
    }

    return JSON.parse(payloadStr) as JwtPayload
  } catch {
    return null
  }
}

export function isJwtExpired(token: string, leewaySeconds = 0): boolean {
  const payload = decodeJwtPayload(token)

  if (!payload?.exp) {
    return false
  }

  return Date.now() >= (payload.exp + leewaySeconds) * 1000
}