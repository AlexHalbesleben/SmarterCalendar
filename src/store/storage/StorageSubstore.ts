import { Store } from "../index.vuex";
import Substore from "../Substore";
import StorageStore from "./StorageStore";

export default class StorageSubstore<T, K = T> extends Substore {
  property: string;

  storage: StorageStore;

  constructor(store: Store, storage: StorageStore, property: string) {
    super(store);
    this.property = property;
    this.storage = storage;
  }

  _mutator: (value: K) => T = (value) => value as unknown as T;

  get value(): T {
    if (!localStorage) {
      throw new Error("localStorage is not available");
    }
    if (!localStorage[this.property]) {
      throw new Error("localStorage[" + this.property + "] is not available");
    }

    return this._mutator(JSON.parse(localStorage[this.property]));
  }

  set value(to: T) {
    if (!localStorage) {
      throw new Error("localStorage is not available");
    }

    localStorage[this.property] = JSON.stringify(to);
  }
}
