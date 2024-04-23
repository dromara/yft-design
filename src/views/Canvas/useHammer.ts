import Hammer from 'hammerjs'
import useCanvas from './useCanvas'
import { Point, Object as FabricObject, util } from 'fabric'
import { storeToRefs } from 'pinia'
import { useFabricStore } from '@/store/modules/fabric'

const rotateSnaps = [0, 45, 90, 135, 180, 225, 270, 315, 360]

export default () => {

  const initHammer = () => {
    let pausePanning = false

    let lastX: number = 0
    let lastY: number = 0

    let adjustDeltaX = 0
    let adjustDeltaY = 0
    let adjustScale = 1
    let adjustScaleX = 1
    let adjustScaleY = 1
    let adjustRotation = 0

    let currentDeltaX = 0
    let currentDeltaY = 0
    let currentScale = 0
    let currentScaleX = 0
    let currentScaleY = 0
    let currentRotation = 0

    const [canvas] = useCanvas()
    const fabricStore = useFabricStore()
    const { zoom } = storeToRefs(fabricStore)
    const hammer = new Hammer.Manager(canvas.lowerCanvasEl)
    const pan = new Hammer.Pan()
    const rotate = new Hammer.Rotate()
    const pinch = new Hammer.Pinch()
    hammer.add([pan, pinch, rotate])
    hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_ALL })
    hammer.get('rotate').set({ enable: true })
    hammer.get('pinch').set({ enable: true })

    hammer.on("panstart pinchstart rotatestart", (e) => {
      adjustRotation -= e.rotation
      lastX = e.center.x
      lastY = e.center.y
      if (canvas.getActiveObject()) {
        const object = canvas.getActiveObject()
        if (!object) return
        adjustScaleX = object.scaleX
        adjustScaleY = object.scaleY
      }
    })

    hammer.on("panmove", (e) => {

      if (canvas.getActiveObject() == undefined && pausePanning == false && !canvas.isDrawingMode && e.maxPointers == 1) {

        currentDeltaX = -(lastX - e.center.x)
        currentDeltaY = -(lastY - e.center.y)
        let delta = new Point(currentDeltaX, currentDeltaY)

        canvas.relativePan(delta)
        canvas.renderAll()

        lastX = e.center.x
        lastY = e.center.y
      }
    })

    const drawRotateGuidelines = (object: FabricObject, angle: number) => {
      const ctx = canvas.getSelectionContext()
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (rotateSnaps.includes(Math.abs(Math.ceil(object.angle)))) {

        const scale = object.scaleX
        let XYstart = util.transformPoint(new Point((object.left - ((object.width * scale) / 2)), (object.top)), canvas.viewportTransform)
        const centerPoint = object.getCenterPoint()
        var XYmid = util.transformPoint(new Point((centerPoint.x), (centerPoint.y)), canvas.viewportTransform)
        var XYend = util.transformPoint(new Point((object.left + ((object.width * scale) / 2)), (object.top)), canvas.viewportTransform)
        ctx.save()
        let middlePoint = { x: XYmid.x, y: XYmid.y }
        ctx.translate(middlePoint.x, middlePoint.y);
        ctx.rotate((Math.PI / 180) * object.angle)
        ctx.translate(-middlePoint.x, -middlePoint.y);
        // ctx.strokeStyle = centerLineColor
        // ctx.lineWidth = centerLineWidth
        ctx.strokeStyle = '#3988ad'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(((XYstart.x)), ((XYstart.y)))
        ctx.lineTo(((XYend.x)), ((XYend.y)))
        ctx.stroke()
        ctx.restore()


        XYstart = util.transformPoint(new Point((object.left - ((object.height * scale) / 2)), (object.top)), canvas.viewportTransform)
        XYend = util.transformPoint(new Point((object.left + ((object.height * scale) / 2)), (object.top)), canvas.viewportTransform)
        ctx.save()

        middlePoint = { x: XYmid.x, y: XYmid.y }
        ctx.translate(middlePoint.x, middlePoint.y);
        ctx.rotate((Math.PI / 180) * (object.angle + 90))
        ctx.translate(-middlePoint.x, -middlePoint.y);
        ctx.strokeStyle = '#3988ad'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo( XYstart.x, XYstart.y)
        ctx.lineTo(XYend.x, XYend.y)
        ctx.stroke()
        ctx.restore()

        canvas.renderAll()
      }
    }

    const between = (value: number, first: number, last: number) => {
      let lower = Math.min(first,last) , upper = Math.max(first,last);
      return value >= lower &&  value <= upper ;
    }
    
    /** 
    const checkRotateSnap = (degree: number, object: FabricObject) => {
      var inDegree = degree + adjustRotation
      var newDegree = null
      if (object.lockRotation == true) {
        if (between(Math.abs(Math.ceil(inDegree)), Math.abs(object.lockedDegree) - 10, Math.abs(object.lockedDegree) + 10)) {
          object.lockRotation = true
          newDegree = object.lockedDegree
        } 
        else {
          object.lockRotation = false
          object.lockedDegree = null
          newDegree = degree + adjustRotation
          contextLines.clearRect(0, 0, canvas.width, canvas.height);
        }
      } 
      else {

        if (rotateSnaps.includes(Math.abs(Math.ceil(inDegree)))) {
          object.lockRotation = true

          newDegree = Math.ceil(degree + adjustRotation)

          object.lockedDegree = newDegree
        } else {

          object.lockRotation = false
          object.lockedDegree = null
          newDegree = degree + adjustRotation
          contextLines.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      // update_info()
      return newDegree


    }
    **/

    hammer.on("pinchmove rotatemove", (e) => {
      console.log(e.scale)
      canvas.zoomToPoint({ x:e.deltaX, y: e.deltaY }, e.scale);
      return;
      // if(canvas.getActiveObject() && e.maxPointers == 2) {
  
      //   this.pausePanning = true
      //   var object = canvas.getActiveObject()

      //   this.currentRotation = checkRotateSnap(e.rotation, object)
          
      //     //console.log("this.currentRotation: " + this.currentRotation)
          
      //   if (this.currentRotation != null) {
      //     object.rotate(this.currentRotation)
      //   }
          
  
      //     // -----------------------------------
      //     // SCALING
      //     // -----------------------------------
  
      //     currentScale = adjustScale * e.scale
      //     currentScaleX = adjustScaleX * e.scale * 1
      //     currentScaleY = adjustScaleY * e.scale * 1
  
      //     // Blocks object from being resized too small (and maintains aspect ratio)
      //     if (currentScaleX > object.minScaleLimit && currentScaleY > object.minScaleLimit) {
  
      //     } else {
      //         // console.log("object has reached a limit")
      //         currentScaleX = object.scaleX //Math.max(currentScaleX, object.minScaleLimit)
      //         currentScaleY = object.scaleY //Math.max(currentScaleY, object.minScaleLimit)     
      //     }
  
      //     this.pausePanning = true
  
      //     let deltaScaleX = currentScaleX
      //     let deltaScaleY = currentScaleY
  
      //     // Temporarily locking regular object dragging during the gesture, just to smooth out jitteryness
      //     object.set({ lockMovementX: true, lockMovementY: true })
  
      //     object.set('scaleX', deltaScaleX)
      //     object.set('scaleY', deltaScaleY)
      //     object.setCoords()
          
          
      //     canvas.renderAll() 
          
          
      //             if(object.lockRotation == true) {
           
      //         drawRotateGuidelines(object)           
              
      //     }
          
      //     object.setCoords()
          
          
      //     canvas.renderAll() 
  
      // }
    })
  
  
  
  hammer.on("panend pinchend rotateend", (e) => {
    pausePanning = false
    // contextLines.clearRect(0, 0, canvas.width, canvas.height);
    const object = canvas.getActiveObject()
    if (object) {
      
      adjustScale = currentScale;
      adjustRotation = currentRotation;
      adjustDeltaX = currentDeltaX;
      adjustDeltaY = currentDeltaY;
      adjustScaleX = currentScaleX;
      adjustScaleY = currentScaleY;

      setTimeout(function(){
        object.set({
          lockRotation: false,
          lockMovementX: false,
          lockMovementY: false
        })
      }, 300)
    }
    canvas.renderAll()
  })

    canvas.on('object:rotating', function (e) {
      if (rotateSnaps.includes(Math.abs(Math.ceil(e.target.angle)))) {
        e.target.lockedDegree = Math.ceil(e.target.angle)
      }
      else {
        e.target.lockedDegree = null
      }
      adjustRotation = e.target.angle
      const object = canvas.getActiveObject()
      if (!object) return
      drawRotateGuidelines(object, e.target.angle)
    })
  }

  return {
    initHammer
  }
}