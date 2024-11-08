<script setup>
import { ref } from 'vue';
const registrationSuccess = ref(false);
const API_URL = `${import.meta.env.VITE_API_BASEURL}/EmailVerification/ResetEmailConfirmed`;
const user = ref({
    email: '',
});
const send = async () => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(user.value),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        registrationSuccess.value = true;
    } else {
        await alert('沒有這個email或輸入錯誤');
        registrationSuccess.value = false;
    }
};
</script>
<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>電子郵件確認</h1>
                <h1>Email Validation</h1>
            </div>
        </div>
    </section>

    <template v-if="!registrationSuccess">
        <form name="user" id="registerForm" @submit.prevent="send" novalidate>
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                <div class="mt-3">
                    <label for="email" class="fs-5">請輸入您的註冊Email</label>
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
                        <span class="text-danger"></span>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn bg-gradient-success w-100 mt-2 mb-0 fs-6">
                            重新發送電子郵件確認
                        </button>
                    </div>
                </div>
                <div class="text-center fs-6 pt-5 px-lg-2 px-1">
                    <p class="mb-4 mx-auto">
                        您還沒有註冊會員嗎?
                        <RouterLink class="text-success text-gradient font-weight-bold ms-2" :to="{ name: 'signup' }"
                            >註冊</RouterLink
                        >
                    </p>
                </div>
            </div>
        </form>
    </template>
    <template v-else>
        <div class="d-flex flex-column justify-content-center align-items-center py-8">
            <h2 class="text-center">信件發送成功!</h2>
            <h3 class="text-center">請確認信箱</h3>
            <RouterLink to="/signin">
                <button class="back-button">回到登入頁面</button>
            </RouterLink>
        </div>
    </template>
</template>

<style lang="css" scoped>
/* header 本人 */
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
/* 下方 mask */
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
.back-button {
    background-color: transparent;
    border: 3px solid #555e6e;
    border-radius: 1rem;
    font-size: large;
    font-weight: 400;
    padding: auto;
    margin-top: 0.5rem;
}
</style>
