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
            StylePropertyMapCallbacks.map(f => f(this))
        },
        clear() {
            StylePropertyMapPrototypeClearUnbound.call(this)
            StylePropertyMapCallbacks.map(f => f(this))
        },
        delete(property: string) {
            StylePropertyMapPrototypeDeleteUnbound.call(this, property)
            StylePropertyMapCallbacks.map(f => f(this))
        },
        set(property: string, ...values: (string | CSSStyleValue)[]) {
            StylePropertyMapPrototypeSetUnbound.call(this, property, ...values)
            StylePropertyMapCallbacks.map(f => f(this))
        },
    }
}
export default StylePropertyMap
export const StylePropertyMapCallbacks: ((x: StylePropertyMap) => any)[] = []