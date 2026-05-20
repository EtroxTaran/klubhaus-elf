// Match renderer abstraction — see ADR-0024 and ADR-0026.
//
// Types live in @soccer-manager/match-contract (the engine ↔ renderer seam).
// This module only owns the renderer side: the `MatchRenderer` interface and
// concrete implementations (Canvas2D now, PixiJS later). GSAP tweens *state
// values* into MatchFrames upstream of here; the renderer never reads the
// event log and never interpolates.

import type {
  MatchEntity,
  MatchEvent,
  MatchFrame,
  MatchQualityProfile,
  Vec2,
} from '@soccer-manager/match-contract'
import { isRenderableProfile } from '@soccer-manager/match-contract'

export type { MatchEntity, MatchEvent, MatchFrame, Vec2 }

export interface MatchRenderer {
  /** Attach to a mounted canvas/host element (client-only boundary). */
  mount(host: HTMLCanvasElement): void
  /** Draw a single frame. Called from the caller's animation loop. */
  render(frame: MatchFrame): void
  /** Release all resources; safe to call repeatedly. */
  destroy(): void
}

/**
 * Canvas 2D implementation skeleton (ADR-0024: ship first, mobile-reliable).
 * Intentionally minimal — the real render loop, hit-testing and GSAP-driven
 * tweening land with the match engine. PixiJS v8 is the planned swap behind
 * this same interface.
 */
export class Canvas2DMatchRenderer implements MatchRenderer {
  private ctx: CanvasRenderingContext2D | null = null

  mount(host: HTMLCanvasElement): void {
    this.ctx = host.getContext('2d')
  }

  render(frame: MatchFrame): void {
    const ctx = this.ctx
    if (!ctx) return
    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)
    for (const e of frame.entities) {
      ctx.beginPath()
      ctx.arc(e.pos.x * width, e.pos.y * height, e.kind === 'ball' ? 4 : 7, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  destroy(): void {
    this.ctx = null
  }
}

/**
 * Renderer factory (ADR-0026 §9). Returns `null` for non-renderable quality
 * profiles (background-detailed / background-fast — summary-only, no spatial
 * data). The contract package owns the `isRenderableProfile` predicate; this
 * factory owns construction because the concrete renderer is app-side.
 */
export function getMatchRenderer(profile: MatchQualityProfile): MatchRenderer | null {
  return isRenderableProfile(profile) ? new Canvas2DMatchRenderer() : null
}
