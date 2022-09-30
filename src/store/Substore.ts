import { Store } from "./index.vuex";

export default class Substore {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }
}
