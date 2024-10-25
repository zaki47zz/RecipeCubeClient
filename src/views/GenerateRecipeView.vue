<script setup>
import RecipeFilterComponent from '@/components/RecipeFilterComponent.vue';
import { useCookingStore } from '@/stores/cookingStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useRecipeFilterStore } from '@/stores/recipeFilterStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, nextTick, computed } from 'vue';

const cookingStore = useCookingStore();
const inventoryStore = useInventoryStore();
const recipeFilterStore = useRecipeFilterStore();
// 使用 filterStore 的篩選條件
const { filters, selectedIngredients } = storeToRefs(recipeFilterStore);
const { inventories } = storeToRefs(inventoryStore); // 使用庫存資料並引入 fetch 方法
const { cookingInventories, isShowingString, isUsingInventory } = storeToRefs(cookingStore); //裡面的cookingInventories拿來產生食譜
const { setCookingInventories } = cookingStore;
const recipes = ref([]); // 用來儲存 API 返回的食譜
// 設定 API 的 URL
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const apiUrl = `${BaseURL}/RecommendRecipe/Recommend`;

const getRecipeImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/recipe/${fileName}`;
};
// 呼叫推薦食譜API
const fetchRecipes = async () => {
    try {
        console.log('Fetching recipes with filters:', filters.value);
        const ingredientIds = cookingInventories.value.map((inventory) => inventory.ingredientId);
        console.log('Ingredient IDs for API:', ingredientIds);
        // 呼叫 API，傳入選擇的食材
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredientIds),
        });

        // 檢查回應狀態
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API 回應錯誤:', errorData);
            // 顯示錯誤訊息給用戶（可以使用 Swal 或其他通知工具）
            Swal.fire({
                title: '錯誤',
                text: errorData.message || '發生未知錯誤',
                icon: 'error',
                confirmButtonText: '確定',
            });
            return;
        }

        // 解析返回的結果
        const data = await response.json();
        recipes.value = data; // 將返回的食譜儲存在 `recipes` 中
        console.log('推薦食譜:', recipes.value);
    } catch (error) {
        console.error('錯誤:', error);
    }
};
// 在DOM載入後抓食材
onMounted(async () => {
    console.log('Store values:', {
        cookingInventories: cookingInventories.value,
        isShowingString: isShowingString.value,
        isUsingInventory: isUsingInventory.value,
    });
    console.log('食材:', { cookingInventories: cookingInventories.value });
    // 1. 先加載庫存
    await inventoryStore.fetchInventories();
    // 2. 從 localStorage 中取出保存的食材 ID
    setCookingInventories();
    // 3. fetch推薦食譜 API
    await fetchRecipes();
    setupIntersectionObserver();
});

// 監聽篩選條件的變化
function handleFilterChange(newFilters) {
    console.log('Received new filters:', newFilters);
    filters.value = newFilters.filters;
    selectedIngredients.value = newFilters.selectedIngredients;
    // 在篩選條件變更時，重新調用 fetchRecipes
    fetchRecipes();
}
//#region 淡入動畫
watch(recipes, (newRecipes) => {
    if (newRecipes.length > 0) {
        setupIntersectionObserver();
    }
});

const setupIntersectionObserver = () => {
    nextTick(() => {
        const cards = document.querySelectorAll('.recipe-card');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // console.log('卡片進入視窗:', entry.target);
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        cards.forEach((card) => {
            observer.observe(card);
        });
    });
};
//#endregion 淡入動畫

//#region 分類 完全符合/不符合食譜
const filteredRecipes = computed(() => {
    return recipes.value.filter((recipe) => {
        // 根據篩選條件來過濾食譜
        const categoryMatch = !filters.value.category || recipe.category === filters.value.category;
        const subcategoryMatch = !filters.value.subcategory || recipe.detailedCategory === filters.value.subcategory;
        const restrictionMatch = filters.value.restriction === '' || recipe.restriction === filters.value.restriction;
        const styleMatch = filters.value.style === '' || recipe.westEast === filters.value.style;

        // 必須符合所有條件
        return categoryMatch && subcategoryMatch && restrictionMatch && styleMatch;
    });
});
// 1. 定義分類的計算屬性
const completeMatchRecipes = computed(() => {
    const completeRecipes = filteredRecipes.value.filter((recipe) => {
        return recipe.ingredientIds.every((id) => cookingInventories.value.some((inv) => inv.ingredientId === id));
    });
    console.log('完全匹配的食譜:', completeRecipes);
    return completeRecipes;
});

const partialMatchRecipes = computed(() => {
    const partialRecipes = filteredRecipes.value
        .filter((recipe) => {
            return recipe.ingredientIds.some((id) => !cookingInventories.value.some((inv) => inv.ingredientId === id));
        })
        .map((recipe) => {
            const missingIngredients = recipe.ingredientIds.filter(
                (id) => !cookingInventories.value.some((inv) => inv.ingredientId === id)
            );
            const missingIngredientNames = missingIngredients.map(
                (id) => recipe.ingredientNames[recipe.ingredientIds.indexOf(id)]
            );
            return {
                ...recipe,
                missingIngredients: missingIngredientNames,
            };
        });
    console.log('部分匹配的食譜:', partialRecipes);
    return partialRecipes;
});

//#endregion 分類 完全符合/不符合食譜
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-warning-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">食譜產生 Recipe Generate</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>
                        您輸入了
                        <span class="text-info text-gradient">{{ cookingInventories.length }}</span>
                        樣食材<span v-if="isShowingString">，並決定
                            <span v-if="isUsingInventory" class="text-info text-gradient">納入</span>
                            <span v-else class="text-info text-gradient">不納入</span>
                            庫存食材一起檢索</span>
                    </h4>
                </div>
            </div>
        </div>
        <div class="container-fluid pt-3 pb-5">
            <div class="row justify-content-center">
                <div class="table-responsive p-1 w-60 banner-ad">
                    <table class="table table-borderless text-center align-middle rounded-4">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">No</th>
                                <th scope="col" class="text-dark">食材分類</th>
                                <th scope="col" class="text-dark">食材名稱</th>
                                <th scope="col" class="text-dark">數量</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(inventory, index) in cookingInventories" :key="cookingInventories.inventoryId">
                                <td scope="row" class="text-dark">{{ index + 1 }}</td>
                                <td class="text-dark">{{ inventory.category }}</td>
                                <td class="text-dark">{{ inventory.ingredientName }}</td>
                                <td class="text-dark">
                                    {{ inventory.quantity }}
                                    {{ inventory.unit }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>以下為符合您需求的食譜</h4>
                    <p class="text-muted">點擊可查看食譜</p>
                </div>
            </div>
        </div>
    </section>
    <!-- 搜尋 -->
    <section class="mt-1 px-2">
        <div class="container-fluid">
            <div class="col-12">
                <RecipeFilterComponent @filterChange="handleFilterChange" :showSearchField="false">
                </RecipeFilterComponent>
            </div>
        </div>
    </section>
    <!-- 產生的食譜 -->
    <section>
        <div class="container-fluid mt-3">
            <!-- 完全匹配的食譜 -->
            <h3>符合所有食材的食譜</h3>
            <div class="row row-cols-1 row-cols-md-2 g-1">
                <div v-for="(recipe, index) in completeMatchRecipes" :key="index"
                    class="recipe-card col-12 col-md-6 p-0">
                    <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                        style="height: 120px; width: 100%">
                        <div class="image-container" style="width: 200px; height: 100%">
                            <img :src="getRecipeImageUrl(recipe.photoName)" :alt="recipe.recipeName"
                                class="recipe-image" style="
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    border-top-left-radius: 0.75rem;
                                    border-bottom-left-radius: 0.75rem;
                                " />
                        </div>
                        <div class="p-3 w-100 d-flex flex-column justify-content-start align-items-center">
                            <h5 class="mt-3 text-center">{{ recipe.recipeName }}</h5>
                            <div class="d-flex flex-wrap gap-2 mb-1 mx-auto">
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.restriction ? '素' : '葷' }}</span>
                                    <span class="text-secondary">#{{ recipe.westEast ? '西式' : '中式' }}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.category }}</span>
                                    <span class="text-secondary">#{{ recipe.detailedCategory }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 部分匹配的食譜 -->
            <h3 class="mt-5">缺少某些食材的食譜</h3>
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div v-for="(recipe, index) in partialMatchRecipes" :key="index" class="recipe-card col-12">
                    <div class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                        style="height: 120px; width: 100%">
                        <div class="image-container" style="width: 200px; height: 100%">
                            <img :src="getRecipeImageUrl(recipe.photoName)" :alt="recipe.recipeName"
                                class="recipe-image" style="
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    border-top-left-radius: 0.75rem;
                                    border-bottom-left-radius: 0.75rem;
                                " />
                        </div>
                        <div class="p-3 w-100 d-flex flex-column justify-content-start align-items-center">
                            <h5 class="mt-3 text-center">{{ recipe.recipeName }}</h5>
                            <div class="d-flex flex-wrap gap-2 mb-1 mx-auto">
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.restriction ? '素' : '葷' }}</span>
                                    <span class="text-secondary">#{{ recipe.westEast ? '西式' : '中式' }}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.category }}</span>
                                    <span class="text-secondary">#{{ recipe.detailedCategory }}</span>
                                </div>
                            </div>
                            <p class="text-danger mt-2">缺少的食材: {{ recipe.missingIngredients.join(',') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
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

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.recipe-card {
    opacity: 0;
    transition: transform 0.3s ease-in-out;
}

.recipe-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border-radius: 0.75rem;
    /* 添加圓角效果，讓陰影也有圓角 */
}

.fade-in {
    animation: fadeIn 1s ease-in-out forwards;
}
</style>
