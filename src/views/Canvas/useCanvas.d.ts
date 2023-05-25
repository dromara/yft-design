import { Canvas } from 'fabric';
export declare const initWorks: () => void;
export declare const initBackground: () => Promise<void>;
declare const initEditor: () => void;
export declare const toggleSelection: (selection?: boolean) => void;
declare const _default: () => [Canvas, typeof initEditor];
export default _default;
