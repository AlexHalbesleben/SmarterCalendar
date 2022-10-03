import Chunk from "@/types/Chunk";
import Settings from "@/types/Settings";
import UserTask from "@/types/Task";
import DateUtils from "@/util/DateUtils";
import Substore from "./Substore";

export default class ChunkStore extends Substore {
  chunks: Chunk[] = [];

  get tasks(): UserTask[] {
    return this.store.tasks;
  }

  get settings(): Settings {
    return this.store.settings;
  }

  getTotalTime(day: number, chunks: Record<number, Chunk[]>): number {
    if (!chunks[day]) {
      chunks[day] = [];
    }
    return chunks[day].reduce((prev, curr) => prev + curr.duration, 0);
  }

  getTotalEffort(day: number, chunks: Record<number, Chunk[]>): number {
    if (!chunks[day]) {
      chunks[day] = [];
    }
    return chunks[day].reduce((prev, curr) => prev + curr.effort, 0);
  }

  update() {
    if (this.tasks.length === 0) {
      this.chunks = [];
      return;
    }

    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

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

    const eventTimes: Record<number, number> = {};

    const completedTimes: Record<number, number> = {};
    const completedEfforts: Record<number, number> = {};

    for (let i = 0; i <= totalDays; i++) {
      chunksByDay[i] = chunksByDay[i] ?? [];

      eventTimes[i] = 0;
      completedTimes[i] = 0;
      completedEfforts[i] = 0;
    }

    for (const event of this.store.events) {
      if (event.date.getTime() > DateUtils.currentDate.getTime()) {
        const convertedDay = DateUtils.daysBetween(
          DateUtils.currentDate,
          event.date
        );
        eventTimes[convertedDay] += event.duration;
      }
    }

    for (const chunk of this.store.completedChunks) {
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
      chunks -= this.store.completedChunks.filter(
        (chunk) => task.id === chunk.task.id
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
            this.getTotalTime(i, chunksByDay) +
            this.getTotalEffort(i, chunksByDay) * this.settings.effortWeight +
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
            this.getTotalTime(d, chunksByDay) + chunkDuration <=
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
            this.getTotalTime(d, chunksByDay) + chunkDuration <=
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
}
