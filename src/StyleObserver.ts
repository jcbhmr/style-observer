import CSSStyleDeclarationPrototypeHashCode from './CSSStyleDeclarationPrototypeHashCode.js';
import StyleObserverEntry from './StyleObserverEntry.js'
import StyleObserverOptions from './StyleObserverOptions.js';
import WeakSet2 from './WeakSet2.js';
import requestReflowCallback, { cancelReflowCallback } from './requestReflowCallback.js';

export type StyleObserverCallback = (changes: StyleObserverEntry[], observer: StyleObserver) => void;
export default class StyleObserver {
  #callback: StyleObserverCallback
  #targets = new WeakSet2<HTMLElement | SVGElement | MathMLElement>()
  // #propertyFilter = new WeakMap<HTMLElement | SVGElement | MathMLElement, string[] | null>()
  // #pseudoElements = new WeakMap<HTMLElement | SVGElement | MathMLElement, string[]>()
  #previousHash = new WeakMap<HTMLElement | SVGElement | MathMLElement, number>()
  #rrId: number;
  #entries: StyleObserverEntry[] = [];
  #mo = new MutationObserver((mutations) => {
    this.#requestReflowCallbackOnce()
  })
  #ro = new ResizeObserver((entries) => {
    this.#requestReflowCallbackOnce()
  })
  constructor(callback: StyleObserverCallback) {
    this.#callback = callback

    globalThis.addEventListener("animationstart", () => {
      this.#requestReflowCallbackOnce()
    })
    globalThis.addEventListener("animationiteration", () => {
      this.#requestReflowCallbackOnce()
    })
    globalThis.addEventListener("animationend", () => {
      this.#requestReflowCallbackOnce()
    })
    globalThis.addEventListener("animationcancel", () => {
      this.#requestReflowCallbackOnce()
    })
    globalThis.addEventListener("resize", () => {
      this.#requestReflowCallbackOnce()
    })
  }

  #requestReflowCallbackOnce() {
    this.#rrId ||= requestReflowCallback(() => {
      this.#rrId = 0
      this.#pushEntries()
      if (this.#entries.length) {
        const entries = this.#entries
        this.#entries = []
        this.#callback(entries, this)
      }
    })
  }

  #pushEntries() {
    for (const target of this.#targets) {
      if (!target.isConnected) continue
      if (target.ownerDocument !== document) continue
      const style = getComputedStyle(target)
      const prev = this.#previousHash.get(target)
      const curr = CSSStyleDeclarationPrototypeHashCode(style)
      if (prev !== curr) {
        this.#entries.push({ target })
      }
      this.#previousHash.set(target, curr)
    }
  }

  disconnect() {
    this.#mo.disconnect()
    this.#ro.disconnect()
    this.#targets.clear()
    this.#previousHash = new WeakMap()
    if (this.#rrId) cancelReflowCallback(this.#rrId)
    this.#entries = []
  }
  observe(target: HTMLElement | SVGElement | MathMLElement, options: StyleObserverOptions = {}) {
    const { propertyFilter = null, pseudoElements = [], subtree = false } = options
    // this.#propertyFilter.set(target, propertyFilter)
    // this.#pseudoElements.set(target, pseudoElements)
    this.#mo.observe(target.ownerDocument, { attributes: true, characterData: true, childList: true, subtree: true })
    this.#ro.observe(target)
    this.#targets.add(target)
    const style = getComputedStyle(target)
    const curr = CSSStyleDeclarationPrototypeHashCode(style)
    this.#previousHash.set(target, curr)
  }
  takeRecords() {
    for (const target of this.#targets) {
      target.ownerDocument.documentElement.offsetHeight
    }
    this.#pushEntries()
    const entries = this.#entries
    this.#entries = []
    return entries
  }
  // unobserve() {}
}
