import IDUtils from "@/util/IDUtils";

export default class UserTask {
  name = "";
  duration = 60;
  chunks = 1;
  due: Date = new Date();
  effort = 1;
  description = "";
  backloaded = false;
  startDate: Date | null = null;

  lockedChunks: { date: Date; number: number }[] = [];

  id = 0;

  get totalEffort(): number {
    return this.effort * this.duration;
  }

  constructor({
    name = "",
    duration = 60,
    chunks = 1,
    due = new Date(),
    effort = 1,
    description = "",
    lockedChunks = [] as { date: Date; number: number }[],
    backloaded = true,
    startDate = null as Date | null,
    id = -1,
  }) {
    this.name = name;
    this.duration = duration;
    this.chunks = chunks;
    this.due = due;
    this.effort = effort;
    this.description = description;
    this.lockedChunks = lockedChunks;
    this.backloaded = backloaded;
    this.startDate = startDate;
    this.id = id;
  }
}

export const TASK_DESCRIPTIONS = {
  duration: "How long, in minutes, the task will take to complete",
  chunks: "How many chunks the task should be split into",
  due: "The day on which the task must be completed. Chunks can be assigned on this day.",
  effort:
    "A measure of how much effort the task will take. A task with an effort of 2 will take twice as much effort to complete than a task with an effort of 1.",
};
