import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useIngredientStore = defineStore('ingredientStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const ingredientApiURL = `${BaseURL}/Ingredients`;

    const ingredients = ref([]);
    const ingredientsDefaultExpireDay = ref({}); //用來存每個食材的預設過期日

    const fetchIngredients = async () => {
        try {
            const response = await fetch(ingredientApiURL);
            if (!response.ok) {
                console.log('網路連線有異常');
                return;
            }
            const data = await response.json();
            ingredients.value = data;

            // 利用 reduce 將 ingredientId 和 expiryDate 存進一個物件中
            ingredientsDefaultExpireDay.value = ingredients.value.reduce((acc, ingredient) => {
                acc[ingredient.ingredientId] = ingredient.expiryDate;
                return acc;
            }, {});
        } catch (error) {
            console.error('API出現錯誤: ', error);
        }
    };

    const getDefaultExpiryDate = (ingredientId) => {
        const defaultExpiryDays = ingredientsDefaultExpireDay.value[ingredientId]; //抓預設天數
        const expiryDate = new Date(); //抓今天日期
        expiryDate.setDate(expiryDate.getDate() + defaultExpiryDays); //今天日期加預設天數
        return expiryDate; //回傳預設日期
    };

    return { ingredients, fetchIngredients, getDefaultExpiryDate };
});
