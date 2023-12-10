import StringPrototypeHashCode from "./StringPrototypeHashCode.js"

export default function StylePropertyMapReadOnlyPrototypeHashCode(that: StylePropertyMapReadOnly) {
    let hash = 0b10101010101010101010101010101010
    for (const [name, value] of that) {
      hash ^= StringPrototypeHashCode(name) + StringPrototypeHashCode(value.toString())
    }
    return hash
}