export interface PixiFilter {
  type: string
}

export interface PixiGlowFilter extends PixiFilter {
  distance: number
  outerStrength: number
  color: number
  quality: number
  alpha: number
}

export interface PixiColorOverlayFilter extends PixiFilter {
  color: number[] | Float32Array
  alpha: number
}