function ObjectGetPropertyDescriptor(object: object, p: string): PropertyDescriptor | undefined {
    for (let o = object; o; o = Object.getPrototypeOf(o)) {
        const d = Object.getOwnPropertyDescriptor(o, p)
        if (d) return d
    }
}
const uncurryThis = Object.bind.bind(Object.call);

function wrapCSSRuleList(that: CSSRuleList, cb: (type: string) => any): CSSRuleList {
    return new Proxy(that, {
        get(target, p, receiver) {
            return Reflect.get(target, p)
        },
        set(target, p, newValue, receiver) {
            const r = Reflect.set(target, p, newValue)
            cb("CSSRuleList:set")
            return r
        },
    })
}
export default function upgradeCSSStyleSheet(that: CSSStyleSheet, cb: (type: string) => any) {
    let cssRulesProxy: CSSRuleList
    Object.defineProperty(that, "cssRules", {
        get() {
            if (!cssRulesProxy) {
                const cssRules = Reflect.get(CSSStyleSheet.prototype, "cssRules", this)
                cssRulesProxy = wrapCSSRuleList(cssRules, cb)
            }
            return cssRulesProxy
        },
        enumerable: true,
        configurable: true,
    })

    let 

    const deleteRule = uncurryThis(that.deleteRule)
    const getDisabled = uncurryThis(that.disabled)
}