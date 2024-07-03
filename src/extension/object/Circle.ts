import { Path, classRegistry, Circle as OriginCircle, CircleProps } from "fabric";

export class Circle extends OriginCircle {

  public line1?: Path
  public line2?: Path
  public line3?: Path

  constructor(options: Partial<CircleProps> = {}) {
    super(options)
    this.initEvent()
  }

  initEvent() {
    this.on('selected', this.onObjectSelected.bind(this))
    this.on('moving', this.onObjectMoving.bind(this))
    this.on('deselected', this.onSelectionCleared.bind(this))
  }

  onObjectSelected(e: any) {
    const activeObject = e.target;

    if (activeObject.name === "p0" || activeObject.name === "p2") {
      activeObject.line2.animate('opacity', '1', {
        duration: 200,
        onChange: this.canvas?.renderAll.bind(this.canvas),
      });
      activeObject.line2.selectable = true;
    }
  }

  onObjectMoving(e: any) {
    const p = e.target;
    if (!p) return
    console.log('p:', p, p.name)
    if (p.name === "p0" || p.name === "p2") {
      console.log('p:', p.name)
      if (p.line1) {
        p.line1.path[0][1] = p.left;
        p.line1.path[0][2] = p.top;
        console.log('line1:', p.line1)
      }
      else if (p.line3) {
        p.line3.path[1][3] = p.left;
        p.line3.path[1][4] = p.top;
        console.log('line3:', p.line3)
      }
    }
    else if (p.name === "p1") {
      if (p.line2) {
        p.line2.path[1][1] = p.left;
        p.line2.path[1][2] = p.top;
        console.log('line2:', p.line2)
      }
    }
    else if (p.name === "p0" || p.name === "p2") {
      p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
      p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
      p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
      p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
    }
  }

  onSelectionCleared(e: any) {
    var activeObject = e.target;
    if (activeObject.name === "p0" || activeObject.name === "p2") {
      activeObject.line2.animate('opacity', '0', {
        duration: 200,
        onChange: this.canvas?.renderAll.bind(this.canvas),
      });
      activeObject.line2.selectable = false;
    }
    else if (activeObject.name === "p1") {
      activeObject.animate('opacity', '0', {
        duration: 200,
        onChange: this.canvas?.renderAll.bind(this.canvas),
      });
      activeObject.selectable = false;
    }
  }

  destroyed() {
    this.off('selected', this.onObjectSelected.bind(this))
    this.off('moving', this.onObjectMoving.bind(this))
    this.off('deselected', this.onSelectionCleared.bind(this))
  }
}

export const makeCurveCircle = (left: number, top: number, line1?: any, line2?: any, line3?: any): Circle => {
  const c = new Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 12,
    fill: '#fff',
    stroke: '#666',
    originX: 'center',
    originY: 'center'
  });

  c.hasBorders = c.hasControls = false;

  c.line1 = line1;
  c.line2 = line2;
  c.line3 = line3;

  return c;
}

export const makeCurvePoint = (left: number, top: number, line1?: any, line2?: any, line3?: any): Circle => {
  var c = new Circle({
    left: left,
    top: top,
    strokeWidth: 8,
    radius: 14,
    fill: '#fff',
    stroke: '#666',
    originX: 'center',
    originY: 'center'
  });

  c.hasBorders = c.hasControls = false;

  c.line1 = line1;
  c.line2 = line2;
  c.line3 = line3;

  return c;
}


classRegistry.setClass(Circle)
