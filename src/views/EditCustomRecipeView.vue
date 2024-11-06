<script setup>
import CustomRecipeSideBarComponent from '@/components/CustomRecipeSideBarComponent.vue';
import CustomRecipeFormComponent from '@/components/CustomRecipeFormComponent.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const recipeId = route.params.recipeId; // 獲取路由中的 recipeId

const recipeData = ref(null);

// 當頁面加載時，根據 recipeId 獲取食譜數據
onMounted(async () => {});
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>編輯自訂食譜</h1>
                <h1>Edit Custom Recipe</h1>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid mt-5 px-3">
            <div class="row g-4">
                <div class="col-md-4 col-12 p-4">
                    <CustomRecipeSideBarComponent> </CustomRecipeSideBarComponent>
                </div>
                <div class="col-md-8 col-12 p-4 rounded-3 shadow" style="background-color: #ace4c8">
                    <CustomRecipeFormComponent :recipe="recipeData" mode="edit"> </CustomRecipeFormComponent>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* 你可以重用原本的樣式 */
.header {
    position: relative;
    overflow: hidden;
    height: 40vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    color: #eee;
    z-index: 0;
}

/* 其他樣式同樣可以重用 */
</style>
