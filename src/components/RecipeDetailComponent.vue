<script setup>
import { computed } from 'vue';

// 接收 props 傳入的食譜數據
const props = defineProps({
    recipe: {
        type: Object,
        required: true,
    }
});

// 計算圖片的完整 URL（類似於主組件的 `getRecipeImageUrl`）
const getRecipeImageUrl = (fileName) => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const BaseUrlWithoutApi = BaseURL.replace('/api', '');
    return `${BaseUrlWithoutApi}/images/recipe/${fileName || 'default_image.jpg'}`;
};
</script>

<template>
    <div v-if="recipe" class="recipe-detail-container">
        <h2 class="recipe-title">{{ recipe.recipeName }}</h2>
        <img :src="getRecipeImageUrl(recipe.photo)" :alt="recipe.recipeName" class="recipe-image" />

        <div class="recipe-info">
            <p><strong>類別:</strong> {{ recipe.category }}</p>
            <p><strong>葷素:</strong> {{ recipe.restriction ? '葷' : '素' }}</p>
            <p><strong>類型:</strong> {{ recipe.westEast ? '西式' : '中式' }}</p>
            <p><strong>描述:</strong> {{ recipe.steps }}</p>
        </div>
    </div>
    <div v-else>
        <p>尚未選擇食譜</p>
    </div>
</template>

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
</style>
