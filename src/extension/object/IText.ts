import { IText as OriginIText, classRegistry, Text } from "fabric"
import { EffectItem } from "@/types/common"
import type { Abortable } from 'fabric'
import { CENTER, RIGHT, LEFT, DEFAULT_SVG_FONT_SIZE } from "../constants"
import { parseAttributes } from '../parser/parseAttributes'

export class IText extends OriginIText {
  public effects?: EffectItem[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.effects = options.effects
  }

  renderEffects() {
    this.canvas?.renderAll()
  }

  _renderChar(method: "fillText" | "strokeText", ctx: CanvasRenderingContext2D, lineIndex: number, charIndex: number, _char: string, left: number, top: number): void {
    if (this.effects) {
      // for (let i = 0; i < this.effects.length; i++) {
      for (let i = this.effects.length - 1; i >= 0; i--) {
        const item = this.effects[i]
        ctx.save();
        ctx.strokeStyle = item.stroke;
        ctx.lineJoin = item.strokeLineJoin;
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
  ) {
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

classRegistry.setClass(IText)
classRegistry.setSVGClass(IText)