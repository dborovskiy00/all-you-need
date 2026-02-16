export interface ApiClientConfig {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
  credentials?: RequestCredentials
  validateStatus?: (status: number) => boolean
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
}

export interface RequestInterceptorConfig {
  url: string
  method: string
  headers: Headers
  body: BodyInit | undefined
  signal: AbortSignal
  credentials: RequestCredentials
}

export type RequestInterceptor = (
  config: RequestInterceptorConfig,
) => RequestInterceptorConfig | Promise<RequestInterceptorConfig>

export type ResponseInterceptor = <T>(
  response: ApiResponse<T>,
) => ApiResponse<T> | Promise<ApiResponse<T>>

const DEFAULT_VALIDATE_STATUS = (status: number): boolean =>
  status >= 200 && status < 300

function mergeHeaders(
  base: Record<string, string> | undefined,
  request: Record<string, string> | Headers | undefined,
): Headers {
  const headers = new Headers()

  if (base) {
    for (const [key, value] of Object.entries(base)) {
      headers.set(key, value)
    }
  }

  if (request) {
    if (request instanceof Headers) {
      request.forEach((value, key) => headers.set(key, value))
    } else {
      for (const [key, value] of Object.entries(request)) {
        headers.set(key, value)
      }
    }
  }

  return headers
}

function buildUrl(
  baseURL: string | undefined,
  url: string,
  params?: Record<string, string | number | boolean>,
): string {
  let fullUrl = url

  if (baseURL && !url.startsWith('http://') && !url.startsWith('https://')) {
    const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
    fullUrl = url.startsWith('/') ? `${base}${url}` : `${base}/${url}`
  }

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, String(value))
    }

    const separator = fullUrl.includes('?') ? '&' : '?'
    fullUrl += separator + searchParams.toString()
  }

  return fullUrl
}

export interface ApiRequestConfig {
  headers?: Record<string, string> | Headers
  timeout?: number
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
  cancelable?: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

export interface CancellableRequest<T = unknown> {
  promise: Promise<ApiResponse<T>>
  abort: (reason?: unknown) => void
  signal: AbortSignal
}

export interface PreparedRequest {
  url: string
  method: string
  headers: Headers
  body: BodyInit | undefined
  signal: AbortSignal
  credentials: RequestCredentials
}

export abstract class ApiClient {
  protected readonly config: Required<
    Pick<ApiClientConfig, 'baseURL' | 'headers' | 'timeout' | 'credentials' | 'validateStatus'>
  >
  protected readonly requestInterceptors: RequestInterceptor[] = []
  protected readonly responseInterceptors: ResponseInterceptor[] = []

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL ?? '',
      headers: config.headers ?? {},
      timeout: config.timeout ?? 0,
      credentials: config.credentials ?? 'same-origin',
      validateStatus: config.validateStatus ?? DEFAULT_VALIDATE_STATUS,
    }

    if (config.requestInterceptors) {
      this.requestInterceptors.push(...config.requestInterceptors)
    }

    if (config.responseInterceptors) {
      this.responseInterceptors.push(...config.responseInterceptors)
    }
  }

  useRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor)

    return () => {
      const i = this.requestInterceptors.indexOf(interceptor)

      if (i >= 0) {
        this.requestInterceptors.splice(i, 1)
      }
    }
  }

  useResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor)

    return () => {
      const i = this.responseInterceptors.indexOf(interceptor)

      if (i >= 0) {
        this.responseInterceptors.splice(i, 1)
      }
    }
  }

  private createSignal(
    userSignal: AbortSignal | undefined,
    timeoutMs: number,
  ): { controller: AbortController; cleanup: () => void } {
    const controller = new AbortController()
    const cleanupFns: Array<() => void> = []

    if (userSignal?.aborted) {
      controller.abort()

      return { controller, cleanup: () => {} }
    }

    if (timeoutMs > 0) {
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      cleanupFns.push(() => clearTimeout(timer))
    }

    if (userSignal) {
      const onAbort = (): void => controller.abort()
      userSignal.addEventListener('abort', onAbort, { once: true })
      cleanupFns.push(() => userSignal.removeEventListener('abort', onAbort))
    }

    const cleanup = (): void => {
      for (const fn of cleanupFns) {
        fn()
      }
    }

    controller.signal.addEventListener('abort', cleanup, { once: true })

    return { controller, cleanup }
  }

  private async request<T>(
    method: string,
    url: string,
    options?: {
      body?: BodyInit | object
      config?: ApiRequestConfig
    },
  ): Promise<ApiResponse<T>> {
    const { body, config: requestConfig } = options ?? {}
    const timeout = requestConfig?.timeout ?? this.config.timeout

    const { controller, cleanup } = this.createSignal(requestConfig?.signal, timeout)
    const signal = controller.signal

    const fullUrl = buildUrl(
      this.config.baseURL,
      url,
      requestConfig?.params,
    )

    const headers = mergeHeaders(this.config.headers, requestConfig?.headers)

    let requestBody: BodyInit | undefined

    if (body !== undefined) {
      if (
        typeof body === 'object' &&
        body !== null &&
        !(body instanceof Blob) &&
        !(body instanceof ArrayBuffer) &&
        !ArrayBuffer.isView(body) &&
        !(body instanceof FormData) &&
        !(body instanceof URLSearchParams)
      ) {
        requestBody = JSON.stringify(body)

        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json')
        }
      } else {
        requestBody = body as BodyInit
      }
    }

    let interceptorConfig: RequestInterceptorConfig = {
      url: fullUrl,
      method,
      headers,
      body: requestBody,
      signal,
      credentials: this.config.credentials,
    }

    for (const interceptor of this.requestInterceptors) {
      interceptorConfig = await interceptor(interceptorConfig)
    }

    const prepared: PreparedRequest = {
      url: interceptorConfig.url,
      method: interceptorConfig.method,
      headers: interceptorConfig.headers,
      body: interceptorConfig.body,
      signal: interceptorConfig.signal,
      credentials: interceptorConfig.credentials,
    }

    try {
      const response = await this.doFetch(prepared)

      return await this.handleResponse<T>(response)
    } finally {
      cleanup()
    }
  }

  protected abstract doFetch(prepared: PreparedRequest): Promise<Response>

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!this.config.validateStatus(response.status)) {
      const text = await response.text()

      throw new ApiError(
        `Request failed with status ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText,
        response.headers,
        text,
      )
    }

    let data: T
    const contentType = response.headers.get('Content-Type') ?? ''

    if (contentType.includes('application/json')) {
      const json = await response.json()
      data = json as T
    } else {
      data = (await response.text()) as T
    }

    let apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    for (const interceptor of this.responseInterceptors) {
      apiResponse = await interceptor(apiResponse)
    }

    return apiResponse
  }

  private requestCancelable<T>(
    method: string,
    url: string,
    options?: { body?: BodyInit | object; config?: Omit<ApiRequestConfig, 'signal'> },
  ): CancellableRequest<T> {
    const controller = new AbortController()
    const config: ApiRequestConfig = {
      ...options?.config,
      signal: controller.signal,
    }

    const promise = this.request<T>(method, url, {
      ...options,
      config,
    })

    return {
      promise,
      abort: (reason?: unknown) => controller.abort(reason),
      signal: controller.signal,
    }
  }

  get<T = unknown>(
    url: string,
    config: Omit<ApiRequestConfig, 'signal'> & { cancelable: true },
  ): CancellableRequest<T>
  get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  get<T = unknown>(
    url: string,
    config?: ApiRequestConfig | (Omit<ApiRequestConfig, 'signal'> & { cancelable: true }),
  ): Promise<ApiResponse<T>> | CancellableRequest<T> {
    if (config && 'cancelable' in config && config.cancelable) {
      const { cancelable, ...rest } = config
      void cancelable

      return this.requestCancelable<T>('GET', url, { config: rest })
    }

    return this.request<T>('GET', url, { config })
  }

  post<T = unknown>(
    url: string,
    body: BodyInit | object | undefined,
    config: Omit<ApiRequestConfig, 'signal'> & { cancelable: true },
  ): CancellableRequest<T>
  post<T = unknown>(
    url: string,
    body?: BodyInit | object,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>>
  post<T = unknown>(
    url: string,
    body?: BodyInit | object,
    config?: ApiRequestConfig | (Omit<ApiRequestConfig, 'signal'> & { cancelable: true }),
  ): Promise<ApiResponse<T>> | CancellableRequest<T> {
    if (config && 'cancelable' in config && config.cancelable) {
      const { cancelable, ...rest } = config
      void cancelable

      return this.requestCancelable<T>('POST', url, { body, config: rest })
    }

    return this.request<T>('POST', url, { body, config })
  }

  put<T = unknown>(
    url: string,
    body: BodyInit | object | undefined,
    config: Omit<ApiRequestConfig, 'signal'> & { cancelable: true },
  ): CancellableRequest<T>
  put<T = unknown>(
    url: string,
    body?: BodyInit | object,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>>
  put<T = unknown>(
    url: string,
    body?: BodyInit | object,
    config?: ApiRequestConfig | (Omit<ApiRequestConfig, 'signal'> & { cancelable: true }),
  ): Promise<ApiResponse<T>> | CancellableRequest<T> {
    if (config && 'cancelable' in config && config.cancelable) {
      const { cancelable, ...rest } = config
      void cancelable

      return this.requestCancelable<T>('PUT', url, { body, config: rest })
    }

    return this.request<T>('PUT', url, { body, config })
  }

  patch<T = unknown>(
    url: string,
    body: BodyInit | object | undefined,
    config: Omit<ApiRequestConfig, 'signal'> & { cancelable: true },
  ): CancellableRequest<T>
  patch<T = unknown>(
    url: string,
    body?: BodyInit | object,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>>
  patch<T = unknown>(
    url: string,
    body?: BodyInit | object,
    config?: ApiRequestConfig | (Omit<ApiRequestConfig, 'signal'> & { cancelable: true }),
  ): Promise<ApiResponse<T>> | CancellableRequest<T> {
    if (config && 'cancelable' in config && config.cancelable) {
      const { cancelable, ...rest } = config
      void cancelable

      return this.requestCancelable<T>('PATCH', url, { body, config: rest })
    }

    return this.request<T>('PATCH', url, { body, config })
  }

  delete<T = unknown>(
    url: string,
    config: Omit<ApiRequestConfig, 'signal'> & { cancelable: true },
  ): CancellableRequest<T>
  delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  delete<T = unknown>(
    url: string,
    config?: ApiRequestConfig | (Omit<ApiRequestConfig, 'signal'> & { cancelable: true }),
  ): Promise<ApiResponse<T>> | CancellableRequest<T> {
    if (config && 'cancelable' in config && config.cancelable) {
      const { cancelable, ...rest } = config
      void cancelable

      return this.requestCancelable<T>('DELETE', url, { config: rest })
    }

    return this.request<T>('DELETE', url, { config })
  }
}

export class FetchApiClient extends ApiClient {
  protected override doFetch(prepared: PreparedRequest): Promise<Response> {
    return fetch(prepared.url, {
      method: prepared.method,
      headers: prepared.headers,
      body: prepared.body,
      credentials: prepared.credentials,
      signal: prepared.signal,
    })
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly headers: Headers,
    public readonly responseBody?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
