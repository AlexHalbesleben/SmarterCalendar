/**
 * A helper class containing helpful utilites for working with dates
 */
export default class DateUtils {
  static get currentDate() {
    return new Date();
  }

  static stripTime(date: Date): Date {
    const newDate = new Date(date.getTime());
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  }

  /**
   * Returns the number of days between two dates
   * The dates are stripped, meaning that the times in each date are not taken into account
   * @param a the earlier date
   * @param b the later date
   */
  static daysBetween(a: Date, b: Date): number {
    return (
      (this.stripTime(b).getTime() - this.stripTime(a).getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }
}
