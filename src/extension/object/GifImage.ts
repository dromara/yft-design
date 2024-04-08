import { Image, ImageSource, classRegistry, util, Object as FabricObject, ImageProps } from 'fabric';
import 'gifler';

export class GifImage extends Image {
	static type = 'GifImage'
	public gifCanvas: HTMLCanvasElement | undefined = undefined
	public gifler = undefined
	public isStarted: boolean = false

  constructor(element: ImageSource, options?: FabricObject<ImageProps>) {
    super(element, options)
    this.gifCanvas = document.createElement('canvas');
  }

	drawFrame(ctx: CanvasRenderingContext2D, frame: any) {
    if (!this.gifCanvas) return
		this.gifCanvas.width = frame.width
		this.gifCanvas.height = frame.height
		ctx.drawImage(frame.buffer, 0, 0)
		this.setSrc(this.gifCanvas.toDataURL())
		this.canvas?.renderAll();
	}

	_render(ctx: CanvasRenderingContext2D) {
		super._render(ctx);
		this.dirty = true;
		if (!this.isStarted) {
			this.isStarted = true;
			this.gifler = window.gifler(this.getSrc()).frames(this.gifCanvas, (context: CanvasRenderingContext2D, frame: any) => {
				
        this.isStarted = true;
        this.drawFrame(context, frame);
      });
		}
	}

	static fromURL(url: string, options: any = {}): Promise<Image> {
    return util.loadImage(url, options).then((img) => new this(img, options));
  }
}

classRegistry.setClass(GifImage)
