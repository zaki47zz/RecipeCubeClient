import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useRecipeFilterStore = defineStore('recipeFilterStore', () => {
    const filters = ref({
        category: '',
        subcategory: '',
        searchWord: '',
        searchType: '',
        restriction: '',
        style: '',
    });

    const selectedIngredients = ref([]);

    const categoryOptions = {
        主餐: ['麵食', '飯食', '粥', '排餐', '鹹派', '火鍋', '焗烤'],
        副餐: ['肉類料理', '青菜料理', '海鮮料理'],
        湯品: ['無'],
        甜點: ['甜', '鹹'],
    };

    const subcategoryOptions = computed(() => {
        if (filters.value.category) {
            return categoryOptions[filters.value.category] || [];
        }
        return [];
    });

    function resetFilters() {
        filters.value = {
            category: '',
            subcategory: '',
            searchWord: '',
            searchType: '',
            restriction: '',
            westEast: '',
        };
        selectedIngredients.value = [];
    }

    return {
        filters,
        selectedIngredients,
        categoryOptions,
        subcategoryOptions,
        resetFilters,
    };
});
