export default class Settings {
  effortWeight = 1;

  baseStartTime = 930;
  baseEndTime = 1380;

  dailyStartTimes: Record<number, string> = {};
  dailyEndTimes: Record<number, string> = {};

  get dailyTimes(): number[] {
    const ret: number[] = [];

    for (let day = 0; day < 7; day++) {
      let startTime = this.baseStartTime;
      if (this.dailyStartTimes[day]) {
        const strStartTime = this.dailyStartTimes[day];
        const extracted = strStartTime.match(/([0-9]{2}):([0-9]{2})/);

        if (extracted && extracted[1] && extracted[2]) {
          startTime = parseInt(extracted[1]) * 60 + parseInt(extracted[2]);
        }
      }

      let endTime = this.baseEndTime;
      if (this.dailyEndTimes[day]) {
        const strEndTime = this.dailyEndTimes[day];
        const extracted = strEndTime.match(/([0-9]{2}):([0-9]{2})/);

        if (extracted && extracted[1] && extracted[2]) {
          endTime = parseInt(extracted[1]) * 60 + parseInt(extracted[2]);
        }
      }

      ret.push(endTime - startTime);
    }

    return ret;
  }
}

export const SETTINGS_DESCRIPTIONS = {
  effortWeight: "How much the algorithm weights effort when chunking tasks",
};
