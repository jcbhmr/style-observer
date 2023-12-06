const StylePropertyMapPrototypeAppendUnbound = globalThis.StylePropertyMap.prototype.append;
const StylePropertyMapPrototypeClearUnbound = globalThis.StylePropertyMap.prototype.clear
const StylePropertyMapPrototypeDeleteUnbound = globalThis.StylePropertyMap.prototype.delete
const StylePropertyMapPrototypeSetUnbound = globalThis.StylePropertyMap.prototype.set
const StylePropertyMap = {
    __proto__: null,
    prototype: {
        __proto__: null,
        append(property: string, ...values: (string | CSSStyleValue)[]) {
            StylePropertyMapPrototypeAppendUnbound.call(this, property, ...values)
            change?.(this)
        },
        clear() {
            StylePropertyMapPrototypeClearUnbound.call(this)
            change?.(this)
        },
        delete(property: string) {
            StylePropertyMapPrototypeDeleteUnbound.call(this, property)
            change?.(this)
        },
        set(property: string, ...values: (string | CSSStyleValue)[]) {
            StylePropertyMapPrototypeSetUnbound.call(this, property, ...values)
            change?.(this)
        },
    }
}
export default StylePropertyMap
const changeCallbacks = new Set<(x: StylePropertyMap) => any>()
function change(x: StylePropertyMap) {
    for (const change of changeCallbacks) {
        change(x)
    }
}
export const onChange = (f: (x: StylePropertyMap) => any) => { changeCallbacks.add(f) }
export const offChange = (f: (x: StylePropertyMap) => any) => { changeCallbacks.delete(f) }