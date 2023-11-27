<template>
  <div class="q-pa-md row-justify-center" align="center">
    <div class="column justify-center text-h6 text-bold">
      <h3>REGISTER</h3>
      <h6>--- Welcome to BookStore ---</h6>

    </div>
    <q-form @submit.prevent="onSubmit" @reset.prevent="onReset" class="q-mt-sm" ref="registerForm">
      <div>
        <q-input
          filled
          v-model="Firstname"
          type="text"
          label="Please type your Firstname"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="Lastname"
          type="text"
          label="Please type your Lastname"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>

      <div>
        <q-input
          filled
          v-model="email"
          type="text"
          label="Please type your Email"
          lazy-rules
          :rules="[emailValidate, requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="Birthday"
          type="text"
          label="Please type your Birthday"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="Phonenumber"
          type="text"
          label="Please type your Phonenumber"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="Please type your password"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length >= 6) || 'Must be 6 characters at least.',
          ]"
        >
          <template v-slot:append>
            <q-icon
              @click="isPwd = !isPwd"
              :name="isPwd ? 'visibility_off' : 'visibility'"
            />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="brown" />
        <q-btn label="Reset" type="reset" color="black" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>
import router from "../router/routes";
import { defineComponent } from "vue";
import { emailValidate, requiredValidate } from "../utils/validations";

export default defineComponent({
  name: "ReqisterPage",
  data() {
    return {
      Firstname: null,
      Lastname: null,
      email: null,
      Birthday: null,
      Phonenumber: null,
      isPwd: true,
    };
  },
  methods: {
    emailValidate,
    requiredValidate,
    onSubmit() {
      const newUser = {
      Firstname: this.Firstname,
      Lastname: this.Lastname,
      email: this.email,
      Birthday: this.Birthday,
      Phonenumber: this.Phonenumber,
      password: this.password,
      };
      this.$api
        .post("/user/signup", newUser)
        .then((res) => {
          console.log(res);
          this.$router.push("/");
        })
        .catch((err) => {
          err;
        });
    },
    onReset() {
      this.Firstname = null;
      this.Lastname = null;
      this.email = null;
      this.Birthday = null;
      this.Phonenumber = null;
      this.password = null;
    },
  },
});
</script>
