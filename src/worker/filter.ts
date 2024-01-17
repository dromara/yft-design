import { Application, Texture, Sprite, Container } from '@pixi/webworker';
import { PixiFilter, PixiGlowFilter, PixiColorOverlayFilter } from '@/types/pixiFilter';
import { GlowFilter, ColorOverlayFilter } from 'pixi-filters'

let app: Application | undefined = undefined

self.onmessage = async (e) => {
  const { type } = e.data
  if (!type) {
    const { width, height, resolution, view } = e.data
    app = new Application<HTMLCanvasElement>({ width, height, resolution, view })
  }
  else if (type === 'filter') {
    const { src, pixiFilters, width, height, id } = e.data
    // app?.renderer.clear()
    app?.renderer.resize(width, height)
    const texture = await Texture.fromURL(src)
    const sprite = new Sprite(texture)
    sprite.filters = []
    const imagefilters = JSON.parse(pixiFilters) as PixiFilter[]
    for (let i = 0; i < imagefilters.length; i++) {
      const ele = imagefilters[i]
      if (ele.type === 'GlowFilter') {
        const item = ele as PixiGlowFilter
        const glowFilter = new GlowFilter({
          distance: item.distance, 
          outerStrength: item.outerStrength,
          color: item.color,
          quality: item.quality,
          alpha: item.alpha
        })
        // sprite.filters.push(glowFilter)
      }
      if (ele.type === 'ColorOverlayFilter') {
        const item = ele as PixiColorOverlayFilter
        const colorOverlayFilter = new ColorOverlayFilter(0xD12323, 1)
        
        sprite.filters.push(colorOverlayFilter)
      }
    }
    app?.stage.addChild(sprite)
    const res = await app?.renderer.plugins.extract.base64(sprite)
    console.log('img:', `<img src="${res}" alt=""/>`)
    const data = {res, id}
    postMessage(data)
  }
}