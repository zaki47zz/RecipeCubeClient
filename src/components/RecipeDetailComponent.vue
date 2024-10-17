<template>
    <div v-if="recipe" class="recipe-detail-container">
        <h2 class="recipe-title">{{ recipe.recipeName }}</h2>
        <img :src="getRecipeImageUrl(recipe.photo)" :alt="recipe.recipeName" class="recipe-image" />

        <div class="recipe-info">
            <el-descriptions title="" :column="2" border>
                <el-descriptions-item label="用戶名稱">{{ userIdDisplay }}</el-descriptions-item>
                <!-- <el-descriptions-item label="是否自定義">{{ recipe.isCustom ? '是' : '否' }}</el-descriptions-item> -->
                <el-descriptions-item label="葷素限制">{{ recipe.restriction ? '葷' : '素' }}</el-descriptions-item>
                <el-descriptions-item label="中/西式">{{ recipe.westEast ? '西式' : '中式' }}</el-descriptions-item>
                <el-descriptions-item label="類別">{{ recipe.category }}</el-descriptions-item>
                <el-descriptions-item label="細部類別">{{ recipe.detailedCategory }}</el-descriptions-item>
                <el-descriptions-item label="可見性">{{ recipe.visibility ? '公開' : '私人' }}</el-descriptions-item>
            </el-descriptions>
            <!-- <p><strong>描述:</strong> {{ recipe.steps }}</p> -->

            <!-- <p class="mt-5"><strong>調味料:</strong> {{ recipe.seasoning }}</p> -->
            <!-- <p><strong>狀態:</strong> {{ recipe.status ? '啟用' : '禁用' }}</p> -->
            <div class="ingredients-section mt-4">
                <h5>食材列表</h5>
                <div class="ingredients-container">
                    <el-card v-for="(ingredientId, index) in recipeStore.selectedRecipe.selectedIngredients"
                        :key="ingredientId" shadow="hover" class="ingredient-card">
                        <div class="d-flex align-items-center">
                            <!-- <img :src="getIngredientImage(ingredientId)" alt="食材圖片" class="ingredient-image" /> -->
                            <div class="ingredient-info ms-3">
                                <h5>{{ recipeStore.selectedRecipe.selectedIngredientNames[index] }}</h5>
                                <p>
                                    <strong>數量:</strong> {{
                                        recipeStore.selectedRecipe.ingredientQuantities[ingredientId] }}
                                    {{ recipeStore.selectedRecipe.ingredientUnits[ingredientId] || '' }}
                                </p>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
            <div class="seasoning-section mt-5">
                <h4><strong>調味料:</strong></h4>
                <div class="seasoning-tags">
                    <el-tag v-for="(seasoning, index) in seasoningList" :key="index" type="success" effect="light"
                        class="mb-2 me-3">
                        {{ seasoning }}
                    </el-tag>
                </div>
            </div>
            <div class="recipe-steps my-4 wide-steps-container" :style="{ height: dynamicHeight, maxWidth: '600px' }">
                <!-- 使用 el-steps 顯示步驟 -->
                <h5>烹飪步驟</h5>
                <el-steps :active="activeStep" direction="vertical">
                    <el-step v-for="(step, index) in recipeSteps" :key="index" :title="step"
                        @click="incrementStep(index)"></el-step>
                </el-steps>
            </div>
        </div>
    </div>

</template>



<script setup>
import { watch, ref, computed } from 'vue';
import { useRecipeStore } from '@/stores/recipeStore';

const recipeStore = useRecipeStore();
// 用來控制當前步驟的變數
let activeStep = ref(1);
// 計算顯示的用戶 ID
const userIdDisplay = computed(() => {
    return recipeStore.selectedRecipe && recipeStore.selectedRecipe.userId === '0' ? '系統預設' : recipeStore.selectedRecipe?.userId;
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
            .split('。')  // 按中文句號 "。" 分割步驟
            .map(step => step.replace(/^\d+\.\s*/, '').trim())  // 移除每個步驟前面的 "1. "、"2. " 等編號
            .filter(step => step !== '');  // 過濾掉空白步驟
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
        return props.recipe.seasoning.split(',').map(item => item.trim());
    }
    return [];
});
</script>

<style scoped>
.recipe-detail-container {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.recipe-title {
    font-size: 24px;
    margin-bottom: 15px;
}

.recipe-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
}

.recipe-info p {
    margin: 5px 0;
}

.ingredients-section {
    margin-top: 20px;
}

.ingredient-item {
    margin-bottom: 10px;
}

.ingredients-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    /* 使用網格佈局，每格最小150px */
    gap: 12px;
    /* 卡片之間的間距 */
}

.ingredient-card {
    padding: 8px;
    /* 縮小卡片的內邊距 */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: #CFD3DC;
    /* 使用 Element Plus 的變量設置背景色 */
}

.ingredient-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
}

.ingredient-info h6 {
    margin: 8px 0 4px 0;
    font-size: 1rem;
    /* 調整字體大小 */
    font-weight: bold;
}

.quantity-info {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
}

/* 使用 ::v-deep 來覆蓋 Element Plus 默認的樣式，使步驟文字變為黑色 */
::v-deep .el-step__title {
    color: #606266 !important;
    font-weight: bold;

}

::v-deep .el-step__description {
    color: #606266 !important;

}
</style>