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

    //判斷是不是已經加入過庫存食材了
    const hasAddedInventories = ref(false);

    //重設cookingInventories
    const resetCookingInventories = () => {
        cookingInventories.value = [];
        leftInventories.value = [];
        isShowingString.value = true;
        isUsingInventory.value = false;
        hasAddedInventories.value = false;
        isSet.value = false;

        const keysToRemove = [
            'cookingInventories',
            'isShowingString',
            'isUsingInventory',
            'isSet',
            'hasAddedInventories',
        ];
        keysToRemove.forEach((key) => localStorage.removeItem(key));
    };

    ////動態操作
    //建構store們
    const inventoryStore = useInventoryStore();
    const pantryStore = usePantryStore();

    //監控isUsingInventory的值，如果設定為true就抓庫存進來
    const { inventories } = storeToRefs(inventoryStore);
    const { fetchInventories } = inventoryStore;

    watch(isUsingInventory, async (newValue) => {
        if (newValue === true && !hasAddedInventories.value) {
            try {
                await fetchInventories();
                console.log('庫存食材清單:', inventories.value);
                cookingInventories.value = [...cookingInventories.value, ...inventories.value];
                localStorage.setItem('cookingInventories', JSON.stringify(cookingInventories.value));
                hasAddedInventories.value = true;
            } catch (error) {
                console.error('出現問題:', error);
            }
        } else if (newValue === false) {
            // 當關閉使用庫存時，重置標記
            hasAddedInventories.value = false;
        }
        localStorage.setItem('hasAddedInventories', JSON.stringify(hasAddedInventories.value));
    });

    //用localStorage重置
    const setCookingInventories = () => {
        try {
            const storedData = {
                cookingInventories: JSON.parse(localStorage.getItem('cookingInventories')),
                isShowingString: JSON.parse(localStorage.getItem('isShowingString')),
                isUsingInventory: JSON.parse(localStorage.getItem('isUsingInventory')),
                isSet: JSON.parse(localStorage.getItem('isSet')),
                hasAddedInventories: JSON.parse(localStorage.getItem('hasAddedInventories')),
            };
            if (storedData.cookingInventories) cookingInventories.value = storedData.cookingInventories;
            if (storedData.isShowingString !== null) isShowingString.value = storedData.isShowingString;
            if (storedData.isSet !== null) isSet.value = storedData.isSet;
            if (storedData.hasAddedInventories !== null) hasAddedInventories.value = storedData.hasAddedInventories;
            if (storedData.isUsingInventory !== null) isUsingInventory.value = storedData.isUsingInventory;
        } catch (error) {
            console.error('Error setting cooking inventories:', error);
            resetCookingInventories();
        }
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
