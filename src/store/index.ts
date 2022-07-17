import Chunk from "@/types/Chunk";
import Vue from "vue";
import Vuex from "vuex";
import {
  createModule,
  mutation,
  action,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import UserTask from "../types/Task";

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "store",
  strict: false,
});

export class Store extends VuexModule {
  tasks: UserTask[] = []; // The user's tasks

  editedIndex = -1; // -1 indicates a new task is being created (as opposed to an existing one being edited)

  get chunks(): Chunk[] {
    const ret: Chunk[] = [];

    for (const task of this.tasks) {
      for (const chunk of task._chunks) {
        ret.push(chunk);
      }
    }

    return ret;
  }
}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(Store),
  },
});

// Creating proxies.
const vxm = {
  store: createProxy(store, Store),
};

export default vxm;
