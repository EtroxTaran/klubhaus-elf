export type RoofKind = 'full' | 'partial' | 'open'

export interface Stand {
  id: string
  name: string
  cap: number
  seats: number
  standing: number
  vip: number
  roof: RoofKind
  rows: number
  blocks: number
  upgrade: string
  upgradeCost: string
}

export type StadiumTypeId = 'dorf' | 'garten' | 'standard' | 'huf' | 'arena'

export interface StadiumType {
  id: StadiumTypeId
  name: string
  stands: number
  capRange: string
  pitch: string
  desc: string
  current?: boolean
}
