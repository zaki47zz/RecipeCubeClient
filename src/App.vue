<style>
body {
    font-family: 'Cinzel', 'Chocolate Classical Sans', system-ui, sans-serif !important;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: 0;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(5px);
    z-index: -1;
}

.main-content {
    margin-top: 75px;
}
</style>

<template>
    <Loader></Loader>
    <Navbar></Navbar>
    <main class="main-content container position-relative max-height-vh-100">
        <RouterView />
    </main>
    <Footer></Footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { watchEffect } from 'vue';
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import Loader from './components/Layout/Loader.vue';

const route = useRoute();

// 導入圖片
import inventoryBg from '@/assets/img/ForBackground/Inventory.png';
import recipeBg from '@/assets/img/ForBackground/Recipe.png';
import buyandcookBg from '@/assets/img/ForBackground/BuyandCook.png';

// 監聽路由變化並修改 body 背景
watchEffect(() => {
    let backgroundImage = '';

    // 根據路由變更設定不同的背景圖片
    switch (route.path) {
        case '/':
            backgroundImage = `url(${buyandcookBg})`;
            break;
        case '/buyandcook':
            backgroundImage = `url(${buyandcookBg})`;
            break;
        case '/recipe':
            backgroundImage = `url(${recipeBg})`;
            break;
        case '/customrecipe':
            backgroundImage = `url(${recipeBg})`;
            break;
        case '/inventory':
            backgroundImage = `url(${inventoryBg})`;
            break;
        case '/addingredient':
            backgroundImage = `url(${inventoryBg})`;
            break;
        default:
            backgroundImage = null;
            break;
    }

    // 設置背景圖片
    document.body.style.backgroundImage = backgroundImage;
});
</script>
