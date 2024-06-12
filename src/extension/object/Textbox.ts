import { Textbox as OriginTextbox, classRegistry, Text } from "fabric"
import { EffectItem } from "@/types/common"
import type { Abortable } from 'fabric'
import { CENTER, RIGHT, LEFT, DEFAULT_SVG_FONT_SIZE } from "../constants"
import { parseAttributes } from '../parser/parseAttributes'

export class Textbox extends OriginTextbox {

  public effects?: EffectItem[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.effects = options.effects
  }

  enlargeSpaces() {
    let diffSpace,
      currentLineWidth,
      numberOfSpaces,
      accumulatedSpace,
      line,
      charBound,
      spaces;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (this.textAlign !== 'justify' && (i === len - 1 || this.isEndOfWrapping(i))) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth < this.width && (spaces = this.textLines[i].split(''))) {
        
        numberOfSpaces = spaces.length - 1;
        diffSpace = (this.width - currentLineWidth) / numberOfSpaces;
        for (let j = 0; j <= line.length; j++) {
          charBound = this.__charBounds[i][j];
          charBound.width += diffSpace;
          charBound.kernedWidth += diffSpace;
          charBound.left += accumulatedSpace;
          accumulatedSpace += diffSpace;
        }
      }
    }
  }

  renderEffects() {
    this.canvas?.renderAll()
  }

  _renderChar(method: "fillText" | "strokeText", ctx: CanvasRenderingContext2D, lineIndex: number, charIndex: number, _char: string, left: number, top: number): void {
    if (this.effects) {
      for (let i = 0; i < this.effects.length; i++) {
        const item = this.effects[i]
        ctx.save();
        ctx.strokeStyle = item.stroke;
        ctx.lineWidth = item.strokeWidth;
        ctx.strokeText(_char, left, top);
        ctx.restore()
      }
    }
    super._renderChar(method, ctx, lineIndex, charIndex, _char, left, top)
  }

  static async fromElement(
    element: HTMLElement,
    options: Abortable,
    cssRules?: any
  ): Promise<any> {
    const parsedAttributes = parseAttributes(
      element,
      Text.ATTRIBUTE_NAMES,
      cssRules
    );
    const {
      textAnchor = LEFT as typeof LEFT | typeof CENTER | typeof RIGHT,
      textDecoration = '',
      dx = 0,
      dy = 0,
      top = 0,
      left = 0,
      fontSize = DEFAULT_SVG_FONT_SIZE,
      strokeWidth = 1,
      ...restOfOptions
    } = { ...options, ...parsedAttributes };

    const textContent = (element.textContent || '')
      .replace(/^\s+|\s+$|\n+/g, '')
      .replace(/\s+/g, ' ');

    // this code here is probably the usual issue for SVG center find
    // this can later looked at again and probably removed.

    const text = new this(textContent, {
        left: left + dx,
        top: top + dy,
        underline: textDecoration.includes('underline'),
        overline: textDecoration.includes('overline'),
        linethrough: textDecoration.includes('line-through'),
        // we initialize this as 0
        strokeWidth: 0,
        fontSize,
        ...restOfOptions,
      }),
      textHeightScaleFactor = text.getScaledHeight() / text.height,
      lineHeightDiff =
        (text.height + text.strokeWidth) * text.lineHeight - text.height,
      scaledDiff = lineHeightDiff * textHeightScaleFactor,
      textHeight = text.getScaledHeight() + scaledDiff;

    let offX = 0;
    /*
      Adjust positioning:
        x/y attributes in SVG correspond to the bottom-left corner of text bounding box
        fabric output by default at top, left.
    */
    if (textAnchor === CENTER) {
      offX = text.getScaledWidth() / 2;
    }
    if (textAnchor === RIGHT) {
      offX = text.getScaledWidth();
    }
    text.set({
      left: text.left - offX,
      top: text.top - (textHeight - text.fontSize * (0.07 + text._fontSizeFraction)) / text.lineHeight,
      strokeWidth,
    });
    return text;
  }
}

classRegistry.setClass(Textbox)
classRegistry.setSVGClass(Textbox)