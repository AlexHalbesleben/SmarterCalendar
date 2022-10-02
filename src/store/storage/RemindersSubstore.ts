import UserReminder from "@/types/Reminder";
import { Store } from "../index.vuex";
import StorageStore from "./StorageStore";
import StorageSubstore from "./StorageSubstore";

export type RawReminder = {
  date: string;
  description: string;
  name: string;
};

export default class RemindersSubstore extends StorageSubstore<
  UserReminder[],
  RawReminder[]
> {
  constructor(store: Store, storage: StorageStore) {
    super(store, storage, "reminders");
  }

  _mutator = (value: RawReminder[]) => {
    return value.map((reminder) => {
      return new UserReminder({
        name: reminder.name,
        description: reminder.description,
        date: new Date(reminder.date),
      });
    });
  };
}
