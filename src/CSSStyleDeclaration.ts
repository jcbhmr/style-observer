const CSSStyleDeclarationPrototypeSetPropertyUnbound = globalThis.CSSStyleDeclaration.prototype.setProperty
const CSSStyleDeclarationPrototypeRemovePropertyUnbound = globalThis.CSSStyleDeclaration.prototype.removeProperty
const CSSStyleDeclarationPrototypeSetCSSTextUnbound = Object.getOwnPropertyDescriptor(globalThis.CSSStyleDeclaration.prototype, "cssText").set as (v: CSSStyleDeclaration['cssText']) => void
const CSSStyleDeclarationPrototypeSetCSSFloatUnbound = Object.getOwnPropertyDescriptor(globalThis.CSSStyleDeclaration.prototype, "cssFloat").set as (v: CSSStyleDeclaration['cssFloat']) => void
const CSSStyleDeclaration = {
    __proto__: null,
    prototype: {
        __proto__: null,
        setProperty(property: string, value: string, priority: string | undefined = undefined) {
            CSSStyleDeclarationPrototypeSetPropertyUnbound.call(this, property, value, priority)
            CSSStyleDeclarationCallbacks.map(f => f(this))
        },
        removeProperty(property: string) {
            const r = CSSStyleDeclarationPrototypeRemovePropertyUnbound.call(this, property)
            CSSStyleDeclarationCallbacks.map(f => f(this))
            return r
        },
        set cssText(cssText: string) {
            CSSStyleDeclarationPrototypeSetCSSTextUnbound.call(this, cssText)
            CSSStyleDeclarationCallbacks.map(f => f(this))
        },
        set cssFloat(cssFloat: string) {
            CSSStyleDeclarationPrototypeSetCSSFloatUnbound.call(this, cssFloat)
            CSSStyleDeclarationCallbacks.map(f => f(this))
        }
    }
}
export default CSSStyleDeclaration
export const CSSStyleDeclarationCallbacks: ((x: CSSStyleDeclaration) => any)[] = []