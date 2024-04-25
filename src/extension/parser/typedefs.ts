import type { Object as FabricObject } from 'fabric';

export type SVGParsingOutput = {
  objects: (FabricObject | null)[];
  options: Record<string, any>;
  elements: Element[];
  allElements: Element[];
};

export type TSvgReviverCallback = (
  element: Element,
  fabricObject: FabricObject
) => void;

export type CSSRules = Record<string, Record<string, string>>;
