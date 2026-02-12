import type { TypedStorage } from './Storage'

export type JwtAuthEvent =
  | { type: 'login'; token: string; payload?: JwtPayload }
  | { type: 'logout' }
  | { type: 'expired' }
  | { type: 'refresh'; token: string; payload?: JwtPayload }

export interface JwtPayload {
  exp?: number
  iat?: number
  sub?: string
  [key: string]: unknown
}

const TOKEN_KEY = 'token'

export interface JwtAuthTargetConfig {
  storage: TypedStorage
  headerName?: string
  headerFormat?: (token: string) => string
}

const DEFAULT_HEADER_NAME = 'Authorization'
const DEFAULT_HEADER_FORMAT = (token: string): string => `Bearer ${token}`

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

type JwtAuthCallback = (event: JwtAuthEvent) => void

export class JwtAuthManager<T extends string = string> {
  private readonly targets = new Map<string, JwtAuthTargetConfig>()
  private readonly subscribers = new Map<string, Set<JwtAuthCallback>>()

  constructor(config: { targets: Record<T, JwtAuthTargetConfig> }) {
    for (const [id, target] of Object.entries(
      config.targets,
    ) as [T, JwtAuthTargetConfig][]) {
      this.targets.set(id, target)
    }
  }

  registerTarget(id: T, config: JwtAuthTargetConfig): void {
    this.targets.set(id, config)
  }

  private getStorage(targetId: string): TypedStorage {
    const target = this.targets.get(targetId)

    if (!target) {
      throw new Error(`JwtAuthManager: target "${targetId}" is not registered`)
    }

    return target.storage
  }

  private getTarget(targetId: string): JwtAuthTargetConfig | undefined {
    return this.targets.get(targetId)
  }

  private notify(targetId: string, event: JwtAuthEvent): void {
    const callbacks = this.subscribers.get(targetId)

    if (callbacks) {
      for (const cb of callbacks) {
        cb(event)
      }
    }
  }

  setToken(targetId: T, token: string): void {
    const target = this.getTarget(targetId)

    if (!target) {
      throw new Error(`JwtAuthManager: target "${targetId}" is not registered`)
    }

    const storage = this.getStorage(targetId)
    storage.set(TOKEN_KEY, token)
    const payload = decodeJwtPayload(token) ?? undefined
    this.notify(targetId, { type: 'login', token, payload })
  }

  getToken(targetId: T): string | null {
    const target = this.getTarget(targetId)

    if (!target) {
      return null
    }

    const storage = this.getStorage(targetId)

    return storage.get<string>(TOKEN_KEY)
  }

  removeToken(targetId: T): void {
    const target = this.getTarget(targetId)

    if (!target) {
      return
    }

    const storage = this.getStorage(targetId)
    storage.remove(TOKEN_KEY)
    this.notify(targetId, { type: 'logout' })
  }

  isAuthenticated(targetId: T, leewaySeconds = 0): boolean {
    const token = this.getToken(targetId)

    if (!token) {
      return false
    }

    return !isJwtExpired(token, leewaySeconds)
  }

  isExpired(targetId: T, leewaySeconds = 0): boolean {
    const token = this.getToken(targetId)

    if (!token) {
      return true
    }

    return isJwtExpired(token, leewaySeconds)
  }

  getAuthHeaders(targetId: T): Record<string, string> | null {
    const token = this.getToken(targetId)

    if (!token) {
      return null
    }

    const target = this.getTarget(targetId)

    if (!target) {
      return null
    }

    const headerName = target.headerName ?? DEFAULT_HEADER_NAME
    const headerFormat = target.headerFormat ?? DEFAULT_HEADER_FORMAT

    return {
      [headerName]: headerFormat(token),
    }
  }

  getPayload(targetId: T): JwtPayload | null {
    const token = this.getToken(targetId)

    if (!token) {
      return null
    }

    return decodeJwtPayload(token)
  }

  subscribe(targetId: T, callback: JwtAuthCallback): () => void {
    const target = this.getTarget(targetId)

    if (!target) {
      throw new Error(`JwtAuthManager: target "${targetId}" is not registered`)
    }

    let callbacks = this.subscribers.get(targetId)

    if (!callbacks) {
      callbacks = new Set()
      this.subscribers.set(targetId, callbacks)
    }

    callbacks.add(callback)

    return () => {
      callbacks!.delete(callback)

      if (callbacks!.size === 0) {
        this.subscribers.delete(targetId)
      }
    }
  }

  refreshToken(targetId: T, token: string): void {
    const target = this.getTarget(targetId)

    if (!target) {
      throw new Error(`JwtAuthManager: target "${targetId}" is not registered`)
    }

    const storage = this.getStorage(targetId)
    storage.set(TOKEN_KEY, token)
    const payload = decodeJwtPayload(token) ?? undefined
    this.notify(targetId, { type: 'refresh', token, payload })
  }

  markExpired(targetId: T): void {
    this.notify(targetId, { type: 'expired' })
  }
}
