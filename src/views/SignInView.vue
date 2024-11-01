<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const user = ref({
    // 後續記得帳號功能，可以在按下記住密碼button後，將帳號密碼寫入localStorage，登入時讀取localStorage帳密，在tokin到期時一起清除
    email: 'user18@example.com',
    password: 'Password123!',
});

const handleLoginClick = async () => {
    const loginSuccess = await authStore.login(user.value.email,user.value.password); // 先發送請求
    if (loginSuccess) {
        authStore.userData.UserName
        authStore.userData.UserName
        console.log(authStore.checkTokenExpiry);
        router.push('/'); // 使用 router 進行導航，不需要刷新頁面
    }
};
</script>

<template>
    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
        <div class="card card-plain mt-8">
            <div class="card-header pb-0 text-left bg-transparent">
                <h3 class="font-weight-bolder text-info text-gradient">歡迎回來</h3>
                <p class="mb-0">輸入Email與密碼登入</p>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleLoginClick">
                    <!-- 修改事件綁定為 handleLoginClick -->
                    <div class="text-danger" role="alert"></div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" name="email" v-model.trim="user.email" id="email"
                            placeholder="Email" required />
                        <label for="email" class="form-label">Email</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" name="password" v-model.trim="user.password"
                            id="password" value="" placeholder="密碼" required />
                        <label for="password" class="form-label">密碼</label>
                    </div>
                    <span class="text-danger text-center">{{ authStore.loginMessage }}</span>
                    <!-- <div class="form-check form-switch">
                        <input class="form-check-input" />
                        <label class="form-check-label">記住密碼</label>
                    </div> -->
                    <!-- 好像不存在同設備頻繁登出登入的需求，後續再考慮實作此功能 -->
                    <div class="text-center">
                        <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">登入</button>
                        <!-- 按下按鈕後執行 handleLoginClick -->
                    </div>
                </form>
            </div>
            <div class="card-footer text-center pt-0 px-lg-2 px-1">
                <p class="mb-4 text-sm mx-auto">
                    不記得密碼嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'resetpassword' }">忘記密碼
                    </RouterLink>
                    <br />
                    還沒有註冊過會員嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'signup' }">註冊
                    </RouterLink>
                    <br />
                    沒有收到驗證電子郵件嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'resetemailConfirmed' }">
                        重新發送電子郵件確認
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
