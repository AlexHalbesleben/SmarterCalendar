import DateUtils from "@/util/DateUtils";

describe("DateUtils", () => {
  it("Properly strips time", () => {
    const stripped = DateUtils.stripTime(new Date());
    expect(stripped.getHours()).toEqual(0);
    expect(stripped.getMinutes()).toEqual(0);
    expect(stripped.getSeconds()).toEqual(0);
    expect(stripped.getMilliseconds()).toEqual(0);
  });
  it("Correctly measures the number of days between two dates", () => {
    const testDate1 = DateUtils.stripTime(new Date());
    testDate1.setFullYear(2000, 0, 0);

    const testDate2 = DateUtils.stripTime(new Date());

    testDate2.setFullYear(2000, 0, 0);
    expect(DateUtils.daysBetween(testDate1, testDate2)).toEqual(0);

    testDate2.setFullYear(2000, 0, 1);
    expect(DateUtils.daysBetween(testDate1, testDate2)).toEqual(1);

    testDate2.setFullYear(2000, 1, 0);
    expect(DateUtils.daysBetween(testDate1, testDate2)).toEqual(31);

    testDate2.setFullYear(2001, 0, 0);
    expect(DateUtils.daysBetween(testDate1, testDate2)).toEqual(366); // 2000 was a leap year
  });
  it("Correctly applies day offsets", () => {
    const testDate1 = DateUtils.stripTime(new Date());
    testDate1.setFullYear(2000, 0, 0);

    expect(DateUtils.applyDayOffset(0, testDate1)).toEqual(testDate1);

    for (const i of [-365, -30, -1, 0, 1, 30, 365]) {
      const newDate = DateUtils.applyDayOffset(i, testDate1);
      expect(DateUtils.daysBetween(testDate1, newDate)).toEqual(i); // Assumes daysBetween is correct; those tests are run first
    }
  });
});
