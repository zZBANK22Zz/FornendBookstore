import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
export const useUserStore = defineStore("user", {
  state: () => ({
    userid: useStorage("userid", ""),
    fullname: useStorage("fullname", ""),
    accessToken: useStorage("accessToken", ""),
    avatar: useStorage("avatar", ""),
  }),
  getters: {
    getFullname: (state) => {
      return state.fullname;
    },
    getUserid: (state) => {
      return state.userid;
    },
    getAccessToken: (state) => {
      return state.accessToken;
    },

  },
  actions: {
    clearStorage() {
      this.userid = "";
      this.fullname = "";
      this.accessToken = "";
      this.avatar = "";
    },
  },
});
