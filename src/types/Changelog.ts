export type ChangelogEntry = {
  version: string;
  title: string;
  description: string;
};

export const changelog: ChangelogEntry[] = [
  {
    version: "1.1.0",
    title: "First working version",
    description: "This is the first working release of SmarterCalendar. The calendar is unsophisticated but works. More is on the way.",
  },
  {
    version: "1.2.0",
    title: "Tasks save in local storage",
    description: "This release fixes the biggest issue preventing the calendar from being actually used--tasks are deleted when the tab is closed. Tasks are now saved in local storage between sessions.",
  },
  {
    version: "2.1.0",
    title: "Major upgrades",
    description: "This is a big update. The chunking system has been completely redone to consider the time and effort spent on each day. The calendar is now much more usable for real people.",
  },
  {
    version: "3.1.0",
    title: "More big upgrades",
    description: `Lots of stuff comes in v3. SmarterCalendar is now actually usable. The main changes are as follows:

The user can manually chunk tasks
The algorithm considers the time available each day (default value for all days, can be overridden for days of the week, can be further overridden for individual days)
The user can add events
There's a lot of other small stuff. This is a big step, as this is now a real, working calendar.`,
  },
  {
    version: "3.1.1",
    title: "Minor bug fixes",
    description: `Fixes the following bugs:

The footer could obscure content
Attempting to create a new event with the n hotkey opened the settings modal
Typing a hotkey in the description field in the task modal could open modals/trigger actions`,
  },
  {
    version: "3.3.0",
    title: "Add changelog",
    description:
      "Creates this changelog that will be valid for all future versions.",
  },
];
