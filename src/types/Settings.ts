import DateUtils from "@/util/DateUtils";

export default class Settings {
  effortWeight;

  baseStartTime;
  baseEndTime;

  dailyStartTimes: Record<number, string>;
  dailyEndTimes: Record<number, string>;

  dayStartTimes: Record<number, string>;
  dayEndTimes: Record<number, string>;

  constructor(
    config: {
      effortWeight?: number;
      baseStartTime?: number;
      baseEndTime?: number;
      dailyStartTimes?: Record<number, string>;
      dailyEndTimes?: Record<number, string>;
      dayStartTimes?: Record<number, string>;
      dayEndTimes?: Record<number, string>;
    } = {
      effortWeight: 1,
      baseStartTime: 930,
      baseEndTime: 1380,
      dailyStartTimes: {},
      dailyEndTimes: {},
      dayStartTimes: {},
      dayEndTimes: {},
    }
  ) {
    this.effortWeight = config.effortWeight || 1;
    this.baseStartTime = config.baseStartTime || 930;
    this.baseEndTime = config.baseEndTime || 1380;
    this.dailyStartTimes = config.dailyStartTimes || {};
    this.dailyEndTimes = config.dailyEndTimes || {};
    this.dayStartTimes = config.dayStartTimes || {};
    this.dayEndTimes = config.dayEndTimes || {};
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
