import { Store } from "@/store/index.vuex";

export default class IDUtils {
  static store: Store | undefined = undefined;

  static get lastID(): number {
    if (!this.store) {
      return -1;
    }

    try {
      return this.store.storage.id.value;
    } catch {
      this.store.storage.id.value = 0;
      return -1;
    }
  }

  static nextID(): number {
    if (!this.store) {
      return -1;
    }
    const id = this.lastID + 1;
    this.store.storage.id.value = id;
    return id;
  }
}
