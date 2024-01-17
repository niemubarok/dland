import { defineStore } from "pinia";
import { ref } from "vue";

export const componentStore = defineStore("component", {
  state: () => ({
    counter: 0,
    miniMode: ref(false),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    toggleMiniMode() {
      this.miniMode = !this.miniMode;
    },
    increment() {
      this.counter++;
    },
  },
});
