const StringPrototypeHashCode = (s: string) => [...s].reduce((a, x) => Math.imul(31, a) + x.charCodeAt(0) | 0, 0)
export default StringPrototypeHashCode