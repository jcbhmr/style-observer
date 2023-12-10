import setImmediate, { clearImmediate } from "./setImmediate.js"

let nextId = 1
let rafId: Map<number, number>
let siId: Map<number, number>
export default function requestReflowCallback(cb: () => any) {
    rafId ??= new Map<number, number>()
    siId ??= new Map<number, number>()
    const id = nextId
    nextId++
    rafId.set(id, requestAnimationFrame(() => {
        rafId.delete(id)
        siId.set(id, setImmediate(() => {
            siId.delete(id)
            cb()
        })) 
    }))
    return id
}
export function cancelReflowCallback(id: number) {
    cancelAnimationFrame(rafId.get(id))
    rafId.delete(id)
    clearImmediate(siId.get(id))
    siId.delete(id)
}