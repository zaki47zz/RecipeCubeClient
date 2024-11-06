import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useIngredientStore } from './ingredientStore';
import { usePantryStore } from './pantryStore';
import { useCookingStore } from './cookingStore';
export const useInventoryStore = defineStore('inventoryStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const inventoryApiURL = `${BaseURL}/Inventories`;
    const userId = localStorage.getItem('UserId');
    const groupId = localStorage.getItem('GroupId');
    const InventoriesURL = `${inventoryApiURL}/${userId}`;
    const ingredientStore = useIngredientStore();
    const { getDefaultExpiryDate } = ingredientStore;
    const pantryStore = usePantryStore();
    const { getFrequentlyUsedIngredients } = pantryStore;

    const inventories = ref([]); //庫存放這
    const ingredientCategory = ref(new Set()); //分類放這，用Set避免重複

    const fetchInventories = async () => {
        try {
            const response = await fetch(InventoriesURL);
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            const data = await response.json();

            inventories.value = data
                .map((inventory) => {
                    // 檢查條件，只有符合條件的項目才會返回轉換後的對象
                    if (inventory.userId === userId || (!inventory.visibility && inventory.userId !== userId)) {
                        return {
                            ...inventory,
                            synonymArray: inventory.synonym?.split(',').map((synonym) => synonym.trim()) || [],
                        };
                    }
                    return null; // 如果不符合條件，返回 null
                })
                .filter((inventory) => inventory !== null); // 過濾掉 null 值

            ingredientCategory.value = new Set(inventories.value.map((i) => i.category));
        } catch (error) {
            console.error('獲取庫存資料失敗:', error);
            throw error;
        }
    };

    const postInventory = async ({ ingredientId, quantity, expiryDate, visibility }) => {
        // 在函數內部處理預設值
        const finalExpiryDate = expiryDate ?? (await getDefaultExpiryDate(ingredientId));
        const finalVisibility = visibility ?? false;

        try {
            const response = await fetch(inventoryApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    InventoryId: 0,
                    GroupId: groupId,
                    UserId: userId,
                    IngredientId: ingredientId,
                    Quantity: quantity,
                    ExpiryDate: finalExpiryDate,
                    Visibility: finalVisibility,
                }),
            });
            if (!response.ok) {
                throw new Error('新增失敗，網路連線有異常');
            }
            await fetchInventories();
        } catch (error) {
            console.error('新增庫存失敗:', error);
            throw error;
        }
    };

    const deleteInventory = async (inventoryId) => {
        try {
            const deleteURL = `${inventoryApiURL}/${inventoryId}`;
            const response = await fetch(deleteURL, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('刪除失敗，網路連線有異常');
            }
            await fetchInventories();
        } catch (error) {
            console.error('刪除庫存失敗:', error);
            throw error;
        }
    };

    const putInventory = async (inventory) => {
        try {
            const putURL = `${inventoryApiURL}/${inventory.inventoryId}`;
            console.log(putURL);
            const response = await fetch(putURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    InventoryId: inventory.inventoryId,
                    UserId: inventory.userId,
                    GroupId: inventory.groupId,
                    IngredientId: inventory.ingredientId,
                    Quantity: inventory.quantity,
                    ExpiryDate: inventory.expiryDate,
                    IsExpiring: inventory.isExpiring,
                    Visibility: inventory.visibility,
                }),
            });
            if (!response.ok) {
                throw new Error('修改失敗，網路連線有異常');
            }
            await fetchInventories();
        } catch (error) {
            console.error('修改庫存失敗:', error);
            throw error;
        }
    };

    const getRunningOutIngredients = async () => {
        if (!inventories.value.length) await fetchInventories();

        const frequentlyUsedIngredientIds = (await getFrequentlyUsedIngredients(0.1)).map(
            (ingredient) => ingredient.ingredientId
        );
        const frequentlyUsedIngredients = inventories.value
            .filter(
                (ingredient) =>
                    frequentlyUsedIngredientIds.includes(ingredient.ingredientId) && ingredient.isExpired === false
            )
            .map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                ingredientName: ingredient.ingredientName,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                source: '常用食材',
            }));
        const isExpiredIngredients = inventories.value
            .filter((inventory) => inventory.isExpired === true)
            .map((inventory) => ({ ...inventory, source: '已經過期' }));

        const runningOutIngredients = [...frequentlyUsedIngredients, ...isExpiredIngredients];
        return runningOutIngredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredient.ingredientName,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            source: ingredient.source,
        }));
    };

    const updateInventoriesAfterCooking = async (recipeIngredients) => {
        console.log('進行更新庫存的食材:', recipeIngredients);
        const deletedIngredients = []; // 存儲被刪除的食材
        const updatedIngredients = []; // 存儲更新過的食材
        const cookingStore = useCookingStore();
        const { leftInventories } = storeToRefs(cookingStore);
        try {
            const userId = localStorage.getItem('UserId');
            const groupId = localStorage.getItem('GroupId');
            const source = localStorage.getItem('source');
            // console.log('leftInventories before update:', cookingStore.leftInventories);
            // leftInventories.value = [];
            // 遍歷每個需要的食材，從庫存中找到對應的項目
            for (const ingredient of recipeIngredients) {
                // console.log(`處理食材: ${ingredient.ingredientName}`);
                // console.log(`日期: ${ingredient.expiryDate}`);

                if (source === 'buyAndCook') {
                    // 確保 ingredient.quantity 和 ingredient.requiredQuantity 是數字
                    const quantity = Number(ingredient.remainingQuantity);
                    const requiredQuantity = Number(ingredient.requiredQuantity);
                    // 隨買隨煮的處理方式，這裡不需查找庫存，直接更新數量
                    let remainingQuantity = quantity - requiredQuantity;
                    // console.log('buyAndCook:', remainingQuantity);
                    if (remainingQuantity <= 0) {
                        // console.log(`食材 ${ingredient.ingredientName} 已用完，將刪除`);
                        deletedIngredients.push(ingredient.ingredientName);
                        // 如果有紀錄隨買隨煮的歷史紀錄，可以在這裡新增記錄
                    } else {
                        // console.log(`更新隨買隨煮的食材 ${ingredient.ingredientName} 的剩餘數量為: ${remainingQuantity}`);
                        updatedIngredients.push({
                            name: ingredient.ingredientName,
                            quantity: requiredQuantity,
                        });

                        leftInventories.value = [
                            ...leftInventories.value,
                            {
                                ingredientId: ingredient.ingredientId,
                                ingredientName: ingredient.ingredientName,
                                quantity: remainingQuantity,
                                unit: ingredient.unit,
                                userId: userId,
                                groupId: groupId,
                                expiryDate: ingredient.expiryDate || new Date().toISOString().split('T')[0],
                                visibility: ingredient.visibility || false,
                            },
                        ];
                    }
                } else {
                    console.log('庫存管理的烹飪');
                    // console.log('庫存數據:', inventories.value);
                    // 正常庫存處理方式
                    let inventoryItems = inventories.value
                        .filter((item) => {
                            console.log('正在檢查庫存項目:', item);

                            // 解析 item.expiryDate 並設置時間為 00:00:00
                            const expiryDate = new Date(item.expiryDate);
                            expiryDate.setHours(0, 0, 0, 0);

                            // 獲取當前日期並設置時間為 00:00:00
                            const currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0);

                            const matchesIngredient = item.ingredientId === ingredient.ingredientId;
                            const matchesUser = item.userId === userId;
                            const notExpired = expiryDate >= currentDate && !isNaN(expiryDate);

                            console.log(`庫存項目: ${item.ingredientName}, 檢查條件: `);
                            console.log(`符合食材 ID: ${matchesIngredient}`);
                            console.log(`符合使用者 ID: ${matchesUser}`);
                            console.log(`過期日期: ${expiryDate}, 當前日期: ${currentDate}`);
                            console.log(`未過期且日期有效: ${notExpired}`);

                            return matchesIngredient && matchesUser && notExpired;
                        })
                        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

                    console.log('過濾後的庫存項目:', inventoryItems);
                    let requiredQuantity = ingredient.requiredQuantity;

                    for (const inventoryItem of inventoryItems) {
                        if (requiredQuantity <= 0) break;

                        console.log(`找到庫存項目，原本數量: ${inventoryItem.quantity}, 需求數量: ${requiredQuantity}`);

                        // 計算本次需要消耗的數量
                        const quantityToDeduct = Math.min(inventoryItem.quantity, requiredQuantity);
                        inventoryItem.quantity -= quantityToDeduct;
                        requiredQuantity -= quantityToDeduct;
                        console.log('更新後的庫存項目:', inventoryItem);

                        if (inventoryItem.quantity <= 0) {
                            console.log(`食材 ${inventoryItem.ingredientName} 的數量不夠或用完，將進行刪除`);
                            const remainingQuantityBeforeDelete = inventoryItem.quantity + ingredient.requiredQuantity;
                            await deleteInventory(inventoryItem.inventoryId);
                            deletedIngredients.push(inventoryItem.ingredientName);

                            await pantryStore.postPantry(
                                userId,
                                inventoryItem.ingredientId,
                                remainingQuantityBeforeDelete,
                                '刪除'
                            );
                            console.log(`已記錄刪除的食材: ${inventoryItem.ingredientName}`);
                        } else {
                            console.log(
                                `更新食材 ${inventoryItem.ingredientName} 的新數量為: ${inventoryItem.quantity}`
                            );
                            await putInventory(inventoryItem);
                            updatedIngredients.push({
                                name: inventoryItem.ingredientName,
                                quantity: quantityToDeduct,
                            });

                            await pantryStore.postPantry(userId, inventoryItem.ingredientId, quantityToDeduct, '減少');
                            console.log(`已記錄減少的食材: ${inventoryItem.ingredientName}, 數量: ${quantityToDeduct}`);
                        }
                    }
                    if (requiredQuantity > 0) {
                        console.log(`食材 ${ingredient.ingredientName} 的庫存不足，仍需 ${requiredQuantity}`);
                    }
                }
            }
            await fetchInventories();
        } catch (error) {
            console.error('更新庫存失敗:', error);
            throw error;
        }

        console.log('刪除的食材列表:', deletedIngredients);
        console.log('更新的食材列表:', updatedIngredients);

        return { deletedIngredients, updatedIngredients };
    };

    return {
        inventories,
        ingredientCategory,
        fetchInventories,
        postInventory,
        deleteInventory,
        putInventory,
        getRunningOutIngredients,
        updateInventoriesAfterCooking,
    };
});
