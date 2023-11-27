<template>
<q-dialog v-model="isDialogVisible" align="center" class="text-grey-9">
    <q-card>
      <q-card-section>
        <div class="text-h6">Add new menu</div>
        <q-input label="Name" v-model="menuName" />
        <q-input label="Detail" v-model="menuDetail" />
        <q-input label="Price" v-model="menuPrice" />
        <q-select
          label="Category"
          v-model="menuCategory"
          :options="categories"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Save"
          color="green-5"
          @click="saveMenu"
          style="border-radius: 15px"
          no-caps
        />
        <q-btn
          label="Cancel"
          text-color="red"
          color="red-3"
          @click="closeDialog"
          style="border-radius: 15px"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BookAdd',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
})
</script>
