import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { RequestInterceptorConfig } from './ApiClient'
import { ApiClient, ApiError, FetchApiClient } from './ApiClient'

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function textResponse(text: string, status = 200) {
  return new Response(text, { status })
}

describe('FetchApiClient', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('baseURL and URL building', () => {
    it('prepends baseURL to relative path', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ baseURL: 'https://api.example.com' })
      await client.get('/users')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object),
      )
    })

    it('handles baseURL with trailing slash', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ baseURL: 'https://api.example.com/' })
      await client.get('/users')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object),
      )
    })

    it('handles path without leading slash', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ baseURL: 'https://api.example.com' })
      await client.get('users')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object),
      )
    })

    it('does not modify absolute URL', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ baseURL: 'https://api.example.com' })
      await client.get('https://other.com/path')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://other.com/path',
        expect.any(Object),
      )
    })

    it('appends params to URL', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ baseURL: 'https://api.example.com' })
      await client.get('/users', { params: { page: 1, limit: 10 } })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users?page=1&limit=10',
        expect.any(Object),
      )
    })

    it('appends params when URL already has query string', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient()
      await client.get('https://api.example.com/users?foo=1', {
        params: { bar: 2 },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users?foo=1&bar=2',
        expect.any(Object),
      )
    })
  })

  describe('headers', () => {
    it('merges base headers with request headers', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ headers: { 'X-Base': 'base' } })
      await client.get('https://api.example.com/', {
        headers: { 'X-Request': 'request' },
      })

      const init = mockFetch.mock.calls[0]![1] as RequestInit
      const headers = init.headers as Headers
      expect(headers.get('X-Base')).toBe('base')
      expect(headers.get('X-Request')).toBe('request')
    })

    it('sets Content-Type application/json for object body', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient()
      await client.post('https://api.example.com/', { name: 'test' })

      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect((init.headers as Headers).get('Content-Type')).toBe(
        'application/json',
      )
    })

    it('does not override explicit Content-Type', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient()
      await client.post('https://api.example.com/', { x: 1 }, {
        headers: { 'Content-Type': 'text/plain' },
      })

      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect((init.headers as Headers).get('Content-Type')).toBe('text/plain')
    })
  })

  describe('request methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue(jsonResponse({}))
    })

    it('get sends GET', async () => {
      const client = new FetchApiClient()
      await client.get('https://api.example.com/')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('post sends POST with body', async () => {
      const client = new FetchApiClient()
      await client.post('https://api.example.com/', { id: 1 })
      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect(init.method).toBe('POST')
      expect(init.body).toBe(JSON.stringify({ id: 1 }))
    })

    it('put sends PUT with body', async () => {
      const client = new FetchApiClient()
      await client.put('https://api.example.com/1', { name: 'x' })
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' }),
      )
    })

    it('patch sends PATCH with body', async () => {
      const client = new FetchApiClient()
      await client.patch('https://api.example.com/1', { name: 'x' })
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' }),
      )
    })

    it('delete sends DELETE', async () => {
      const client = new FetchApiClient()
      await client.delete('https://api.example.com/1')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('response handling', () => {
    it('parses JSON response', async () => {
      const data = { id: 1, name: 'John' }
      mockFetch.mockResolvedValue(jsonResponse(data))

      const client = new FetchApiClient()
      const res = await client.get<typeof data>('https://api.example.com/')

      expect(res.data).toEqual(data)
      expect(res.status).toBe(200)
      expect(res.headers).toBeInstanceOf(Headers)
    })

    it('parses text response when Content-Type is not JSON', async () => {
      mockFetch.mockResolvedValue(textResponse('plain text'))

      const client = new FetchApiClient()
      const res = await client.get<string>('https://api.example.com/')

      expect(res.data).toBe('plain text')
    })

    it('throws ApiError on non-2xx status', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve(textResponse('Not Found', 404)),
      )

      const client = new FetchApiClient()

      await expect(client.get('https://api.example.com/')).rejects.toThrow(
        ApiError,
      )

      const err = await client
        .get('https://api.example.com/')
        .catch((e) => e as ApiError) as ApiError;
      expect(err).toBeInstanceOf(ApiError)
      expect(err.status).toBe(404)
      expect(err.responseBody).toBe('Not Found')
    })

    it('uses custom validateStatus', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}, 201))

      const client = new FetchApiClient({
        validateStatus: (s) => s >= 200 && s < 300,
      })
      const res = await client.get('https://api.example.com/')
      expect(res.status).toBe(201)
    })

    it('rejects when validateStatus returns false', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}, 201))

      const client = new FetchApiClient({
        validateStatus: (s) => s === 200,
      })

      await expect(client.get('https://api.example.com/')).rejects.toThrow(ApiError)
    })
  })

  describe('interceptors', () => {
    it('request interceptor can modify config', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({
        baseURL: 'https://api.example.com',
        requestInterceptors: [
          (config: RequestInterceptorConfig) => {
            config.headers.set('X-Intercepted', 'yes')

            return config
          },
        ],
      })

      await client.get('/users')
      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect((init.headers as Headers).get('X-Intercepted')).toBe('yes')
    })

    it('request interceptor can be async', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({
        requestInterceptors: [
          async (config) => {
            config.headers.set('X-Async', 'yes')

            return config
          },
        ],
      })

      await client.get('https://api.example.com/')
      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect((init.headers as Headers).get('X-Async')).toBe('yes')
    })

    it('response interceptor can modify response', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ id: 1 }))

      const client = new FetchApiClient({
        responseInterceptors: [
          (res) => ({
            ...res,
            data: { ...(res.data as object), modified: true } as never,
          }),
        ],
      })

      const res = await client.get<{ id: number; modified?: boolean }>(
        'https://api.example.com/',
      )
      expect(res.data).toEqual({ id: 1, modified: true })
    })

    it('useRequestInterceptor returns unsubscribe', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve(jsonResponse({})),
      )

      const client = new FetchApiClient()
      const interceptor = vi.fn((c: RequestInterceptorConfig) => {
        c.headers.set('X-Added', '1')

        return c
      })

      const unsub = client.useRequestInterceptor(interceptor)
      await client.get('https://api.example.com/')
      expect(interceptor).toHaveBeenCalledTimes(1)

      unsub()
      await client.get('https://api.example.com/')
      expect(interceptor).toHaveBeenCalledTimes(1)
    })

    it('useResponseInterceptor returns unsubscribe', async () => {
      mockFetch.mockImplementation(() => Promise.resolve(jsonResponse({})))

      const client = new FetchApiClient()
      const interceptor = vi.fn((r) => r)

      const unsub = client.useResponseInterceptor(interceptor)
      await client.get('https://api.example.com/')
      expect(interceptor).toHaveBeenCalledTimes(1)

      unsub()
      await client.get('https://api.example.com/')
      expect(interceptor).toHaveBeenCalledTimes(1)
    })
  })

  describe('cancelable requests', () => {
    it('returns CancellableRequest when cancelable: true', async () => {
      mockFetch.mockImplementation(
        () => new Promise(() => {}),
      )

      const client = new FetchApiClient()
      const result = client.get('https://api.example.com/', { cancelable: true })

      expect(result).toHaveProperty('promise')
      expect(result).toHaveProperty('abort')
      expect(result).toHaveProperty('signal')
      expect(result.promise).toBeInstanceOf(Promise)
      expect(result.signal).toBeInstanceOf(AbortSignal)
    })

    it('abort cancels the request', async () => {
      mockFetch.mockImplementation((url: string, init?: RequestInit) => {
        const controller = new AbortController()
        const signal = init?.signal ?? controller.signal

        return new Promise<Response>((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
      })

      const client = new FetchApiClient()
      const { promise, abort } = client.get('https://api.example.com/', {
        cancelable: true,
      })

      abort()

      await expect(promise).rejects.toThrow()
    })
  })

  describe('credentials', () => {
    it('defaults to same-origin', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient()
      await client.get('https://api.example.com/')

      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect(init.credentials).toBe('same-origin')
    })

    it('uses config credentials', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      const client = new FetchApiClient({ credentials: 'include' })
      await client.get('https://api.example.com/')

      const init = mockFetch.mock.calls[0]![1] as RequestInit
      expect(init.credentials).toBe('include')
    })
  })
})

describe('ApiClient abstract', () => {
  it('subclass with doFetch works without global fetch', async () => {
    class TestClient extends ApiClient {
      protected override doFetch(): Promise<Response> {
        return Promise.resolve(new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }))
      }
    }

    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    const client = new TestClient({ baseURL: 'https://test.com' })
    const res = await client.get('/path')

    expect(res.data).toEqual({})
    expect(mockFetch).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})

describe('ApiError', () => {
  it('has correct structure', () => {
    const headers = new Headers()
    const err = new ApiError('msg', 500, 'Error', headers, 'body')

    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('ApiError')
    expect(err.message).toBe('msg')
    expect(err.status).toBe(500)
    expect(err.statusText).toBe('Error')
    expect(err.headers).toBe(headers)
    expect(err.responseBody).toBe('body')
  })
})
