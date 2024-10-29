<script setup>
import { useCookingStore } from '@/stores/cookingStore';
import { storeToRefs } from 'pinia';
import tippy from 'tippy.js';
import CategorySwiperComponent from '@/components/CategorySwiperComponent.vue';
import UnitConversionComponent from '@/components/UnitConversionComponent.vue';
import 'tippy.js/dist/tippy.css';
import { ref, onMounted, watch } from 'vue';
import { ElCheckbox } from 'element-plus';

const cookingStore = useCookingStore();
const { cookingInventories } = storeToRefs(cookingStore);
const { resetCookingInventories } = cookingStore;
const selectedIngredients = ref([]);
const set = ref(false);
const useInventory = ref(false);

onMounted(() => {
    initTippy();
    resetCookingInventories();
});

//利用watch監測selectedIngredients，即時更新cookingInventories
watch(
    selectedIngredients,
    (newIngredients) => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const expiryDate = date.toISOString().split('T')[0];

        //cookingInventories 的值
        cookingInventories.value = newIngredients.map((ingredient) => {
            return {
                ...ingredient,
                quantity: 0, //初始數量
                expiryDate: expiryDate, //到期日期
                visibility: false, //預設 visibility
            };
        });
    },
    { immediate: true }
);

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

const deleteInventory = (inventory) => {
    const deletingIndex = selectedIngredients.value.findIndex((item) => item.ingredientId === inventory.ingredientId);
    if (deletingIndex > -1) {
        selectedIngredients.value = [
            //為了讓watch讀到，需要直接賦值
            ...selectedIngredients.value.slice(0, deletingIndex), //第一個到要刪的(不包含要刪的)
            ...selectedIngredients.value.slice(deletingIndex + 1), //要刪的+1到最後
        ];
    }
};

//將所選食材送至產生食譜介面
const exportInventories = () => {
    if (!selectedIngredients.value.length) {
        return;
    }
    localStorage.setItem('cookingInventories', JSON.stringify(cookingInventories.value));
    localStorage.setItem('isUsingInventory', useInventory.value);
    localStorage.setItem('isSet', set.value);
};
</script>

<template>
    <section class="banner-section">
        <div class="bg-danger-subtle block-2">
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
        <div class="container-fluid">
            <CategorySwiperComponent v-model="selectedIngredients"></CategorySwiperComponent>
        </div>
    </section>

    <section class="banner-section py-3 overflow-hidden p-5 bg-danger-subtle">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-1">
                        <h5>您選擇的食材</h5>
                        <UnitConversionComponent
                            :addingInventoriesList="cookingInventories"
                            color="danger"
                        ></UnitConversionComponent>
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
                            <tr v-for="(inventory, index) in cookingInventories">
                                <th scope="row" class="text-dark">{{ index + 1 }}</th>
                                <td class="text-dark">{{ inventory.ingredientName }}</td>
                                <td class="text-dark">
                                    <input
                                        v-model="inventory.quantity"
                                        type="text"
                                        class="form-control inline-control w-30"
                                    />
                                    {{ inventory.unit }}
                                </td>
                                <td class="text-dark">
                                    <select
                                        v-model="inventory.visibility"
                                        class="form-control inline-control text-center"
                                    >
                                        <option :value="false">群組</option>
                                        <option :value="true">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        v-model="inventory.expiryDate"
                                        type="date"
                                        class="form-control inline-control text-center"
                                    />
                                </td>
                                <td class="text-dark">
                                    <button class="delete-icon" @click="deleteInventory(inventory)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
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
                    <ElCheckbox v-model="set" name="set" id="set" class="switch-set">
                        <span class="fs-6">
                            套餐
                            <span id="tooltip-wrapper-set">
                                <i class="fa-solid fa-circle-question"></i>
                            </span>
                        </span>
                    </ElCheckbox>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <ElCheckbox v-model="useInventory" name="inventory" id="inventory" class="switch-inventory">
                        <span class="fs-6">
                            使用庫存食材
                            <span id="tooltip-wrapper-inventory">
                                <i class="fa-solid fa-circle-question"></i>
                            </span>
                        </span>
                    </ElCheckbox>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <RouterLink
                        class="btn text-dark shadow fs-5 w-100"
                        :class="selectedIngredients.length ? 'bg-danger-subtle' : 'bg-secondary disabled-link'"
                        :to="selectedIngredients.length ? { name: 'GenerateRecipe' } : ''"
                        @click="exportInventories"
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

.switch-set {
    left: 25%;
}

.switch-inventory {
    left: 25%;
}

.delete-icon {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0 3px 0 3px;
}

.delete-icon:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
    box-shadow: 0px 21px 44px rgba(0, 0, 0, 0.08);
}
</style>
