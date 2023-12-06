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
            change(this)
        },
        removeProperty(property: string) {
            const r = CSSStyleDeclarationPrototypeRemovePropertyUnbound.call(this, property)
            change(this)
            return r
        },
        set cssText(cssText: string) {
            CSSStyleDeclarationPrototypeSetCSSTextUnbound.call(this, cssText)
            change(this)
        },
        set cssFloat(cssFloat: string) {
            CSSStyleDeclarationPrototypeSetCSSFloatUnbound.call(this, cssFloat)
            change(this)
        }
    }
}
export default CSSStyleDeclaration
const changeCallbacks = new Set<(x: CSSStyleDeclaration) => any>()
function change(x: CSSStyleDeclaration) {
    for (const change of changeCallbacks) {
        change(x)
    }
}
export const onChange = (f: (x: CSSStyleDeclaration) => any) => { changeCallbacks.add(f) }
export const offChange = (f: (x: CSSStyleDeclaration) => any) => { changeCallbacks.delete(f) }