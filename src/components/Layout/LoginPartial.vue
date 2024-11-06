<script setup>
import { useAuthStore } from '@/stores/auth';
import { useOAuthStore } from '@/stores/oauth';
const authStore = useAuthStore();
const oauthStore = useOAuthStore();

</script>

<template>
   <template v-if="!authStore.token || !authStore.checkTokenExpiry || !oauthStore.token">
        <ul class="navbar-nav ms-auto text-center">
            <li class="nav-item">
                <RouterLink class="nav-link me-2" :to="{ name: 'signup' }">
                    <i class="fa fa-user opacity-6 me-1"></i> 註冊
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink class="nav-link me-2" :to="{ name: 'signin' }">
                    <i class="fas fa-sign-out-alt opacity-6 me-1"></i> 登入
                </RouterLink>
            </li>
        </ul>
    </template>
    <template v-else>
        <ul class="navbar-nav ms-auto text-center">
            <li class="nav-item">
                <RouterLink class="nav-link me-2" to="/user">
                    <i class="fa fa-user opacity-6 me-1"></i>
                    {{ authStore.userData.UserName || oauthStore.userData.UserName}}
                </RouterLink>
            </li>
            <li @click="authStore.logout()" class="nav-item">
                <RouterLink class="nav-link me-2" to="/">
                    <i class="fas fa-sign-out-alt opacity-6 me-1"></i> 登出
                </RouterLink>
            </li>
        </ul>
    </template>
</template>
<style lang="css" scoped></style>