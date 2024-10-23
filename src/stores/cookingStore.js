import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCookingStore = defineStore('cookingStore', () => {
    //儲存產生食譜用的食材們
    const cookingInventories = ref([]);
    //決定是否要顯示"並決定 庫存食材一起檢索"字串的Flag(如果來自庫存頁面則為否)
    const isShowingString = ref(true);
    //決定顯示"納入/不納入"字串的Flag(在隨買隨煮設定)
    const isUsingInventory = ref(false);
    //重設cookingInventories
    function resetCookingInventories() {
        cookingInventories.value = [];
    }

    return { cookingInventories };
});
