<template>
  <q-card>
    <div class="q-pa-md">
      <div class="text-subtitle2 text-bold row justify-between">
        <div>{{ menuName }}</div>
        <div>{{ menuPrice }} Bath</div>
      </div>
      <div class="text-grey q-pt-md">
        Category: <span class="text-black">{{ menuCategory }}</span>
      </div>
      <div class="text-grey q-pt-md">
        Sold out: <span class="text-black">{{ menuSold }}</span>
      </div>
      <div class="text-grey q-pt-md">
        Detail:
        <span class="text-black">{{ menuDetail }}</span>
      </div>
      <div class="row justify-center q-mt-md">
        <q-btn
          color="orange-2"
          text-color="orange"
          label="Edit"
          style="border-radius: 15px"
          no-caps
          class="q-mr-md"
          @click="openEditDialog"
        />
        <q-btn
          color="red-2"
          text-color="red"
          label="Delete"
          style="border-radius: 15px"
          no-caps
          @click="deleteMenuItem"
        />
      </div>
    </div>

    <!-- q-dialog for editing -->
    <q-dialog v-model="isEditDialogVisible" align="center" class="text-grey-9">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Menu</div>
          <q-input label="Name" v-model="editedMenuName" />
          <q-input label="Detail" v-model="editedMenuDetail" />
          <q-input label="Price" v-model="editedMenuPrice" />
          <q-input label="Category" v-model="editedMenuCategory" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Save"
            color="green-5"
            @click="saveEditedMenu"
            style="border-radius: 15px"
            no-caps
          />
          <q-btn
            label="Cancel"
            text-color="red"
            color="red-3"
            @click="closeEditDialog"
            style="border-radius: 15px"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BookEdit',
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
