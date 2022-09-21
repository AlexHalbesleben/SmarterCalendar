import UserTask from "@/types/Task";

export default class TaskUtils {
  static tasksEqual(task1: UserTask, task2: UserTask): boolean {
    const testedKeys: (keyof UserTask)[] = [
      "name",
      "due",
      "duration",
      "effort",
      "description",
      "chunks",
      "startDate",
      "backloaded",
    ];
    return testedKeys.every(
      (k) => task1[k]?.toString() === task2[k]?.toString()
    );
  }
}
