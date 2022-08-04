import DateUtils from "@/util/DateUtils";

export default class Settings {
  effortWeight;

  baseStartTime;
  baseEndTime;

  timeIncludesEvents: boolean;

  dailyStartTimes: Record<number, string>;
  dailyEndTimes: Record<number, string>;

  dayStartTimes: Record<number, string>;
  dayEndTimes: Record<number, string>;

  constructor({
    effortWeight = 1,
    baseStartTime = 930,
    baseEndTime = 1380,
    dailyStartTimes = {},
    dailyEndTimes = {},
    dayStartTimes = {},
    dayEndTimes = {},
    timeIncludesEvents = false,
  }) {
    this.effortWeight = effortWeight;
    this.baseStartTime = baseStartTime;
    this.baseEndTime = baseEndTime;
    this.dailyStartTimes = dailyStartTimes;
    this.dailyEndTimes = dailyEndTimes;
    this.dayStartTimes = dayStartTimes;
    this.dayEndTimes = dayEndTimes;
    this.timeIncludesEvents = timeIncludesEvents;
  }

  stringToTime(str: string): number {
    const extracted = str.match(/([0-9]{2}):([0-9]{2})/);

    if (extracted && extracted[1] && extracted[2]) {
      return parseInt(extracted[1]) * 60 + parseInt(extracted[2]);
    }
    return 0;
  }

  stringToTimeOptional(str: string | undefined): number | undefined {
    if (str === undefined) {
      return undefined;
    }
    return this.stringToTime(str);
  }

  timeToString(time: number): string {
    return `${Math.floor(time / 60)}:${Math.floor(time % 60)}`;
  }

  timeOnDay(day: Date): number {
    const numKey = DateUtils.stripTime(day).getTime();
    const dayOfWeek = DateUtils.dayOfWeek(day);

    const start =
      this.stringToTimeOptional(this.dayStartTimes[numKey]) ||
      this.stringToTimeOptional(this.dailyStartTimes[dayOfWeek]) ||
      this.baseStartTime;

    const end =
      this.stringToTimeOptional(this.dayEndTimes[numKey]) ||
      this.stringToTimeOptional(this.dailyEndTimes[dayOfWeek]) ||
      this.baseEndTime;

    return end - start;
  }
}

export const SETTINGS_DESCRIPTIONS = {
  effortWeight:
    "The higher the value, the more the algorithm tries to make sure days have the same effort instead of the same time",
  timeChunkingModeSpent:
    "Whether the algorithm should consider time from events when trying to make days have the same amount of time spent",
};
