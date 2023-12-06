import StyleObserverEntry, { StyleObserverEntryKey } from './StyleObserverEntry.js'

let sheetedit: () => void;
const hashCode = (s: string) => [...s].reduce((a, x) => Math.imul(31, a) + x.charCodeAt(0) | 0, 0)
export type StyleObserverCallback = (changes: StyleObserverEntry[]) => void;
export default class StyleObserver {
  static #instances = new Set<WeakRef<StyleObserver>>()
  static {
    Object.defineProperty(StyleObserverEntry, "name", { value: "StyleObserver", configurable: true })
    Object.defineProperty(StyleObserverEntry.prototype, Symbol.toStringTag, { value: "StyleObserver", configurable: true })
    sheetedit = () => {
      for (const instance of this.#instances) {
        if (instance.deref()) {
          instance.deref().#sheetedit()          
        } else {
          this.#instances.delete(instance)
        }
      }
    }
  }

  #callback: StyleObserverCallback
  #previousHash = new WeakMap<HTMLElement, number>()
  #targets = new Set<HTMLElement>()
  #id: number;
  #mo = new MutationObserver(m => this.#mutations(m))
  constructor(callback: StyleObserverCallback) {
    this.#callback = callback
  }

  #mutations(mutations: MutationRecord[]) {
    cancelAnimationFrame(this.#id)
    this.#id = requestAnimationFrame(() => this.#renderpaint())
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

  #sheetedit() {
    cancelAnimationFrame(this.#id)
    this.#id = requestAnimationFrame(() => this.#renderpaint())
  }

  disconnect() {
    this.#mo.disconnect()
    this.#targets.clear()
  }
  observe(target: HTMLElement) {
    this.#targets.add(target)
    this.#mo.observe(target, { childList: true, characterData: true, attributes: true, subtree: true })
    this.#mo.observe(target.getRootNode(), { childList: true, characterData: true, attributes: true, subtree: true })
    if (target.getRootNode() !== target.ownerDocument) {
      this.#mo.observe(target.ownerDocument, { childList: true, characterData: true, attributes: true, subtree: true })
    }
  }
  // takeRecords() {}
  // unobserve() {}
}





