import { describe, expect, it } from 'vitest'

import { FetchApiClient } from './ApiClient'
import { ApiManager } from './ApiManager'

type TestClients = {
  main: FetchApiClient
  auth: FetchApiClient
}

describe('ApiManager', () => {
  describe('constructor', () => {
    it('registers clients from config', () => {
      const main = new FetchApiClient({ baseURL: 'https://api.example.com' })
      const auth = new FetchApiClient({ baseURL: 'https://auth.example.com' })

      const manager = new ApiManager<TestClients>({
        clients: { main, auth },
      })

      expect(manager.getClientIds()).toEqual(['main', 'auth'])
      expect(manager.hasClient('main')).toBe(true)
      expect(manager.hasClient('auth')).toBe(true)
      expect(manager.getClient('main')).toBe(main)
      expect(manager.getClient('auth')).toBe(auth)
    })

    it('creates empty manager without config', () => {
      const manager = new ApiManager<Record<string, never>>()

      expect(manager.getClientIds()).toEqual([])
      expect(manager.hasClient('main')).toBe(false)
    })

    it('accepts empty config', () => {
      const manager = new ApiManager<Record<string, FetchApiClient>>({
        clients: {},
      })

      expect(manager.getClientIds()).toEqual([])
    })
  })

  describe('createClient', () => {
    it('creates FetchApiClient and registers it', () => {
      const manager = new ApiManager<Record<string, FetchApiClient>>()
      const client = manager.createClient('api', {
        baseURL: 'https://api.test.com',
      })

      expect(client).toBeInstanceOf(FetchApiClient)
      expect(manager.getClient('api')).toBe(client)
      expect(manager.hasClient('api')).toBe(true)
      expect(manager.getClientIds()).toContain('api')
    })

    it('throws when client id already exists', () => {
      const manager = new ApiManager<{ api: FetchApiClient }>({
        clients: {
          api: new FetchApiClient({ baseURL: 'https://api.test.com' }),
        },
      })

      expect(() =>
        manager.createClient('api', { baseURL: 'https://other.com' }),
      ).toThrow('ApiManager: client "api" already exists')
    })
  })

  describe('getClient', () => {
    it('returns client when exists', () => {
      const client = new FetchApiClient({ baseURL: 'https://api.test.com' })
      const manager = new ApiManager<{ api: FetchApiClient }>({
        clients: { api: client },
      })

      expect(manager.getClient('api')).toBe(client)
    })

    it('returns undefined when client does not exist', () => {
      const manager = new ApiManager<Record<string, FetchApiClient>>()

      expect(manager.getClient('api')).toBeUndefined()
    })
  })

  describe('getClientOrThrow', () => {
    it('returns client when exists', () => {
      const client = new FetchApiClient({ baseURL: 'https://api.test.com' })
      const manager = new ApiManager<{ api: FetchApiClient }>({
        clients: { api: client },
      })

      expect(manager.getClientOrThrow('api')).toBe(client)
    })

    it('throws when client does not exist', () => {
      const manager = new ApiManager<Record<string, FetchApiClient>>()

      expect(() => manager.getClientOrThrow('api')).toThrow(
        'ApiManager: client "api" is not registered',
      )
    })
  })

  describe('clearClient', () => {
    it('removes client by id', () => {
      const manager = new ApiManager<{ api: FetchApiClient }>({
        clients: {
          api: new FetchApiClient({ baseURL: 'https://api.test.com' }),
        },
      })

      expect(manager.hasClient('api')).toBe(true)

      manager.clearClient('api')

      expect(manager.hasClient('api')).toBe(false)
      expect(manager.getClient('api')).toBeUndefined()
      expect(manager.getClientIds()).not.toContain('api')
    })
  })

  describe('clearAll', () => {
    it('removes all clients', () => {
      const manager = new ApiManager<{ a: FetchApiClient; b: FetchApiClient }>({
        clients: {
          a: new FetchApiClient({ baseURL: 'https://a.com' }),
          b: new FetchApiClient({ baseURL: 'https://b.com' }),
        },
      })

      manager.clearAll()

      expect(manager.getClientIds()).toEqual([])
      expect(manager.hasClient('a')).toBe(false)
      expect(manager.hasClient('b')).toBe(false)
    })
  })
})
