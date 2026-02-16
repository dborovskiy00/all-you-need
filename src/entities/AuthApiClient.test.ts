import { describe, expect, it } from 'vitest'

import { FetchApiClient } from './ApiClient'
import { AuthApiClient, type AuthTokens } from './AuthApiClient'

describe('AuthApiClient', () => {
  class TestAuthClient extends AuthApiClient {
    override async login(email: string): Promise<AuthTokens> {
      return {
        access_token: `token-${email}`,
        refresh_token: `refresh-${email}`,
      }
    }

    override async logout(): Promise<void> {}

    override async refresh(token: string): Promise<AuthTokens> {
      return {
        access_token: `new-${token}`,
        refresh_token: token,
      }
    }
  }

  describe('isAuthApiClient', () => {
    it('returns true for AuthApiClient subclass instance', () => {
      const client = new TestAuthClient({ baseURL: 'https://auth.example.com' })

      expect(AuthApiClient.isAuthApiClient(client)).toBe(true)
    })

    it('returns false for plain FetchApiClient', () => {
      const client = new FetchApiClient({ baseURL: 'https://api.example.com' })

      expect(AuthApiClient.isAuthApiClient(client)).toBe(false)
    })

    it('returns false for null and undefined', () => {
      expect(AuthApiClient.isAuthApiClient(null as never)).toBe(false)
      expect(AuthApiClient.isAuthApiClient(undefined as never)).toBe(false)
    })
  })

  describe('abstract methods', () => {
    it('subclass implements login, logout, refresh', async () => {
      const client = new TestAuthClient({ baseURL: 'https://auth.example.com' })

      const tokens = await client.login('user@test.com')
      expect(tokens.access_token).toBe('token-user@test.com')
      expect(tokens.refresh_token).toBe('refresh-user@test.com')

      await expect(client.logout()).resolves.toBeUndefined()

      const refreshed = await client.refresh('old-token')
      expect(refreshed.access_token).toBe('new-old-token')
      expect(refreshed.refresh_token).toBe('old-token')
    })
  })

  describe('inheritance', () => {
    it('extends FetchApiClient and has API methods', () => {
      const client = new TestAuthClient({ baseURL: 'https://auth.example.com' })

      expect(client).toBeInstanceOf(FetchApiClient)
      expect(client.get).toBeDefined()
      expect(client.post).toBeDefined()
    })
  })
})
