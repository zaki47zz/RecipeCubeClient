<script setup>
import CustomRecipeSideBarComponent from '@/components/CustomRecipeSideBarComponent.vue';
import CustomRecipeFormComponent from '@/components/CustomRecipeFormComponent.vue';
</script>

<template>
    <section class="banner-section">
        <div class="bg-warning-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>自訂食譜 Custom Recipe</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid mt-5 px-3">
            <div class="row g-4">
                <div class="col-md-4 col-12 p-4">
                    <CustomRecipeSideBarComponent> </CustomRecipeSideBarComponent>
                </div>
                <div class="col-md-8 col-12 p-4 rounded-3 shadow" style="background-color: blanchedalmond">
                    <CustomRecipeFormComponent> </CustomRecipeFormComponent>
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

.circle-number {
    width: 1.8rem;
    height: 1.8rem;
    background-color: #494948;
    /* 背景顏色 */
    color: white;
    /* 文字顏色 */
    border-radius: 50%;
    /* 使元素變成圓形 */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step-button {
    font-weight: 600;
    font-size: larger;
}

.step-button:hover {
    color: #595959;
    /* 懸停時變色 */
    cursor: pointer;
    transform: scale(1.1);
    /* 懸停時放大效果 */
    transition: transform 0.2s, background-color 0.2s;
    /* 添加平滑動畫 */
}
</style>
