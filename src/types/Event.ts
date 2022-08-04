import DateUtils from "@/util/DateUtils";

export default class UserEvent {
  date: Date;
  duration: number;

  name: string;
  description: string;

  constructor({
    date = DateUtils.stripTime(DateUtils.currentDate),
    duration = 60,
    name = "",
    description = "",
  }) {
    this.date = date;
    this.duration = duration;
    this.name = name;
    this.description = description;
  }
}
