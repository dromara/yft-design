import { Application, Texture, Sprite } from '@pixi/webworker';
import { PixiFilter, PixiGlowFilter } from '@/types/pixiFilter';
import { GlowFilter } from 'pixi-filters'

let app: Application | undefined = undefined

self.onmessage = async (e) => {
  console.log('e.data:', e.data)
  const { type } = e.data
  if (!type) {
    const { width, height, resolution, view } = e.data
    app = new Application({ width, height, resolution, view });
    console.log('app:', app)
  }
  else if (type === 'filter') {
    const { src, filter } = e.data
    const texture = await Texture.fromURL(src)
    const sprite = new Sprite(texture)
    const filters = JSON.parse(filter) as PixiFilter[]
    filters.forEach(ele => {
      if (ele.type === 'GlowFilter') {
        const item = ele as PixiGlowFilter
        const glowFilter = new GlowFilter({
          distance: item.distance, 
          outerStrength: item.outerStrength,
          color: item.color,
          quality: item.quality,
          alpha: item.alpha
        })
        sprite.filters?.push(glowFilter)
      }
    })
    app?.stage.addChild(sprite)
  }
  // const text = new Text('雷猴')
  // if (text) {
  //   app.stage.removeChild(text)
  // }
  // // 将文本添加到画布中
  // app.stage.addChild(text)
}