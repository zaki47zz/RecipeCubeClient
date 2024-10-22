// stores/recipeStore.js
import { defineStore } from 'pinia';

export const useRecipeStore = defineStore('recipeStore', {
    state: () => ({
        recipes: [],
        selectedRecipe: null,
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
            this.selectedRecipe = recipe;
            this.dialogVisible = true; // 顯示 Dialog
        },
        closeDialog() {
            this.dialogVisible = false; // 隱藏 Dialog
        },
    }
});
