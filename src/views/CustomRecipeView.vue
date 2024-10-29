<script setup>
import CustomRecipeSideBarComponent from '@/components/CustomRecipeSideBarComponent.vue';
import CustomRecipeFormComponent from '@/components/CustomRecipeFormComponent.vue';
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>自訂食譜</h1>
                <h1>Custom Recipe</h1>
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
/* header本人 */
.header {
    position: relative;
    overflow: hidden;
    height: 40vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    color: #eee;
    z-index: 0;
}
/* 背景 */
.header:before {
    content: '';
    width: 100%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateZ(0) scale(1, 1);
    background: #1b2030 url('src/assets/img/ForBackground/bg-header-recipe.jpg') 50% 0 no-repeat;
    background-size: cover;
    background-attachment: fixed;
    animation: grow 180s linear 10ms infinite;
    transition: all 0.4s ease-in-out;
    z-index: -2;
}
/* 下方mask */
.header:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 40%, rgb(254, 254, 254) 100%);
}
/* 文字 */
.title {
    width: 100%;
    padding-top: 5%;
    text-align: center;
    text-shadow: 0 2px 3px rgba(255, 255, 255, 0.4);
}
/* 上下移動縮放特效 */
@keyframes grow {
    0% {
        transform: scale(1) translateY(0px);
    }
    50% {
        transform: scale(1.2) translateY(-250px);
    }
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
