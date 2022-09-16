export type ChangelogEntry = {
  version: string;
  title: string;
  description: string;
};

export const changelog: ChangelogEntry[] = [
  {
    version: "1.1.0",
    title: "First working version",
    description:
      "This is the first working release of SmarterCalendar. The calendar is unsophisticated but works. More is on the way.",
  },
  {
    version: "1.2.0",
    title: "Tasks save in local storage",
    description:
      "This release fixes the biggest issue preventing the calendar from being actually used--tasks are deleted when the tab is closed. Tasks are now saved in local storage between sessions.",
  },
  {
    version: "2.1.0",
    title: "Major upgrades",
    description:
      "This is a big update. The chunking system has been completely redone to consider the time and effort spent on each day. The calendar is now much more usable for real people.",
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
    version: "3.2.0",
    title: "Task completion revamp",
    description:
      "This is a significant update. Task/chunk completion has been revamped. Completed chunks now display in the calendar (they're in orange, not green) and aren't deleted. The chunking algorithm takes into consideration chunks that you've already completed, so you don't get more chunks assigned to a day after completing the day's chunks.",
  },
  {
    version: "3.3.0",
    title: "New setting for completed chunks",
    description:
      "Previously, the chunking algorithm considered chunks that have been completed when scheduling chunks for all days. The user now has the option to have this only take effect for the current day.\nBasically, the user has the option to work ahead and then work normally on future days.",
  },
  {
    version: "3.3.1",
    title: "Bug fixes",
    description: "Fix bug where uncompleting a chunk duplicates chunks",
  },
  {
    version: "3.3.2",
    title: "Major bug fix",
    description:
      "This release fixes a major bug with the chunking algorithm. The algorithm now much more effectively schedules far into the future.",
  },
  {
    version: "3.3.3",
    title: "Minor improvements",
    description: "Chunks are set to the current date when they are completed",
  },
  {
    version: "3.3.4",
    title: "Minor fix",
    description: "Day scrollbars are fixed",
  },
  {
    version: "3.3.5",
    title: "Minor fix",
    description: "Fix day layout",
  },
  {
    version: "3.3.6",
    title: "Minor fix",
    description:
      'The "due" field on the event modal has been changed to "date."',
  },
  {
    version: "3.3.7",
    title: "Minor fix",
    description: "The navbar is now fixed to the top of the screen",
  },
  {
    version: "3.3.8",
    title: "Current day indicator",
    description:
      "The indicator of the current day on the calendar has changed to be more noticeable and generally looks better",
  },
  {
    version: "3.4.0",
    title: "Add changelog",
    description:
      "Creates this changelog that will be valid for all future versions.",
  },
  {
    version: "3.4.1",
    title: "Update changelog",
    description: "Updates the changelog to include past entries",
  },
  {
    version: "3.5.0",
    title: "Add reminders",
    description:
      "Implements reminders. Reminders are like events, but they have no duration and don't affect chunking.",
  },
  {
    version: "3.6.0",
    title: "Frontloading tasks",
    description:
      "The user can now assign tasks to be scheduled on the first possible time instead of the last possible time.",
  },
  {
    version: "3.6.1",
    title: "Modal closing",
    description:
      "Chunk and task modals are now closed when tasks/chunks are completed or deleted.",
  },
  {
    version: "3.6.2",
    title: "Arrow keys work in changelog modal",
    description:
      "The arrow keys now work in the changelog modal. This allows the user to scroll through the changelog.",
  },
  {
    version: "3.6.3",
    title: "Scheduling fix",
    description:
      "Fixes a bug tasks could not be set to be scheduled at the latest possible date",
  },
  {
    version: "3.6.4",
    title: "Task completion fix",
    description:
      "Fixes bugs where task/chunk completion sometimes didn't work or created multiple copies of the task/chunk",
  },
  {
    version: "3.6.5",
    title: "Optimize chunking algorithm",
    description:
      "Implements a couple of optimizations to the chunking algorithm that should speed it up, especially on lower-end devices",
  },
];
