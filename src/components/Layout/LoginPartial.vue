<script setup>
import { ref, onMounted } from 'vue';

const tokenData = ref(null);
const username = ref('');
const isTokenExpired = ref(false);
const storedUserData = JSON.parse(localStorage.getItem('UserData')); // 取得 UserData

function checkTokenExpiry() {
    const currentTime = Math.floor(Date.now() / 1000) //取的以秒為單位的目前時間
    return storedUserData?.Exp < currentTime; // 判斷token的過期時間是否超過目前時間 超過則返回true
}
onMounted(() => {
    tokenData.value = localStorage.getItem('token');
    // 取得localStorage的token
    if (tokenData.value) {
        isTokenExpired.value = checkTokenExpiry();
        if (!isTokenExpired.value) {
            username.value = storedUserData?.UserName;
        } else {
            // 若 token 過期，清除 token 並強制用戶重新登入
            logout();
        }
    }
})
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('UserData');
    localStorage.removeItem('UserId');
    localStorage.removeItem('GroupId');
    localStorage.removeItem('ExclusiveIngredients');
    localStorage.removeItem('PreferedIngredients');

    // localStorage.clear(); //清空localStorage
    location.reload();  // 刷新頁面以更新登入狀態
}
</script>

<template>
    <template v-if="!tokenData || isTokenExpired">
        <ul class="navbar-nav ms-auto text-center">
            <li class="nav-item">
                <RouterLink class="nav-link me-2" :to="{ name: 'signup' }">
                    <i class="fa fa-user opacity-6 me-1" aria-hidden="true"
                        :class="isTransparent ? 'text-white' : 'text-dark'" @click="isNavbarShown = false"></i>
                    註冊
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink class="nav-link me-2" :to="{ name: 'signin' }">
                    <i class="fas fa-sign-out-alt opacity-6 me-1" aria-hidden="true"
                        :class="isTransparent ? 'text-white' : 'text-dark'" @click="isNavbarShown = false"></i>
                    登入
                </RouterLink>
            </li>
        </ul>
    </template>

    <template v-else>
        <ul class="navbar-nav ms-auto text-center">
            <li class="nav-item">
                <RouterLink class="nav-link me-2" to="/user">
                    <i class="fa fa-user opacity-6 me-1" aria-hidden="true"
                        :class="isTransparent ? 'text-white' : 'text-dark'" @click="isNavbarShown = false"></i>
                    {{ username }}
                </RouterLink>
            </li>
            <li @click="logout" class="nav-item">
                <RouterLink class="nav-link me-2" to="/">
                    <i class="fas fa-sign-out-alt opacity-6 me-1" aria-hidden="true"
                        :class="isTransparent ? 'text-white' : 'text-dark'" @click="isNavbarShown = false"></i>
                    登出
                </RouterLink>
            </li>
        </ul>
    </template>
</template>
<style lang="css" scoped></style>