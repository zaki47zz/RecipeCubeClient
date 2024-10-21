<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRecipeStore } from '@/stores/recipeStore';
import Swal from 'sweetalert2';
import BannerRecipe from '@/assets/img/ForBackground/banner-recipe.jpg';

import RecipeDetailComponent from '@/components/RecipeDetailComponent.vue';

// 使用 Pinia 的 recipeStore
const recipeStore = useRecipeStore();

const recipes = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const BaseURL = import.meta.env.VITE_API_BASEURL; // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const ApiURL = `${BaseURL}/Recipes`;

// 使用fetch獲取數據
const fetchRecipes = async () => {
    try {
        const response = await fetch(ApiURL); // 替換為你的 API URL
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        recipes.value = data; // 將獲取到的數據存入 recipes 變量
        // totalRecipes.value = recipes.value.length;
        // console.log(recipes)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// 在組件加載後獲取數據
onMounted(() => {
    fetchRecipes();

});
const getRecipeImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/recipe/${fileName}`;
};
const resetActiveStep = ref(false);

// 當打開對話框時，重置子組件中的 activeStep
const onDialogOpened = () => {
    resetActiveStep.value = true;
    // 確保這個重置只發生一次
    setTimeout(() => {
        resetActiveStep.value = false;
    }, 0);
};

//搜尋功能
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

const filteredRecipes = computed(() => {
    const searchWords = filters.value.searchWord.split(',').map(word => word.trim().toLowerCase());
    return recipes.value.filter((recipe) => {
        // 分類篩選
        const categoryMatch = !filters.value.category || recipe.category === filters.value.category;

        // 細部類別篩選
        const subcategoryMatch = !filters.value.subcategory || recipe.detailedCategory === filters.value.subcategory;


        let searchMatch = true;

        // 如果沒有選擇搜尋類型，預設不篩選
        if (filters.value.searchType === '') {
            searchMatch = true; // 沒有選擇類型時，搜尋條件為 true，代表不篩選
        } else if (filters.value.searchType === 'recipeName') {
            // 搜尋食譜名稱
            searchMatch = searchWords.every(word => {
                return !word || recipe.recipeName.toLowerCase().includes(word);
            });
        } else if (filters.value.searchType === 'ingredient') {
            // 搜尋食材名稱（包括同義字）
            searchMatch = searchWords.every(word => {
                return (
                    !word ||
                    (recipe.selectedIngredientNames && recipe.selectedIngredientNames.some(ingredient => ingredient.toLowerCase().includes(word))) ||
                    (recipe.synonyms && recipe.synonyms.some(synonym => synonym.toLowerCase().includes(word)))
                );
            });
        }

        // 葷素篩選
        const restrictionMatch =
            filters.value.restriction === '' || recipe.restriction === filters.value.restriction;


        // 中西式篩選
        const styleMatch = filters.value.style === '' || recipe.westEast === filters.value.style;

        // 必須符合所有條件
        return categoryMatch && subcategoryMatch && searchMatch && restrictionMatch && styleMatch;
    });
});
//清空子類別
watch(() => filters.value.category, () => {
    filters.value.subcategory = '';
});
watch(filters, () => {
    currentPage.value = 1; // 重置為第一頁
    console.log(filters.value)
}, { deep: true });
//搜尋功能end


//分頁功能 start

// all-data
const totalRecipes = computed(() => filteredRecipes.value.length);
const totalPages = computed(() => Math.ceil(totalRecipes.value / pageSize.value));

//該分頁所顯示的data
const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredRecipes.value.slice(start, end);
});


const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; // 當每頁顯示的數量改變時，重置到第一頁
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;

};

watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages) {
        currentPage.value = newTotalPages;
    }
});
//分頁功能 end

</script>

<template>
    <!-- 食譜header start -->
    <section class="banner-section">
        <div class="banner-ad bg-warning-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>食譜 Recipe</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>
    <!-- 食譜header end -->
    <!-- 推薦食譜 start -->
    <section class="pt-5">
        <div class="container-fluid">
            <div class="pt-5 rounded-4" :style="{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${BannerRecipe})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }">
                <div class="row p-3">
                    <div class="col-md-6 d-flex flex-column align-items-center">
                        <h2 class="mt-3 text-white">左思右想還是不知道煮什麼嗎?</h2>
                        <div class="d-flex gap-2 flex-wrap mb-5">
                            <button class="btn btn-lg bg-gradient-warning fs-6">推薦我食譜!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid mt-5">
            <div class="row">
                <div class="col-12 text-center">
                    <h3 style="color: lightslategray; display: block">- 或是 -</h3>
                    <h4 class="mt-3" style="color: lightslategray; display: block">利用檢索功能查找您想要的食譜</h4>
                </div>
            </div>
        </div>
    </section>
    <!-- 推薦食譜 end -->
    <!-- 搜尋食譜 start -->
    <section class="pt-3 p-2">
        <div class="container-fluid">
            <div class="col-sm-10 offset-sm-2 offset-md-0 col-lg-12 d-none d-lg-block">
                <div class="row g-3 py-1 px-3 mt-3 bg-warning-subtle rounded-4 shadow d-flex justify-content-between">
                    <!-- 分類欄 -->
                    <div class="col-md-2">
                        <p class="fw-bold">分類 CATEGORY</p>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select" v-model="filters.restriction">
                            <option value="">選擇葷素食</option>
                            <option :value="true">素食</option>
                            <option :value="false">葷食</option>
                        </select>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select" v-model="filters.style">
                            <option value="">選擇中西式</option>
                            <option :value="false">中式</option>
                            <option :value="true">西式</option>
                        </select>
                    </div>
                    <div class="col-md-3 my-auto">
                        <select class="form-select" v-model="filters.category">
                            <option value="">選擇主類別</option>
                            <option v-for="(subcategories, category) in categoryOptions" :key="category"
                                :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-3 my-auto">
                        <select class="form-select" v-model="filters.subcategory">
                            <option value="">選擇細部類別</option>
                            <option v-for="subcategory in subcategoryOptions" :key="subcategory" :value="subcategory">
                                {{ subcategory }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-3 mx-auto my-3">
                        <select class="form-select" v-model="filters.searchType">
                            <option value="">選擇搜尋食譜或食材</option>
                            <option value="recipeName">搜尋食譜名稱</option>
                            <option value="ingredient">搜尋食材名稱</option>
                        </select>
                    </div>
                    <div class="col-md-9 mx-auto my-3">
                        <input type="text" v-model="filters.searchWord" class="form-control w-100 rounded-3"
                            placeholder="輸入食譜名稱或食材 (一次輸入多種請用逗號分隔，例如: 青椒,蘋果)" />
                    </div>

                </div>
            </div>
        </div>
    </section>
    <!-- 搜尋食譜 end -->

    <!-- 顯示食譜 start -->
    <section class="recipe-list">
        <div class="container-fluid mt-3">
            <div class="row">
                <div class="col-md-12">
                    <div class="banner-ad bootstrap-tabs product-tabs p-3">
                        <div class="tabs-header d-flex justify-content-between">
                            <h3>食譜列表</h3>

                        </div>
                        <div>
                            <!-- 分頁導航 -->

                            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                                :total="totalRecipes" background layout="sizes, total, ->,prev, pager, next, jumper "
                                :page-sizes="[8, 12, 16, 20]" @size-change="handlePageSizeChange"
                                @current-change="handleCurrentChange"
                                class="mt-4 d-flex justify-content-end align-items-center gap-2">
                            </el-pagination>

                            <!-- 分頁導航結束 -->
                        </div>
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" id="nav-all" role="tabpanel"
                                aria-labelledby="nav-all-tab">
                                <div class="row g-3 mt-2">
                                    <div class="col-12 col-md-6" v-for="recipe in paginatedRecipes"
                                        :key="recipe.recipeId">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px" @click="recipeStore.selectRecipe(recipe)">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${getRecipeImageUrl(recipe.photo) || 'default_image.jpg'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">{{ recipe.recipeName }}</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary" v-if="recipe.restriction">素食</span>
                                                    <span class="badge bg-secondary" v-else>葷食</span>
                                                    <span class="badge bg-secondary" v-if="recipe.westEast">西式</span>
                                                    <span class="badge bg-secondary" v-else>中式</span>
                                                    <span class="badge bg-secondary">{{ recipe.category }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- 顯示食譜end -->
    <!-- Recipe Detail Component -->
    <!-- <RecipeDetailComponent v-if="recipeStore.selectedRecipe" :recipe="recipeStore.selectedRecipe">
    </RecipeDetailComponent> -->
    <el-dialog v-model="recipeStore.dialogVisible" title="食譜詳細資訊" width="80%" @close="recipeStore.closeDialog" center
        @opened="onDialogOpened">
        <RecipeDetailComponent :recipe="recipeStore.selectedRecipe" :reset-active-step="resetActiveStep"
            v-if="recipeStore.selectedRecipe">
        </RecipeDetailComponent>
        <span slot="footer" class="dialog-footer d-flex justify-content-center m-3">
            <el-button @click="recipeStore.closeDialog" type="danger">關閉</el-button>
        </span>
    </el-dialog>
</template>

<style lang="css" scoped>
/* General Styles */
.container-fluid {
    padding: 0;
    margin: 0;
    max-width: 100vw;
}

/* Banner Styles */
.banner-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
}

.banner-ad {
    position: relative;
    overflow: hidden;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat center / cover;
}

/* Product Tabs Styles */
.product-tabs .nav-tabs {
    justify-content: flex-end;
    border: none;
}

.product-tabs .nav-tabs .nav-link.active,
.product-tabs .nav-tabs .nav-item.show .nav-link {
    border: none;
    border-bottom: 3px solid rgb(127, 180, 255);
    background-color: transparent;
}
</style>
