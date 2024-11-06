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
    width: 100vw;
    margin-left: calc(50% - 50vw);
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat center / cover;
}

.main-content {
    margin-top: 75px;
    flex-grow: 1;
    min-width: 90%;
}
</style>

<template>
    <el-scrollbar ref="appScrollContainer" style="height: 100vh">
        <Loader />
        <Navbar />
        <main class="main-content container position-relative">
            <RouterView />
            <Footer></Footer>
        </main>
    </el-scrollbar>
</template>

<script setup>
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import Loader from './components/Layout/Loader.vue';

import { onMounted, ref, provide } from 'vue';
import { useRouter } from 'vue-router';
const isMobile = ref(false); // 用來判斷是否為手機裝置
const appScrollContainer = ref(null); // Ref to access PerfectScrollbar instance
const router = useRouter(); // Access Vue Router instance
const checkIfMobile = () => {
    isMobile.value = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
// Listen for route changes and reset the scroll position to top
onMounted(() => {
    checkIfMobile(); // 檢查裝置類型
    provide('appScrollContainer', appScrollContainer);
    router.afterEach(() => {
        if (appScrollContainer.value && !isMobile.value) {
            appScrollContainer.value.setScrollTop(0); // 使用 el-scrollbar 的 setScrollTop 方法重設滾動到頂部
        }
    });
});
</script>
