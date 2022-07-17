import UserTask from "./Task";

export default class Chunk {
  task: UserTask;

  duration: number;

  date: Date;

  constructor(task: UserTask, duration: number, date: Date) {
    this.task = task;
    this.duration = duration;
    this.date = date;
  }

  get desc(): string {
    return `${this.duration} minute chunk of task ${
      this.task.name
    } due on ${this.date.toUTCString()}`;
  }
}
