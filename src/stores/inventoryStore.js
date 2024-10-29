import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useIngredientStore } from './ingredientStore';
import { usePantryStore } from './pantryStore';

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
            inventories.value = data.map((inventory) => ({
                ...inventory,
                synonymArray: inventory.synonym?.split(',').map((synonym) => synonym.trim()) || [],
            }));
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
                    IsExpiring: false,
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

        const frequentlyUsedIngredientIds = (await getFrequentlyUsedIngredients(0.05)).map(
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

        try {
            // 獲取當前用戶ID
            const userId = localStorage.getItem('UserId');
            console.log('當前用戶ID:', userId);

            // 遍歷每個需要的食材，從庫存中找到對應的項目
            for (const ingredient of recipeIngredients) {
                console.log(`處理食材: ${ingredient.ingredientName}`);
                // 找到所有符合 ingredientId 且屬於當前用戶的庫存項目，並按過期日期排序（優先使用快過期的）
                let inventoryItems = inventories.value
                    .filter(item => {
                        const expiryDate = new Date(item.expiryDate);
                        return item.ingredientId === ingredient.ingredientId
                            && item.userId === userId
                            && expiryDate >= new Date() // 過濾掉過期的項目
                            && !isNaN(expiryDate); // 確保日期有效
                    })
                    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

                let requiredQuantity = ingredient.requiredQuantity;

                for (const inventoryItem of inventoryItems) {
                    if (requiredQuantity <= 0) break;

                    console.log(`找到庫存項目，原本數量: ${inventoryItem.quantity}, 需求數量: ${requiredQuantity}`);
                    console.log(`庫存項目的 userId: ${inventoryItem.userId}, 當前 userId: ${userId}`);

                    // 計算本次需要消耗的數量
                    const quantityToDeduct = Math.min(inventoryItem.quantity, requiredQuantity);
                    inventoryItem.quantity -= quantityToDeduct;
                    requiredQuantity -= quantityToDeduct;

                    // 如果庫存數量小於等於 0，則刪除該項目
                    if (inventoryItem.quantity <= 0) {
                        console.log(`食材 ${inventoryItem.ingredientName} 的數量不夠或用完，將進行刪除`);
                        // 在刪除之前，先記錄當前的剩餘數量，這是最終被刪除的數量
                        const remainingQuantityBeforeDelete = inventoryItem.quantity + ingredient.requiredQuantity;
                        await deleteInventory(inventoryItem.inventoryId);
                        deletedIngredients.push(inventoryItem.ingredientName);
                        console.log(`已刪除食材: ${inventoryItem.ingredientName}`);

                        // 記錄刪除的食材到歷史紀錄
                        await pantryStore.postPantry(userId, inventoryItem.ingredientId, remainingQuantityBeforeDelete, '刪除');
                        console.log(`已記錄刪除的食材: ${inventoryItem.ingredientName}`);
                    } else {
                        // 更新庫存數量
                        console.log(`更新食材 ${inventoryItem.ingredientName} 的新數量為: ${inventoryItem.quantity}`);
                        await putInventory(inventoryItem);
                        updatedIngredients.push({
                            name: inventoryItem.ingredientName,
                            quantity: quantityToDeduct
                        });

                        // 記錄減少的食材數量到歷史紀錄
                        await pantryStore.postPantry(userId, inventoryItem.ingredientId, quantityToDeduct, '減少');
                        console.log(`已記錄減少的食材: ${inventoryItem.ingredientName}, 數量: ${quantityToDeduct}`);
                    }
                }

                if (requiredQuantity > 0) {
                    console.log(`食材 ${ingredient.ingredientName} 的庫存不足，仍需 ${requiredQuantity}`);
                }
            }

            // 刷新庫存數據
            await fetchInventories();
        } catch (error) {
            console.error('更新庫存失敗:', error);
            throw error;
        }

        // 列出被刪除和更新的食材列表
        console.log('刪除的食材列表:', deletedIngredients);
        console.log('更新的食材列表:', updatedIngredients);

        // 返回被刪除和更新的食材列表
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
