import Substore from "../Substore";
import CompletedSubstore from "./CompletedSubstore";
import EventsSubstore from "./EventsSubstore";
import RemindersSubstore from "./RemindersSubstore";
import SettingsSubstore from "./SettingsSubstore";
import TasksSubstore from "./TasksSubstore";

export default class StorageStore extends Substore {
  tasks = new TasksSubstore(this.store, this);
  settings = new SettingsSubstore(this.store, this);
  events = new EventsSubstore(this.store, this);
  completed = new CompletedSubstore(this.store, this);
  reminders = new RemindersSubstore(this.store, this);

  updateTasks() {
    this.tasks.value = this.store.tasks;
  }
  updateSettings() {
    this.settings.value = this.store.settings;
  }
  updateEvents() {
    this.events.value = this.store.events;
  }
  updateCompleted() {
    this.completed.value = this.store.completedChunks;
  }
  updateReminders() {
    this.reminders.value = this.store.reminders;
  }
}
