// TODO: Use more efficient shim
export default function setImmediate(cb: () => any) {
    return setTimeout(cb, 0)
}
export function clearImmediate(id: number) {
    clearTimeout(id)
}