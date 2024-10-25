import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePantryStore = defineStore('pantryStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const pantryApiURL = `${BaseURL}/PantryManagements`;
    const userId = localStorage.getItem('UserId');
    const groupId = localStorage.getItem('GroupId');
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

    const postPantry = async (userId, ingredientId, quantity, action) => {
        try {
            const response = await fetch(pantryApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PantryId: 0,
                    UserId: userId,
                    GroupId: groupId,
                    IngredientId: ingredientId,
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

    const getFrequentlyUsedIngredients = () => {
        //找出歷史紀錄裡出現過次數超過總次數10%以上的食材
    };

    return { pantries, fetchPantries, postPantry, getFrequentlyUsedIngredients };
});
