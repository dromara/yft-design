import fabric from "fabric"

export const setLineControls = () => {
  fabric.Object.prototype.controls.tl.visible = false
  fabric.Object.prototype.controls.ml.visible = true
  fabric.Object.prototype.controls.bl.visible = false

  fabric.Object.prototype.controls.mt.visible = false
  fabric.Object.prototype.controls.mb.visible = false
  fabric.Object.prototype.controls.mtr.visible = true

  fabric.Object.prototype.controls.tr.visible = false
  fabric.Object.prototype.controls.mr.visible = true
  fabric.Object.prototype.controls.br.visible = false


}

export const setCommonControls = () => {
  fabric.Object.prototype.controls.tl.visible = true
  fabric.Object.prototype.controls.ml.visible = true
  fabric.Object.prototype.controls.bl.visible = true

  fabric.Object.prototype.controls.mt.visible = false
  fabric.Object.prototype.controls.mb.visible = false
  fabric.Object.prototype.controls.mtr.visible = true

  fabric.Object.prototype.controls.tr.visible = true
  fabric.Object.prototype.controls.mr.visible = true
  fabric.Object.prototype.controls.br.visible = true
}

export const setGroupControls = () => {
  fabric.Object.prototype.controls.tl.visible = true
  fabric.Object.prototype.controls.ml.visible = true
  fabric.Object.prototype.controls.bl.visible = true

  fabric.Object.prototype.controls.mt.visible = false
  fabric.Object.prototype.controls.mb.visible = false
  fabric.Object.prototype.controls.mtr.visible = false

  fabric.Object.prototype.controls.tr.visible = true
  fabric.Object.prototype.controls.mr.visible = true
  fabric.Object.prototype.controls.br.visible = true
}