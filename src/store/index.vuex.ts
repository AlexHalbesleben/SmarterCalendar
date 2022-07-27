import Chunk from "@/types/Chunk";
import Settings from "@/types/Settings";
import DateUtils from "@/util/DateUtils";
import Vue from "vue";
import Vuex from "vuex";
import {
  createModule,
  mutation,
  action,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import UserTask from "../types/Task";

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "store",
  strict: false,
});

export class Store extends VuexModule {
  tasks: UserTask[] = []; // The user's tasks

  editedIndex = -1; // -1 indicates a new task is being created (as opposed to an existing one being edited)

  chunks: Chunk[] = [];

  settings: Settings = new Settings();

  /**
   * Splits the tasks into chunks
   */
  @mutation
  updateChunks() {
    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

    const getTotalTime = (day: Chunk[]) =>
      day.reduce((prev, curr) => prev + curr.duration, 0);
    const getTotalEffort = (day: Chunk[]) =>
      day.reduce((prev, curr) => prev + curr.effort, 0);

    // TODO: Tasks should have a priority and higher-priority tasks are scheduled first
    // For each task
    for (const task of this.tasks) {
      const { chunks, due } = task;
      const daysUntilDue = DateUtils.daysBetween(DateUtils.currentDate, due);
      const chunkDuration = task.duration / task.chunks;
      const chunkEffort = chunkDuration * task.effort;

      // For each chunk
      for (let i = 0; i < chunks; i++) {
        let dayToAssign = 0;

        const dayData: { effort: number; time: number }[] = [];
        for (let i = 0; i <= daysUntilDue + 1; i++) {
          chunksByDay[i] = chunksByDay[i] || [];
          const day = chunksByDay[i];
          dayData.push({
            effort: getTotalEffort(day),
            time: getTotalTime(day),
          });
        }

        /** Each index of this array refers to a date that is index number of days after the current day. The values are the next day's effort and time minus the current day's. */
        const dayDifferences: { effort: number; time: number }[] = [];
        for (let i = 0; i <= daysUntilDue; i++) {
          const currentDay = dayData[i];
          const nextDay = dayData[i + 1];

          dayDifferences.push({
            effort: nextDay.effort - currentDay.effort,
            time: nextDay.time - currentDay.time,
          });
        }

        /** Same format as {@link dayDifferences} but combines the effort and time differences into a single value */
        const combinedDayDifferences: number[] = Object.values(
          dayDifferences
        ).map((day) => day.effort + day.time);

        for (let d = 0; d <= daysUntilDue; d++) {
          if (
            combinedDayDifferences[d] >= combinedDayDifferences[dayToAssign]
          ) {
            dayToAssign = d;
          }
        }

        // Avoids errors (if there are no tasks/chunks)
        chunksByDay[dayToAssign] = chunksByDay[dayToAssign] ?? [];

        // Create the chunk and add it to the list
        chunksByDay[dayToAssign].push(
          new Chunk(
            task,
            chunkDuration,
            DateUtils.applyDayOffset(dayToAssign, DateUtils.currentDate)
          )
        );
      }
    }

    // Get the values of the chunksByDay object (a nested array of Chunks) and flatten
    this.chunks = (Object.values(chunksByDay) as Chunk[][]).flat(1);
  }

  @action
  async uploadTasks() {
    localStorage["tasks"] = JSON.stringify(this.tasks);
  }

  @action
  async uploadSettings() {
    localStorage["settings"] = JSON.stringify(this.settings);
  }

  constructor() {
    super();

    if (localStorage["tasks"]) {
      this.tasks = JSON.parse(localStorage["tasks"]).map((task: UserTask) => {
        return {
          ...task,
          due: new Date(task.due),
        };
      });

      this.updateChunks();
    }

    if (localStorage["settings"]) {
      const settings: {
        maxPreferredDailyTime: string | number;
        maxPreferredDayTimeDiff: string | number;
      } = JSON.parse(localStorage["settings"]);

      this.settings.maxPreferredDailyTime = parseInt(
        settings.maxPreferredDailyTime.toString()
      );
      this.settings.maxPreferredTimeDiff = parseInt(
        settings.maxPreferredDayTimeDiff.toString()
      );
    }
  }
}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(Store),
  },
});

// Creating proxies.
const vxm = {
  store: createProxy(store, Store),
};

export default vxm;
