import { defineStore } from "pinia";
import ls from "localstorage-slim";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const userStore = defineStore("user", {
  state: () => ({
    counter: 0,
    isLogin: ref(false),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    async login(username, password) {
      try {
        // const lokasiPos = ls.get("lokasiPos")?.value || null;
        const response = await api.post("petugas/login", {
          username: username,
          password: password,
          // id_pos: lokasiPos,
        });

        // ls.set("timeLogin", response.data.time_login);
        ls.set("petugas", response.data);
        // ls.set("shift", response.data.shift);
        // ls.set("tanggal", response.data.tanggal);
        // const adminLevels = ["0001", "0002", "0003", "0004"];
        // this.isAdmin = adminLevels.includes(response.data.level_pegawai);

        if (response.data.id_petugas) {
          console.log("true");
        }
        this.isLogin = true;
        console.log(response.data);

        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          // Handle 401 error here
          console.log("Invalid username or password");
          $q.notify({
            type: "negative",
            message: "Cek kembali username dan password anda",
            position: "top",
            timeout: 1000,
          });
        }
      }
    },
    async logout() {
      const id_petugas = ls.get("pegawai")?.id_pegawai;
      const id_shift = ls.get("shift");
      const pos = ls.get("lokasiPos")?.value;
      const time_login = ls.get("timeLogin");
      const tanggal = ls.get("tanggal");

      try {
        const res = await axios.post(this.API_URL + "/user/logout", {
          id_petugas,
          id_shift,
          pos,
          time_login,
          tanggal,
        });
      } catch (error) {}
    },
  },
});
