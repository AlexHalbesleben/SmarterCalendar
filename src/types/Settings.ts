import DateUtils from "@/util/DateUtils";

export default class Settings {
  effortWeight;

  baseStartTime;
  baseEndTime;

  timeChunkingModeSpent: boolean;

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
    timeChunkingModeSpent = true,
  }) {
    this.effortWeight = effortWeight;
    this.baseStartTime = baseStartTime;
    this.baseEndTime = baseEndTime;
    this.dailyStartTimes = dailyStartTimes;
    this.dailyEndTimes = dailyEndTimes;
    this.dayStartTimes = dayStartTimes;
    this.dayEndTimes = dayEndTimes;
    this.timeChunkingModeSpent = timeChunkingModeSpent;
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
  effortWeight: "How much the algorithm weights effort when chunking tasks",
};
