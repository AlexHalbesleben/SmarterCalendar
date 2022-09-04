import DateUtils from "@/util/DateUtils";

export default class UserReminder {
  date: Date;
  name: string;
  description: string;

  constructor({
    date = DateUtils.stripTime(DateUtils.currentDate),
    name = "",
    description = "",
  }) {
    this.date = date;
    this.name = name;
    this.description = description;
  }
}
