<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { useCookingStore } from '@/stores/cookingStore';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
const router = useRouter();
// 使用 Pinia store 來取得庫存與食譜數據
const inventoryStore = useInventoryStore();
const recipeStore = useRecipeStore();
const cookingStore = useCookingStore();
const { updateInventoriesAfterCooking } = inventoryStore;
const source = localStorage.getItem('source') || 'inventoryManagement'; //隨買隨煮or庫存管理
//用來追蹤打勾的食材
const localChecked = ref([]);

// 切換打勾狀態
const toggleChecked = (ingredientId) => {
    if (localChecked.value.includes(ingredientId)) {
        localChecked.value = localChecked.value.filter((id) => id !== ingredientId);
    } else {
        localChecked.value.push(ingredientId);
    }
};

// 檢查是否打勾
const isChecked = (ingredientId) => {
    return localChecked.value.includes(ingredientId);
};
// 檢查 `selectedRecipe` 的初始值
// console.log('selectedRecipe 初始值:', recipeStore.selectedRecipe);

onMounted(async () => {
    await recipeStore.saveSelectedRecipe();
});
// 計算從 recipeStore 中取得的選擇的食譜

const currentUser = localStorage.getItem('UserId') ? { id: localStorage.getItem('UserId') } : null; // 這是示例，請根據實際情況設置當前用戶ID
const isGuest = !currentUser;
const recipeIngredients = computed(() => {
    if (source === 'buyAndCook') {
        // 使用隨買隨煮的食材列表，並為每個食材加入需求數量和擁有的數量
        return cookingStore.cookingInventories
            .map((inventory) => {
                const ingredientId = inventory.ingredientId;
                const ingredientName = inventory.ingredientName;
                const requiredQuantity = recipeStore.selectedRecipe?.ingredientQuantities[ingredientId] || 0;
                const unit = inventory.unit || '';
                const expiryDate = inventory.expiryDate || new Date().toISOString().split('T')[0];
                return {
                    ingredientId,
                    ingredientName,
                    requiredQuantity,
                    remainingQuantity: parseFloat(inventory.quantity) || 0, // 將庫存中的數量轉為數值
                    unit,
                    expiryDate,
                };
            })
            .filter((ingredient) => ingredient.requiredQuantity > 0); // 只保留需求數量大於 0 的食材
    } else {
        if (!recipeStore.selectedRecipe) return [];
        return recipeStore.selectedRecipe.selectedIngredients
            .map((ingredientId, index) => {
                const ingredientName = recipeStore.selectedRecipe.selectedIngredientNames[index];
                const requiredQuantity = recipeStore.selectedRecipe.ingredientQuantities[ingredientId] || 0;
                const unit = recipeStore.selectedRecipe.ingredientUnits[ingredientId] || '';

                // 找到屬於當前用戶的所有庫存項目並累加數量
                const totalQuantity = inventoryStore.inventories
                    .filter((item) => item.ingredientId === ingredientId && item.userId === currentUser.id)
                    .reduce((sum, item) => sum + parseFloat(item.quantity), 0); // 確保數值的加總

                return {
                    ingredientId,
                    ingredientName,
                    requiredQuantity,
                    remainingQuantity: totalQuantity,
                    unit,
                };
            })
            .filter((ingredient) => ingredient.requiredQuantity > 0); // 只保留需求數量大於 0 的食材
    }
});

//#region 顯示食譜資訊
// 計算顯示的用戶 ID
const userIdDisplay = computed(() => {
    return recipeStore.selectedRecipe && recipeStore.selectedRecipe.userId === '0'
        ? '系統預設'
        : recipeStore.selectedRecipe?.userId;
});

// 用來控制當前步驟的變數
let activeStep = ref(1);

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
    if (recipeStore.selectedRecipe?.seasoning) {
        return recipeStore.selectedRecipe.seasoning.split(',').map((item) => item.trim());
    }
    return [];
});
//#endregion 顯示食譜資訊

// 當點擊「開始烹飪」時觸發的操作
const startCooking = async () => {
    try {
        const { deletedIngredients = [], updatedIngredients = [] } = await updateInventoriesAfterCooking(
            recipeIngredients.value
        );
        // console.log(deletedIngredients);
        // console.log(updatedIngredients);

        // 用於合併刪除和更新的食材
        const ingredientChanges = {};

        // 處理刪除的食材
        deletedIngredients.forEach((ingredientName) => {
            if (!ingredientChanges[ingredientName]) {
                ingredientChanges[ingredientName] = { deleted: true, reducedQuantity: 0 };
            } else {
                ingredientChanges[ingredientName].deleted = true;
            }
        });

        // 處理減少的食材
        updatedIngredients.forEach((ingredient) => {
            if (!ingredientChanges[ingredient.name]) {
                ingredientChanges[ingredient.name] = {
                    deleted: false,
                    reducedQuantity: ingredient.quantity,
                };
            } else {
                ingredientChanges[ingredient.name].reducedQuantity += ingredient.quantity;
            }
        });
        // 確保 `updatedIngredients` 是有效的數組後再傳遞
        if (Array.isArray(updatedIngredients) && updatedIngredients.length > 0) {
            // console.log('updateCooking觸發');
            cookingStore.updateCookingInventories(updatedIngredients);
        } else {
            console.error('updatedIngredients 無效，無法進行更新');
        }
        let message = '烹飪完成。\n';

        // 組合訊息
        Object.keys(ingredientChanges).forEach((ingredientName) => {
            const change = ingredientChanges[ingredientName];
            if (change.deleted && change.reducedQuantity > 0) {
                message += `${ingredientName} 已全部用完，並從庫存中刪除；之前的剩餘數量已減少了 ${change.reducedQuantity}。\n`;
            } else if (change.deleted) {
                message += `${ingredientName} 已全部用完，並從庫存中刪除。\n`;
            } else if (change.reducedQuantity > 0) {
                message += `${ingredientName} 已減少了 ${change.reducedQuantity}。\n`;
            }
        });

        // 如果沒有任何刪除或減少的情況，也給一個提示
        if (Object.keys(ingredientChanges).length === 0) {
            message = '您的庫存沒有變化。';
        }

        // 判斷是否需要將剩餘食材存入資料庫
        if (source === 'buyAndCook' && !isGuest) {
            // 如果是 "隨買隨煮" 並且不是訪客，將剩餘食材存入資料庫
            await cookingStore.saveLeftoverInventories();
        }
        Swal.fire({
            title: '烹飪狀態更新',
            html: `<pre>${message}</pre>`,
            icon: 'info',
            confirmButtonText: '了解',
        }).then(() => {
            // 清除標識以避免影響後續的操作
            localStorage.removeItem('source');
            // 清除選擇的食譜
            localStorage.removeItem('selectedRecipe');
            router.push('/generaterecipe');
        });
    } catch (error) {
        console.error('startCooking 發生錯誤:', error);
        Swal.fire({
            title: '錯誤',
            text: '更新庫存時發生錯誤，請稍後再試。',
            icon: 'error',
            confirmButtonText: '確定',
        }).then(() => {
            // 清除標識以避免影響後續的操作
            localStorage.removeItem('source');
            // 清除選擇的食譜
            localStorage.removeItem('selectedRecipe');
        });
    }
};
</script>

<template>
    <div>
        <!-- 食譜header start -->
        <section>
            <div class="header">
                <div class="title">
                    <h1>料理時間</h1>
                    <h1>Cooking Time</h1>
                </div>
            </div>
        </section>
        <!-- 食譜header end -->

        <!-- 裝飾貼紙 -->
        <section>
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-1.png"
                alt=""
                style="top: 25%; right: 10%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-2.png"
                alt=""
                style="top: 20%; left: 10%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-3.png"
                alt=""
                style="top: 35%; left: 0%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-4.png"
                alt=""
                style="top: 43%; right: 0%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-5.png"
                alt=""
                style="top: 50%; left: 13%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-6.png"
                alt=""
                style="top: 60%; right: 10%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-7.png"
                alt=""
                style="top: 67%; left: -2%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-8.png"
                alt=""
                style="top: 80%; right: 0%"
            />
            <img
                class="sticker"
                src="@/assets/img/ForBackground/stickers/sticker-9.png"
                alt=""
                style="top: 85%; left: 12%"
            />
        </section>

        <!-- 食譜詳細資訊 start -->
        <section class="recipe-details mt-5 text-center">
            <p class="recipe-title display-4">{{ recipeStore.selectedRecipe.recipeName }}</p>
            <p class="recipe-description">為之後的食譜描述預留空間</p>
            <div class="container mt-4">
                <table class="table table-bordered table-striped table-hover description-table">
                    <tbody>
                        <tr>
                            <th>烹飪時長</th>
                            <td>50 分鐘</td>
                        </tr>
                        <tr>
                            <th>用戶名稱</th>
                            <td>{{ userIdDisplay }}</td>
                        </tr>
                        <tr>
                            <th>葷素限制</th>
                            <td>{{ recipeStore.selectedRecipe.restriction ? '素' : '葷' }}</td>
                        </tr>
                        <tr>
                            <th>類別</th>
                            <td>{{ recipeStore.selectedRecipe.category }}</td>
                        </tr>
                        <tr>
                            <th>細部類別</th>
                            <td>{{ recipeStore.selectedRecipe.detailedCategory }}</td>
                        </tr>
                        <tr>
                            <th>權限</th>
                            <td>
                                <span v-if="recipeStore.selectedRecipe.visibility === 0">公開</span>
                                <span v-else-if="recipeStore.selectedRecipe.visibility === 1">群組</span>
                                <span v-else-if="recipeStore.selectedRecipe.visibility === 2">私人</span>
                                <span v-else>未知</span>
                                <!-- 若為意外值，顯示"未知" -->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <!-- 食譜詳細資訊 end -->
        <!-- 食材列表 start -->
        <section class="mt-5 text-center">
            <div class="container-fluid">
                <div class="row g-4 fs-5">
                    <!-- 食材 -->
                    <div class="col-12 w-60 mx-auto p-3">
                        <h3 class="text-black">食材</h3>
                        <div class="row g-4">
                            <ul class="list-unstyled">
                                <li
                                    v-for="(ingredient, index) in recipeIngredients"
                                    :key="ingredient.ingredientId"
                                    class="mb-1"
                                >
                                    <div class="d-flex justify-content-center align-items-center">
                                        <!-- Checkbox，綁定 checked 狀態和 localChecked 集合 -->
                                        <el-checkbox
                                            :value="isChecked(ingredient.ingredientId)"
                                            @change="toggleChecked(ingredient.ingredientId)"
                                            class="mt-2"
                                        >
                                        </el-checkbox>
                                        <!-- 顯示食材名稱與數量資訊 -->
                                        <span
                                            :style="{
                                                textDecoration: localChecked.includes(ingredient.ingredientId)
                                                    ? 'line-through'
                                                    : 'none',
                                            }"
                                            class="ms-2"
                                        >
                                            {{ ingredient.ingredientName }} - 需求數量:
                                            {{ ingredient.requiredQuantity }} {{ ingredient.unit }}
                                            (總數量:
                                            <span
                                                :class="{
                                                    'text-danger':
                                                        ingredient.remainingQuantity < ingredient.requiredQuantity,
                                                }"
                                            >
                                                {{ ingredient.remainingQuantity }} {{ ingredient.unit }} </span
                                            >)
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- 調味料 -->
                    <div class="col-12 w-60 mx-auto p-3">
                        <h3 class="text-black">調味料</h3>
                        <div
                            class="seasoning-tags mt-3"
                            style="display: flex; flex-wrap: wrap; justify-content: center"
                        >
                            <el-tag
                                v-for="(seasoning, index) in seasoningList"
                                :key="index"
                                type="success"
                                effect="light"
                                size="large"
                                class="mb-2 me-3 fs-6"
                            >
                                {{ seasoning }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 食材列表 end -->

        <!-- 步驟 start -->
        <section class="mt-5 text-center w-60 mx-auto p-3">
            <h3 class="text-black">烹飪步驟</h3>
            <div
                class="recipe-steps my-4 wide-steps-container d-flex justify-content-center"
                :style="{ height: dynamicHeight, maxWidth: '600px' }"
            >
                <!-- 使用 el-steps 顯示步驟 -->
                <el-steps :active="activeStep" direction="vertical">
                    <el-step
                        v-for="(step, index) in recipeSteps"
                        :key="index"
                        :title="step"
                        @click="incrementStep(index)"
                    ></el-step>
                </el-steps>
            </div>
        </section>

        <!-- 步驟 end -->
        <!-- 開始烹飪按鈕 start -->
        <div class="container-fluid text-center mt-5 mb-3">
            <el-button type="success" size="large" @click="startCooking">烹飪完成</el-button>
        </div>
        <!-- 開始烹飪按鈕 end -->
    </div>
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
    background: #1b2030 url('@/assets/img/ForBackground/bg-header.jpg') 50% 0 no-repeat;
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
.sticker {
    width: 13%;
    position: absolute;
}
.recipe-title {
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.recipe-description {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
}

.description-table {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f8f9fa;
}

.description-table th,
.description-table td {
    padding: 12px;
    text-align: center;
    font-size: 1rem;
}

.description-table th {
    background-color: #e9ecef;
    color: #495057;
    width: 40%;
    font-weight: 600;
}

.description-table td {
    color: #212529;
}

.description-table tr:hover {
    background-color: #f1f1f1;
}
</style>
