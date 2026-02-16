import { ApiClient, FetchApiClient } from './ApiClient'

export interface AuthTokens {
  access_token: string
  refresh_token?: string
  expires_in?: number
  [key: string]: unknown
}

export abstract class AuthApiClient extends FetchApiClient {
  abstract login(...args: unknown[]): Promise<AuthTokens>
  abstract logout(): Promise<void>
  abstract refresh(token: string): Promise<AuthTokens>

  static isAuthApiClient<TClient extends ApiClient>(
    client: TClient
  ): client is TClient {
    return client instanceof AuthApiClient;
  }
}

export type AuthApiClientLoginParams<TClient extends AuthApiClient> =
  Parameters<TClient['login']> extends Array<unknown>
    ? Parameters<TClient['login']>
    : []
