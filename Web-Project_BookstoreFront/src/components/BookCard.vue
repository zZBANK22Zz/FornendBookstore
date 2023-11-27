<template>
<q-card>
    <div class="q-pa-md">
      <div class="text-subtitle2 text-bold row justify-between">
        <div>{{ menuName }}</div>
        <div>{{ menuPrice }} Bath</div>
      </div>
      <div class="text-grey q-pt-md">
        Catagory: <span class="text-black">{{ menuCategory }}</span>
      </div>
      <div class="text-grey q-pt-md">
        Sold out: <span class="text-black">{{ menuSold }}</span>
      </div>
      <div class="text-grey q-pt-md">
        detail:
        <span class="text-black">{{ menuDetail }}</span>
      </div>
      <div class="row justify-end">
        <q-icon name="add" size="20px" color="orange-9" @click="addMenuBuy()" />
        <div class="q-mx-sm text-bold">{{ menuBuy }}</div>
        <q-icon
          name="remove"
          size="20px"
          color="orange-9"
          @click="removeMenuBuy()"
        />
      </div>
      <div align="center" class="q-pt-md" v-if="menuBuy > 0">
        <q-btn
          color="green-2"
          label="Confirm"
          text-color="green"
          style="border-radius: 15px"
          no-caps
          class="q-mr-sm"
          @click="confirmOrder()"
        />
        <q-btn
          color="red-2"
          label="Cancel"
          text-color="red"
          style="border-radius: 15px"
          no-caps
          @click="canCelOrder"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BookCard',
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
