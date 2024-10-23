import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useIngredientStore } from './ingredientStore';

export const useInventoryStore = defineStore('inventoryStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const inventoryApiURL = `${BaseURL}/Inventories`;
    const userId = localStorage.getItem('UserId');
    const groupId = localStorage.getItem('GroupId');
    const InventoriesURL = `${inventoryApiURL}/${userId}`;
    const ingredientStore = useIngredientStore();
    const { fetchIngredients, getDefaultExpiryDate } = ingredientStore;

    const inventories = ref([]); //庫存放這
    const ingredientCategory = ref(new Set()); //分類放這，用Set避免重複

    const fetchInventories = async () => {
        const response = await fetch(InventoriesURL);
        if (!response.ok) {
            console.log('網路連線有異常');
        }
        const data = await response.json();
        inventories.value = data.map((inventory) => ({
            //因為陣列每項inventory都是物件，要用物件角度思考
            ...inventory, //...展開式表示把原先物件內容還原
            synonymArray: inventory.synonym.split(',').map((synonym) => synonym.trim()), //加入新的一項，拆分synonym然後去空白轉陣列
        }));
        ingredientCategory.value = new Set(inventories.value.map((i) => i.category)); //利用map回傳陣列存進set再存進ref set
    };

    const postInventory = async (
        ingredientId,
        quantity,
        expiryDate = getDefaultExpiryDate(ingredientId),
        visibility = false //true是私人，false是群組
    ) => {
        await fetchIngredients(); //要先更新ingredient裡的預設過期日期
        const postURL = `${inventoryApiURL}`;
        const response = await fetch(putURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserId: userId,
                GroupId: groupId,
                IngredientId: ingredientId,
                Quantity: quantity,
                ExpiryDate: expiryDate,
                IsExpiring: false,
                Visibility: visibility,
            }),
        });
        if (!response.ok) {
            console.log('新增失敗，網路連線有異常');
        }
    };

    const deleteInventory = async (inventoryId) => {
        const deleteURL = `${inventoryApiURL}/${inventoryId}`;
        const response = await fetch(deleteURL, { method: 'DELETE' });
        if (!response.ok) {
            console.log('刪除失敗，網路連線有異常');
        }
    };

    const putInventory = async (inventory) => {
        const putURL = `${inventoryApiURL}/${inventory.inventoryId}`;
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
            console.log('修改失敗，網路連線有異常');
        }
    };

    return { inventories, ingredientCategory, fetchInventories, postInventory, deleteInventory, putInventory };
});
