import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useIngredientStore = defineStore('ingredientStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const ingredientApiURL = `${BaseURL}/Ingredients`;

    const ingredients = ref([]);
    const groupedIngredients = ref([]);
    const ingredientCategory = ref(new Set());
    const ingredientsDefaultExpireDay = ref({}); //用來存每個食材的預設過期日

    const fetchIngredients = async () => {
        try {
            const response = await fetch(ingredientApiURL);
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            const data = await response.json();
            //存入回傳資料的同時把同義字拆分成陣列方便操作
            ingredients.value = data.map((ingredient) => ({
                ...ingredient,
                //加入synonymArray屬性，"||空陣列"確保他一直都是陣列
                synonymArray: ingredient.synonym?.split(',').map((synonym) => synonym.trim()) || [],
            }));
            //利用Category將ingredients分group(給multiselect用的)
            groupedIngredients.value = data.reduce((acc, ingredient) => {
                // 如果該group不存在，先創建一個group
                let category = acc.find((group) => group.category === ingredient.category);
                if (!category) {
                    category = { category: ingredient.category, ingredients: [] };
                    acc.push(category);
                }
                // 將食材加入對應group
                category.ingredients.push(ingredient);
                return acc;
            }, []);
            //單獨抓出分類資料
            ingredientCategory.value = new Set(ingredients.value.map((i) => i.category));
            // 利用 reduce 將 ingredientId 和 expiryDate 存進物件中
            ingredientsDefaultExpireDay.value = ingredients.value.reduce((acc, ingredient) => {
                acc[ingredient.ingredientId] = ingredient.expiryDate;
                return acc;
            }, {});
        } catch (error) {
            console.error('獲取食材資料失敗:', error);
            throw error;
        }
    };

    const postIngredient = async (formData) => {
        try {
            const response = await fetch(ingredientApiURL, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('新增失敗，網路連線有異常');
            }
            await fetchIngredients();
        } catch (error) {
            console.error('新增食材失敗:', error);
            throw error;
        }
    };

    const getDefaultExpiryDate = (ingredientId) => {
        fetchIngredients();
        const defaultExpiryDays = ingredientsDefaultExpireDay.value[ingredientId]; //抓預設天數
        const expiryDate = new Date(); //抓今天日期
        expiryDate.setHours(0, 0, 0, 0);
        expiryDate.setDate(expiryDate.getDate() + defaultExpiryDays); //今天日期加預設天數
        return expiryDate; //回傳預設日期
    };

    return {
        ingredients,
        groupedIngredients,
        ingredientCategory,
        fetchIngredients,
        postIngredient,
        getDefaultExpiryDate,
    };
});
