export type ChangelogEntry = {
  version: string;
  title: string;
  description: string;
};

export const changelog: ChangelogEntry[] = [
  {
    version: "3.3.0",
    title: "Add changelog",
    description:
      "Creates this changelog that will be valid for all future versions.",
  },
];
