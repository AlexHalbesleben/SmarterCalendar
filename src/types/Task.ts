export default class UserTask {
  name = "";
  duration = 60;
  chunks = 1;
  due: Date = new Date();
  effort = 1;

  get totalEffort(): number {
    return this.effort * this.duration;
  }
}
