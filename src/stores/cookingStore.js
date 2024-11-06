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
    // 判斷是否來自隨買隨煮
    const source = ref(''); // 設定來源標識，如 'buyAndCook' 或 'inventory'
    //重設cookingInventories
    const resetCookingInventories = () => {
        cookingInventories.value = [];
        leftInventories.value = [];
        isShowingString.value = true;
        isUsingInventory.value = false;
        hasAddedInventories.value = false;
        isSet.value = false;
        source.value = '';
        const keysToRemove = [
            'cookingInventories',
            'isShowingString',
            'isUsingInventory',
            'isSet',
            'hasAddedInventories',
            'source',
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
                source: localStorage.getItem('source'),
            };
            if (storedData.cookingInventories) cookingInventories.value = storedData.cookingInventories;
            if (storedData.isShowingString !== null) isShowingString.value = storedData.isShowingString;
            if (storedData.isSet !== null) isSet.value = storedData.isSet;
            if (storedData.hasAddedInventories !== null) hasAddedInventories.value = storedData.hasAddedInventories;
            if (storedData.isUsingInventory !== null) isUsingInventory.value = storedData.isUsingInventory;
            if (storedData.source) source.value = storedData.source;
        } catch (error) {
            console.error('Error setting cooking inventories:', error);
            resetCookingInventories();
        }
    };

    //將剩餘食材加入庫存並更新紀錄
    const { postInventory } = inventoryStore;
    const { postPantry } = pantryStore;
    const saveLeftoverInventories = async () => {
        // 如果來源不是隨買隨煮，則不需要將剩餘食材加入庫存
        if (source.value !== 'buyAndCook') {
            console.log('來源不是隨買隨煮，跳過保存剩餘食材的步驟');
            return;
        }

        console.log('保存剩餘食材至庫存中:', leftInventories.value);
        // 確認 leftInventories.value 是否有元素
        if (!leftInventories.value || leftInventories.value.length === 0) {
            console.log('leftInventories 是空的，沒有剩餘食材需要保存');
            return;
        }
        for (const inventory of leftInventories.value) {
            // 添加到庫存中
            console.log(`嘗試保存食材: ${inventory.ingredientName}，數量: ${inventory.quantity}`);
            try {
                // 添加到庫存中
                await postInventory(inventory);
                // 更新 pantry 紀錄
                await postPantry({
                    userId: inventory.userId,
                    ownerId: inventory.userId,
                    ingredientId: inventory.ingredientId,
                    quantity: inventory.quantity,
                    action: '增加',
                });
                console.log(`成功保存剩餘食材: ${inventory.ingredientName}`);
            } catch (error) {
                console.error(`保存剩餘食材 ${inventory.ingredientName} 時發生錯誤:`, error);
            }
        }

        try {
            await fetchInventories();
        } catch (error) {
            console.error('刷新庫存失敗:', error);
        }
    };
    const updateCookingInventories = (usedIngredients) => {
        if (!Array.isArray(usedIngredients)) {
            console.error('usedIngredients 不是一個有效的數組:', usedIngredients);
            return;
        }
    
        console.log('開始更新 cookingInventories，usedIngredients:', usedIngredients);
    
        // 遍歷使用過的食材
        usedIngredients.forEach((usedIngredient) => {
            // 在 cookingInventories 中找到對應的食材
            const inventoryItem = cookingInventories.value.find(
                (item) => item.ingredientName === usedIngredient.name
            );
    
            // 如果找到了對應的食材，減去用掉的數量
            if (inventoryItem) {
                // 確保 quantity 是數字型別
                inventoryItem.quantity = parseFloat(inventoryItem.quantity);
    
                console.log(`正在更新食材: ${inventoryItem.ingredientName}, 原本數量: ${inventoryItem.quantity}, 使用數量: ${usedIngredient.quantity}`);
                inventoryItem.quantity -= usedIngredient.quantity;
    
                // 確保數量不會變成負數
                if (inventoryItem.quantity < 0) {
                    inventoryItem.quantity = 0;
                }
    
                console.log(`更新後的數量: ${inventoryItem.quantity}`);
            } else {
                console.warn(`找不到對應的食材，ingredientId: ${usedIngredient.ingredientId}`);
            }
        });
    
        // 更新 LocalStorage 中的 cookingInventories
        localStorage.setItem('cookingInventories', JSON.stringify(cookingInventories.value));
        console.log('更新完畢後的 cookingInventories:', cookingInventories.value);
    };
    
    
    ////動態操作結束

    return {
        cookingInventories,
        leftInventories,
        isShowingString,
        isUsingInventory,
        isSet,
        resetCookingInventories,
        setCookingInventories,
        saveLeftoverInventories,
        updateCookingInventories,
    };
});
