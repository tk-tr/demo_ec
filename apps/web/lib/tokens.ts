import { colorTokens, spacingTokens } from '../tailwind.config'

export const COLOR_TOKENS = colorTokens
export const SPACING_TOKENS = spacingTokens

export type ColorTokenName = keyof typeof COLOR_TOKENS
export type SpacingKey = keyof typeof SPACING_TOKENS
