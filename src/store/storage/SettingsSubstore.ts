import Settings from "@/types/Settings";
import { Store } from "../index.vuex";
import StorageStore from "./StorageStore";
import StorageSubstore from "./StorageSubstore";

type RawSettings = ConstructorParameters<typeof Settings>[0];

export default class SettingsSubstore extends StorageSubstore<
  Settings,
  RawSettings
> {
  constructor(store: Store, storage: StorageStore) {
    super(store, storage, "settings");
  }

  _mutator = (value: RawSettings) => new Settings(value);
}
