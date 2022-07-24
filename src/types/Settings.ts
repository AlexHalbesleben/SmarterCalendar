export default class Settings {
  /** When a day has a total time of more than this, the system attempts to schedule chunks on other days */
  maxPreferredDailyTime = 240;
  /** When a day has this much (or more) total time than the previous day, the system attempts to schedule chunks on the previous day */
  maxPreferredDayTimeDiff = 60;
}
