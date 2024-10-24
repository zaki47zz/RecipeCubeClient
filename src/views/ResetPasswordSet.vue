<script setup>
import { ref} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();  // 使用vue-router來獲取URL中的token
const registrationSuccess = ref(false);
const API_URL = `${import.meta.env.VITE_API_BASEURL}/EmailVerification/ResetPassword`;
const user = ref({
    "password": "",
    "token": route.query.token  // 獲取URL中的token
})
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
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                registrationSuccess.value = true;  // 重設密碼成功
            } else {
                // 如果後端回傳非 200 OK 狀態，提取錯誤訊息
                const errorData = await response.json();
                pwdmessage.value = errorData.Message || '重設密碼失敗';  // 顯示後端的錯誤訊息
            }
        } catch (error) {
            pwdmessage.value = '連接伺服器發生錯誤';  // 捕捉到的錯誤
        }
    }
}
</script>

<template >
    <template v-if="!registrationSuccess">
        <form  name="user" id="registerForm" @submit.prevent="send" novalidate>
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                <div class="card card-plain mt-8">
                    <div class="card-header pb-0 text-left bg-transparent">
                        <h3 class="font-weight-bolder text-info text-gradient">重設密碼</h3>
                        <p class="mb-0">重設密碼，不要再忘了</p>
                    </div>
                    <div class="card-body">
                        <div class="form-floating mb-3">
                        <input type="password" class="form-control" name="password" v-model.trim="pwd1"
                            id="password" value="" placeholder="密碼" required />
                        <label for="password" class="form-label">密碼</label>
                        <span class="text-danger"></span>
                        </div>
                        <div class="form-floating mb-3">
                        <input type="password" class="form-control" name="password" v-model.trim="pwd2"
                            id="password" value="" placeholder="確認密碼" required />
                        <label for="password" class="form-label">確認密碼</label>
                        <span class="text-danger">{{ pwdmessage }}</span>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">重設密碼</button> 
                        </div>
                    </div>
                </div>
            </div>
        </form>
</template>
    <template v-else>
        <h2>重設密碼成功，請重新登入</h2>
    </template>
</template>  

<style lang="css" scoped>

</style>