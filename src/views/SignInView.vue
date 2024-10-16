<script setup>
import { ref } from 'vue';

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Users/login`
const user = ref({
    "email": "",
    // "password": ""
})

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


const send = async () => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(user.value),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        const datas = await response.json()
        if(datas.token) {
            localStorage.setItem('token', datas.token); // 儲存 JWT
            const decoded = parseJwt(datas.token);


          
            /*  解析JWT 取得並將UserId寫入localStorage.getItem('UserId')
                使用方法 const UserId = localStorage.getItem('UserId');
            */
            if (decoded.certserialnumber) {
                localStorage.setItem('UserId', decoded.certserialnumber);  // 存入登入用戶的 ID
                console.log('UserId 已存入 localStorage:', decoded.certserialnumber);
            } else {
                console.error('找不到 certserialnumber');
            }
            alert(datas.message);
            console.log("解碼後的 JWT:", decoded);
        }
    }
    else{
        alert("登入失敗");
    }
}



</script>

<template>
    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
    <div class="card card-plain mt-8">
        <div class="card-header pb-0 text-left bg-transparent">
            <h3 class="font-weight-bolder text-info text-gradient">歡迎回來</h3>
            <p class="mb-0">輸入Email與密碼登入</p>
        </div>
        <div class="card-body">
            <form @submit.prevent="send">
                <div class="text-danger" role="alert"></div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" name="email" v-model="user.email" id="email" placeholder="Email" required/>
                    <label for="email" class="form-label">Email</label>
                    <span class="text-danger"></span>
                </div>
                <!-- <div class="form-floating mb-3">
                    <input type="password" class="form-control" name="password" v-model="user.password"
                    id="password" value="" placeholder="密碼" required/>
                    <label for="password" class="form-label">密碼</label>
                    <span class="text-danger"></span>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" />
                    <label class="form-check-label">記住密碼</label>
                </div> -->
                <div class="text-center">
                    <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">登入</button>
                </div>
            </form>
        </div>
        <div class="card-footer text-center pt-0 px-lg-2 px-1">
            <p class="mb-4 text-sm mx-auto">
                不記得密碼嗎?
                <a id="forgot-password" class="text-info text-gradient font-weight-bold">忘記密碼</a>
                <br>
                還沒有註冊過會員嗎?
                <a asp-page="./Register" class="text-info text-gradient font-weight-bold">註冊</a>
                <br>
                沒有收到驗證電子郵件嗎?
                <a id="resend-confirmation" class="text-info text-gradient font-weight-bold">重新發送電子郵件確認</a>
            </p>
        </div>
    </div>
</div>
</template>

<style lang="css" scoped></style>