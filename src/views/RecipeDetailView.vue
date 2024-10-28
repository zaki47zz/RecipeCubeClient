<script setup>
import { ref, computed, watch } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useRecipeStore } from '@/stores/recipeStore';

// 使用 Pinia store 來取得庫存與食譜數據
const inventoryStore = useInventoryStore();
const recipeStore = useRecipeStore();

//追蹤用戶的食材是否已準備
const ingredientChecks = ref([]);

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
            <div class="banner-ad bg-warning-subtle block-2">
                <div class="row banner-content pt-5">
                    <div class="content-wrapper text-center col-md-12">
                        <h1 class="pb-5">食譜製作 Recipe Cooking</h1>
                    </div>
                </div>
            </div>
        </section>
        <!-- 食譜header end -->
        <!-- 食譜詳細資訊 start -->
        <section class="recipe-details mt-4">
            <div class="container-fluid">
                <h3>食譜詳細資訊</h3>
                <el-descriptions :column="4" border>
                    <el-descriptions-item label="用戶名稱">{{ userIdDisplay }}</el-descriptions-item>
                    <el-descriptions-item label="葷素限制">{{
                        recipeStore.selectedRecipe.restriction ? '素' : '葷'
                    }}</el-descriptions-item>
                    <el-descriptions-item label="類別">{{ recipeStore.selectedRecipe.category }}</el-descriptions-item>
                    <el-descriptions-item label="可見性">{{
                        recipeStore.selectedRecipe.visibility ? '公開' : '私人'
                    }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </section>
        <!-- 食譜詳細資訊 end -->
        <!-- 食材列表 start -->
        <section class="mt-5">
            <div class="container-fluid">
                <h3>食材</h3>
                <div class="row g-4">
                    <el-card
                        v-for="(ingredient, index) in recipeIngredients"
                        :key="ingredient.ingredientId"
                        shadow="hover"
                        class="col-12 col-md-6 col-lg-4"
                    >
                        <div class="align-items-center">
                            <el-checkbox v-model="selectedIngredients"></el-checkbox>
                            {{ ingredient.ingredientName }}
                            {{ ingredient.requiredQuantity }} {{ ingredient.unit }}
                            (庫存數量:
                            <span
                                :class="{
                                    'text-danger': ingredient.remainingQuantity < ingredient.requiredQuantity,
                                }"
                            >
                                {{ ingredient.remainingQuantity }} {{ ingredient.unit }} </span
                            >)
                        </div>
                    </el-card>
                </div>
                <!-- 調味料 start -->
                <h3>調味料</h3>
                <div class="seasoning-tags" style="display: flex">
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
                <!-- 調味料 end -->
            </div>
        </section>
        <!-- 食材列表 end -->

        <!-- 步驟 start -->
        <section class="mt-5">
            <div class="recipe-steps my-4 wide-steps-container" :style="{ height: dynamicHeight, maxWidth: '600px' }">
                <!-- 使用 el-steps 顯示步驟 -->
                <h5>烹飪步驟</h5>
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
            <el-button type="primary" @click="startCooking">開始烹飪</el-button>
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

.banner-ad {
    position: relative;
    overflow: hidden;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat center / cover;
}
</style>
