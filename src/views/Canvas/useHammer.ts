import Hammer from 'hammerjs'
import useCanvas from './useCanvas'
import { Point, Object as FabricObject, util } from 'fabric'
import { storeToRefs } from 'pinia'
import { useFabricStore } from '@/store/modules/fabric'

const rotateSnaps = [0, 45, 90, 135, 180, 225, 270, 315, 360]

export default () => {

  const initHammer = () => {
    let pausePanning = false

    let lastX = null
    let lastY = null

    let adjustDeltaX = 0
    let adjustDeltaY = 0
    let adjustScale = 1
    let adjustScaleX = 1
    let adjustScaleY = 1
    let adjustRotation = 0

    let currentDeltaX = null
    let currentDeltaY = null
    let currentScale = null
    let currentScaleX = null
    let currentScaleY = null
    let currentRotation = null

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
      this.lastX = e.center.x
      this.lastY = e.center.y
      if (canvas.getActiveObject()) {
        const object = canvas.getActiveObject()
        if (!object) return
        this.adjustScaleX = object.scaleX
        this.adjustScaleY = object.scaleY
      }
    })

    hammer.on("panmove", (e) => {

      if (canvas.getActiveObject() == undefined
        && this.pausePanning == false
        && canvas.isDrawingMode == 0
        && e.maxPointers == 1) {

        currentDeltaX = -(this.lastX - e.center.x)
        currentDeltaY = -(this.lastY - e.center.y)
        let delta = new fabric.Point(currentDeltaX, currentDeltaY)

        canvas.relativePan(delta)
        canvas.renderAll()

        this.lastX = e.center.x
        this.lastY = e.center.y
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
        ctx.strokeStyle = centerLineColor
        ctx.lineWidth = centerLineWidth
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
        //console.log("centerLineColor: " + centerLineColor)
        ctx.moveTo(
          ((XYstart.x)),
          ((XYstart.y))
        )

        ctx.lineTo(
          ((XYend.x)),
          ((XYend.y))
        )


        ctx.stroke()
        ctx.restore()

        canvas.renderAll()
      }
    }

    const checkRotateSnap = (degree, object) => {
      var inDegree = degree + adjustRotation
      var newDegree = null
      if (object.lockRotation == true) {
        if (between(Math.abs(Math.ceil(inDegree)), Math.abs(object.lockedDegree) - 10, Math.abs(object.lockedDegree) + 10)) {



          //console.log("111 - maintain snap")
          object.lockRotation = true
          newDegree = object.lockedDegree
          //newDegree = degree

          // break
        } else {

          //console.log("222 - exit snap")
          object.lockRotation = false
          object.lockedDegree = null
          newDegree = degree + adjustRotation
          contextLines.clearRect(0, 0, canvas.width, canvas.height);

        }

      } else {

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
      update_info()
      return newDegree


    }

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