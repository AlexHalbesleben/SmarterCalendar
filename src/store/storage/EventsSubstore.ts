import UserEvent from "@/types/Event";
import { Store } from "../index.vuex";
import StorageStore from "./StorageStore";
import StorageSubstore from "./StorageSubstore";

export type RawEvent = ConstructorParameters<typeof UserEvent>[0];

export default class EventsSubstore extends StorageSubstore<
  UserEvent[],
  RawEvent[]
> {
  constructor(store: Store, storage: StorageStore) {
    super(store, storage, "events");
  }

  _mutator = (value: RawEvent[]): UserEvent[] => {
    return value.map((event) => {
      return new UserEvent({
        name: event.name,
        description: event.description,
        date: event.date ? new Date(event.date) : undefined,
        duration: event.duration,
      });
    });
  };
}
