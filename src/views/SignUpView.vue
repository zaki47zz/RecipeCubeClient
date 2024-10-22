<script setup>
import { ref } from 'vue';

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Users/SignUp`;

const user = ref({
    "email": "",
    "password": "",
    "DietaryRestrictions": false,
});

const pwd1 = ref('');
const pwd2 = ref('');

const validatePasswords = () => {
    if (pwd1.value !== pwd2.value) {
        alert('兩次輸入的密碼不一致');
        return false;
    }
    return true;
};

const send = async () => {
    if (validatePasswords()) {
        user.value.password = pwd1.value;  // 將密碼存入 user 對象
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(user.value),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            alert('註冊成功!!');
        }
    }
};
</script>

<template>
    <form name="user" id="registerForm" @submit.prevent="send" novalidate>
        <div class="form-floating mb-3">
            <input type="email" v-model.trim="user.email" class="form-control" placeholder="Email" required/>
            <label>Email</label>
        </div>

        <div class="form-floating mb-3">
            <input type="password" v-model.trim="pwd1" class="form-control" placeholder="密碼" required/>
            <label>密碼</label>
        </div>

        <div class="form-floating mb-3">
            <input type="password" v-model.trim="pwd2" class="form-control" placeholder="確認密碼" required/>
            <label>確認密碼</label>
        </div>

         <!-- 飲食偏好選擇 -->
         <div class="mb-3 form-check">
            <label class="form-check-label">
                <input type="checkbox" v-model="user.DietaryRestrictions" class="form-check-input" />
                {{ user.DietaryRestrictions ? "素食" : "葷食" }}
            </label>
        </div>
        

        <div class="text-center">
            <button type="submit" class="btn bg-gradient-dark w-100">註冊</button>
        </div>
    </form>
</template>

<style lang="css" scoped>

</style>