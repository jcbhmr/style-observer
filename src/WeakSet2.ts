export default class WeakSet2<T extends object> {
    #set = new Set<WeakRef<T>>();
    #ref = new WeakMap<T, WeakRef<T>>();
    constructor(iterable: Iterable<T> = []) {
      for (const value of iterable) {
        this.#set.add(this.#refFor(value));
      }
    }
    #clean() {
      for (const ref of this.#set) {
        const value = ref.deref();
        if (value === undefined) {
          this.#set.delete(ref);
        }
      }
    }
    #refFor(value: T) {
      let ref = this.#ref.get(value);
      if (ref === undefined) {
        ref = new WeakRef(value);
        this.#ref.set(value, ref);
      }
      return ref;
    }
    get size() {
      this.#clean();
      return this.#set.size;
    }
    has(value: T) {
      return this.#set.has(this.#refFor(value));
    }
    add(value: T) {
      this.#set.add(this.#refFor(value));
      return this;
    }
    clear() {
      this.#set.clear();
    }
    delete(value: T) {
      return this.#set.delete(this.#refFor(value));
    }
    forEach<U>(
      f: (this: U, value: T, key: T, set: this) => void,
      that: U = this as any
    ) {
      this.#clean();
      this.#set.forEach((value, key) =>
        f.call(that, value.deref()!, key.deref()!, this)
      );
    }
    *[Symbol.iterator]() {
      this.#clean();
      for (const ref of this.#set) {
        yield ref.deref()!;
      }
    }
    *keys() {
      this.#clean();
      for (const ref of this.#set.keys()) {
        yield ref.deref()!;
      }
    }
    *values() {
      this.#clean();
      for (const ref of this.#set.values()) {
        yield ref.deref()!;
      }
    }
    *entries() {
      this.#clean();
      for (const ref of this.#set) {
        const value = ref.deref()!;
        yield [value, value];
      }
    }
  }