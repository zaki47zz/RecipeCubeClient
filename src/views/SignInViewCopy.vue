<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOAuthStore } from '@/stores/oauth';

const router = useRouter();
const authStore = useAuthStore();
const oauthStore = useOAuthStore();

const user = ref({
    // 後續記得帳號功能，可以在按下記住密碼button後，將帳號密碼寫入localStorage，登入時讀取localStorage帳密，在tokin到期時一起清除
    email: 'user18@example.com',
    password: 'Password123!',
});

const handleLoginClick = async () => {
    const loginSuccess = await authStore.login(user.value.email, user.value.password); // 先發送請求
    if (loginSuccess) {
        // console.log(authStore.checkTokenExpiry);
        router.push('/'); // 使用 router 進行導航，不需要刷新頁面
    }
};

const handleGoogleLogin = async (response) => {
    oauthStore.callback(response);
};
</script>

<template>
    <section>
        <div class="page-header min-vh-75">
            <div class="container">
                <div class="row">
                    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                        <div class="card card-plain mt-4">
                            <div class="card-header pb-0 bg-transparent mx-auto text-center">
                                <h2 class="font-weight-bolder text-success text-gradient">歡迎回來</h2>
                                <GoogleLogin :callback="handleGoogleLogin" class="mt-1" />
                                <p class="my-2">-或者-</p>
                                <p class="mt-0 mb-2 fs-6">輸入Email與密碼登入</p>
                            </div>
                            <div class="card-body pt-2 pb-3 mt-0">
                                <form @submit.prevent="handleLoginClick">
                                    <div class="text-danger" role="alert"></div>
                                    <div class="form-floating mb-3">
                                        <input
                                            type="email"
                                            class="form-control"
                                            name="email"
                                            v-model.trim="user.email"
                                            id="email"
                                            placeholder="Email"
                                            required
                                        />
                                        <label for="email" class="form-label">Email</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input
                                            type="password"
                                            class="form-control"
                                            name="password"
                                            v-model.trim="user.password"
                                            id="password"
                                            value=""
                                            placeholder="密碼"
                                            required
                                        />
                                        <label for="password" class="form-label">密碼</label>
                                    </div>
                                    <span class="text-danger text-center">{{ authStore.loginMessage }}</span>
                                    <div class="form-check form-switch d-flex justify-content-center">
                                        <input class="form-check-input" type="checkbox" id="rememberMe" checked="" />
                                        <label class="form-check-label" for="rememberMe">記住密碼</label>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="btn bg-gradient-success w-100 mt-1 mb-0 fs-6">
                                            登入
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div class="card-footer text-center pt-0 px-lg-2 px-1">
                                <p class="mb-4 text-sm mx-auto">
                                    不記得密碼嗎?
                                    <RouterLink
                                        class="text-success text-gradient font-weight-bold"
                                        :to="{ name: 'resetpassword' }"
                                        >忘記密碼
                                    </RouterLink>
                                    <br />
                                    還沒有註冊過會員嗎?
                                    <RouterLink
                                        class="text-success text-gradient font-weight-bold"
                                        :to="{ name: 'signup' }"
                                        >註冊
                                    </RouterLink>
                                    <br />
                                    沒有收到驗證電子郵件嗎?
                                    <RouterLink
                                        class="text-success text-gradient font-weight-bold"
                                        :to="{ name: 'resetemailConfirmed' }"
                                    >
                                        重新發送電子郵件確認
                                    </RouterLink>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="my-4 d-md-block d-none">
                            <img
                                src="@/assets/img/ForBackground/SignIn-bg.jpg"
                                alt="Background Image"
                                class="bg-sign-in"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
.form-switch .form-check-input:checked {
    border-color: rgba(58, 111, 60, 0.95);
    background-color: rgba(58, 111, 60, 0.95);
}
.bg-sign-in {
    width: 100%;
    height: 80vh;
    border-radius: 2rem;
    object-fit: cover;
}
</style>
