import { DEFAULT_SVG_FONT_SIZE } from '../constants';
import { parseUnit } from '../util/misc/svgParsing';
import { cPath, fSize, mask, svgValidParentsRegEx } from './constants';
import { getGlobalStylesForElement } from './getGlobalStylesForElement';
import { normalizeAttr } from './normalizeAttr';
import { normalizeValue } from './normalizeValue';
import { parseFontDeclaration } from './parseFontDeclaration';
import { parseStyleAttribute } from './parseStyleAttribute';
import { setStrokeFillOpacity } from './setStrokeFillOpacity';
import type { CSSRules } from './typedefs';

/**
 * Returns an object of attributes' name/value, given element and an array of attribute names;
 * Parses parent "g" nodes recursively upwards.
 * @param {SVGElement | HTMLElement} element Element to parse
 * @param {Array} attributes Array of attributes to parse
 * @return {Object} object containing parsed attributes' names/values
 */
export function parseAttributes(
  element: HTMLElement | null,
  attributes: string[],
  cssRules?: CSSRules
): Record<string, any> {
  if (!element) {
    return {};
  }

  let parentAttributes: Record<string, string> = {},
    tspanAttributes: Record<string, string> = {},
    fontSize: number,
    parentFontSize = DEFAULT_SVG_FONT_SIZE;

  // if there's a parent container (`g` or `a` or `symbol` node), parse its attributes recursively upwards
  if (element.parentNode && svgValidParentsRegEx.test(element.parentNode.nodeName)) {
    parentAttributes = parseAttributes(element.parentElement, attributes, cssRules);
    if (parentAttributes.fontSize) {
      fontSize = parentFontSize = parseUnit(parentAttributes.fontSize);
    }
  }

  if (element.tagName.toLowerCase().replace('svg:', '') === 'text' && element.childNodes) {
    element.childNodes.forEach(sonElement => {
      tspanAttributes = parseTspanAttributes(sonElement as any, attributes, cssRules);
    })
  }

  const ownAttributes: Record<string, string> = {
    ...attributes.reduce<Record<string, string>>((memo, attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        memo[attr] = value;
      }
      return memo;
    }, {}),
    // add values parsed from style, which take precedence over attributes
    // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
    ...getGlobalStylesForElement(element, cssRules),
    ...parseStyleAttribute(element),
  };

  if (ownAttributes[mask]) {
    element.setAttribute(mask, ownAttributes[mask]);
  }

  if (ownAttributes[cPath]) {
    element.setAttribute(cPath, ownAttributes[cPath]);
  }
  if (ownAttributes[fSize]) {
    // looks like the minimum should be 9px when dealing with ems. this is what looks like in browsers.
    fontSize = parseUnit(ownAttributes[fSize], parentFontSize);
    ownAttributes[fSize] = `${fontSize}`;
  }

  // this should have its own complex type
  const normalizedStyle: Record<
    string,
    string | boolean | number | number[] | null
  > = {};
  for (const attr in ownAttributes) {
    const normalizedAttr = normalizeAttr(attr);
    const normalizedValue = normalizeValue(
      normalizedAttr,
      ownAttributes[attr],
      parentAttributes,
      fontSize!
    );
    normalizedStyle[normalizedAttr] = normalizedValue;
  }
  if (normalizedStyle && normalizedStyle.font) {
    parseFontDeclaration(normalizedStyle.font as string, normalizedStyle);
  }
  const mergedAttrs = { ...parentAttributes, ...normalizedStyle, ...tspanAttributes };

  return svgValidParentsRegEx.test(element.nodeName)
    ? mergedAttrs
    : setStrokeFillOpacity(mergedAttrs);
}


const parseTspanAttributes = (element: HTMLElement | null, attributes: string[], cssRules?: CSSRules) => {
  if (!element) return {}
  const ownAttributes: Record<string, string> = {
    ...attributes.reduce<Record<string, string>>((memo, attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        memo[attr] = value;
      }
      return memo;
    }, {}),
    // add values parsed from style, which take precedence over attributes
    // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
    ...getGlobalStylesForElement(element, cssRules),
    ...parseStyleAttribute(element),
  };
  if (ownAttributes['x']) {
    const leftValue = normalizeValue('left', ownAttributes['x'], {}, undefined!);
    ownAttributes['dx'] = leftValue as any
    delete ownAttributes['x']
  }
  if (ownAttributes['y']) {
    const topValue = normalizeValue('top', ownAttributes['y'], {}, undefined!);
    ownAttributes['dy'] = topValue as any
    delete ownAttributes['y']
  }
  return ownAttributes
}