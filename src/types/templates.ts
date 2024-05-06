import type { CSSProperties } from "vue";

export interface IVirtualWaterFallProps {
  gap: number;
  column: number;
  pageSize: number;
  enterSize?: number;
  request: (page: number, pageSize: number) => Promise<ICardItem[]>;
}

export interface ICardItem {
  id: number | string;
  width: number;
  height: number;
  [key: string]: any;
}

export interface IColumnQueue {
  list: IRenderItem[];
  height: number;
}

// 渲染视图项
export interface IRenderItem {
  item: ICardItem;
  y: number;
  h: number;
  style: CSSProperties;
}

export interface IItemRect {
  width: number;
  height: number;
}

export interface IBookColumnQueue {
  list: IBookRenderItem[];
  height: number;
}

export interface IBookRenderItem {
  item: ICardItem;
  y: number;
  h: number;
  imageHeight: number;
  style: CSSProperties;
}

export interface IBookItemRect {
  width: number;
  height: number;
  imageHeight: number;
}

export interface DataState {
  loading: boolean
  isFinish: boolean
  currentPage: number
  list: ICardItem[]
}

export interface ScrollState {
  viewWidth: number
  viewHeight: number
  start: number
}

export interface QueueState {
  queue: Array<any>
  len: number
}