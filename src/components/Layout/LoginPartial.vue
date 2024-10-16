<script setup>
    
</script>

<template>
    <li class="nav-item">
        <RouterLink class="nav-link me-2" to="/">
            <i class="fa fa-user opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            註冊
        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" :to="{ name: 'SignIn' }">
                            <i
                                class="fas fa-sign-out-alt opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            登入
                        </RouterLink>
    </li>      
</template>

<style lang="css" scoped>

</style>