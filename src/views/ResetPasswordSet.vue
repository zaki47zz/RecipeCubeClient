<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // 使用vue-router來獲取URL中的token
const registrationSuccess = ref(false);
const API_URL = `${import.meta.env.VITE_API_BASEURL}/EmailVerification/ResetPassword`;
const user = ref({
    password: '',
    token: route.query.token, // 獲取URL中的token
});
const pwd1 = ref('');
const pwd2 = ref('');
const pwdmessage = ref('');

const validatePasswords = () => {
    if (pwd1.value !== pwd2.value) {
        pwdmessage.value = '兩次輸入的密碼不一致';
        return false;
    }
    return true;
};

const send = async () => {
    if (validatePasswords()) {
        user.value.password = pwd1.value;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(user.value),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                registrationSuccess.value = true; // 重設密碼成功
            } else {
                // 如果後端回傳非 200 OK 狀態，提取錯誤訊息
                const errorData = await response.json();
                pwdmessage.value = errorData.Message || '重設密碼失敗'; // 顯示後端的錯誤訊息
            }
        } catch (error) {
            pwdmessage.value = '連接伺服器發生錯誤'; // 捕捉到的錯誤
        }
    }
};
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>重設密碼</h1>
                <h1>Password Reset</h1>
            </div>
        </div>
    </section>

    <template v-if="!registrationSuccess">
        <form name="user" id="registerForm" @submit.prevent="send" novalidate>
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                <div class="mt-3">
                    <label for="password" class="fs-5">請輸入您的新密碼</label>
                    <div class="form-floating mb-3">
                        <input
                            type="password"
                            class="form-control"
                            name="password"
                            v-model.trim="pwd1"
                            id="password"
                            value=""
                            placeholder="新密碼"
                            required
                        />
                        <label for="password" class="form-label">密碼</label>
                        <span class="text-danger"></span>
                    </div>
                    <label for="password" class="fs-5">請再次輸入您的新密碼</label>
                    <div class="form-floating mb-3">
                        <input
                            type="password"
                            class="form-control"
                            name="password"
                            v-model.trim="pwd2"
                            id="password"
                            value=""
                            placeholder="確認密碼"
                            required
                        />
                        <label for="password" class="form-label">確認密碼</label>
                        <span class="text-danger">{{ pwdmessage }}</span>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn bg-gradient-success w-100 mt-2 mb-0 fs-6">重設密碼</button>
                        <p class="mb-0">(重設密碼後請妥善保管您的密碼資訊)</p>
                    </div>
                </div>
            </div>
        </form>
    </template>
    <template v-else>
        <div class="d-flex flex-column justify-content-center align-items-center py-8">
            <h2 class="text-center">重設密碼成功!</h2>
            <h3 class="text-center">請重新登入</h3>
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
