// Realtime transport abstraction — see docs ADR-0023.
//
// Server->client push (inbox, live match ticker, notifications) goes through
// this interface. The MVP implementation is SSE (native to TanStack Start,
// zero new infra). Centrifugo is the planned swap-in for guaranteed delivery /
// recovery / presence / bidirectional multiplayer — behind this same
// interface, so the swap is contained.

export interface RealtimeMessage<T = unknown> {
  channel: string
  data: T
}

export type RealtimeHandler<T = unknown> = (msg: RealtimeMessage<T>) => void

/** Call to stop receiving messages on a subscription. Idempotent. */
export type Unsubscribe = () => void

export interface RealtimeTransport {
  /** Open the underlying connection. Safe to call once per transport. */
  connect(): void
  /** Subscribe to a channel; returns an unsubscribe handle. */
  subscribe<T = unknown>(channel: string, handler: RealtimeHandler<T>): Unsubscribe
  /** Close the connection and drop all subscriptions. */
  close(): void
}

/**
 * SSE implementation skeleton (ADR-0023: ship first). One EventSource per
 * transport; channels are multiplexed via the SSE `event:` field. The real
 * reconnect/backoff and TanStack Query cache integration land with the inbox
 * feature. Centrifugo is the planned swap behind this interface.
 */
export class SseRealtimeTransport implements RealtimeTransport {
  private source: EventSource | null = null
  private readonly handlers = new Map<string, Set<RealtimeHandler>>()

  constructor(private readonly url: string) {}

  connect(): void {
    if (this.source) return
    this.source = new EventSource(this.url, { withCredentials: true })
  }

  subscribe<T = unknown>(channel: string, handler: RealtimeHandler<T>): Unsubscribe {
    const set = this.handlers.get(channel) ?? new Set<RealtimeHandler>()
    set.add(handler as RealtimeHandler)
    this.handlers.set(channel, set)

    const listener = (ev: MessageEvent<string>): void => {
      handler({ channel, data: JSON.parse(ev.data) as T })
    }
    this.source?.addEventListener(channel, listener)

    return () => {
      set.delete(handler as RealtimeHandler)
      this.source?.removeEventListener(channel, listener)
    }
  }

  close(): void {
    this.source?.close()
    this.source = null
    this.handlers.clear()
  }
}
