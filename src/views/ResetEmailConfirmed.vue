<script setup>
import { ref } from 'vue';
const registrationSuccess = ref(false);
const API_URL = `${import.meta.env.VITE_API_BASEURL}/EmailVerification/ResetEmailConfirmed`;
const user = ref({
    "email": "",
})
const send = async () => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(user.value),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        registrationSuccess.value = true;
    }
    else {
        await alert("沒有這個email或輸入錯誤");
        registrationSuccess.value = false;
    }
}
</script>
<template >
    <template v-if="!registrationSuccess">
        <form  name="user" id="registerForm" @submit.prevent="send" novalidate>
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                <div class="card card-plain mt-8">
                    <div class="card-header pb-0 text-left bg-transparent">
                        <h3 class="font-weight-bolder text-info text-gradient">重新發送電子郵件確認</h3>
                        <p class="mb-0">輸入註冊Email</p>
                    </div>
                    <div class="card-body">
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" name="email" v-model.trim="user.email" id="email" placeholder="Email" required />
                            <label for="email" class="form-label">Email</label>
                            <span class="text-danger"></span>
                        </div>
                    <div class="text-center">
                        <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">重新發送電子郵件確認</button> 
                    </div>
                    </div>
                    <div class="card-footer text-center pt-0 px-lg-2 px-1">
                        <p class="mb-4 text-sm mx-auto">還沒有註冊過會員嗎?</p>
                        <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'signup' }">註冊</RouterLink>
                    </div>
                </div>
            </div>
        </form>
</template>
    <template v-else>
        <h2>發送成功，請確認信箱</h2>
    </template>
</template>    


<style lang="css" scoped>

</style>