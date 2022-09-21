import Chunk from "@/types/Chunk";
import UserEvent from "@/types/Event";
import UserReminder from "@/types/Reminder";
import Settings from "@/types/Settings";
import DateUtils from "@/util/DateUtils";
import TaskUtils from "@/util/TaskUtils";
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

  reminders: UserReminder[] = [];

  editedIndex = -1; // -1 indicates a new task is being created (as opposed to an existing one being edited)

  editedTaskCompleted = false;

  editedEventIndex = -1;

  editedReminderIndex = -1;

  dayModalMonth = 0;

  dayModalDay = 0;

  chunks: Chunk[] = [];

  settings: Settings = new Settings({});

  editedChunk: Chunk | undefined = undefined;

  changelogModalShown = false;

  /**
   * Splits the tasks into chunks
   */
  @mutation updateChunks() {
    if (this.tasks.length === 0) {
      this.chunks = [];
      return;
    }

    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

    const getTotalTime = (day: number) => {
      if (!chunksByDay[day]) {
        chunksByDay[day] = [];
      }
      return chunksByDay[day].reduce((prev, curr) => prev + curr.duration, 0);
    };
    const getTotalEffort = (day: number) => {
      if (!chunksByDay[day]) {
        chunksByDay[day] = [];
      }
      return chunksByDay[day].reduce((prev, curr) => prev + curr.effort, 0);
    };

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

    const lastTask = this.tasks[this.tasks.length - 1];
    const totalDays = DateUtils.daysBetween(
      DateUtils.currentDate,
      lastTask.due
    );

    if (this.tasks.length > 0) {
      for (let i = 0; i <= totalDays; i++) {
        chunksByDay[i] = chunksByDay[i] ?? [];
      }
    }

    const eventTimes: Record<number, number> = {};
    for (let i = 0; i <= totalDays; i++) {
      eventTimes[i] = 0;
    }
    for (const event of this.events) {
      if (event.date.getTime() > DateUtils.currentDate.getTime()) {
        const convertedDay = DateUtils.daysBetween(
          DateUtils.currentDate,
          event.date
        );
        eventTimes[convertedDay] += event.duration;
      }
    }

    const completedTimes: Record<number, number> = {};
    const completedEfforts: Record<number, number> = {};
    for (let i = 0; i <= totalDays; i++) {
      completedTimes[i] = 0;
      completedEfforts[i] = 0;
    }
    for (const chunk of this.completedChunks) {
      const convertedDay = DateUtils.daysBetween(
        DateUtils.currentDate,
        chunk.date
      );
      completedTimes[convertedDay] += chunk.duration;
      completedEfforts[convertedDay] += chunk.effort;
    }

    // For each task, with tasks due earlier scheduled first
    for (const task of this.tasks) {
      let { chunks } = task;
      chunks -= task.lockedChunks.length;
      chunks -= this.completedChunks.filter((chunk) =>
        TaskUtils.tasksEqual(task, chunk.task)
      ).length;
      const { due } = task;
      let daysUntilDue = DateUtils.daysBetween(DateUtils.currentDate, due);
      const chunkDuration = task.duration / task.chunks;

      const usedNumbers = task.lockedChunks.map((chunk) => chunk.number);
      const startDay = task.startDate
        ? DateUtils.daysBetween(DateUtils.currentDate, task.startDate)
        : 0;

      if (startDay > daysUntilDue) {
        continue;
      }

      // For each chunk
      for (let i = 0; i < chunks; i++) {
        const combinedDayData: Record<number, number> = {};

        for (let i = 0; i <= daysUntilDue; i++) {
          combinedDayData[i] =
            getTotalTime(i) +
            getTotalEffort(i) * this.settings.effortWeight +
            completedTimes[i] +
            completedEfforts[i] * this.settings.effortWeight +
            (this.settings.timeIncludesEvents ? eventTimes[i] : 0);

          if (
            this.settings.useMinimumTime &&
            i > this.settings.minimumTimeGap
          ) {
            combinedDayData[i] +=
              this.settings.minimumDailyTime * (1 + this.settings.effortWeight);
          }
        }

        let dayToAssign = daysUntilDue;

        // Assign to the latest possible day (if none work, will be due date) by default
        for (let d = startDay; d <= daysUntilDue; d++) {
          const dayHasTime =
            getTotalTime(d) + chunkDuration <=
            this.settings.timeOnDay(
              DateUtils.applyDayOffset(d, DateUtils.currentDate)
            ) -
              eventTimes[d];

          if (dayHasTime) {
            dayToAssign = d;
          }
        }

        let anyDaysWork = false;

        daysUntilDue = Math.floor(daysUntilDue);

        const loopStart = task.backloaded ? startDay : daysUntilDue;
        const loopEnded = (d: number) =>
          task.backloaded ? d <= daysUntilDue : d >= startDay;
        const loopIncrement = task.backloaded ? 1 : -1;

        // Finds the day with that has the lowest effort compared to the next and sets that as the chunk's due date
        for (let d = loopStart; loopEnded(d); d += loopIncrement) {
          const dayHasTime =
            getTotalTime(d) + chunkDuration <=
            this.settings.timeOnDay(
              DateUtils.applyDayOffset(d, DateUtils.currentDate)
            ) -
              eventTimes[d];

          if (dayHasTime) {
            anyDaysWork = true;
          } else {
            continue; // If the time is greater than what we can spend on this day, try the next one
          }

          if (combinedDayData[d] <= combinedDayData[dayToAssign]) {
            dayToAssign = d;
          }
        }

        // If none of the days have enough time, choose the one using the normal algorithm disregarding the time limits
        if (!anyDaysWork) {
          // Finds the day with that has the lowest effort compared to the next and sets that as the chunk's due date
          for (let d = loopStart; loopEnded(d); d += loopIncrement) {
            if (combinedDayData[d] <= combinedDayData[dayToAssign]) {
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

  @action async uploadReminders() {
    localStorage["reminders"] = JSON.stringify(this.reminders);
  }

  constructor() {
    super();

    if (localStorage["tasks"]) {
      this.tasks = JSON.parse(localStorage["tasks"]).map((task: UserTask) => {
        return {
          ...task,
          due: new Date(task.due),
          startDate: task.startDate ? new Date(task.startDate) : null,
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
              startDate: chunk.task.startDate
                ? new Date(chunk.task.startDate)
                : null,
            }),
            chunk.duration,
            new Date(chunk.date),
            chunk.number
          )
      );
    }

    if (localStorage["reminders"]) {
      this.reminders = JSON.parse(localStorage["reminders"]).map(
        (reminder: UserReminder) =>
          new UserReminder({
            date: new Date(reminder.date),
            name: reminder.name,
            description: reminder.description,
          })
      );
    }

    this.completedTasks = this.completedChunks
      .map((chunk) => chunk.task)
      .filter((task) => !this.tasks.includes(task));

    // try {
    this.updateChunks();
    /* } catch (e) {
      if (e instanceof Error) {
        alert(`ERROR: ${e.name}`);
        alert(`message: ${e.message}`);
        alert(`stack:\n ${e.stack}`);
        alert(`cause: ${e.cause}`);

        this.tasks.sort((a, b) => a.due.getTime() - b.due.getTime());
      }
    } */
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
