import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  decodeJwtPayload,
  isJwtExpired,
  JwtAuthManager,
  type JwtAuthEvent,
} from './JwtAuthManager'

// Valid JWT: header.payload.signature (payload: { exp: 2000000000, iat: 1000000000, sub: "user1" })
// exp 2000000000 = 2033-05-18
const validToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjIwMDAwMDAwMDAsImlhdCI6MTAwMDAwMDAwMCwic3ViIjoidXNlcjEifQ.signature'
// Expired JWT: exp 1 = 1970-01-01
const expiredToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6OTAwMDAwMDAwLCJzdWIiOiJ1c2VyMSJ9.sig'
// Token without exp
const noExpToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSJ9.signature'

function createMockStorage(): {
  store: Map<string, string>
  adapter: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void }
} {
  const store = new Map<string, string>()

  return {
    store,
    adapter: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
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

  it('returns null for invalid token', () => {
    expect(decodeJwtPayload('invalid')).toBeNull()
    expect(decodeJwtPayload('a.b')).toBeNull()
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
})

describe('JwtAuthManager', () => {
  let storage: ReturnType<typeof createMockStorage>
  let manager: JwtAuthManager

  beforeEach(() => {
    storage = createMockStorage()
    manager = new JwtAuthManager({
      storage: storage.adapter,
      targets: [
        {
          id: 'api',
          storageKey: 'jwt:api',
        },
        {
          id: 'auth',
          storageKey: 'jwt:auth',
          headerName: 'X-Auth-Token',
          headerFormat: (t) => t,
        },
      ],
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('setToken / getToken', () => {
    it('stores and retrieves token', () => {
      manager.setToken('api', validToken)

      expect(manager.getToken('api')).toBe(validToken)
      expect(storage.store.get('jwt:api')).toBe(validToken)
    })
  })

  describe('removeToken', () => {
    it('removes token from storage', () => {
      manager.setToken('api', validToken)
      manager.removeToken('api')

      expect(manager.getToken('api')).toBeNull()
      expect(storage.store.has('jwt:api')).toBe(false)
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when token is valid', () => {
      manager.setToken('api', validToken)

      expect(manager.isAuthenticated('api')).toBe(true)
    })

    it('returns false when token is expired', () => {
      manager.setToken('api', expiredToken)

      expect(manager.isAuthenticated('api')).toBe(false)
    })

    it('returns false when no token', () => {
      expect(manager.isAuthenticated('api')).toBe(false)
    })
  })

  describe('isExpired', () => {
    it('returns false when token is valid', () => {
      manager.setToken('api', validToken)

      expect(manager.isExpired('api')).toBe(false)
    })

    it('returns true when token is expired', () => {
      manager.setToken('api', expiredToken)

      expect(manager.isExpired('api')).toBe(true)
    })
  })

  describe('getAuthHeaders', () => {
    it('returns Bearer header for default target', () => {
      manager.setToken('api', validToken)

      expect(manager.getAuthHeaders('api')).toEqual({
        Authorization: `Bearer ${validToken}`,
      })
    })

    it('returns custom header format for configured target', () => {
      manager.setToken('auth', validToken)

      expect(manager.getAuthHeaders('auth')).toEqual({
        'X-Auth-Token': validToken,
      })
    })

    it('returns null when no token', () => {
      expect(manager.getAuthHeaders('api')).toBeNull()
    })
  })

  describe('subscribe', () => {
    it('notifies on setToken (login)', () => {
      const cb = vi.fn<(event: JwtAuthEvent) => void>()
      manager.subscribe('api', cb)

      manager.setToken('api', validToken)

      expect(cb).toHaveBeenCalledWith({
        type: 'login',
        token: validToken,
        payload: expect.objectContaining({ exp: 2_000_000_000, sub: 'user1' }),
      })
    })

    it('notifies on removeToken (logout)', () => {
      const cb = vi.fn<(event: JwtAuthEvent) => void>()
      manager.setToken('api', validToken)
      manager.subscribe('api', cb)

      manager.removeToken('api')

      expect(cb).toHaveBeenCalledWith({ type: 'logout' })
    })

    it('notifies on refreshToken', () => {
      const cb = vi.fn<(event: JwtAuthEvent) => void>()
      manager.setToken('api', validToken)
      manager.subscribe('api', cb)
      cb.mockClear()

      manager.refreshToken('api', validToken)

      expect(cb).toHaveBeenCalledWith({
        type: 'refresh',
        token: validToken,
        payload: expect.any(Object),
      })
    })

    it('notifies on markExpired', () => {
      const cb = vi.fn<(event: JwtAuthEvent) => void>()
      manager.setToken('api', validToken)
      manager.subscribe('api', cb)
      cb.mockClear()

      manager.markExpired('api')

      expect(cb).toHaveBeenCalledWith({ type: 'expired' })
    })

    it('unsubscribes correctly', () => {
      const cb = vi.fn<(event: JwtAuthEvent) => void>()
      const unsub = manager.subscribe('api', cb)

      unsub()
      manager.setToken('api', validToken)

      expect(cb).not.toHaveBeenCalled()
    })
  })

  describe('registerTarget', () => {
    it('allows registering target after construction', () => {
      const m = new JwtAuthManager({ storage: storage.adapter })
      m.registerTarget({ id: 'new', storageKey: 'jwt:new' })

      m.setToken('new', validToken)

      expect(m.getToken('new')).toBe(validToken)
    })
  })
})
