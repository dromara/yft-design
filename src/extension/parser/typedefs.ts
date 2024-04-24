import type { FabricObject } from 'fabric/src/shapes/Object/FabricObject';

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
