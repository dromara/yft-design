import Hammer from 'hammerjs'
import useCanvas from './useCanvas'
import { Point } from 'fabric'
import { storeToRefs } from 'pinia'
import { useFabricStore } from '@/store/modules/fabric'

export default () => {
  
  const initHammer = () => {
    const [ canvas ] = useCanvas()
    const fabricStore = useFabricStore()
    const { zoom } = storeToRefs(fabricStore)
    const hammer = new Hammer(canvas.lowerCanvasEl);
    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('pinch pan', function(ev) {
      // 缩放
      if (ev.type == 'pinch') {
          // var zoom = canvas.getZoom();
          var zoomRatio = ev.scale / zoom.value
          zoom.value *= zoomRatio;
          if (zoom.value > 5) zoom.value = 5;
          if (zoom.value < 0.05) zoom.value = 0.05;
          canvas.zoomToPoint(new Point(ev.center.x, ev.center.y), zoom.value);
          zoom.value = ev.scale;
      }
      // 移动
      else if (ev.type == 'pan') {
        var delta = new Point(ev.deltaX, ev.deltaY);
        canvas.relativePan(delta);
      }
    });
  }

  return {
    initHammer
  }
}