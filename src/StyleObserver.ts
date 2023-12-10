import StyleObserverEntry from './StyleObserverEntry.js'
import StyleObserverOptions from './StyleObserverOptions.js';
import WeakSet2 from './WeakSet2.js';

export type StyleObserverCallback = (changes: StyleObserverEntry[]) => void;
export default class StyleObserver {
  #callback: StyleObserverCallback
  #targets = new WeakSet2<HTMLElement>()
  #propertyFilter = new WeakMap<HTMLElement, string[] | null>()
  #propertyOldValue = new WeakMap<HTMLElement, boolean>()
  #previousHash = new WeakMap<HTMLElement, number>()
  #id: number;
  #sheets = new WeakSet2<CSSStyleSheet>()
  #do = new MutationObserver(mutations => {
    cancelAnimationFrame(this.#id)
    this.#id = requestAnimationFrame(() => this.#renderpaint())
  })
  #sso = new MutationObserver(mutations => {
    const entries = mutations.flatMap(mutation => {
      if (!mutation.target.isConnected) {
        return []
      }
      let target: HTMLLinkElement | HTMLStyleElement
      let addedSheet: CSSStyleSheet;
      let removedSheet: CSSStyleSheet;
      for (const n of mutation.addedNodes) {
        if ((n as any).sheet) {
          addedSheet = (n as HTMLStyleElement | HTMLLinkElement).sheet
        }
      }
      for (const n of mutation.removedNodes) {
        
      }
    })
  })
  constructor(callback: StyleObserverCallback) {
    this.#callback = callback
  }

  #renderpaint() {
    const entries: StyleObserverEntry[] = []
    for (const target of this.#targets) {
      let currentHash = 0b10101010101010101010101010101010
      const computedStyle = getComputedStyle(target)
      for (let i = 0; i < computedStyle.length; i++) {
        const name = computedStyle[i]
        const value = computedStyle[name]
        currentHash ^= hashCode(name) + hashCode(value)
      }
      if (currentHash !== this.#previousHash.get(target)) {
        entries.push(new StyleObserverEntry(StyleObserverEntryKey, { target }))
      }
      this.#previousHash.set(target, currentHash)
    }
    if (entries.length) {
      this.#callback(entries)
    }
  }

  disconnect() {
    this.#ao.disconnect()
    this.#targets.clear()
  }
  observe(target: HTMLElement, options: StyleObserverOptions = {}) {
    const { propertyFilter = null, propertyOldValue = false } = options
    this.#do.observe(target.ownerDocument, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    if (target.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    this.#sro.observe()
  }
  // takeRecords() {}
  // unobserve() {}
}
