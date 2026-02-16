import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FetchApiClient } from './ApiClient'
import { ApiManager } from './ApiManager'
import { AuthApiClient } from './AuthApiClient'
import { AuthManager } from './AuthManager'
import { JwtAuthManager, JwtAuthTarget } from './JwtAuthManager'
import { TypedStorage } from './Storage'

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

const validToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjIwMDAwMDAwMDAsImlhdCI6MTAwMDAwMDAwMCwic3ViIjoidXNlcjEifQ.sig'

describe('AuthManager', () => {
  let storage: TypedStorage

  beforeEach(() => {
    storage = new TypedStorage({
      adapter: new MockStorage(),
      prefix: 'test:auth:',
    })
  })

  describe('constructor', () => {
    it('accepts matching jwt and api managers', () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: 'tok', refresh_token: 'ref' }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'tok', refresh_token: 'ref' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })

      expect(
        () => new AuthManager({ jwtAuthManager, authApiManager }),
      ).not.toThrow()
    })

    it('throws when client has no matching target', () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: 'x' }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          other: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        } as never,
      })

      expect(
        () => new AuthManager({ jwtAuthManager, authApiManager }),
      ).toThrow('AuthManager: invalid clients')
    })

    it('throws when target has no matching client', () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: 'x' }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: {
          a: new JwtAuthTarget({ storage }),
          b: new JwtAuthTarget({ storage }),
        },
      })
      const authApiManager = new ApiManager({
        clients: {
          a: new CustomAuthClient({ baseURL: 'x' }),
          b: new CustomAuthClient({ baseURL: 'x' }),
          c: new CustomAuthClient({ baseURL: 'x' }),
        } as never,
      })

      expect(
        () => new AuthManager({ jwtAuthManager, authApiManager }),
      ).toThrow('AuthManager: invalid clients')
    })

    it('throws when client is not AuthApiClient', () => {
      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new FetchApiClient({
            baseURL: 'https://api.example.com',
          }) as never,
        },
      })

      expect(
        () => new AuthManager({ jwtAuthManager, authApiManager }),
      ).toThrow('AuthManager: invalid clients')
    })
  })

  describe('login', () => {
    it('calls client login, stores tokens, returns AuthTokens', async () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return {
            access_token: validToken,
            refresh_token: 'refresh-123',
          }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x', refresh_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      const tokens = await authManager.login('main')

      expect(tokens.access_token).toBe(validToken)
      expect(tokens.refresh_token).toBe('refresh-123')
      expect(authManager.isAuthenticated('main')).toBe(true)
      expect(jwtAuthManager.getToken('main')).toBe(validToken)
      expect(jwtAuthManager.getRefreshToken('main')).toBe('refresh-123')
    })

    it('stores only access_token when no refresh_token', async () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: validToken }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      await authManager.login('main')

      expect(jwtAuthManager.getToken('main')).toBe(validToken)
      expect(jwtAuthManager.getRefreshToken('main')).toBeNull()
    })

    it('throws when target has no client', async () => {
      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager<Record<string, AuthApiClient>>()

      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager: authApiManager as never,
      })

      await expect(
        authManager.login('main' as never),
      ).rejects.toThrow('AuthManager: no client for target "main"')
    })
  })

  describe('logout', () => {
    it('calls client logout and removes tokens', async () => {
      const logoutMock = vi.fn().mockResolvedValue(undefined)
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: validToken }
        }
        override async logout() {
          return logoutMock()
        }
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      await authManager.login('main')
      expect(authManager.isAuthenticated('main')).toBe(true)

      await authManager.logout('main')

      expect(logoutMock).toHaveBeenCalled()
      expect(authManager.isAuthenticated('main')).toBe(false)
      expect(jwtAuthManager.getToken('main')).toBeNull()
    })
  })

  describe('refresh', () => {
    it('uses refresh_token, calls client refresh, updates tokens', async () => {
      const refreshMock = vi.fn().mockResolvedValue({
        access_token: validToken,
        refresh_token: 'new-refresh',
      })
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: 'old', refresh_token: 'ref' }
        }
        override async logout() {}
        override async refresh(token: string) {
          return refreshMock(token)
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      await authManager.login('main')
      refreshMock.mockClear()

      const tokens = await authManager.refresh('main')

      expect(refreshMock).toHaveBeenCalledWith('ref')
      expect(tokens.access_token).toBe(validToken)
      expect(tokens.refresh_token).toBe('new-refresh')
      expect(jwtAuthManager.getToken('main')).toBe(validToken)
      expect(jwtAuthManager.getRefreshToken('main')).toBe('new-refresh')
    })

    it('throws when no refresh_token stored', async () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: validToken }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      await authManager.login('main')

      await expect(authManager.refresh('main')).rejects.toThrow(
        'AuthManager: no refresh_token for target "main"',
      )
    })
  })

  describe('getAuthData', () => {
    it('returns JWT payload for target', async () => {
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: validToken }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      await authManager.login('main')

      const payload = authManager.getAuthData('main')
      expect(payload).toMatchObject({
        exp: 2_000_000_000,
        sub: 'user1',
      })
    })
  })

  describe('subscribe', () => {
    it('delegates to JwtAuthManager and returns unsubscribe', async () => {
      const callback = vi.fn()
      class CustomAuthClient extends AuthApiClient {
        override async login() {
          return { access_token: validToken }
        }
        override async logout() {}
        override async refresh() {
          return { access_token: 'x' }
        }
      }

      const jwtAuthManager = new JwtAuthManager({
        targets: { main: new JwtAuthTarget({ storage }) },
      })
      const authApiManager = new ApiManager({
        clients: {
          main: new CustomAuthClient({ baseURL: 'https://auth.example.com' }),
        },
      })
      const authManager = new AuthManager({
        jwtAuthManager,
        authApiManager,
      })

      const unsub = authManager.subscribe('main', callback)
      await authManager.login('main')

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'login',
          token: validToken,
        }),
      )

      unsub()
      await authManager.logout('main')
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
