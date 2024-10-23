<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRecipeStore } from '@/stores/recipeStore'; // 引入 Pinia Store
import RecipeDetailComponent from '@/components/RecipeDetailComponent.vue';

const recipeStore = useRecipeStore(); // 使用 Pinia Store
// 在組件加載後獲取數據
onMounted(() => {
    recipeStore.fetchRecipes();
});

const filters = ref({
    category: '',
    subcategory: '',
    searchWord: '',
    searchType: '',
    restriction: '',
    style: '',
});

const categoryOptions = {
    "主餐": ["麵食", "飯食", "粥", "排餐", "鹹派", "火鍋", "焗烤"],
    "副餐": ["肉類料理", "青菜料理", "海鮮料理"],
    "湯品": ["無"],
    "甜點": ["甜", "鹹"]
};
const subcategoryOptions = computed(() => {
    // console.log(filters.value)
    if (filters.value.category) {
        return categoryOptions[filters.value.category] || [];
    }
    return [];
});
//清空子類別
watch(() => filters.value.category, () => {
    filters.value.subcategory = '';
});
// 根據搜尋條件和篩選條件過濾食譜
const filteredRecipes = computed(() => {
    return recipeStore.recipes.filter(recipe => {
        const searchWordMatch = !filters.value.searchWord || recipe.recipeName.toLowerCase().includes(filters.value.searchWord.toLowerCase());
        // 葷素篩選
        const restrictionMatch =
            filters.value.restriction === '' || recipe.restriction === filters.value.restriction;
        // 中西式篩選
        const styleMatch = filters.value.style === '' || recipe.westEast === filters.value.style;
        return searchWordMatch && restrictionMatch && styleMatch;
    });
});
const resetActiveStep = ref(false);
// Create a ref for the scrollable container
const scrollContainer = ref(null);
const onDialogOpened = () => {
    if (scrollContainer.value) {
        const psInstance = scrollContainer.value.$el; // Get the underlying DOM element of PerfectScrollbar
        psInstance.scrollTop = 0; // Reset the scroll position to top
    }
    // console.log("Selected Recipe:", recipeStore.selectedRecipe);
    resetActiveStep.value = true;
    // 確保這個重置只發生一次
    setTimeout(() => {
        resetActiveStep.value = false;
    }, 0);
};
</script>

<template>
    <div class="d-flex justify-content-center">
        <h4>參考已有食譜</h4>
    </div>
    <div class="sidebar-body">
        <!-- 搜尋欄 -->
        <div class="search-box mb-3">
            <input type="text" v-model="filters.searchWord" class="form-control w-100" placeholder="搜尋" />
            <!-- <span>{{ filters.searchWord }}</span> -->
        </div>
        <hr />
        <!-- 篩選按鈕 -->
        <div class="filter-buttons mb-3">
            <select class="form-select w-100 mb-2" v-model="filters.restriction">
                <option value="">選擇葷素食</option>
                <option :value="true">素食</option>
                <option :value="false">葷食</option>
            </select>
            <select class="form-select w-100 mb-2" v-model="filters.style">
                <option value="">選擇中西式</option>
                <option :value="false">中式</option>
                <option :value="true">西式</option>
            </select>
            <select class="form-select w-100 mb-2" v-model="filters.category">
                <option value="">選擇主類別</option>
                <option v-for="(subcategories, category) in categoryOptions" :key="category" :value="category">
                    {{ category }}
                </option>
            </select>
            <select class="form-select w-100 mb-2" v-model="filters.subcategory">
                <option value="">選擇細部類別</option>
                <option v-for="subcategory in subcategoryOptions" :key="subcategory" :value="subcategory">
                    {{ subcategory }}
                </option>
            </select>
        </div>
        <hr />
        <!-- 食譜列表 -->
        <ul class="list-group list-group-flush">
            <li v-for="recipe in filteredRecipes.slice(0, 20)" :key="recipe.recipeName"
                class="list-group-item list-group-item-action" @click="recipeStore.selectRecipe(recipe)">
                {{ recipe.recipeName }}
            </li>
        </ul>
        <!-- 食譜詳細資訊對話框 -->
        <el-dialog v-model="recipeStore.dialogVisible" title="食譜詳細資訊" width="75%" center @opened="onDialogOpened">
            <PerfectScrollbar ref="scrollContainer" class="custom-scroll-container">
                <div class="dialog-content">
                    <RecipeDetailComponent :recipe="recipeStore.selectedRecipe" :reset-active-step="resetActiveStep"
                        v-if="recipeStore.selectedRecipe" />
                </div>
            </PerfectScrollbar>
            <span slot="footer" class="dialog-footer d-flex justify-content-center m-3">
                <el-button @click="recipeStore.closeDialog" type="danger">關閉</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style lang="css" scoped>
.custom-scroll-container {
    max-height: 300px;
    overflow: hidden;
}

.dialog-content {
    max-height: 100%;
    padding-right: 15px;
    /* Adjust as needed to avoid content overflow */
}
</style>