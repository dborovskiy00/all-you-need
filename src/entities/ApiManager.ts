import { ApiClient, FetchApiClient, type ApiClientConfig } from './ApiClient'

export type { ApiClientConfig } from './ApiClient'

export interface ApiManagerConfig<TClinets extends Record<string, ApiClient>> {
  clients?: TClinets;
}

export class ApiManager<TClinets extends Record<string, ApiClient>> {
  private readonly clients = new Map<keyof TClinets, ApiClient>()

  constructor(config?: ApiManagerConfig<TClinets>) {
    if (config?.clients) {
      for (const [id, client] of Object.entries(
        config.clients,
      ) as [keyof TClinets, TClinets[keyof TClinets]][]) {
        this.clients.set(id, client)
      }
    }
  }

  createClient(id: keyof TClinets, config: ApiClientConfig = {}): ApiClient {
    const existing = this.clients.get(id)

    if (existing) {
      throw new Error(`ApiManager: client "${id.toString()}" already exists. Use clearClient first.`)
    }

    const client = new FetchApiClient(config)
    this.clients.set(id, client)

    return client
  }

  getClient<TKey extends keyof TClinets>(id: TKey): TClinets[TKey] | undefined {
    return this.clients.get(id) as TClinets[TKey] ?? undefined
  }

  getClientOrThrow<TKey extends keyof TClinets>(id: TKey): TClinets[TKey] {
    const client = this.clients.get(id)

    if (!client) {
      throw new Error(`ApiManager: client "${id.toString()}" is not registered`)
    }

    return client as TClinets[TKey]
  }

  hasClient<TKey extends keyof TClinets>(id: TKey): boolean {
    return this.clients.has(id)
  }

  clearClient<TKey extends keyof TClinets>(id: TKey): void {
    this.clients.delete(id)
  }

  clearAll(): void {
    this.clients.clear()
  }

  getClientIds(): (keyof TClinets)[] {
    return Array.from(this.clients.keys()) as (keyof TClinets)[]
  }
}
