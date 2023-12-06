import StyleObserverEntry, { StyleObserverEntryKey } from './StyleObserverEntry.js'

const hashCode = (s: string) => [...s].reduce((a, x) => Math.imul(31, a) + x.charCodeAt(0) | 0, 0)
export type StyleObserverCallback = (changes: StyleObserverEntry[]) => void;
export default class StyleObserver {
  #callback: StyleObserverCallback
  #previousHash = new WeakMap<HTMLElement, number>()
  #targets: HTMLElement[] = []
  #id: number;
  #mo = new MutationObserver(m => this.#mutations(m))
  constructor(callback: StyleObserverCallback) {
    this.#callback = callback
  }

  #mutations(mutations: MutationRecord[]) {
    cancelAnimationFrame(this.#id)
    this.#id = requestAnimationFrame(() => {
      const entries: StyleObserverEntry[] = []
      for (const target of this.#targets) {
        let previousHash = this.#previousHash.get(target)
        let currentHash = 0b10101010101010101010101010101010
        const computedStyle = getComputedStyle(target)
        for (let i = 0; i < computedStyle.length; i++) {
          const name = computedStyle[i]
          const value = computedStyle[name]
          currentHash ^= hashCode(name) + hashCode(value)
        }
        if (currentHash !== previousHash) {
          entries.push(new StyleObserverEntry(StyleObserverEntryKey, { target }))
        }
        previousHash = currentHash
        this.#previousHash.set(target, previousHash)
      }
      this.#callback(entries)
    })
  }

  disconnect() {
    this.#mo.disconnect()
  }
  observe(target: HTMLElement) {
    const rootNode = target.getRootNode()
    this.#mo.observe(rootNode)
    if (target.ownerDocument !== rootNode) {
      this.#mo.observe(target.ownerDocument)
    }
  }
  // takeRecords() {}
  // unobserve() {}
}





