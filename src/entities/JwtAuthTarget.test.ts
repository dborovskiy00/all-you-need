import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  decodeJwtPayload,
  isJwtExpired,
  JwtAuthTarget,
  type JwtAuthEvent,
  type JwtPayload,
} from './JwtAuthTarget'
import { TypedStorage } from './Storage'

const validToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjIwMDAwMDAwMDAsImlhdCI6MTAwMDAwMDAwMCwic3ViIjoidXNlcjEifQ.signature'
const expiredToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6OTAwMDAwMDAwLCJzdWIiOiJ1c2VyMSJ9.sig'
const noExpToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSJ9.signature'

class MockStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

describe('decodeJwtPayload', () => {
  it('decodes valid JWT payload', () => {
    const payload = decodeJwtPayload(validToken)

    expect(payload).toEqual({
      exp: 2_000_000_000,
      iat: 1_000_000_000,
      sub: 'user1',
    })
  })

  it('returns null for malformed token', () => {
    expect(decodeJwtPayload('invalid')).toBeNull()
    expect(decodeJwtPayload('a.b')).toBeNull()
    expect(decodeJwtPayload('')).toBeNull()
  })

  it('returns null for invalid base64 in payload', () => {
    expect(decodeJwtPayload('a.!!!.c')).toBeNull()
  })

  it('returns null for invalid JSON in payload', () => {
    const badB64 = btoa('not json').replace(/\+/g, '-').replace(/\//g, '_')
    expect(decodeJwtPayload(`a.${badB64}.c`)).toBeNull()
  })
})

describe('isJwtExpired', () => {
  it('returns false for valid token', () => {
    expect(isJwtExpired(validToken)).toBe(false)
  })

  it('returns true for expired token', () => {
    expect(isJwtExpired(expiredToken)).toBe(true)
  })

  it('returns false when payload has no exp', () => {
    expect(isJwtExpired(noExpToken)).toBe(false)
  })

  it('applies leewaySeconds', () => {
    vi.useFakeTimers({ now: 2000 })
    const almostExpired =
      'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6MSwic3ViIjoidXNlcjEifQ.sig'
    expect(isJwtExpired(almostExpired)).toBe(true)
    expect(isJwtExpired(almostExpired, 5)).toBe(false)
    vi.useRealTimers()
  })
})

describe('JwtAuthTarget', () => {
  let adapter: MockStorage
  let target: JwtAuthTarget<JwtPayload, Record<string, string>>

  beforeEach(() => {
    adapter = new MockStorage()
    target = new JwtAuthTarget({
      storage: new TypedStorage({ adapter, prefix: 'jwt:target:' }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('setToken / getToken', () => {
    it('stores token in storage', () => {
      target.setToken(validToken)

      expect(target.getToken()).toBe(validToken)
      expect(
        new TypedStorage({ adapter, prefix: 'jwt:target:' }).get<string>('token'),
      ).toBe(validToken)
    })

    it('overwrites existing token', () => {
      target.setToken(validToken)
      target.setToken(expiredToken)

      expect(target.getToken()).toBe(expiredToken)
    })
  })

  describe('getPayload', () => {
    it('returns decoded payload when token exists', () => {
      target.setToken(validToken)

      expect(target.getPayload()).toEqual({
        exp: 2_000_000_000,
        iat: 1_000_000_000,
        sub: 'user1',
      })
    })

    it('returns null when no token', () => {
      expect(target.getPayload()).toBeNull()
    })

    it('returns null when token is invalid', () => {
      target.setToken('invalid.token.here')
      expect(target.getPayload()).toBeNull()
    })
  })

  describe('setRefreshToken / getRefreshToken / removeRefreshToken', () => {
    it('stores and retrieves refresh token', () => {
      target.setRefreshToken('refresh-123')

      expect(target.getRefreshToken()).toBe('refresh-123')
    })

    it('returns null when no refresh token', () => {
      expect(target.getRefreshToken()).toBeNull()
    })

    it('removeRefreshToken clears refresh token', () => {
      target.setRefreshToken('refresh-123')
      target.removeRefreshToken()

      expect(target.getRefreshToken()).toBeNull()
    })
  })

  describe('removeToken', () => {
    it('removes both token and refresh token', () => {
      target.setToken(validToken)
      target.setRefreshToken('refresh-123')

      target.removeToken()

      expect(target.getToken()).toBeNull()
      expect(target.getRefreshToken()).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when valid token exists', () => {
      target.setToken(validToken)
      expect(target.isAuthenticated()).toBe(true)
    })

    it('returns false when token is expired', () => {
      target.setToken(expiredToken)
      expect(target.isAuthenticated()).toBe(false)
    })

    it('returns false when no token', () => {
      expect(target.isAuthenticated()).toBe(false)
    })

    it('accepts leewaySeconds', () => {
      vi.useFakeTimers({ now: 2000 })
      const almostExpired =
        'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6MSwic3ViIjoidXNlcjEifQ.sig'
      target.setToken(almostExpired)
      expect(target.isAuthenticated()).toBe(false)
      expect(target.isAuthenticated(5)).toBe(true)
      vi.useRealTimers()
    })
  })

  describe('isExpired', () => {
    it('returns false when token is valid', () => {
      target.setToken(validToken)
      expect(target.isExpired()).toBe(false)
    })

    it('returns true when token is expired', () => {
      target.setToken(expiredToken)
      expect(target.isExpired()).toBe(true)
    })

    it('returns true when no token', () => {
      expect(target.isExpired()).toBe(true)
    })
  })

  describe('getAuthHeaders', () => {
    it('returns Bearer header by default', () => {
      target.setToken(validToken)

      expect(target.getAuthHeaders()).toEqual({
        Authorization: `Bearer ${validToken}`,
      })
    })

    it('uses custom headersFormat when provided', () => {
      const customTarget = new JwtAuthTarget<JwtPayload, { 'X-Auth-Token': string }>({
        storage: new TypedStorage({ adapter, prefix: 'jwt:custom:' }),
        headersFormat: (token) => ({ 'X-Auth-Token': token }),
      })
      customTarget.setToken(validToken)

      expect(customTarget.getAuthHeaders()).toEqual({
        'X-Auth-Token': validToken,
      })
    })

    it('returns null when no token', () => {
      expect(target.getAuthHeaders()).toBeNull()
    })
  })

  describe('subscribe', () => {
    it('notifies on setToken (login)', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      target.subscribe(cb)

      target.setToken(validToken)

      expect(cb).toHaveBeenCalledWith({
        type: 'login',
        token: validToken,
        payload: expect.objectContaining({ exp: 2_000_000_000, sub: 'user1' }),
      })
    })

    it('notifies on removeToken (logout)', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      target.setToken(validToken)
      target.subscribe(cb)

      target.removeToken()

      expect(cb).toHaveBeenCalledWith({ type: 'logout' })
    })

    it('notifies on refreshToken', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      target.setToken(validToken)
      target.subscribe(cb)
      cb.mockClear()

      target.refreshToken(validToken)

      expect(cb).toHaveBeenCalledWith({
        type: 'refresh',
        token: validToken,
        payload: expect.objectContaining({ exp: 2_000_000_000, sub: 'user1' }),
      })
    })

    it('notifies on markExpired', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      target.setToken(validToken)
      target.subscribe(cb)
      cb.mockClear()

      target.markExpired()

      expect(cb).toHaveBeenCalledWith({ type: 'expired' })
    })

    it('returns unsubscribe that stops notifications', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      const unsub = target.subscribe(cb)

      unsub()
      target.setToken(validToken)

      expect(cb).not.toHaveBeenCalled()
    })

    it('notifies multiple subscribers', () => {
      const cb1 = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      const cb2 = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      target.subscribe(cb1)
      target.subscribe(cb2)

      target.setToken(validToken)

      expect(cb1).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'login', token: validToken }),
      )
      expect(cb2).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'login', token: validToken }),
      )
    })
  })

  describe('refreshToken', () => {
    it('updates stored token', () => {
      target.setToken(expiredToken)

      target.refreshToken(validToken)

      expect(target.getToken()).toBe(validToken)
    })
  })

  describe('markExpired', () => {
    it('notifies subscribers without removing token', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      target.setToken(validToken)
      target.subscribe(cb)

      target.markExpired()

      expect(cb).toHaveBeenCalledWith({ type: 'expired' })
      expect(target.getToken()).toBe(validToken)
    })
  })
})
