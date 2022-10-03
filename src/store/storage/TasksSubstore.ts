import UserTask from "@/types/Task";
import { Store } from "../index.vuex";
import StorageStore from "./StorageStore";
import StorageSubstore from "./StorageSubstore";

export type RawChunk = {
  number: number;
  date: string;
};

export type RawTask = ConstructorParameters<typeof UserTask>[0];

export default class TasksSubstore extends StorageSubstore<
  UserTask[],
  RawTask[]
> {
  constructor(store: Store, storage: StorageStore) {
    super(store, storage, "tasks");
  }

  _mutator = (value: RawTask[]): UserTask[] => {
    return value.map((task: RawTask) => {
      return new UserTask({
        name: task.name,
        description: task.description,
        duration: task.duration,
        effort: task.effort,
        due: task.due ? new Date(task.due) : undefined,
        startDate: task.startDate ? new Date(task.startDate) : null,
        chunks: task.chunks,
        backloaded: task.backloaded,
        id: task.id ?? -1,
        lockedChunks: task.lockedChunks?.map((lockedChunk) => {
          return {
            date: new Date(lockedChunk.date),
            number: lockedChunk.number,
          };
        }),
      });
    });
  };
}
