import { filters, TWebGLPipelineState, T2DPipelineState, util, classRegistry } from "fabric";

export const isWebGLPipelineState = (
  options: TWebGLPipelineState | T2DPipelineState
): options is TWebGLPipelineState => {
  return (options as TWebGLPipelineState).webgl !== undefined;
};

export class Mask extends filters.BaseFilter {

  static type: 'Mask'
  public mask: any
  public channel: number

  constructor(options: Record<string, any>) {
    super(options)
    this.mask = options.mask
    this.channel = [ 0, 1, 2, 4 ].indexOf(options.channel) > -1 ? options.channel: 0
  }

  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
		if(!this.mask) return;
    if (isWebGLPipelineState(options)) {
      console.log('isWebGLPipelineState(options):', isWebGLPipelineState(options))
    }
    else {
      const canvasEl = options.canvasEl
      const context = canvasEl.getContext('2d')
      if (!context) return
      const imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height)
      const data = imageData.data
      const maskEl = this.mask._originalElement
      const maskCanvasEl = util.createCanvasElement()
      const channel = this.channel
      maskCanvasEl.width = imageData.width;
      maskCanvasEl.height = imageData.height;
      maskCanvasEl.getContext('2d')?.drawImage(maskEl, 0, 0, canvasEl.width, canvasEl.height);
      const maskImageData = maskCanvasEl.getContext('2d')?.getImageData(0, 0, canvasEl.width, canvasEl.height)
      if (!maskImageData) return
      const maskData = maskImageData.data;
      const originalImgSize = imageData.width * imageData.height * 4;
      for (let i = 0; i < originalImgSize; i += 4 ) {
        data[ i + 3 ] = maskData[ i + channel ];
      }
      context.putImageData( imageData, 0, 0 );
      options.imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height)
    }
		
   
	}

  // applyTo2d(options: T2DPipelineState) {
  //   options.imageData = this.simpleBlur(options);
  // }
}
  // declare blur: number;

  // declare horizontal: boolean;
  // declare aspectRatio: number;

  // static type = 'Blur';

  // static defaults = blurDefaultValues;

  // getFragmentSource(): string {
  //   return fragmentSource;
  // }

  // applyTo(options: TWebGLPipelineState | T2DPipelineState) {
  //   if (isWebGLPipelineState(options)) {
  //     // this aspectRatio is used to give the same blur to vertical and horizontal
  //     this.aspectRatio = options.sourceWidth / options.sourceHeight;
  //     options.passes++;
  //     this._setupFrameBuffer(options);
  //     this.horizontal = true;
  //     this.applyToWebGL(options);
  //     this._swapTextures(options);
  //     this._setupFrameBuffer(options);
  //     this.horizontal = false;
  //     this.applyToWebGL(options);
  //     this._swapTextures(options);
  //   } else {
  //     this.applyTo2d(options);
  //   }
  // }

  // applyTo2d(options: T2DPipelineState) {
  //   options.imageData = this.simpleBlur(options);
  // }

  // simpleBlur({
  //   ctx,
  //   imageData,
  //   filterBackend: { resources },
  // }: T2DPipelineState) {
  //   const { width, height } = imageData;
  //   if (!resources.blurLayer1) {
  //     resources.blurLayer1 = createCanvasElement();
  //     resources.blurLayer2 = createCanvasElement();
  //   }
  //   const canvas1 = resources.blurLayer1!;
  //   const canvas2 = resources.blurLayer2!;
  //   if (canvas1.width !== width || canvas1.height !== height) {
  //     canvas2.width = canvas1.width = width;
  //     canvas2.height = canvas1.height = height;
  //   }
  //   const ctx1 = canvas1.getContext('2d')!,
  //     ctx2 = canvas2.getContext('2d')!,
  //     nSamples = 15,
  //     blur = this.blur * 0.06 * 0.5;
  //   let random, percent, j, i;

  //   // load first canvas
  //   ctx1.putImageData(imageData, 0, 0);
  //   ctx2.clearRect(0, 0, width, height);

  //   for (i = -nSamples; i <= nSamples; i++) {
  //     random = (Math.random() - 0.5) / 4;
  //     percent = i / nSamples;
  //     j = blur * percent * width + random;
  //     ctx2.globalAlpha = 1 - Math.abs(percent);
  //     ctx2.drawImage(canvas1, j, random);
  //     ctx1.drawImage(canvas2, 0, 0);
  //     ctx2.globalAlpha = 1;
  //     ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  //   }
  //   for (i = -nSamples; i <= nSamples; i++) {
  //     random = (Math.random() - 0.5) / 4;
  //     percent = i / nSamples;
  //     j = blur * percent * height + random;
  //     ctx2.globalAlpha = 1 - Math.abs(percent);
  //     ctx2.drawImage(canvas1, random, j);
  //     ctx1.drawImage(canvas2, 0, 0);
  //     ctx2.globalAlpha = 1;
  //     ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  //   }
  //   ctx.drawImage(canvas1, 0, 0);
  //   const newImageData = ctx.getImageData(0, 0, canvas1.width, canvas1.height);
  //   ctx1.globalAlpha = 1;
  //   ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  //   return newImageData;
  // }

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  // getUniformLocations(
  //   gl: WebGLRenderingContext,
  //   program: WebGLProgram
  // ): TWebGLUniformLocationMap {
  //   return {
  //     delta: gl.getUniformLocation(program, 'uDelta'),
  //   };
  // }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  // sendUniformData(
  //   gl: WebGLRenderingContext,
  //   uniformLocations: TWebGLUniformLocationMap
  // ) {
  //   const delta = this.chooseRightDelta();
  //   gl.uniform2fv(uniformLocations.delta, delta);
  // }

  /**
   * choose right value of image percentage to blur with
   * @returns {Array} a numeric array with delta values
   */
  // chooseRightDelta() {
  //   let blurScale = 1;
  //   const delta = [0, 0];
  //   if (this.horizontal) {
  //     if (this.aspectRatio > 1) {
  //       // image is wide, i want to shrink radius horizontal
  //       blurScale = 1 / this.aspectRatio;
  //     }
  //   } else {
  //     if (this.aspectRatio < 1) {
  //       // image is tall, i want to shrink radius vertical
  //       blurScale = this.aspectRatio;
  //     }
  //   }
  //   const blur = blurScale * this.blur * 0.12;
  //   if (this.horizontal) {
  //     delta[0] = blur;
  //   } else {
  //     delta[1] = blur;
  //   }
  //   return delta;
  // }
// }

classRegistry.setClass(Mask, 'Mask');