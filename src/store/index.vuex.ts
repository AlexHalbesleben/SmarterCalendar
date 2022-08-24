import Chunk from "@/types/Chunk";
import UserEvent from "@/types/Event";
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

  completedTasks: UserTask[] = [];
  completedChunks: Chunk[] = [];

  events: UserEvent[] = [];

  editedIndex = -1; // -1 indicates a new task is being created (as opposed to an existing one being edited)

  editedEventIndex = -1;

  dayModalMonth = 0;

  dayModalDay = 0;

  chunks: Chunk[] = [];

  settings: Settings = new Settings({});

  editedChunk: Chunk | undefined = undefined;

  /**
   * Splits the tasks into chunks
   */
  @mutation updateChunks() {
    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

    const getTotalTime = (day: Chunk[]) =>
      day.reduce((prev, curr) => prev + curr.duration, 0);
    const getTotalEffort = (day: Chunk[]) =>
      day.reduce((prev, curr) => prev + curr.effort, 0);

    for (const task of this.tasks) {
      for (const lockedChunk of task.lockedChunks) {
        const convertedDay = DateUtils.daysBetween(
          DateUtils.currentDate,
          lockedChunk.date
        );
        chunksByDay[convertedDay] = chunksByDay[convertedDay] ?? [];
        const newChunk = new Chunk(
          task,
          task.duration / task.chunks,
          lockedChunk.date,
          lockedChunk.number
        );
        chunksByDay[convertedDay].push(newChunk);
      }
    }

    // For each task, with tasks due earlier scheduled first
    for (const task of this.tasks.sort(
      (a, b) => a.due.getTime() - b.due.getTime()
    )) {
      let { chunks } = task;
      chunks -= task.lockedChunks.length;
      const { due } = task;
      const daysUntilDue = DateUtils.daysBetween(DateUtils.currentDate, due);
      const chunkDuration = task.duration / task.chunks;

      const usedNumbers = task.lockedChunks.map((chunk) => chunk.number);

      // For each chunk
      for (let i = 0; i < chunks; i++) {
        /** The effort and time of each day, with the first value (index 0) being the current date */
        const dayData: { effort: number; time: number }[] = [];
        for (let i = 0; i <= daysUntilDue + 1; i++) {
          chunksByDay[i] = chunksByDay[i] || [];
          const day = chunksByDay[i];
          dayData.push({
            effort: getTotalEffort(day),
            time: getTotalTime(day),
          });
        }

        /** Each index of this array refers to a date that is index number of days after the current day. The values are the current day's effort and time minus the next day's. */
        const dayDifferences: { effort: number; time: number }[] = [];
        for (let i = 0; i <= daysUntilDue; i++) {
          const currentDay = dayData[i];
          const nextDay = dayData[i + 1];

          // Don't consider this if this is the due date and the next day has no tasks
          const dontCountDiff =
            nextDay.effort <= 0 && nextDay.time <= 0 && i === daysUntilDue;

          dayDifferences.push({
            effort: !dontCountDiff
              ? Math.max(0, currentDay.effort - nextDay.effort)
              : 0,
            time: !dontCountDiff
              ? Math.max(0, currentDay.time - nextDay.time)
              : 0,
          });
        }

        const eventTimeOnDay = (d: number) => {
          const trueDate = DateUtils.applyDayOffset(d, DateUtils.currentDate);
          const events = this.events.filter(
            (event: UserEvent) =>
              DateUtils.daysBetween(trueDate, event.date) === 0 &&
              DateUtils.daysBetween(event.date, trueDate) === 0
          );
          return events.reduce((prev, curr) => prev + curr.duration, 0);
        };

        const completedTimeOnDay = (d: number) => {
          const trueDate = DateUtils.applyDayOffset(d, DateUtils.currentDate);
          const chunks = this.completedChunks.filter(
            (chunk: Chunk) =>
              DateUtils.daysBetween(trueDate, chunk.date) === 0 &&
              DateUtils.daysBetween(chunk.date, trueDate) === 0
          );
          if (!this.settings.considerCompletedChunksOnAllDays && d !== 0)
            return 0;
          return chunks.reduce((prev, curr) => prev + curr.duration, 0);
        };

        const completedEffortOnDay = (d: number) => {
          const trueDate = DateUtils.applyDayOffset(d, DateUtils.currentDate);
          const chunks = this.completedChunks.filter(
            (chunk: Chunk) =>
              DateUtils.daysBetween(trueDate, chunk.date) === 0 &&
              DateUtils.daysBetween(chunk.date, trueDate) === 0
          );
          if (!this.settings.considerCompletedChunksOnAllDays && d !== 0)
            return 0;
          return chunks.reduce((prev, curr) => prev + curr.effort, 0);
        };

        /** Same format as {@link dayDifferences} but combines the effort and time differences into a single value */
        const combinedDayDifferences: number[] = Object.values(
          dayDifferences
        ).map(
          (day, d) =>
            day.effort * this.settings.effortWeight +
            completedEffortOnDay(d) * this.settings.effortWeight +
            day.time +
            completedTimeOnDay(d) +
            (this.settings.timeIncludesEvents ? eventTimeOnDay(d) : 0)
        );

        let dayToAssign = daysUntilDue;

        // Assign to the latest possible day (if none work, will be due date) by default
        for (let d = 0; d <= daysUntilDue; d++) {
          const dayHasTime =
            getTotalTime(chunksByDay[d]) + chunkDuration <=
            this.settings.timeOnDay(
              DateUtils.applyDayOffset(d, DateUtils.currentDate)
            ) -
              eventTimeOnDay(d);

          if (dayHasTime) {
            dayToAssign = d;
          }
        }

        let anyDaysWork = false;

        // Finds the day with that has the lowest effort compared to the next and sets that as the chunk's due date
        for (let d = 0; d <= daysUntilDue; d++) {
          const dayHasTime =
            getTotalTime(chunksByDay[d]) + chunkDuration <=
            this.settings.timeOnDay(
              DateUtils.applyDayOffset(d, DateUtils.currentDate)
            ) -
              eventTimeOnDay(d);

          if (dayHasTime) {
            anyDaysWork = true;
          } else {
            continue; // If the time is greater than what we can spend on this day, try the next one
          }

          if (
            combinedDayDifferences[d] <= combinedDayDifferences[dayToAssign]
          ) {
            dayToAssign = d;
          }
        }

        // If none of the days have enough time, choose the one using the normal algorithm disregarding the time limits
        if (!anyDaysWork) {
          // Finds the day with that has the lowest effort compared to the next and sets that as the chunk's due date
          for (let d = 0; d <= daysUntilDue; d++) {
            if (
              combinedDayDifferences[d] <= combinedDayDifferences[dayToAssign]
            ) {
              dayToAssign = d;
            }
          }
        }

        // Avoids errors (if there are no tasks/chunks)
        chunksByDay[dayToAssign] = chunksByDay[dayToAssign] ?? [];

        let number = 0;
        while (usedNumbers.includes(number)) {
          number++;
        }
        usedNumbers.push(number);

        // Create the chunk and add it to the list
        chunksByDay[dayToAssign].push(
          new Chunk(
            task,
            chunkDuration,
            DateUtils.applyDayOffset(dayToAssign, DateUtils.currentDate),
            number
          )
        );
      }
    }

    // Get the values of the chunksByDay object (a nested array of Chunks) and flatten
    this.chunks = (Object.values(chunksByDay) as Chunk[][]).flat(1);
  }

  @action async uploadTasks() {
    localStorage["tasks"] = JSON.stringify(this.tasks);
  }

  @action async uploadSettings() {
    localStorage["settings"] = JSON.stringify(this.settings);
  }

  @action async uploadEvents() {
    localStorage["events"] = JSON.stringify(this.events);
  }

  @action async uploadCompleted() {
    localStorage["completed"] = JSON.stringify(this.completedChunks);
  }

  constructor() {
    super();

    if (localStorage["tasks"]) {
      this.tasks = JSON.parse(localStorage["tasks"]).map((task: UserTask) => {
        return {
          ...task,
          due: new Date(task.due),
          lockedChunks: task.lockedChunks.map((lockedChunk) => {
            return {
              date: new Date(lockedChunk.date),
              number: lockedChunk.number,
            };
          }),
        };
      });
    }

    if (localStorage["settings"]) {
      this.settings = new Settings(JSON.parse(localStorage["settings"]));
    }

    if (localStorage["events"]) {
      this.events = JSON.parse(localStorage["events"]).map(
        (event: UserEvent) =>
          new UserEvent({
            date: new Date(event.date),
            name: event.name,
            duration: event.duration,
            description: event.description,
          })
      );
    }

    if (localStorage["completed"]) {
      this.completedChunks = JSON.parse(localStorage["completed"]).map(
        (chunk: Chunk) =>
          new Chunk(
            new UserTask({
              ...chunk.task,
              due: new Date(chunk.task.due),
            }),
            chunk.duration,
            new Date(chunk.date),
            chunk.number
          )
      );
    }

    this.updateChunks();
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
