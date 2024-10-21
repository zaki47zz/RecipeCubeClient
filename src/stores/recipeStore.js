// stores/recipeStore.js
import { defineStore } from 'pinia';
import { nextTick } from 'vue';
export const useRecipeStore = defineStore('recipeStore', {
    state: () => ({
        recipes: [],
        selectedRecipe: null,
        currentPage: 1,
        pageSize: 8,
        totalRecipes: 0,
        dialogVisible: false, // 新增這個狀態來控制 Dialog 是否顯示
    }),
    actions: {
        async fetchRecipes() {
            const BaseURL = import.meta.env.VITE_API_BASEURL;
            const ApiURL = `${BaseURL}/Recipes`;

            try {
                const response = await fetch(ApiURL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                this.recipes = data;
                this.totalRecipes = data.length;
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        selectRecipe(recipe) {
            console.log('selected');
            this.selectedRecipe = recipe;
            console.log('recipe:', recipe);
            console.log('be:', this.dialogVisible);
            this.dialogVisible = true; // 顯示 Dialog
            console.log('after:', this.dialogVisible);
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        closeDialog() {
            this.dialogVisible = false; // 隱藏 Dialog
        },
    },
    getters: {
        totalPages: (state) => Math.ceil(state.totalRecipes / state.pageSize),
        paginatedRecipes: (state) => {
            const start = (state.currentPage - 1) * state.pageSize;
            const end = start + state.pageSize;
            return state.recipes.slice(start, end);
        },
    },
});
