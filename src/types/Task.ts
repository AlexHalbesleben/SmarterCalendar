import DateUtils from "@/util/DateUtils";
import Chunk from "./Chunk";

export default class UserTask {
  name = "";
  duration = 60;
  chunks = 1;
  due: Date = new Date();

  _chunks: Chunk[] = [];

  splitIntoChunks() {
    // Adding 1 because the current day also counts
    const daysAvailable = DateUtils.daysUntil(this.due) + 1;

    this._chunks = [];

    for (let i = 0; i < this.chunks; i++) {
      const dateToAssign = DateUtils.applyDayOffset(
        daysAvailable - (i % daysAvailable) - 1,
        DateUtils.currentDate
      );
      this._chunks.push(
        new Chunk(this, this.duration / this.chunks, dateToAssign)
      );
    }
  }
}
