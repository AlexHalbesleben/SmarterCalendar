export default class UserTask {
  name = "";
  duration = 60;
  chunks = 1;
  due: Date = new Date();
  effort = 1;
  description = "";

  get totalEffort(): number {
    return this.effort * this.duration;
  }
}
