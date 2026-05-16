export interface Player {
  /** Full name. */
  n: string
  pos: string
  age: number
  /** Strength 1–10. */
  str: number
  /** Talent tier 1–4. */
  tal: number
  /** Form as a de-DE decimal string, e.g. "7,4". */
  form: string
  /** Contract end as MM/YY. */
  contract: string
  /** Nationality code. */
  nat: string
  shirt: number
  bench?: boolean
}
