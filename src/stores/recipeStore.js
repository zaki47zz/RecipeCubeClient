import { defineStore } from 'pinia';

export const useRecipeStore = defineStore('recipeStore', {
  state: () => ({
    recipes: [],
    selectedRecipe: null,
    currentPage: 1,
    pageSize: 8,
    totalRecipes: 0
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
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  getters: {
    totalPages: (state) => Math.ceil(state.totalRecipes / state.pageSize),
    paginatedRecipes: (state) => {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      return state.recipes.slice(start, end);
    }
  }
});
