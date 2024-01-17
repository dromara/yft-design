import { Application, Texture, Sprite, Container } from '@pixi/webworker';
import { PixiFilter, PixiGlowFilter } from '@/types/pixiFilter';
import { GlowFilter } from 'pixi-filters'

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
    const imagefilters = JSON.parse(pixiFilters) as PixiFilter[]
    for (let i = 0; i < imagefilters.length; i++) {
      const ele = imagefilters[i] as PixiGlowFilter
      if (ele.type === 'GlowFilter') {
        const glowFilter = new GlowFilter({
          distance: ele.distance, 
          outerStrength: ele.outerStrength,
          color: ele.color,
          quality: ele.quality,
          alpha: ele.alpha
        })
        sprite.filters?.push(glowFilter)
      }
    }
    app?.stage.addChild(sprite)
    const res = await app?.renderer.plugins.extract.base64(sprite)
    const data = {res, id}
    postMessage(data)
  }
}