import { Store } from "../index.vuex";
import StorageStore from "./StorageStore";
import StorageSubstore from "./StorageSubstore";

export default class IDSubstore extends StorageSubstore<number, number> {
  constructor(store: Store, storage: StorageStore) {
    super(store, storage, "id");
  }
}
