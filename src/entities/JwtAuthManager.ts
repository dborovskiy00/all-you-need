import {
  JwtAuthCallback,
  JwtAuthTarget,
  type JwtPayload,
} from './JwtAuthTarget'

export type { JwtAuthEvent, JwtAuthTargetConfig, JwtPayload } from './JwtAuthTarget'
export {
  decodeJwtPayload,
  isJwtExpired,
  JwtAuthTarget,
} from './JwtAuthTarget'

export type TargetPayload<TTarget extends JwtAuthTarget<JwtPayload, Record<string, string>>> =
  TTarget extends JwtAuthTarget<infer TPayload, Record<string, string>> ? TPayload : never;

export type TargetHeaders<TTarget extends JwtAuthTarget<JwtPayload, Record<string, string>>> =
  TTarget extends JwtAuthTarget<JwtPayload, infer THeaders> ? THeaders : never;

export class JwtAuthManager<
  TTargets extends Record<
    string,
    JwtAuthTarget<JwtPayload, Record<string, string>>
  >,
> {
  private readonly targets = new Map<keyof TTargets, TTargets[keyof TTargets]>()

  constructor(config: { targets: TTargets }) {
    for (const [id, target] of Object.entries(config.targets)) {
      this.targets.set(id as keyof TTargets, target as TTargets[keyof TTargets])
    }
  }

  getTargetIds(): (keyof TTargets)[] {
    return Array.from(this.targets.keys()) as (keyof TTargets)[]
  }

  hasTarget<TKey extends keyof TTargets>(targetId: TKey): boolean {
    return this.targets.has(targetId)
  }

  getTarget<TKey extends keyof TTargets>(targetId: TKey): TTargets[TKey] | undefined {
    return this.targets.get(targetId) as TTargets[TKey] ?? undefined;
  }

  getTargetOrThrow<TKey extends keyof TTargets>(targetId: TKey): TTargets[TKey] {
    const target = this.targets.get(targetId)

    if (!target) {
      throw new Error(`JwtAuthManager: target "${targetId.toString()}" is not registered`)
    }

    return target as TTargets[TKey];
  }

  setToken<TKey extends keyof TTargets>(targetId: TKey, token: string): void {
    this.getTargetOrThrow(targetId).setToken(token)
  }

  getToken<TKey extends keyof TTargets>(targetId: TKey): string | null {
    return (this.targets.get(targetId) as TTargets[TKey])?.getToken() ?? null
  }

  getRefreshToken<TKey extends keyof TTargets>(targetId: TKey): string | null {
    return this.targets.get(targetId)?.getRefreshToken() ?? null
  }

  setRefreshToken<TKey extends keyof TTargets>(targetId: TKey, token: string): void {
    this.getTargetOrThrow(targetId).setRefreshToken(token)
  }

  removeRefreshToken<TKey extends keyof TTargets>(targetId: TKey): void {
    this.targets.get(targetId)?.removeRefreshToken()
  }

  removeToken<TKey extends keyof TTargets>(targetId: TKey): void {
    this.targets.get(targetId)?.removeToken()
  }

  isAuthenticated<TKey extends keyof TTargets>(targetId: TKey, leewaySeconds = 0): boolean {
    const target = this.targets.get(targetId)

    if (!target) {
      return false
    }

    return target.isAuthenticated(leewaySeconds)
  }

  isExpired<TKey extends keyof TTargets>(targetId: TKey, leewaySeconds = 0): boolean {
    const target = this.targets.get(targetId)

    if (!target) {
      return true
    }

    return target.isExpired(leewaySeconds)
  }

  getAuthHeaders<TKey extends keyof TTargets>(targetId: TKey): TargetHeaders<TTargets[TKey]> | undefined {
    return this.targets.get(targetId)?.getAuthHeaders() as TargetHeaders<TTargets[TKey]> ?? undefined
  }

  getPayload<TKey extends keyof TTargets>(targetId: TKey): TargetPayload<TTargets[TKey]> | undefined {
    return this.targets.get(targetId)?.getPayload() as TargetPayload<TTargets[TKey]> ?? null
  }

  subscribe<TKey extends keyof TTargets>(targetId: TKey, callback: JwtAuthCallback<TargetPayload<TTargets[TKey]>>): () => void {
    return this.getTargetOrThrow(targetId).subscribe(callback as JwtAuthCallback<JwtPayload>)
  }

  refreshToken<TKey extends keyof TTargets>(targetId: TKey, token: string): void {
    this.getTargetOrThrow(targetId).refreshToken(token)
  }

  markExpired<TKey extends keyof TTargets>(targetId: TKey): void {
    this.targets.get(targetId)?.markExpired()
  }
}
