<template>
    <div v-if="recipe" class="recipe-detail-container">
        <p class="recipe-title text-center">{{ recipe.recipeName }}</p>

        <div class="recipe-info">
            <el-descriptions title="" :column="2" border>
                <el-descriptions-item label="用戶名稱">{{ userIdDisplay }}</el-descriptions-item>
                <el-descriptions-item label="葷素限制">{{ recipe.restriction ? '素' : '葷' }}</el-descriptions-item>
                <el-descriptions-item label="中/西式">{{ recipe.westEast ? '中式' : '西式' }}</el-descriptions-item>
                <el-descriptions-item label="類別">{{ recipe.category }}</el-descriptions-item>
                <el-descriptions-item label="細部類別">{{ recipe.detailedCategory }}</el-descriptions-item>
                <el-descriptions-item label="權限">{{
                    recipe.visibility === 0 ? '所有人可見' : recipe.visibility === 1 ? '群組可見' : '自己可見'
                }}</el-descriptions-item>
            </el-descriptions>

            <div class="row ingredients-seasoning-section mt-4">
                <div class="col-md-6 ingredients-section">
                    <h5>食材列表</h5>
                    <ul class="ingredients-list">
                        <li
                            v-for="(ingredientId, index) in recipeStore.selectedRecipe.selectedIngredients"
                            :key="ingredientId"
                            class="ingredient-item"
                        >
                            <span class="ingredient-name">
                                {{ recipeStore.selectedRecipe.selectedIngredientNames[index] }}
                            </span>
                            <span class="quantity-info">
                                {{ recipeStore.selectedRecipe.ingredientQuantities[ingredientId] }}
                                {{ recipeStore.selectedRecipe.ingredientUnits[ingredientId] || '' }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="col-md-6 seasoning-section">
                    <h5>調味料</h5>
                    <div class="seasoning-tags">
                        <el-tag
                            v-for="(seasoning, index) in seasoningList"
                            :key="index"
                            type="success"
                            effect="light"
                            size="large"
                            class="seasoning-tag"
                        >
                            {{ seasoning }}
                        </el-tag>
                    </div>
                </div>
            </div>

            <div class="recipe-steps my-4 wide-steps-container" :style="{ height: dynamicHeight }">
                <h5 class="mb-3">烹飪步驟</h5>
                <el-steps :active="activeStep" direction="vertical">
                    <el-step
                        v-for="(step, index) in recipeSteps"
                        :key="index"
                        :title="step"
                        @click="incrementStep(index)"
                    ></el-step>
                </el-steps>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue';
import { useRecipeStore } from '@/stores/recipeStore';

const recipeStore = useRecipeStore();
// 用來控制當前步驟的變數
let activeStep = ref(1);

// 計算顯示的用戶 ID
const userIdDisplay = computed(() => {
    return recipeStore.selectedRecipe && recipeStore.selectedRecipe.userId === '0'
        ? '系統預設'
        : recipeStore.selectedRecipe?.userId;
});
const props = defineProps({
    recipe: {
        type: Object,
        required: true,
    },
    resetActiveStep: {
        type: Boolean,
        default: false,
    },
});
// 監控 resetActiveStep，如果變為 true，重置 activeStep
watch(
    () => props.resetActiveStep,
    (newValue) => {
        if (newValue) {
            activeStep.value = 1;
        }
    }
);
const getRecipeImageUrl = (fileName) => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const BaseUrlWithoutApi = BaseURL.replace('/api', '');
    return `${BaseUrlWithoutApi}/images/recipe/${fileName || 'default_image.jpg'}`;
};

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
    if (props.recipe?.seasoning) {
        return props.recipe.seasoning.split(',').map((item) => item.trim());
    }
    return [];
});
</script>

<style scoped>
.recipe-detail-container {
    padding: 20px;
    border-radius: 10px;
    background-color: #f5f5f5;
}

.recipe-title {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
}

.recipe-info {
    margin-top: 20px;
    padding-bottom: 10px;
}

/* 食材列表樣式 */

.ingredients-list {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    width: 70%;
    max-width: 400px;
    font-size: 1rem;
}

.ingredient-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    margin: 0 auto;
}
.ingredient-item:before {
    content: '\f0da';
    font-family: FontAwesome;
    color: #ccc;
    margin-right: 10px;
}

.ingredient-name {
    font-weight: 500;
    color: #303133;
}

.quantity-info {
    color: #606266;
    font-size: 0.95rem;
    margin-left: 16px;
}

.seasoning-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.seasoning-tag {
    margin: 0 !important;
    padding: 8px 16px;
    font-size: 1rem;
}

.wide-steps-container {
    text-align: center;
    max-width: 800px;
    margin: 40px auto;
}

:deep(.el-step__title) {
    color: #303133 !important;
    font-weight: 500;
}

:deep(.el-step__description) {
    color: #606266 !important;
}

:deep(.el-step.is-vertical) {
    margin-left: 0;
}

@media (max-width: 768px) {
    .ingredients-list {
        grid-template-columns: 1fr;
    }

    .recipe-title {
        font-size: 24px;
    }

    .ingredient-item {
        margin-bottom: 8px;
    }
}
</style>
