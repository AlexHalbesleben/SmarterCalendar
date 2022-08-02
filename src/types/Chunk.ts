import UserTask from "./Task";

export default class Chunk {
  task: UserTask;

  duration: number;

  date: Date;

  number: number;

  constructor(task: UserTask, duration: number, date: Date, number: number) {
    this.task = task;
    this.duration = duration;
    this.date = date;
    this.number = number;
  }

  get effort(): number {
    return this.duration * this.task.effort;
  }

  get desc(): string {
    return `${this.duration} minute chunk of task ${
      this.task.name
    } due on ${this.date.toUTCString()}`;
  }
}
