<script setup>
import WineWithBeef from '@/assets/img/ForComponent/WineWithBeef.jpg';
import { useIngredientStore } from '@/stores/ingredientStore';

const ingredientStore = useIngredientStore(); //裡面的cookingInventories拿來產生食譜
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-primary-subtle block-2">
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
                        <span v-if="true" class="text-info text-gradient">{{
                            ingredientStore.cookingInventories.length
                        }}</span>
                        樣食材<span v-if="ingredientStore.isShowingString"
                            >，並決定
                            <span v-if="ingredientStore.isUsingInventory" class="text-info text-gradient">納入</span>
                            <span v-else class="text-info text-gradient">不納入</span>
                            庫存食材一起檢索</span
                        >
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
                            <tr
                                v-for="(inventory, index) in ingredientStore.cookingInventories"
                                :key="ingredientStore.cookingInventories.inventoryId"
                            >
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

    <section class="mt-1 px-2">
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
                            <option selected>中西式</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select">
                            <option selected>類別</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select">
                            <option selected>細部類別</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 my-auto">
                        <select class="form-select">
                            <option selected>群組/私有</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid mt-3">
            <div class="row">
                <div class="col-md-12">
                    <div class="banner-ad bootstrap-tabs product-tabs px-3 pb-3">
                        <div class="row g-3 mt-2">
                            <div class="col-12 col-md-4">
                                <div
                                    class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                    style="height: 120px"
                                >
                                    <div
                                        class="d-flex"
                                        :style="{
                                            width: '200px',
                                            height: '100%',
                                            backgroundImage: `url(${WineWithBeef})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderTopLeftRadius: '0.75rem',
                                            borderBottomLeftRadius: '0.75rem',
                                        }"
                                    ></div>

                                    <!-- 右邊文字和標籤區 -->
                                    <div class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                        <h5 class="mb-1">紅酒燉牛肉</h5>
                                        <div class="d-flex gap-2 mb-1">
                                            <span class="text-secondary">#葷</span>
                                            <span class="text-secondary">#西式</span>
                                            <span class="text-secondary">#主餐</span>
                                        </div>
                                        <p class="mb-1">您有全部的食材</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-md-4">
                                <div
                                    class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                    style="height: 120px"
                                >
                                    <div
                                        class="d-flex"
                                        :style="{
                                            width: '200px',
                                            height: '100%',
                                            backgroundImage: `url(${WineWithBeef})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderTopLeftRadius: '0.75rem',
                                            borderBottomLeftRadius: '0.75rem',
                                        }"
                                    ></div>

                                    <!-- 右邊文字和標籤區 -->
                                    <div class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                        <h5 class="mb-1">世紀濃湯</h5>
                                        <div class="d-flex gap-2 mb-1">
                                            <span class="text-secondary">#葷</span>
                                            <span class="text-secondary">#西式</span>
                                            <span class="text-secondary">#主餐</span>
                                        </div>
                                        <p class="mb-1">您缺少 1 項食材</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div
                                    class="card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                    style="height: 120px"
                                >
                                    <div
                                        class="d-flex"
                                        :style="{
                                            width: '200px',
                                            height: '100%',
                                            backgroundImage: `url(${WineWithBeef})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderTopLeftRadius: '0.75rem',
                                            borderBottomLeftRadius: '0.75rem',
                                        }"
                                    ></div>

                                    <!-- 右邊文字和標籤區 -->
                                    <div class="p-3 w-100 d-flex flex-column justify-content-center align-items-center">
                                        <h5 class="mb-1">彈跳甲魚湯</h5>
                                        <div class="d-flex gap-2 mb-1">
                                            <span class="text-secondary">#葷</span>
                                            <span class="text-secondary">#中式</span>
                                            <span class="text-secondary">#主餐</span>
                                        </div>
                                        <p class="mb-1">您缺少 2 項食材</p>
                                    </div>
                                </div>
                            </div>
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
</style>
