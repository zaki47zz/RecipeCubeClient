<style>
body {
    font-family: 'Cinzel', 'Chocolate Classical Sans', system-ui, sans-serif !important;
    margin: 0;
    overflow-x: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 0;
}



html,
body,
#app {
    height: 100%;
    margin: 0;
    overflow: hidden;
    /* 避免顯示原生滾動條 */
}

#scroll-container {
    height: 100vh;
    /* 確保 PerfectScrollbar 覆蓋整個視窗 */
    display: flex;
    flex-direction: column;
}

.main-content {
    margin-top: 75px;
    flex-grow: 1;
    /* 使主內容填滿剩餘空間 */
}
</style>

<template>
    <PerfectScrollbar id="scroll-container">
        <Loader />
        <Navbar />
        <main class="main-content container position-relative">
            <RouterView />
        </main>
        <Footer />
    </PerfectScrollbar>
</template>

<script setup>
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import Loader from './components/Layout/Loader.vue';
// 引入 PerfectScrollbar 組件
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
</script>
