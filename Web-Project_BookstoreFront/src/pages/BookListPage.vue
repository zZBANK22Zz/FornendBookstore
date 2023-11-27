<template>
  <q-page class="q-px-md">
    <div class="q-gutter-y-sm">
      <div class="row justify-between">
        <div class="text-subtitle1 text-bold q-mt-md">All Book</div>
        <q-btn
          color="brown"
          class="q-mt-md"
          label="ADD"
          style="border-radius: 20px"
          @click="showDialog"
        />
      </div>
      <MenuAdd
        :isVisible="isDialogVisible"
        v-model="isDialogVisible"
        @updateVisible="updateDialogVisibility"
        @addmenu="addMenu"
      />
      <MenuEdit
        class="q-my-md"
        v-for="allmenu in allmenus"
        :key="allmenu.id"
        :menuName="allmenu.name"
        :menuDetail="allmenu.detail"
        :menuPrice="allmenu.price"
        :menuCategory="allmenu.category"
        :menuSold="allmenu.sold_amount"
        :menuId="allmenu.id"
        @updateMenuItem="updateMenu"
        @deleteMenuItem="deleteMenu(allmenu.id)"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "src/stores/user";
import MenuEdit from "src/components/BookEdit.vue";
import MenuAdd from "src/components/BookAdd.vue";
import { ref } from "vue";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "MenuManagement",
  data() {
    const userStore = useUserStore();
    const accessToken = userStore.user.accessToken;
    return {
      userStore,
      accessToken,
      allmenus: [],
      tab: "all",
      isDialogVisible: ref(false),
      isEditing: false,
    };
  },
  created() {
    this.getAllMenu();
  },

  methods: {
    getAllMenu() {
      const headerss = {
        "x-access-token": `${this.accessToken}`,
      };
      this.$api
        .get("/menu/", { headers: headerss })
        .then((res) => {
          this.allmenus = res.data;
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showDialog() {
      this.isDialogVisible = true;
      console.log(this.isDialogVisible);
    },
    updateDialogVisibility(newValue) {
      // Update the dialog visibility based on the emitted value from the child component
      this.isDialogVisible = newValue;
    },
    async addMenu(menuData) {
      try {
        const headerss = {
          "x-access-token": `${this.accessToken}`,
        };
        const response = await api.post("/menu/addmenu", menuData, {
          headers: headerss,
        });
        console.log("Menu added:", response.data);
        this.isDialogVisible = false;
      } catch (error) {
        console.log("Error adding menu", error);
      }
    },
    async deleteMenu(id) {
      try {
        const headerss = {
          "x-access-token": `${this.accessToken}`,
        };
        const response = await api.delete(`/menu/${id}`, { headers: headerss });
        const deleteIndex = this.allmenus.findIndex((menus) => menus.id === id);
        if (deleteIndex !== -1) {
          this.allmenus.splice(deleteIndex, 1);
        }
        console.log("Menu deleted:", response.data);
      } catch (error) {
        console.log("Error deleting menu", error);
      }
    },
    async updateMenu(menuData) {
      try {
        const headerss = {
          "x-access-token": `${this.accessToken}`,
        };
        const response = await api.put(`/menu/${menuData.id}`, menuData, {
          headers: headerss,
        });
        console.log("Menu updated:", response.data);
        // Find the updated menu in allmenus and update its data
        const updatedMenuIndex = this.allmenus.findIndex(
          (menu) => menu.id === menuData.id
        );
        if (updatedMenuIndex !== -1) {
          const updatedMenu = this.allmenus[updatedMenuIndex];
          updatedMenu.name = menuData.name;
          updatedMenu.price = menuData.price;
          updatedMenu.category = menuData.category;
          updatedMenu.detail = menuData.detail;
        }
        // Close the edit dialog
        this.isEditing = false;
      } catch (error) {
        console.log("Error updating menu", error);
      }
    },
  },
  components: { MenuEdit, MenuAdd },
});
</script>
