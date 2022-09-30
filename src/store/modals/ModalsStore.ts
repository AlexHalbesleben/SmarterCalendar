import Substore from "../Substore";
import ChangelogModalStore from "./ChangelogModalStore";
import ChunkModalStore from "./ChunkModalStore";
import DayModalStore from "./DayModalStore";
import EventModalStore from "./EventModalStore";
import ReminderModalStore from "./ReminderModalStore";
import TaskModalStore from "./TaskModalStore";

export default class ModalsStore extends Substore {
  chunk = new ChunkModalStore(this.store);
  task = new TaskModalStore(this.store);
  event = new EventModalStore(this.store);
  reminder = new ReminderModalStore(this.store);
  changelog = new ChangelogModalStore(this.store);
  day = new DayModalStore(this.store);
}
