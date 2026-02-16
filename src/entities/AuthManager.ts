import type { ApiManager } from './ApiManager'
import { AuthApiClient, type AuthApiClientLoginParams, type AuthTokens } from './AuthApiClient'
import type { JwtAuthEvent, JwtAuthManager, JwtAuthTarget, JwtPayload, TargetPayload } from './JwtAuthManager'

export type { AuthTokens } from './AuthApiClient'

export interface AuthManagerConfig<
  TClinets extends Record<string, AuthApiClient>,
  TTargets extends Record<keyof TClinets, JwtAuthTarget<JwtPayload, Record<string, string>>>
> {
  jwtAuthManager: JwtAuthManager<TTargets>
  authApiManager: ApiManager<TClinets>
}

export class AuthManager<
  TClinets extends Record<string, AuthApiClient>,
  TTargets extends Record<keyof TClinets, JwtAuthTarget<JwtPayload, Record<string, string>>>
> {
  private readonly jwtAuthManager: JwtAuthManager<TTargets>
  private readonly authApiManager: ApiManager<TClinets>

  constructor(config: AuthManagerConfig<TClinets, TTargets>) {
    this.jwtAuthManager = config.jwtAuthManager
    this.authApiManager = config.authApiManager

    const apiIds = config.authApiManager.getClientIds()

    if (!this.isValidClients(apiIds)) {
      throw new Error('AuthManager: invalid clients')
    }
  }

  async login<TKey extends keyof TClinets>(
    targetId: TKey,
    ...credentials: AuthApiClientLoginParams<TClinets[TKey]>
  ): Promise<AuthTokens> {
    const client = this.authApiManager.getClient(targetId)

    if (!client) {
      throw new Error(`AuthManager: no client for target "${targetId.toString()}"`)
    }

    const tokens = await client.login(...credentials)
    this.jwtAuthManager.setToken(targetId, tokens.access_token)

    if (tokens.refresh_token) {
      this.jwtAuthManager.setRefreshToken(targetId, tokens.refresh_token)
    }

    return tokens
  }

  async logout<TKey extends keyof TClinets>(targetId: TKey): Promise<void> {
    const client = this.authApiManager.getClient(targetId)

    if (!client) {
      throw new Error(`AuthManager: no client for target "${targetId.toString()}"`)
    }

    await client.logout();
    this.jwtAuthManager.removeToken(targetId);
  }

  async refresh<TKey extends keyof TClinets>(targetId: TKey): Promise<AuthTokens> {
    const refreshToken = this.jwtAuthManager.getRefreshToken(targetId)

    if (!refreshToken) {
      throw new Error(`AuthManager: no refresh_token for target "${targetId.toString()}"`)
    }

    const client = this.authApiManager.getClient(targetId)

    if (!client) {
      throw new Error(`AuthManager: no client for target "${targetId.toString()}"`)
    }

    const tokens = await client.refresh(refreshToken)
    this.jwtAuthManager.refreshToken(targetId, tokens.access_token)

    if (tokens.refresh_token) {
      this.jwtAuthManager.setRefreshToken(targetId, tokens.refresh_token)
    }

    return tokens
  }

  getAuthData<TKey extends keyof TClinets>(targetId: TKey) {
    return this.jwtAuthManager.getPayload(targetId)
  }

  isAuthenticated<TKey extends keyof TClinets>(targetId: TKey, leewaySeconds?: number): boolean {
    return this.jwtAuthManager.isAuthenticated(targetId, leewaySeconds)
  }

  subscribe<TKey extends keyof TClinets>(
    targetId: TKey, callback: (event: JwtAuthEvent<TargetPayload<TTargets[TKey]>>) => void
  ): () => void {
    return this.jwtAuthManager.subscribe(targetId, callback)
  }

  private isValidClient<TKey extends keyof TClinets>(clientId: TKey): boolean {
    return this.authApiManager.hasClient(clientId)
      && AuthApiClient.isAuthApiClient(this.authApiManager.getClient(clientId)!)
      && this.jwtAuthManager.hasTarget(clientId);
  }

  private isValidClients<TKeys extends keyof TClinets>(clientIds: TKeys[]): boolean {
    return clientIds.every(this.isValidClient, this);
  }
}
