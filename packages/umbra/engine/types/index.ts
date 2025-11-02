import type { UmbraSwatch } from '../../swatch'
import type { Alias } from '../primitives/attach'
import type { Formater, UmbraOutputs } from '../primitives/format'
import type { TintsInput } from '../easing'
import type { ColorString } from '../presets'

export interface ValidationWarning {
  type: 'contrast' | 'readability' | 'accessibility'
  severity: 'warning' | 'error'
  message: string
  context?: {
    accentName?: string
    accentColor?: string
    targetColor?: string
    contrastValue?: number
    minContrast?: number
    // For base foreground/background validation
    contrast?: number
    threshold?: number
    originalForeground?: string
    background?: string
    adjustedForeground?: string
    against?: string
  }
}

export interface UmbraRange {
  name: string
  background: UmbraSwatch
  range: UmbraSwatch[]
  foreground: UmbraSwatch
}

export interface FormatedRange {
  name: string
  background: string
  shades: string[]
  foreground: string
}

export interface StableAccent {
  name: string
  color: string
  range: string[]
}

export interface StableScheme {
  background: string
  foreground: string
  baseRange: string[]
  accents: StableAccent[]
}

export interface UmbraOutput {
  input: UmbraInput
  adjusted: UmbraAdjusted
  generated: UmbraRange[]
  validationWarnings: ValidationWarning[]
}

export interface Accent {
  name?: string
  color?: ColorString
  range?: TintsInput | { light?: TintsInput; dark?: TintsInput }
  readability?: number
}

export type UmbraInput = Partial<UmbraScheme>

export interface UmbraScheme extends UmbraColors {
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraColors {
  background: ColorString
  foreground: ColorString
  accents: ColorString | (ColorString | Accent)[]
  baseRange?: TintsInput | { light?: TintsInput; dark?: TintsInput }
}

export interface UmbraAdjusted {
  background: UmbraSwatch
  foreground: UmbraSwatch
  accents: (string | Accent)[]
}

export interface UmbraSettings {
  power?: number
  iterations?: number
  /** APCA contrast target for base foreground/background (default: 30) */
  readability?: number
  insertion?: number
  aliases?: Alias | true
  range?: TintsInput | { light?: TintsInput; dark?: TintsInput }
  callback?: (props: UmbraOutputs) => void
  formater?: Formater
  /** Minimum APCA contrast for accent primer validation (default: 30) */
  minContrastThreshold?: number
}
