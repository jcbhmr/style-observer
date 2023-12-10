import StringPrototypeHashCode from "./StringPrototypeHashCode.js"

export default function CSSStyleDeclarationPrototypeHashCode(that: CSSStyleDeclaration) {
    let hash = 0b10101010101010101010101010101010
    for (let i = 0; i < that.length; i++) {
      const name = that[i]
      const value = that[name]
      hash ^= StringPrototypeHashCode(name) + StringPrototypeHashCode(value)
    }
    return hash
}