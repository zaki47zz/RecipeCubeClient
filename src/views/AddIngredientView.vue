<script setup>
import CategorySwiperComponent from '@/components/CategorySwiperComponent.vue';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import UnitConversionComponent from '@/components/UnitConversionComponent.vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePantryStore } from '@/stores/pantryStore';

const inventoryStore = useInventoryStore();
const { postInventory } = inventoryStore;
const pantryStore = usePantryStore();
const { postPantry } = pantryStore;

const selectedIngredients = ref([]); //用一個selectedIngredients當作子組建的同名物件供操作
const addingInventories = ref([]); //定義要加入庫存的食材

//利用watch監測selectedIngredients，即時更新addingInventories
watch(
    selectedIngredients,
    (newIngredients) => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const expiryDate = date.toISOString().split('T')[0];

        //更新addingInventories 的值
        addingInventories.value = newIngredients.map((ingredient) => {
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

////提醒
//確認公版
const check = (text, icon, buttonText, func, secondTitle) => {
    Swal.fire({
        title: '您確定嗎?',
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: buttonText,
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            func();
            Swal.fire({
                title: secondTitle,
                icon: 'success',
            });
        }
    });
};
// 清空列表按鈕的提醒
const alertClearCheck = () => {
    check(
        '即將清空所選食材列表',
        'warning',
        '清空',
        () => {
            deleteInventories();
        },
        '清空了!'
    );
};
//加入食材庫存提醒
const alertAddCheck = () => {
    check(
        '即將加入食材至庫存',
        'question',
        '加入',
        () => {
            addInventories();
        },
        '成功加入!'
    );
};
//提醒公版
const swalAlert = (text) => {
    Swal.fire({
        title: '提醒您',
        text: text,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
    });
};
////提醒結束

//刪除食材按鈕
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

//刪除全部食材按鈕
const deleteInventories = () => {
    selectedIngredients.value = [];
};

//加入食材按鈕
const addInventories = async () => {
    console.log(addingInventories.value);
    for (let inventory of addingInventories.value) {
        if (inventory.quantity === null) {
            console.log('數量不可為空');
            return;
        }
        if (inventory.quantity <= 0) {
            console.log('數量不可小於或等於 0');
            return;
        }
    }
    // 如果所有庫存項目都是有效的，則繼續處理
    const inventories = addingInventories.value.map((inventory) => ({
        ingredientId: inventory.ingredientId,
        quantity: inventory.quantity,
        expiryDate: inventory.expiryDate,
        visibility: inventory.visibility,
    }));
    console.log(inventories);
    if (inventories.length === 0) {
        swalAlert('請再次檢查您的輸入');
        return;
    }
    const userId = localStorage.getItem('UserId');
    const action = '增加';
    try {
        for (let inventory of inventories) {
            const { ingredientId, quantity, expiryDate, visibility } = inventory;
            // 執行 POST 請求
            await postInventory(ingredientId, quantity, expiryDate, visibility);
            await postPantry(userId, ingredientId, quantity, action);
        }
        // 清空已選食材
        selectedIngredients.value = [];
    } catch (error) {
        console.error('新增庫存時出錯:', error);
        swalAlert('發生錯誤，請稍後再試');
    }
};
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-primary-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">加入食材 Add Ingredient</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5 overflow-hidden">
        <div class="container-fluid banner-ad">
            <!-- 在子component用v-model相當於繫結它內部的props.modelValue，後面放什麼就會被傳過去 -->
            <CategorySwiperComponent v-model="selectedIngredients"></CategorySwiperComponent>
        </div>
    </section>

    <section v-if="selectedIngredients.length" class="py-3 overflow-hidden">
        <div class="d-flex justify-content-center mb-5">
            <hr class="horizontal dark my-0 w-50" />
        </div>
        <div class="container-fluid post-it shadow">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-2">
                        <h4>您今天買了 {{ selectedIngredients.length }} 樣食材</h4>
                        <UnitConversionComponent
                            :addingInventoriesList="addingInventories"
                            color="primary"
                        ></UnitConversionComponent>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive p-3">
                    <table class="table table-borderless text-center table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">No</th>
                                <th scope="col" class="text-dark">食材</th>
                                <th scope="col" class="text-dark">數量</th>
                                <th scope="col" class="text-dark">權限</th>
                                <th scope="col" class="text-dark">期限</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(inventory, index) in addingInventories" :key="inventory.ingredientId">
                                <th scope="row" class="text-dark">{{ index + 1 }}</th>
                                <td class="text-dark">{{ inventory.ingredientName }}</td>
                                <td class="text-dark">
                                    <input
                                        v-model="inventory.quantity"
                                        type="number"
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
        <div class="container-fluid pt-5">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <button class="btn bg-primary-subtle text-dark shadow fs-5 w-100" @click="alertAddCheck">
                        加入食材
                    </button>
                </div>
                <div class="col-lg-3">
                    <button class="w-100 btn blur text-danger shadow fs-5" @click="alertClearCheck">
                        清空所選食材
                    </button>
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

.post-it {
    background: #fffaa2;
    padding: 1% 3% 3%;
    text-align: center;
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
