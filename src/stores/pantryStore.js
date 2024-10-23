import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePantryStore = defineStore('pantryStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const pantryApiURL = `${BaseURL}/PantryManagements`;
    const userId = localStorage.getItem('UserId');
    const pantriesURL = `${pantryApiURL}/${userId}`;

    const pantries = ref([]);

    const fetchPantries = async () => {
        try {
            const response = await fetch(pantriesURL);
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            const data = await response.json();
            pantries.value = data;
        } catch (error) {
            console.error('獲取紀錄資料失敗:', error);
            throw error;
        }
    };

    const postPantry = async (inventory, quantity, action) => {
        try {
            const response = await fetch(pantryApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PantryId: 0,
                    UserId: inventory.userId,
                    GroupId: inventory.groupId,
                    IngredientId: inventory.ingredientId,
                    Quantity: quantity,
                    action: action,
                    time: new Date(),
                }),
            });
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            await fetchPantries();
        } catch (error) {
            console.error('紀錄失敗:', error);
            throw error;
        }
    };

    return { pantries, fetchPantries, postPantry };
});
