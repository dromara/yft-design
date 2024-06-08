import { Application, Texture, Sprite, Container, Filter, Graphics } from '@pixi/webworker';

import { GlowFilter, ColorOverlayFilter, ColorGradientFilter, BevelFilter, EmbossFilter } from 'pixi-filters'
import { 
  PixiFilter, 
  PixiGlowFilter, 
  PixiColorOverlayFilter, 
  PixiColorGradientFilter, 
  PixiBlendModeFilter ,
  PixiBevelFilter,
  PixiEmbossFilter
} from '@/types/pixiFilter';

let app: Application | undefined = undefined

self.onmessage = async (e) => {
  const { type } = e.data
  if (!type) {
    const { width, height, resolution, view } = e.data
    app = new Application<HTMLCanvasElement>({ width, height, resolution, view })
  }
  else if (type === 'filter') {
    const { src, pixiFilters, width, height, id } = e.data
    app?.renderer.clear()
    app?.renderer.resize(width, height)
    const texture = await Texture.fromURL(src)
    const sprite = new Sprite(texture)
    sprite.filters = []
    const imagefilters = JSON.parse(pixiFilters) as PixiFilter[]
    for (let i = 0; i < imagefilters.length; i++) {
      const ele = imagefilters[i]
      if (ele.type === 'GlowFilter') {
        handleGlowFilter(ele as PixiGlowFilter, sprite.filters)
      }
      if (ele.type === 'ColorOverlayFilter') {
        handleColorOverlayFilter(ele as PixiColorOverlayFilter, sprite.filters)
      }
      if (ele.type === 'ColorGradientFilter') {
        handleColorGradientFilter(ele as PixiColorGradientFilter, sprite.filters)
      }
      if (ele.type === 'BevelFilter') {
        handleBevelFilter(ele as PixiBevelFilter, sprite.filters)
      }
      if (ele.type === 'EmbossFilter') {
        handleEmbossFilter(ele as PixiEmbossFilter, sprite.filters)
      }
    }
    console.log('sprite.filters:', sprite.filters)
    app?.stage.addChild(sprite)
    const res = await app?.renderer.plugins.extract.base64(sprite)
    const data = {res, id}
    postMessage(data)
  }
  else if (type === 'mask') {
    const { id, width, height, mask, src } = e.data
    app?.renderer.clear()
    app?.renderer.resize(width, height)
    const textureLayer = await Texture.fromURL(src)
    const spriteLayer = new Sprite(textureLayer)

    const maskData = JSON.parse(mask)
    const textureMask = await Texture.fromURL(maskData.src)
    const spriteMask = new Sprite(textureMask)
    app?.stage.addChild(spriteMask)
    spriteLayer.mask = spriteMask
    app?.stage.addChild(spriteLayer)
    const res = await app?.renderer.plugins.extract.base64(spriteLayer)
    const data = {res, id}
    postMessage(data)
  }
}

const handleGlowFilter = (item: PixiGlowFilter, filters: Filter[]) => {
  const glowFilter = new GlowFilter({
    distance: 15, 
    outerStrength: 2,
    innerStrength: 2,
    color: item.color,
    alpha: item.alpha
  })
  filters.push(glowFilter)
}

const handleColorOverlayFilter = (item: PixiColorOverlayFilter, filters: Filter[]) => {
  const colorOverlayFilter = new ColorOverlayFilter(item.color, item.alpha)
  filters.push(colorOverlayFilter)
}

const handleColorGradientFilter = (item: PixiColorGradientFilter, filters: Filter[]) => {
  console.log('item:', item)
  const colorGradientFilter = new ColorGradientFilter({
    type: item.gradientType,
    angle: item.angle,
    alpha: item.alpha,
    maxColors: item.maxColors,
    stops: item.stops
  })
  filters.push(colorGradientFilter)
}

const handleBevelFilter = (item: PixiBevelFilter, filters: Filter[]) => {
  const bevelFilter = new BevelFilter({
    lightAlpha: item.lightAlpha,
    lightColor: item.lightColor,
    rotation: item.rotation,
    shadowColor: item.shadowColor,
    thickness: item.thickness,
  })
  filters.push(bevelFilter)
}

const handleEmbossFilter = (item: PixiEmbossFilter, filters: Filter[]) => {
  const embossFilter = new EmbossFilter(item.strength)
  filters.push(embossFilter)
}
// const handleBlendColorFilter = (item: PixiBlendModeFilter, sprite: Sprite) => {
//   sprite.blendMode = item.mode
// }