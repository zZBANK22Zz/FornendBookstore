<template>
  <div class="q-pa-md">
    <div class="row justify-center text-h6 text-bold">Login</div>
    <q-form
      @submit.prevent="loginUser"
      @reset.prevent="onReset"
      class="q-gutter-sm"
    >
      <div>
        <q-input filled v-model="username" type="text" label="Your username" />
      </div>
      <div>
        <q-input
          filled
          type="password"
          v-model="password"
          label="Your password"
        />
      </div>

      <div class="row justify-center">
        <q-btn label="Log in" type="submit" color="black" />
        <q-btn
          label="Register"
          color="brown"
          class="q-ml-sm"
          @click="this.$router.push('/register')"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useUserStore } from "src/stores/user";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginPage",
  data() {
    const userStore = useUserStore();

    return {
      username: "",
      password: "",
      userStore,
      user: {},
    };
  },
  methods: {
    async loginUser() {
      try {
        const userLogin = {
          username: this.username,
          password: this.password,
        };
        const res = await api.post("/user/login", userLogin);
        console.log("🚀 ~ loginUser ~ res:", res.data);

        this.userStore.user = res.data;
        this.$router.push("/menu");
      } catch (error) {
        console.log(error);
      }
    },
    onReset() {
      this.username = "";
      this.password = "";
    },
  },
});
</script>
