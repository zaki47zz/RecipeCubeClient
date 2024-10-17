<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRecipeStore } from '@/stores/recipeStore';
import Isotope from 'isotope-layout';
import Swal from 'sweetalert2';
import WineWithBeef from '@/assets/img/ForComponent/WineWithBeef.jpg';
import SoftBadge from '@/components/SoftBadge.vue';
import SoftPagination from '@/components/SoftPagination.vue';
import SoftPaginationItem from '@/components/SoftPaginationItem.vue';
import RecipeDetailComponent from '@/components/RecipeDetailComponent.vue';


// 使用 Pinia 的 recipeStore
const recipeStore = useRecipeStore();
// 控制列表的顯示與否
const isRecipeListVisible = ref(true);
const recipes = ref([]);
let currentPage = ref(1);
let pageSize = ref(8); // 每頁顯示 8 個食譜
let totalRecipes = ref(100);
const BaseURL = import.meta.env.VITE_API_BASEURL;  // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', '');  // 去掉 "/api" 得到基本的 URL;
const ApiURL = `${BaseURL}/Recipes`;
const selectedRecipe = ref(null);  // 儲存當前選中的食譜

const showRecipeDetails = (recipe) => {
    selectedRecipe.value = recipe;  // 更新選中的食譜
    isRecipeListVisible.value = false;  // 點擊後隱藏食譜列表
};
const hideRecipeDetails = () => {
    isRecipeListVisible.value = true;  // 隱藏詳細內容，重新顯示列表
};
// 使用fetch獲取數據
const fetchRecipes = async () => {
    try {
        const response = await fetch(ApiURL); // 替換為你的 API URL
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        recipes.value = data; // 將獲取到的數據存入 recipes 變量
        totalRecipes.value = recipes.value.length;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};
const dialogVisible = computed({
    get: () => recipeStore.dialogVisible,
    set: (value) => {
        recipeStore.dialogVisible = value;
    },
});
// 在組件加載後獲取數據
onMounted(() => {
    fetchRecipes();
});

// 分頁控制
const totalPages = computed(() => Math.ceil(totalRecipes.value / pageSize.value));
const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return recipes.value.slice(start, end);
});
// 使用計算屬性來取得分頁的食譜
// const paginatedRecipes = computed(() => recipeStore.paginatedRecipes);
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
const inputPage = ref(1);

const goToPage = () => {
    if (inputPage.value >= 1 && inputPage.value <= totalPages.value) {
        changePage(inputPage.value);
    } else {
        // 提示使用者輸入有效的頁碼
        Swal.fire({
            title: '頁碼無效',
            text: `請輸入介於 1 和 ${totalPages.value} 之間的頁碼`,
            icon: 'warning',
            confirmButtonText: '確定',
        });
    }
};

const pagesAroundCurrent = computed(() => {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, currentPage.value + 2);
    let pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const getRecipeImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/recipe/${fileName}`;
};

</script>

<template>
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

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>在下方食材列表，您可以看到您所屬群組的庫存食材，您可以進行兩種操作</h4>
                </div>
            </div>
            <div class="row justify-content-center my-5">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-box-open mt-3"></i> 管理食材</h5>
                            <p>對個別食材進行數量的修改或刪除</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-utensils mt-3"></i> 產生食譜</h5>
                            <p>選取食材讓我們為您自動生成食譜</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-1">
        <div class="container-fluid">
            <div class="col-sm-10 offset-sm-2 offset-md-0 col-lg-12 d-none d-lg-block">
                <div class="row g-3 py-1 px-3 mt-3 bg-warning-subtle rounded-4 shadow d-flex justify-content-between">
                    <!-- 分類欄 -->
                    <div class="col-md-2">
                        <p class="fw-bold">分類 CATEGORY</p>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select">
                            <option selected>葷素</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select">
                            <option selected>類別</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-3 my-auto">
                        <select class="form-select">
                            <option selected>細部類別</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-3 my-auto">
                        <select class="form-select">
                            <option selected>自訂食譜</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-9 my-auto">
                        <input type="text" class="form-control w-100 rounded-3"
                            placeholder="輸入食譜名稱或食材 (一次輸入多種食材請用逗號分隔，例如: 青椒,蘋果)" />
                    </div>
                    <div class="col-md-3 d-flex justify-content-center mb-0 p-0 my-auto">
                        <button class="btn blur rounded-3 shadow w-85 p-2 mb-2" style="font-size: large">
                            隨機推薦
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid mt-3">
            <div class="row">
                <div class="col-md-12">
                    <div class="banner-ad bootstrap-tabs product-tabs p-3">
                        <div class="tabs-header d-flex justify-content-between">
                            <h3>食譜列表</h3>
                            <div>
                                <button class="btn blur shadow fs-6 text-danger me-1">刪除</button>
                            </div>
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a href="#" class="nav-link fs-5 fw-bold text-dark active" id="nav-all-tab"
                                        data-bs-toggle="tab" data-bs-target="#nav-all">所有食譜</a>
                                    <a href="#" class="nav-link fs-5 fw-bold text-dark" id="nav-group-tab"
                                        data-bs-toggle="tab" data-bs-target="#nav-group">群組食譜</a>
                                    <a href="#" class="nav-link fs-5 fw-bold text-dark" id="nav-user-tab"
                                        data-bs-toggle="tab" data-bs-target="#nav-user">您的食譜</a>
                                </div>
                            </nav>
                        </div>
                        <div class="tab-content" id="nav-tabContent">
                            <!-- All Products Tab -->
                            <div class="tab-pane fade show active" id="nav-all" role="tabpanel"
                                aria-labelledby="nav-all-tab">
                                <div class="row g-3 mt-2">
                                    <div class="col-12 col-md-6">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${WineWithBeef})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">紅酒燉牛肉</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary">葷</span>
                                                    <span class="badge bg-secondary">西式</span>
                                                    <span class="badge bg-secondary">主餐</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-md-6">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${WineWithBeef})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">紅酒燉牛肉</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary">葷</span>
                                                    <span class="badge bg-secondary">西式</span>
                                                    <span class="badge bg-secondary">主餐</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 群組 Tab -->
                            <div class="tab-pane fade show" id="nav-group" role="tabpanel"
                                aria-labelledby="nav-group-tab">
                                <div class="row g-3 mt-2">
                                    <div class="col-12 col-md-6">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${WineWithBeef})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">紅酒燉牛肉</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary">葷</span>
                                                    <span class="badge bg-secondary">西式</span>
                                                    <span class="badge bg-secondary">主餐</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-md-6">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${WineWithBeef})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">紅酒燉牛肉</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary">葷</span>
                                                    <span class="badge bg-secondary">西式</span>
                                                    <span class="badge bg-secondary">主餐</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 自己 tab -->
                            <div class="tab-pane fade show" id="nav-user" role="tabpanel"
                                aria-labelledby="nav-user-tab">
                                <div class="row g-3 mt-2">
                                    <div class="col-12 col-md-6">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${WineWithBeef})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">紅酒燉牛肉</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary">葷</span>
                                                    <span class="badge bg-secondary">西式</span>
                                                    <span class="badge bg-secondary">主餐</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-md-6">
                                        <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                            style="height: 150px">
                                            <div class="d-flex" :style="{
                                                width: '50%',
                                                height: '100%',
                                                backgroundImage: `url(${WineWithBeef})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderTopLeftRadius: '0.75rem',
                                                borderBottomLeftRadius: '0.75rem',
                                            }"></div>

                                            <!-- 右邊文字和標籤區 -->
                                            <div
                                                class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                                <h5 class="mb-3">紅酒燉牛肉</h5>
                                                <div class="d-flex gap-2">
                                                    <span class="badge bg-secondary">葷</span>
                                                    <span class="badge bg-secondary">西式</span>
                                                    <span class="badge bg-secondary">主餐</span>
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


    <section class="recipe-list">
        <div class="container-fluid mt-3">
            <div class="row">
                <div class="col-md-12">
                    <div class="banner-ad bootstrap-tabs product-tabs p-3">
                        <div class="tabs-header d-flex justify-content-between">
                            <h3>食譜列表</h3>
                            <div>
                                <button class="btn blur shadow fs-6 text-danger me-1">刪除</button>
                            </div>
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
                                                    <span class="badge bg-secondary" v-if="recipe.restriction">葷</span>
                                                    <span class="badge bg-secondary" v-else>素</span>
                                                    <span class="badge bg-secondary" v-if="recipe.westEast">西式</span>
                                                    <span class="badge bg-secondary" v-else>中式</span>
                                                    <span class="badge bg-secondary">{{ recipe.category }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 分頁導航 -->
                                <div
                                    class="pagination-container mt-4 d-flex justify-content-end align-items-center gap-2">
                                    <soft-pagination color="warning" class="d-flex align-items-center gap-2 m-0">
                                        <soft-pagination-item prev @click="changePage(currentPage - 1)"
                                            :disabled="currentPage === 1" />
                                        <soft-pagination-item v-for="page in pagesAroundCurrent" :key="page"
                                            :label="String(page)" :active="page === currentPage"
                                            @click="changePage(page)" />
                                        <soft-pagination-item next @click="changePage(currentPage + 1)"
                                            :disabled="currentPage === totalPages" />
                                    </soft-pagination>
                                    <div class="d-flex justify-content-center ms-3 gap-2">
                                        <input type="number" class="form-control shadow-sm border-primary" min="1"
                                            :max="totalPages" v-model.number="inputPage" placeholder="輸入頁碼"
                                            style="max-width: 80px; height: 45px; border-radius: 8px; padding: 0.375rem 0.75rem;">
                                        <button class="btn btn-primary shadow-sm" @click="goToPage"
                                            style="max-width: 80px; height: 45px; border-radius: 8px; padding: 0 20px;">前往</button>
                                    </div>
                                </div>
                                <!-- 分頁導航結束 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Recipe Detail Component -->
    <!-- <RecipeDetailComponent v-if="recipeStore.selectedRecipe" :recipe="recipeStore.selectedRecipe">
    </RecipeDetailComponent> -->
    <el-dialog v-model="recipeStore.dialogVisible" title="食譜詳細資訊" width="50%" @close="recipeStore.closeDialog">
        <RecipeDetailComponent :recipe="recipeStore.selectedRecipe" v-if="recipeStore.selectedRecipe">
        </RecipeDetailComponent>
        <span slot="footer" class="dialog-footer">
            <el-button @click="recipeStore.closeDialog">關閉</el-button>
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
    background: url('@/assets/img/ForBackground/background-pattern.jpg') no-repeat center / cover;
    position: relative;
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