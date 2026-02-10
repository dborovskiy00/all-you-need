import { isBrowser } from "./isBrowser";
import { isNode } from "./isNode";

export function isSSR(): boolean {
  return isNode() && !isBrowser();
}
