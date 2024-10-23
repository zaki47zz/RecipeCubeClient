<script setup>
import { useCookingStore } from '@/stores/cookingStore';
import { storeToRefs } from 'pinia';
import tippy from 'tippy.js';
import SoftSwitch from '@/components/SoftSwitch.vue';
import CategorySwiperComponent from '@/components/CategorySwiperComponent.vue';
import 'tippy.js/dist/tippy.css';
import { ref, onMounted } from 'vue';

const cookingStore = useCookingStore();
const { cookingInventories, isUsingInventory, isSet } = storeToRefs(cookingStore);
const { resetCookingInventories } = cookingStore;
const selectedIngredients = ref([]);

onMounted(() => {
    initTippy();
    resetCookingInventories();
});

const initTippy = function () {
    tippy('#tooltip-wrapper-set', {
        content: '啟用此功能，我們會為您搭配一份主餐與一份副餐!',
        placement: 'right-end',
        animation: 'fade',
    });
    tippy('#tooltip-wrapper-inventory', {
        content: '啟用此功能，我們會同時使用您庫存內的食材進行食譜搜索，如不想使用庫存內食材，請取消。',
        placement: 'right-end',
        animation: 'fade',
    });
};

//將所選食材送至產生食譜介面
const exportInventories = () => {
    //沒有選東西就沒反應
    if (!selectedIngredients.value.length) {
        return;
    }
    cookingInventories.value = [...selectedIngredients.value];
};
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-danger-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">隨買隨煮 Buy & Cook</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-1" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>選擇食材</h5>
                            <p>填入您今天購買的食材</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-2" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>產生食譜</h5>
                            <p>按下產生食譜按鈕生成食譜</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-3" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>開始料理</h5>
                            <p>選擇料理食譜，準備大顯身手</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-3 overflow-hidden">
        <div class="container-fluid banner-ad">
            <CategorySwiperComponent></CategorySwiperComponent>
        </div>
    </section>

    <section class="banner-section py-3 overflow-hidden p-5 bg-danger-subtle">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-1">
                        <h5>您選擇的食材</h5>
                        <p class="badge bg-secondary"><i class="fa-solid fa-repeat"></i> 數量換算表</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive p-1">
                    <table class="table table-borderless text-center align-middle bg-white rounded-4">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">編號</th>
                                <th scope="col" class="text-dark">食材</th>
                                <th scope="col" class="text-dark">數量</th>
                                <th scope="col" class="text-dark">權限</th>
                                <th scope="col" class="text-dark">期限</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" class="text-dark">1</th>
                                <td class="text-dark">菠菜</td>
                                <td class="text-dark">
                                    <input type="text" class="form-control inline-control w-30" /> 把
                                </td>
                                <td class="text-dark">
                                    <select class="form-control inline-control text-center">
                                        <option value="0">群組</option>
                                        <option value="1">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        type="date"
                                        class="form-control inline-control text-center"
                                        value="2024-10-30"
                                    />
                                </td>
                                <td class="text-dark">
                                    <i class="fa-solid fa-trash"></i>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-dark">1</th>
                                <td class="text-dark">菠菜</td>
                                <td class="text-dark">
                                    <input type="text" class="form-control inline-control w-30" /> 把
                                </td>
                                <td class="text-dark">
                                    <select class="form-control inline-control text-center">
                                        <option value="0">群組</option>
                                        <option value="1">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        type="date"
                                        class="form-control inline-control text-center"
                                        value="2024-10-30"
                                    />
                                </td>
                                <td class="text-dark">
                                    <i class="fa-solid fa-trash"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <SoftSwitch v-model="isSet" name="set" id="set" class="switch-set">
                        <span>
                            套餐
                            <span id="tooltip-wrapper-set">
                                <i class="fa-solid fa-circle-question"></i>
                            </span>
                        </span>
                    </SoftSwitch>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <SoftSwitch v-model="isUsingInventory" name="inventory" id="inventory" class="switch-inventory">
                        <span>
                            使用庫存食材
                            <span id="tooltip-wrapper-inventory">
                                <i class="fa-solid fa-circle-question"></i>
                            </span>
                        </span>
                    </SoftSwitch>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <RouterLink
                        class="btn text-dark shadow fs-5 w-100"
                        :class="selectedIngredients.length ? 'bg-danger-subtle' : 'bg-secondary disabled-link'"
                        :to="selectedIngredients.length ? { name: 'GenerateRecipe' } : ''"
                        @click="selectedIngredients.length ? exportInventories : $event.preventDefault()"
                    >
                        產生食譜
                    </RouterLink>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <p class="text-center">(別擔心，剩餘食材將被加入庫存)</p>
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

.switch-set {
    /* margin-left: calc(50% - 3.5vw); */
    left: 50%;
    transform: translateX(33%);
}

.switch-inventory {
    /* margin-left: calc(50% - 3.5vw); */
    left: 50%;
    transform: translateX(24%);
}
</style>
