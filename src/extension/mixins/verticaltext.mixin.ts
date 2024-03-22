import { Object as FabricObject, TPointerEventInfo, TPointerEvent } from "fabric"

const getParentScaleX = (el: FabricObject): number => {
  return el.scaleX * (el.group ? getParentScaleX(el.group) : 1)
}

const notALeftClick = (e: MouseEvent) => {
  return e.button && e.button !== 1;
}

export const VerticalTextMixin: any = {
  minFontSize: 2,
  maxFontSize: 250,
  minLineHeight: 2,
  maxLineHeight: 200,

  maxStrokeWidth () {
    return Math.ceil(this.getFontSize() / 10);
  },

  setProperty(property: string, value: any) {
    this[property] = value
    this._textBeforeEdit = this.text;
  },

  _removeStyle(styleName: any) {
    for(let row in this.styles) {
      for (let index in this.styles[row]) {
        delete this.styles[row][index][styleName]
      }
    }
  },

  _removeStyleAt(propertyToRemove: any, index: number) {
    let loc = this.getStylePosition(index);
    if (!this._getLineStyle(loc.lineIndex) || !this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
      return;
    }
    let style = this.styles[loc.lineIndex][loc.charIndex];
    delete style[propertyToRemove];
    if(!Object.keys(style).length ){
      delete this.styles[loc.lineIndex][loc.charIndex];
      if(!this.styles[loc.lineIndex].length ){
        delete this.styles[loc.lineIndex];
      }
    }
  },

  _modifyObjectStyleProperty(styleName: string, value: any) {
    let count = 0;
    for (let row in this.styles) {
      for (let index in this.styles[row]) {
        if (this.styles[row][index] === undefined || this.styles[row][index][styleName] === value){
          count++;
        }else{
          return;
        }
      }
    }
    if (count === this.text.length) {
      this._removeStyle(styleName);
      this[styleName] = value;
    }
  },

  setStyleInterval(styleName: string, value: any, start: number, end: number) {
    if (value === undefined || this[styleName] === value){
      for (let i = start; i < end; i++) {
        this._removeStyleAt(styleName,i);
      }
      this._forceClearCache = true;
    }else{
      this.setSelectionStyles({[styleName]: value}, start, end);
    }
    this._modifyObjectStyleProperty(styleName,value);
    this.setCoords();
    if(styleName === "fontFamily" && value && this.renderOnFontsLoaded){
      this.renderOnFontsLoaded([value])
    }
  },

  setStyle(styleName: string, value: any) {
    this.__selectionStart = this.selectionStart;
    this.__selectionEnd = this.selectionEnd;
    this.__changedProperty = styleName;
    if (this.setSelectionStyles && this.isEditing && this.selectionStart !== this.selectionEnd) {
      this.setStyleInterval(styleName, value,this.selectionStart,this.selectionEnd)
    }
    else {
      if (value !== undefined) {
        this._removeStyle(styleName);
        this.set(styleName,value)
      } else {
        this.set(styleName,value)
      }
      if (!this._textLines && this.ready) {
        this._clearCache();
        this._splitText();
      }
    }
    this.setCoords();
    if (this.caching) {
      this.dirty = true;
    }
    delete this.__changedProperty;
    delete this.__selectionStart;
    delete this.__selectionEnd;
  },

  generateTextStyle() {
    return {
      'font-style': this.getStyle('fontStyle'),
      'font-weight': this.getStyle('bold'),
      'text-decoration':
        ( this.getStyle('linethrough') ? 'line-through ' : '') +
        ( this.getStyle('overline') ? 'overline ' : '') +
        ( this.getStyle('underline') ? 'underline ' : '')
    }
  },

  _mouseDownHandler({ e }: TPointerEventInfo) {
    if (
      !this.canvas ||
      !this.editable ||
      notALeftClick(e as MouseEvent) ||
      this.__corner
    ) {
      return;
    }

    if (this.draggableTextDelegate.start(e)) {
      return;
    }

    this.canvas.textEditingManager.register(this);

    if (this.selected) {
      this.inCompositionMode = false;
      this.setCursorByClick(e);
    }
    if (this.isEditing) {
      this.__selectionStartOnMouseDown = this.selectionStart;
      if (this.selectionStart === this.selectionEnd) {
        this.abortCursorAnimation();
      }
      this.renderCursorOrSelection();
    }
  },

  mouseUpHandler({ e, transform, button }: TPointerEventInfo) {
    const didDrag = this.draggableTextDelegate.end(e);
    if (this.canvas) {
      this.canvas.textEditingManager.unregister(this);
      const activeObject = this.canvas._activeObject;
      if (activeObject && activeObject !== this) {
        return;
      }
    }
    if (
      !this.editable ||
      (this.group && !this.group.interactive) ||
      (transform && transform.actionPerformed) ||
      notALeftClick(e as MouseEvent) ||
      didDrag
    ) {
      return;
    }
    if (this.__lastSelected && !this.__corner) {
      this.selected = false;
      this.__lastSelected = false;
      this.isEditing = false;
      this._restoreEditingProps();
      this.enterEditing(e);
      if (this.selectionStart === this.selectionEnd) {
        this.initDelayedCursor(true);
      } else {
        this.renderCursorOrSelection();
      }
    } else {
      this.selected = true;
    }
  },

  enterEditing(e: TPointerEvent) {
    if (this.isEditing || !this.editable) {
      return;
    }
    if (this.canvas) {
      this.canvas.calcOffset();
      this.canvas.textEditingManager.exitTextEditing();
    }

    this.isEditing = true;
    if (!this.hiddenTextarea) {
      this.initHiddenTextarea();
    }
    this.hiddenTextarea!.focus();
    this.hiddenTextarea!.value = this.text;
    this._updateTextarea();
    this._saveEditingProps();
    this._setEditingProps();
    this._textBeforeEdit = this.text;

    this._tick();
    this.fire('editing:entered', { e });
    this._fireSelectionChanged();
    if (this.canvas) {
      this.canvas.fire('text:editing:entered', { target: this, e });
      this.canvas.requestRenderAll();
    }
  },

  exitEditing() {
    const isTextChanged = (this._textBeforeEdit !== this.text);
    this.selectionEnd = this.selectionStart;
    this.__isEditing = false;
    this._exitEditing()
    this.abortCursorAnimation();
    this._restoreEditingProps();
    if (this._forceClearCache) {
      this.initDimensions();
      this.setCoords();
    }
    this.fire('editing:exited');
    isTextChanged && this.fire('modified')
    if (this.canvas) {
      this.canvas.off('mouse:move', this.mouseMoveHandler);
      this.canvas.fire('text:editing:exited', { target: this });
      this.canvas.fire('object:modified', { target: this });
    }
    return this;
  },

  mouseMoveHandler(options: any) {
    if (!this.__isMousedown || !this.isEditing) {
      return;
    }
    if(this.group){
      options.e._group = this.group;
    }
    let newSelectionStart = this.getSelectionStartFromPointer(options.e),
      currentStart = this.selectionStart,
      currentEnd = this.selectionEnd;
    if (
      (newSelectionStart !== this.__selectionStartOnMouseDown || currentStart === currentEnd)
      &&
      (currentStart === newSelectionStart || currentEnd === newSelectionStart)
    ) {
      return;
    }
    if (newSelectionStart > this.__selectionStartOnMouseDown) {
      this.selectionStart = this.__selectionStartOnMouseDown;
      this.selectionEnd = newSelectionStart;
    }
    else {
      this.selectionStart = newSelectionStart;
      this.selectionEnd = this.__selectionStartOnMouseDown;
    }
    if (this.selectionStart !== currentStart || this.selectionEnd !== currentEnd) {
      this.restartCursorIfNeeded();
      this._fireSelectionChanged();
      this._updateTextarea();
      this.renderCursorOrSelection();
    }
    if(this.group){
      delete options.e._group;
    }
  }
}