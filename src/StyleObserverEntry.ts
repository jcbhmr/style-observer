export const StyleObserverEntryKey = Symbol("StyleObserverEntryKey")
export default class StyleObserverEntry {
    static {
        Object.defineProperty(StyleObserverEntry, "name", { value: "StyleObserverEntry", configurable: true })
        Object.defineProperty(StyleObserverEntry.prototype, Symbol.toStringTag, { value: "StyleObserverEntry", configurable: true })
    }

    #target: HTMLElement
    constructor(k: typeof StyleObserverEntryKey = undefined!, options: { target: HTMLElement } = undefined!) {
        if (k !== StyleObserverEntryKey) throw new TypeError("Illegal constructor")
        this.#target = options.target
    }

    get target() { return this.#target }
}