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
                console.log(data);
                this.recipes = data;
                this.totalRecipes = data.length;
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        selectRecipe(recipe) {
            console.log('Selected Recipe:', recipe); // 確認選擇的食譜是否正確
            // 透過食譜 ID 獲取完整的食譜資料
            this.fetchRecipeDetail(recipe.recipeId);
            this.dialogVisible = true; // 顯示 Dialog
        },
        closeDialog() {
            this.dialogVisible = false; // 隱藏 Dialog
        },
        async fetchRecipeDetail(recipeId) {
            const BaseURL = import.meta.env.VITE_API_BASEURL;
            const ApiURL = `${BaseURL}/Recipes/${recipeId}`; // 使用 GET 方法來獲取詳細資料

            try {
                const response = await fetch(ApiURL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('獲取到的食譜詳細資料:', data);
                this.selectedRecipe = data; // 將返回的詳細食譜資料賦值給 selectedRecipe
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
    }
});
