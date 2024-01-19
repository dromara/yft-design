export interface PixiFilter {
  type: string
}

export interface PixiGlowFilter extends PixiFilter {
  distance: number
  outerStrength: number
  innerStrength?: number
  color: number
  quality: number
  alpha: number
}

export interface PixiColorOverlayFilter extends PixiFilter {
  color: number[] | Float32Array
  alpha: number
}

interface PixiColorGradientStop {
  offset: number
  color: number | string | Float32Array | number[]
  alpha: number
}

export interface PixiColorGradientFilter extends PixiFilter {
  gradientType: number
  stops: PixiColorGradientStop[]
  angle?: number
  alpha?: number
  maxColors?: number
}