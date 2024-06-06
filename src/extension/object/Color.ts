import { Color as FabricColor, TColorArg } from "fabric";

export class Color extends FabricColor {
  constructor(color?: TColorArg) {
    super(color)
  }

  toMaskWhite() {
    // 0.2125   0.7154   0.0721
    const source = this.getSource(),
    colorLuminance = 0.2125 * source[0] / 255 + 0.7154 * source[1] / 255 + 0.0721 * source[2] / 255,
    finalOpacity = colorLuminance * source[3];
    return 'rgba(255, 255, 255,' + finalOpacity + ')';
  }
}