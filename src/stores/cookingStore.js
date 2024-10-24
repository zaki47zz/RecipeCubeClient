import { ref, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePantryStore } from '@/stores/pantryStore';

export const useCookingStore = defineStore('cookingStore', () => {
    //儲存產生食譜用的食材們
    const cookingInventories = ref([]);

    //儲存料理完剩餘的食材們(要加入庫存，並更新紀錄)
    const leftInventories = ref([]);

    //決定是否要顯示"並決定 庫存食材一起檢索"字串的Flag(如果來自庫存頁面則為否)
    const isShowingString = ref(true);

    //決定顯示"納入/不納入"字串的Flag(在隨買隨煮設定)
    const isUsingInventory = ref(false);

    //決定是否要產生套餐的Flag(在隨買隨煮設定)
    const isSet = ref(false);

    //重設cookingInventories
    const resetCookingInventories = () => {
        cookingInventories.value = [];
        isShowingString.value = true;
        isUsingInventory.value = false;
        isSet.value = false;
    };

    ////動態操作
    //建構store們
    const inventoryStore = useInventoryStore();
    const pantryStore = usePantryStore();

    //監控isUsingInventory的值，如果設定為true就抓庫存進來
    const { inventories } = storeToRefs(inventoryStore);
    const { fetchInventories } = inventoryStore;

    watch(isUsingInventory, async (newValue) => {
        if (newValue === true) {
            await fetchInventories();
        }
        cookingInventories.value.concat(inventories.value);
    });

    //監控cookingInventories的值，如果有變就更新localStorage
    watch(
        () => cookingInventories.value,
        async (newValue) => {
            console.log('newValue');
            if (newValue.length > 0) {
                localStorage.setItem('cookingInventories', JSON.stringify(newValue));
            }
        },
        { deep: true }
    );

    //從localStorage抓資料(防止刷新頁面)
    const setCookingInventories = () => {
        console.log(JSON.parse(localStorage.getItem('cookingInventories')));
        const cookingInventoriesData = JSON.parse(localStorage.getItem('cookingInventories'));
        cookingInventories.value = cookingInventoriesData ? cookingInventoriesData : [];
    };

    //將剩餘食材加入庫存並更新紀錄
    const { postInventory } = inventoryStore;
    const { postPantry } = pantryStore;
    //還沒寫
    console.log(leftInventories.value);

    ////動態操作結束

    return {
        cookingInventories,
        isShowingString,
        isUsingInventory,
        isSet,
        resetCookingInventories,
        setCookingInventories,
    };
});
