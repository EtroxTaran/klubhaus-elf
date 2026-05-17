export type CrestShape = 'heater' | 'iberian' | 'gonfalon' | 'roundel'

export type CrestCharge =
  | 'lion'
  | 'eagle'
  | 'ship'
  | 'wave'
  | 'tower'
  | 'sword'
  | 'cog'
  | 'cross'
  | 'star'
  | 'ball'

export interface CrestSpec {
  shape: CrestShape
  /** Primary tincture (hex). */
  a: string
  /** Secondary tincture (hex). */
  b: string
  charge: CrestCharge
}

export type ClubId =
  | 'hafenstadt'
  | 'northbridge'
  | 'kaltenbach'
  | 'sauveterre'
  | 'auerbach'
  | 'valguarda'
  | 'riverdale'
  | 'oakport'

export interface Club {
  id: ClubId
  name: string
  short: string
  /** Club primary colour — drives the adaptive accent. */
  primary: string
  /** Club secondary colour — drives the adaptive accent-2. */
  secondary: string
  crest: CrestSpec
}
