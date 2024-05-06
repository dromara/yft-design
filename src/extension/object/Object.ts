import { Object as OriginObject,classRegistry } from "fabric";
import * as fabric from "fabric";

class Object extends OriginObject {

  defaultProperties = {}

  getIDPath=()=>{
    const result = this.group ? this.group.getIDPath() + "." : "";
    if (!this.id) {
      this.id = this.type! + Date.now();
    }
    return result + this.id;
  }


  override set =(key: any, value: any)=> {
    if (typeof key === "object") {
      this._setObject(key);
      if (this.onSet && !this._currentlySetProperties) {
        this._currentlySetProperties = true;
        this.onSet(key);
        delete this._currentlySetProperties;
      }
    } else {
      this._set(key, value);
      if (this.onSet && !this._currentlySetProperties) {
        this._currentlySetProperties = true;
        this.onSet({ [key]: value });
        delete this._currentlySetProperties;
      }
    }
    return this;
  }

  getAbsoluteProperties=()=>{
    const matrix = this.calcTransformMatrix(),
    options = fabric.util.qrDecompose(matrix),
    center = new fabric.Point(options.translateX, options.translateY),
    center2 = this.translateToCenterPoint(center, "center", "center"),
    position = this.translateToOriginPoint(center2, this.originX, this.originY);

  return {
    width: this.width,
    height: this.height,
    left: position.x,
    top: position.y,
    angle: options.angle,
    scaleX: options.scaleX,
    scaleY: options.scaleY,
  };
  }

  getAbsoluteCoordinates=()=>{
    const options = this.getAbsoluteProperties();
    // @ts-ignore
    if (!this.canvas._hackrect) {
      // @ts-ignore
      this.canvas._hackrect = new fabric.Rect({});
    }
    // @ts-ignore
    this.canvas._hackrect.set(options);
    // @ts-ignore
    return this.canvas._hackrect.getCoords(true, true);
  }

  setOptions=(options:any)=>{
    this._setOptions(options);
    if (this.onSet && !this._currentlySetProperties) {
      this._currentlySetProperties = true;
      this.onSet(options);
      delete this._currentlySetProperties;
    }
    this._initGradient(options.fill, "fill");
    this._initGradient(options.stroke, "stroke");
    this._initPattern(options.fill, "fill");
    this._initPattern(options.stroke, "stroke");
  }

  _set=(key: string, value: any)=>{
    const shouldConstrainValue = key === "scaleX" || key === "scaleY";
  // @ts-ignore
  let isChanged = this[key] !== value,
    groupNeedsUpdate = false;

  if (shouldConstrainValue) {
    value = this._constrainScale(value);
  }
  if (key === "scaleX" && value < 0) {
    this.flipX = !this.flipX;
    value *= -1;
  } else if (key === "scaleY" && value < 0) {
    this.flipY = !this.flipY;
    value *= -1;
  } else if (key === "shadow" && value && !(value instanceof fabric.Shadow)) {
    value = new fabric.Shadow(value);
  } else if (key === "dirty" && this.group) {
    this.group.set("dirty", value);
  }

  const setter = "__set" + key;
  // @ts-ignore
  if (this[setter]) {
    // @ts-ignore
    this[setter](value);
  } else {
    // @ts-ignore
    this[key] = value;
  }

  if (isChanged) {
    groupNeedsUpdate = (this.group && this.group.isOnACache()) || false;
    if (this.cacheProperties!.indexOf(key) > -1) {
      this.dirty = true;
      groupNeedsUpdate && this.group!.set("dirty", true);
    } else if (groupNeedsUpdate && this.stateProperties!.indexOf(key) > -1) {
      this.group!.set("dirty", true);
    }
  }
  return this;
  }

  toDatalessObject=(  propertiesToInclude: string[])=>{
    const object = this.toObject(propertiesToInclude);
  delete object["version"];
  const defaults = this.getDefaultProperties();
  for (const property in object) {
    if (property === "type") {
      continue;
    }
    if (defaults[property]) {
      if (object[property] === defaults[property]) {
        delete object[property];
      }
    } else {
      // @ts-ignore
      if (object[property] === fabric.Rect.prototype[property]) {
        delete object[property];
      }
    }
  }
  if (this.id) {
    object.id = this.id;
  }
  return object;
  }

  getDefaultProperties=()=>{
    return this.defaultProperties || {};
  }



 }

 classRegistry.setClass(Object)
