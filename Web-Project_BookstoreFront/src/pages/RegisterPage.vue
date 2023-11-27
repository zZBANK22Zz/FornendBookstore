<template>
  <div class="q-pa-md row-justify-center" align="center">
    <div class="column justify-center text-h6 text-bold">
      <h3>REGISTER</h3>
      <h6>--- Welcome to BookStore ---</h6>

    </div>
    <q-form @submit.prevent="onSubmit" @reset.prevent="onReset" class="q-mt-sm">
      <div>
        <q-input
          filled
          v-model="firstName"
          type="text"
          label="Please type your Firstname"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="lastName"
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
          v-model="dateOfBirth"
          type="text"
          label="Please type your Birthday"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="address"
          type="text"
          label="Please type your address"
          lazy-rules
          :rules="[requiredValidate]"
        />
      </div>
      <div>
        <q-input
          filled
          v-model="phoneNumber"
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
import router from "../stores/user";
import { defineComponent } from "vue";
import { Notify } from "quasar";
import { emailValidate, requiredValidate } from "../utils/validations";

export default defineComponent({
  name: "ReqisterPage",
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      isPwd: true,
      password: null,
      dateOfBirth: null,
      address: null,
      phoneNumber: null,
      role: 2
    };
  },
  methods: {
    emailValidate,
    requiredValidate,
    onSubmit() {
      const newUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        dateOfBirth: this.dateOfBirth,
        address: this.address,
        phoneNumber: this.phoneNumber,
        role: this.role
      };
      this.$api.post("/user/create", newUser)
        .then((res) => {
          console.log(res);
          this.$router.push("/");
        })
        .catch((err) => {
          console.log(err);
          err;
        });
    },
    onReset() {
      (this.firstName= null),
      (this.lastName= null),
      (this.email= null),
      (this.isPwd= true),
      (this.password= null),
      (this.dateOfBirth= null),
      (this.address= null),
      (this. phoneNumber= null)
    },
  },
});
</script>
