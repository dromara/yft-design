declare '@/plugins/trianglify/trianglify'

declare module 'beautify-qrcode' {
  interface CodeOption {
    text: string;
    correctLevel: number; // 1 | 0 | 3 | 2
    width: number;
    height: number;
    isSpace: boolean;
  }
  export const encodeData: (option: CodeOption) => string
  export const renderer25D: (string) => any
  export const rendererRect: (string) => any
  export const rendererRound: (string) => any
  export const rendererRandRound: (string) => any
  export const rendererDSJ: (string) => any
  export const rendererRandRect: (string) => any
  export const rendererImage: (string) => any
  export const rendererResImag: (string) => any
  export const rendererCircle: (string) => any
  export const rendererLine: (string) => any
  export const rendererLine2: (string) => any
  export const rendererFuncA: (string) => any
  export const rendererFuncB: (string) => any
}

