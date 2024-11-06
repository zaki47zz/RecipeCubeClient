// stores/recipeStore.js
import { defineStore } from 'pinia';

export const useRecipeStore = defineStore('recipeStore', {
    state: () => ({
        recipes: [],
        selectedRecipe: null,
        dialogVisible: false, // 新增這個狀態來控制 Dialog 是否顯示
        editingRecipe: null, // 用於保存當前編輯的食譜
        isEditMode: false, // 用於區分新增或編輯模式
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
                // console.log(data);
                // 過濾掉狀態為 false 的食譜
                const activeRecipes = data.filter(recipe => recipe.status !== false);
                this.recipes = activeRecipes;

                this.totalRecipes = activeRecipes.length;
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
                // console.log('獲取到的食譜詳細資料:', data);
                this.selectedRecipe = data; // 將返回的詳細食譜資料賦值給 selectedRecipe
                localStorage.setItem('selectedRecipe', JSON.stringify(data)); // 將詳細食譜保存到 localStorage
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        saveSelectedRecipe() {
            // console.log("saveSelectedRecipe");
            const storedRecipe = localStorage.getItem('selectedRecipe');
            if (storedRecipe) {
                this.selectedRecipe = JSON.parse(storedRecipe);
                // console.log(this.saveSelectedRecipe)
            }
        },
        setEditMode(isEditMode) {
            this.isEditMode = isEditMode; // 設置是否為編輯模式
        },
        setEditingRecipe(recipe) {
            this.editingRecipe = recipe; // 設置當前正在編輯的食譜
        },
        clearEditingRecipe() {
            this.editingRecipe = null; // 清除編輯中的食譜
            this.isEditMode = false; // 重置編輯模式狀態
        },
        async saveRecipe() {
            const BaseURL = import.meta.env.VITE_API_BASEURL;
            const ApiURL = `${BaseURL}/Recipes`;
            const method = this.isEditMode ? 'PUT' : 'POST'; // 根據模式確定使用 POST 或 PUT
            const url = this.isEditMode ? `${ApiURL}/${this.editingRecipe.recipeId}` : ApiURL;

            const formData = new FormData();
            Object.entries(this.editingRecipe).forEach(([key, value]) => {
                formData.append(key, value);
            });

            try {
                const response = await fetch(url, {
                    method: method,
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('儲存食譜失敗');
                }
                const data = await response.json();
                console.log('Recipe saved successfully:', data);
                // 更新 recipes 列表
                await this.fetchRecipes();
                this.clearEditingRecipe();
            } catch (error) {
                console.error('Error saving recipe:', error);
            }
        },
        async deleteRecipe (recipeId, status) {
            try {
                const BaseURL = import.meta.env.VITE_API_BASEURL;

                const response = await fetch(`${BaseURL}/Recipes/${recipeId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status }),
                });
    
                if (!response.ok) {
                    console.log("刪除食譜失敗")
                    throw new Error('Failed to update recipe status');
                }
            } catch (error) {
                console.error('Error updating recipe status:', error);
                throw error;
            }
        }
    }
});
