export default class Settings {
  effortWeight = 1;

  baseStartTime = 930;
  baseEndTime = 1380;

  dailyStartTimes: Record<number, string> = {};
  dailyEndTimes: Record<number, string> = {};
}

export const SETTINGS_DESCRIPTIONS = {
  effortWeight: "How much the algorithm weights effort when chunking tasks",
};
