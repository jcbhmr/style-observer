const bus = new EventTarget()
export default bus

let applyListenersOnce = false
export function applyListeners() {
    if (applyListenersOnce) return

    // DOM attribute mutations
    new MutationObserver().observe()

    // CSS animations
    globalThis.addEventListener("animationiteration", (event) => {
        const myEvent = new Event("animationiteration") as Event & { relatedTarget: any }
        myEvent.relatedTarget = event.target;
        bus.dispatchEvent(myEvent);
    })
    applyListenersOnce = true
}
