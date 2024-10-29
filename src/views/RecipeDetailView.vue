<script setup>
import { ref, computed, watch } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useRecipeStore } from '@/stores/recipeStore';

// 使用 Pinia store 來取得庫存與食譜數據
const inventoryStore = useInventoryStore();
const recipeStore = useRecipeStore();

// 來追蹤用戶選擇的食材
const selectedIngredients = ref([]);
// 檢查 `selectedRecipe` 的初始值
console.log('selectedRecipe 初始值:', recipeStore.selectedRecipe);
// 使用 watch 來監聽 `selectedRecipe` 的變化
watch(
    () => recipeStore.selectedRecipe,
    (newVal, oldVal) => {
        console.log('selectedRecipe 的變化:', oldVal, '=>', newVal);
    }
);
// 計算從 recipeStore 中取得的選擇的食譜
const currentUser = { id: localStorage.getItem('UserId') }; // 這是示例，請根據實際情況設置當前用戶ID

const recipeIngredients = computed(() => {
    if (!recipeStore.selectedRecipe) return [];

    return recipeStore.selectedRecipe.selectedIngredients.map((ingredientId, index) => {
        const ingredientName = recipeStore.selectedRecipe.selectedIngredientNames[index];
        const requiredQuantity = recipeStore.selectedRecipe.ingredientQuantities[ingredientId] || 0;
        const unit = recipeStore.selectedRecipe.ingredientUnits[ingredientId] || '';

        // 找到屬於當前用戶的庫存項目
        const inventoryItem = inventoryStore.inventories.find(
            (item) => item.ingredientId === ingredientId && item.userId === currentUser.id
        );
        const remainingQuantity = inventoryItem ? inventoryItem.quantity : 0;

        return {
            ingredientId,
            ingredientName,
            requiredQuantity,
            remainingQuantity,
            unit,
        };
    });
});

// 計算顯示的用戶 ID
const userIdDisplay = computed(() => {
    return recipeStore.selectedRecipe && recipeStore.selectedRecipe.userId === '0'
        ? '系統預設'
        : recipeStore.selectedRecipe?.userId;
});

// 用來控制當前步驟的變數
let activeStep = ref(1);

// 將步驟文字分割為數組，使用中文句號 "。" 作為分隔符，並移除開頭的數字編號
const recipeSteps = computed(() => {
    if (recipeStore.selectedRecipe?.steps) {
        return recipeStore.selectedRecipe.steps
            .split('。') // 按中文句號 "。" 分割步驟
            .map((step) => step.replace(/^\d+\.\s*/, '').trim()) // 移除每個步驟前面的 "1. "、"2. " 等編號
            .filter((step) => step !== ''); // 過濾掉空白步驟
    }
    return [];
});
// 計算動態高度：每個步驟設置一個固定高度，例如 100px
const dynamicHeight = computed(() => {
    const stepCount = recipeSteps.value.length;
    const baseHeight = 60; // 每個步驟的基本高度（例如 80px）
    const paddingHeight = 30; // 給一些額外的空間
    return `${stepCount * baseHeight + paddingHeight}px`;
});
// 點擊步驟時增加 activeStep 的值
const incrementStep = (index) => {
    if (index >= activeStep.value) {
        activeStep.value++;
    }
};
// 將調味料字符串分割為列表
const seasoningList = computed(() => {
    if (recipeStore.selectedRecipe?.seasoning) {
        return recipeStore.selectedRecipe.seasoning.split(',').map((item) => item.trim());
    }
    return [];
});
// 當點擊「開始烹飪」時觸發的操作
const startCooking = () => {
    if (selectedIngredients.value.length === 0) {
        return Swal.fire({
            title: '錯誤',
            text: '請選擇要使用的食材',
            icon: 'error',
            confirmButtonText: '確定',
        });
    }

    // 這裡你可以根據選擇的食材執行扣庫存等後續邏輯
    console.log('開始烹飪，選擇的食材:', selectedIngredients.value);
};
</script>

<template>
    <div>
        <!-- 食譜header start -->
        <section class="banner-section">
            <div class="bg-warning-subtle block-2">
                <div class="row banner-content pt-5">
                    <div class="content-wrapper text-center col-md-12">
                        <h1 class="pb-5">食譜製作 Recipe Cooking</h1>
                    </div>
                </div>
            </div>
        </section>
        <!-- 食譜header end -->
        <!-- 食譜詳細資訊 start -->
        <section class="recipe-details mt-5 text-center">
            <p class="recipe-title display-4">{{ recipeStore.selectedRecipe.recipeName }}</p>
            <p class="recipe-description">為之後的食譜描述預留空間</p>
            <div class="container mt-4">
                <table class="table table-bordered table-striped table-hover description-table">
                    <tbody>
                        <tr>
                            <th>烹飪時長</th>
                            <td>50 分鐘</td>
                        </tr>
                        <tr>
                            <th>用戶名稱</th>
                            <td>{{ userIdDisplay }}</td>
                        </tr>
                        <tr>
                            <th>葷素限制</th>
                            <td>{{ recipeStore.selectedRecipe.restriction ? '素' : '葷' }}</td>
                        </tr>
                        <tr>
                            <th>類別</th>
                            <td>{{ recipeStore.selectedRecipe.category }}</td>
                        </tr>
                        <tr>
                            <th>細部類別</th>
                            <td>{{ recipeStore.selectedRecipe.detailedCategory }}</td>
                        </tr>
                        <tr>
                            <th>可見性</th>
                            <td>{{ recipeStore.selectedRecipe.visibility ? '公開' : '私人' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <!-- 食譜詳細資訊 end -->
        <!-- 食材列表 start -->
        <section class="mt-5 text-center">
            <div class="container-fluid">
                <div class="row g-4 fs-5">
                    <!-- 食材 -->
                    <div class="col-12 border w-60 mx-auto p-3">
                        <h3 class="text-black">食材</h3>
                        <div class="row g-4">
                            <ul class="list-unstyled">
                                <li
                                    v-for="(ingredient, index) in recipeIngredients"
                                    :key="ingredient.ingredientId"
                                    class="mb-1"
                                >
                                    <div class="d-flex justify-content-center align-items-center">
                                        <el-checkbox
                                            v-model="selectedIngredients"
                                            :label="ingredient.ingredientName"
                                            class="mt-2"
                                            size="large"
                                        ></el-checkbox>
                                        <span
                                            :style="{
                                                'text-decoration-line': selectedIngredients.includes(
                                                    ingredient.ingredientName
                                                )
                                                    ? 'line-through'
                                                    : 'none',
                                            }"
                                            class="ms-2"
                                        >
                                            {{ ingredient.requiredQuantity }} {{ ingredient.unit }}
                                            (庫存數量:
                                            <span
                                                :class="{
                                                    'text-danger':
                                                        ingredient.remainingQuantity < ingredient.requiredQuantity,
                                                }"
                                            >
                                                {{ ingredient.remainingQuantity }} {{ ingredient.unit }} </span
                                            >)
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 調味料 -->
                    <div class="col-12 border w-60 mx-auto p-3">
                        <h3 class="text-black">調味料</h3>
                        <div
                            class="seasoning-tags mt-3"
                            style="display: flex; flex-wrap: wrap; justify-content: center"
                        >
                            <el-tag
                                v-for="(seasoning, index) in seasoningList"
                                :key="index"
                                type="primary"
                                effect="light"
                                size="large"
                                class="mb-2 me-3"
                            >
                                {{ seasoning }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 食材列表 end -->

        <!-- 步驟 start -->
        <section class="mt-5 text-center border w-60 mx-auto p-3">
            <h3 class="text-black">烹飪步驟</h3>
            <div
                class="recipe-steps my-4 wide-steps-container d-flex justify-content-center"
                :style="{ height: dynamicHeight, maxWidth: '600px' }"
            >
                <!-- 使用 el-steps 顯示步驟 -->
                <el-steps :active="activeStep" direction="vertical">
                    <el-step
                        v-for="(step, index) in recipeSteps"
                        :key="index"
                        :title="step"
                        @click="incrementStep(index)"
                    ></el-step>
                </el-steps>
            </div>
        </section>

        <!-- 步驟 end -->
        <!-- 開始烹飪按鈕 start -->
        <div class="container-fluid text-center mt-5">
            <el-button type="success" size="large" @click="startCooking">烹飪完成</el-button>
        </div>
        <!-- 開始烹飪按鈕 end -->
    </div>
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
.recipe-title {
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.recipe-description {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
}

.description-table {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f8f9fa;
}

.description-table th,
.description-table td {
    padding: 12px;
    text-align: center;
    font-size: 1rem;
}

.description-table th {
    background-color: #e9ecef;
    color: #495057;
    width: 40%;
    font-weight: 600;
}

.description-table td {
    color: #212529;
}

.description-table tr:hover {
    background-color: #f1f1f1;
}
</style>
