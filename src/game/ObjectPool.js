export class ObjectPool {
  constructor(factory, disposeItem) {
    this.factory = factory;
    this.disposeItem = disposeItem;
    this.free = [];
    this.active = new Set();
  }

  acquire() {
    const item = this.free.pop() || this.factory();
    this.active.add(item);
    return item;
  }

  release(item) {
    if (!this.active.delete(item)) return;
    if (this.disposeItem) this.disposeItem(item);
    this.free.push(item);
  }

  releaseAll() {
    for (const item of [...this.active]) this.release(item);
  }

  get activeCount() {
    return this.active.size;
  }

  dispose() {
    this.releaseAll();
    for (const item of this.free) {
      if (this.disposeItem) this.disposeItem(item);
    }
    this.free.length = 0;
  }
}
