import Chunk from "@/types/Chunk";
import StorageSubstore from "./StorageSubstore";
import { RawTask } from "./TasksSubstore";
import { Store } from "../index.vuex";
import StorageStore from "./StorageStore";

export type RawChunk = {
  date: string;
  number: number;
  duration: number;
  task: RawTask;
};

export default class CompletedSubstore extends StorageSubstore<
  Chunk[],
  RawChunk[]
> {
  constructor(store: Store, storage: StorageStore) {
    super(store, storage, "completed");
  }

  _mutator = (value: RawChunk[]): Chunk[] => {
    return value.map((chunk: RawChunk) => {
      return new Chunk(
        this.storage.tasks._mutator([chunk.task])[0],
        chunk.duration,
        new Date(chunk.date),
        chunk.number
      );
    });
  };
}
