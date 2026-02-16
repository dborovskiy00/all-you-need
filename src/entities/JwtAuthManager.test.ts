import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  JwtAuthManager,
  JwtAuthTarget,
  type JwtAuthEvent,
  type JwtPayload,
} from './JwtAuthManager'
import { TypedStorage } from './Storage'

const validToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjIwMDAwMDAwMDAsImlhdCI6MTAwMDAwMDAwMCwic3ViIjoidXNlcjEifQ.signature'
const expiredToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6OTAwMDAwMDAwLCJzdWIiOiJ1c2VyMSJ9.sig'

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

describe('JwtAuthManager', () => {
  function createManager() {
    const adapter = new MockStorage()

    return {
      adapter,
      manager: new JwtAuthManager({
        targets: {
          api: new JwtAuthTarget({
            storage: new TypedStorage({ adapter, prefix: 'jwt:api:' }),
          }),
          auth: new JwtAuthTarget({
            storage: new TypedStorage({ adapter, prefix: 'jwt:auth:' }),
            headersFormat: (token) => ({ 'X-Auth-Token': token }),
          }),
        },
      }),
    }
  }

  let adapter: MockStorage
  let manager: ReturnType<typeof createManager>['manager']

  beforeEach(() => {
    const mocks = createManager()
    adapter = mocks.adapter
    manager = mocks.manager
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getTargetIds', () => {
    it('returns all target ids', () => {
      expect(manager.getTargetIds()).toEqual(['api', 'auth'])
    })
  })

  describe('hasTarget', () => {
    it('returns true for registered target', () => {
      expect(manager.hasTarget('api')).toBe(true)
      expect(manager.hasTarget('auth')).toBe(true)
    })

    it('returns false for unregistered target', () => {
      expect(manager.hasTarget('other' as never)).toBe(false)
    })
  })

  describe('getTarget', () => {
    it('returns target when exists', () => {
      const target = manager.getTarget('api')
      expect(target).toBeInstanceOf(JwtAuthTarget)
    })

    it('returns undefined when target does not exist', () => {
      expect(manager.getTarget('other' as never)).toBeUndefined()
    })
  })

  describe('getTargetOrThrow', () => {
    it('returns target when exists', () => {
      const target = manager.getTargetOrThrow('api')
      expect(target).toBeInstanceOf(JwtAuthTarget)
    })

    it('throws when target does not exist', () => {
      expect(() => manager.getTargetOrThrow('other' as never)).toThrow(
        'JwtAuthManager: target "other" is not registered',
      )
    })
  })

  describe('setToken / getToken', () => {
    it('stores and retrieves token per target', () => {
      manager.setToken('api', validToken)

      expect(manager.getToken('api')).toBe(validToken)
      expect(manager.getToken('auth')).toBeNull()
      expect(
        new TypedStorage({ adapter, prefix: 'jwt:api:' }).get<string>('token'),
      ).toBe(validToken)
    })

    it('setToken throws for unknown target', () => {
      expect(() => manager.setToken('other' as never, validToken)).toThrow(
        'JwtAuthManager: target "other" is not registered',
      )
    })
  })

  describe('removeToken', () => {
    it('removes token and refresh token from target', () => {
      manager.setToken('api', validToken)
      manager.setRefreshToken('api', 'refresh-123')

      manager.removeToken('api')

      expect(manager.getToken('api')).toBeNull()
      expect(manager.getRefreshToken('api')).toBeNull()
    })
  })

  describe('setRefreshToken / getRefreshToken / removeRefreshToken', () => {
    it('stores and retrieves refresh token', () => {
      manager.setToken('api', validToken)
      manager.setRefreshToken('api', 'refresh-123')

      expect(manager.getRefreshToken('api')).toBe('refresh-123')
    })

    it('removeRefreshToken clears refresh token only', () => {
      manager.setToken('api', validToken)
      manager.setRefreshToken('api', 'refresh-123')

      manager.removeRefreshToken('api')

      expect(manager.getToken('api')).toBe(validToken)
      expect(manager.getRefreshToken('api')).toBeNull()
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

    it('returns false for unknown target', () => {
      expect(manager.isAuthenticated('other' as never)).toBe(false)
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

    it('returns true for unknown target', () => {
      expect(manager.isExpired('other' as never)).toBe(true)
    })
  })

  describe('getAuthHeaders', () => {
    it('returns default Bearer for target without headersFormat', () => {
      manager.setToken('api', validToken)

      expect(manager.getAuthHeaders('api')).toEqual({
        Authorization: `Bearer ${validToken}`,
      })
    })

    it('returns custom format for target with headersFormat', () => {
      manager.setToken('auth', validToken)

      expect(manager.getAuthHeaders('auth')).toEqual({
        'X-Auth-Token': validToken,
      })
    })

    it('returns undefined when no token', () => {
      expect(manager.getAuthHeaders('api')).toBeUndefined()
    })
  })

  describe('getPayload', () => {
    it('returns decoded payload when token exists', () => {
      manager.setToken('api', validToken)

      expect(manager.getPayload('api')).toMatchObject({
        exp: 2_000_000_000,
        iat: 1_000_000_000,
        sub: 'user1',
      })
    })

    it('returns null/undefined when no token', () => {
      const result = manager.getPayload('api')
      expect(result === null || result === undefined).toBe(true)
    })
  })

  describe('subscribe', () => {
    it('notifies on setToken (login)', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      manager.subscribe('api', cb)

      manager.setToken('api', validToken)

      expect(cb).toHaveBeenCalledWith({
        type: 'login',
        token: validToken,
        payload: expect.objectContaining({ exp: 2_000_000_000, sub: 'user1' }),
      })
    })

    it('notifies on removeToken (logout)', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      manager.setToken('api', validToken)
      manager.subscribe('api', cb)

      manager.removeToken('api')

      expect(cb).toHaveBeenCalledWith({ type: 'logout' })
    })

    it('notifies on refreshToken', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
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
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      manager.setToken('api', validToken)
      manager.subscribe('api', cb)
      cb.mockClear()

      manager.markExpired('api')

      expect(cb).toHaveBeenCalledWith({ type: 'expired' })
    })

    it('returns unsubscribe that stops notifications', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      const unsub = manager.subscribe('api', cb)

      unsub()
      manager.setToken('api', validToken)

      expect(cb).not.toHaveBeenCalled()
    })

    it('throws for unknown target', () => {
      const cb = vi.fn()

      expect(() => manager.subscribe('other' as never, cb)).toThrow(
        'JwtAuthManager: target "other" is not registered',
      )
    })
  })

  describe('refreshToken', () => {
    it('updates token for target', () => {
      manager.setToken('api', expiredToken)

      manager.refreshToken('api', validToken)

      expect(manager.getToken('api')).toBe(validToken)
    })
  })

  describe('markExpired', () => {
    it('notifies subscribers without removing token', () => {
      const cb = vi.fn<(event: JwtAuthEvent<JwtPayload>) => void>()
      manager.setToken('api', validToken)
      manager.subscribe('api', cb)

      manager.markExpired('api')

      expect(cb).toHaveBeenCalledWith({ type: 'expired' })
      expect(manager.getToken('api')).toBe(validToken)
    })
  })
})
