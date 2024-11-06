<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useOAuthStore } from '@/stores/oauth';
const oauthStore = useOAuthStore();
const dietaryRestrictions = ref(false);



const handleLoginClick = async () => {
    const loginSuccess = await oauthStore.oAuthFirstSignIn(dietaryRestrictions.value); // 先發送請求
};
</script>

<template>
    <div>
        <form name="user" id="registerForm" @submit.prevent="handleLoginClick" novalidate>
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                <div class="card card-plain mt-8">
                    <div class="card-header pb-0 text-left bg-transparent">
                        <h3 class="font-weight-bolder text-info text-gradient">請填寫飲食習慣</h3>
                        <p class="mb-0">選擇您的飲食限制</p>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <!-- 第一個 Radio Button: 素食 -->
                            <input type="radio" class="form-check-input me-2 custom-radio" name="dietaryPreference"
                                v-model="dietaryRestrictions" id="nonVegetarian" :value="true" />
                            <label for="nonVegetarian" class="form-check-label me-4">素食</label>
                            <!-- 第二個 Radio Button: 葷食 -->
                            <input type="radio" class="form-check-input me-2 custom-radio" name="dietaryPreference"
                                v-model="dietaryRestrictions" id="vegetarian" :value="false" />
                            <label for="vegetarian" class="form-check-label">葷食</label>
                            <!-- 顯示錯誤訊息 -->
                            <span class="text-danger ms-3">{{ dietaryMessage }}</span>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">送出</button>
                        </div>
                        <p>{{ dietaryRestrictions }}</p>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style lang="css" scoped>
.custom-radio {
    accent-color: #007bff;
    /* 設置邊框顏色為藍色，調整為你希望的顏色 */
    outline: 2px solid #007bff;
    /* 設置選中時的外框顏色 */
    outline-offset: 2px;
    /* 控制外框與元素間的距離 */
    transition: outline 0.2s ease-in-out;
    /* 增加過渡效果 */
}

.custom-radio:checked {
    outline: 2px solid #ff5722;
    /* 勾選時的顏色，可以調整 */
}
</style>
