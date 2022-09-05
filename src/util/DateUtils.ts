/**
 * A helper class containing helpful utilites for working with dates
 */
export default class DateUtils {
  static get currentDate() {
    return this.stripTime(new Date());
  }

  static stripTime(date: Date): Date {
    try {
      const newDate = new Date(date.getTime());
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      // alert(`Successfully stripped time from ${date} to get ${newDate}`);
      return newDate;
    } catch (e) {
      alert(`error in stripping time from ${date}: ${e}`);
      return date;
    }
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

  /**
   * @param date the date of which to determine the day of the week
   * @returns the day of the week of the given date
   */
  static dayOfWeek(date: Date): number {
    return date.getDay();
  }

  /**
   * Literally just combines {@link applyDayOffset} and {@link dayOfWeek}
   * @param date the date on which to apply the offset
   * @param offset the offset to apply to the date
   * @returns the day of the week of the day that is a given offset from a certain date
   */
  static offsetDayOfWeek(date: Date, offset: number): number {
    return this.dayOfWeek(this.applyDayOffset(offset, date));
  }

  /**
   * Creates a Date from a given day and month. The year is set to the current year and time is stripped ({@link stripTime})
   * @param day the day of the new date
   * @param month the month of the new date
   * @returns a new date with the given date and month
   */
  static constructDate(day: number, month: number): Date {
    const template = this.stripTime(new Date());
    template.setDate(day);
    template.setMonth(month);
    return template;
  }
}
