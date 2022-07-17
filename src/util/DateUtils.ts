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

  /**
   * Applies a given offset in days to an existing date
   * @param days the number of days to offset
   * @param to the date to which the offset is applied
   */
  static applyDayOffset(days: number, to: Date): Date {
    let rawTime = to.getTime();
    rawTime += days * (1000 * 60 * 60 * 24);
    return new Date(rawTime);
  }

  /**
   * Calculates the number of days until the given date (from the current date, as calculated by {@link currentDate})
   * @param date the date on which to perform the comparison
   */
  static daysUntil(date: Date): number {
    return this.daysBetween(this.currentDate, date);
  }
}
