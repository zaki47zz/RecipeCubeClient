import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useIngredientStore = defineStore('ingredientStore', () => {
    const cookingInventories = ref([]);

    return { cookingInventories };
});
