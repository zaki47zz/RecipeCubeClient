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
    <component :is="isMobile ? 'div' : 'PerfectScrollbar'" id="scroll-container" ref="scrollContainer">
        <!-- <PerfectScrollbar id="scroll-container" ref="scrollContainer"> -->
        <Loader />
        <Navbar />
        <main class="main-content container position-relative">
            <RouterView />
        </main>
        <Footer />
        <!-- </PerfectScrollbar> -->
    </component>
</template>

<script setup>
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import Loader from './components/Layout/Loader.vue';
// 引入 PerfectScrollbar 組件
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const isMobile = ref(false); // 用來判斷是否為手機裝置
const scrollContainer = ref(null); // Ref to access PerfectScrollbar instance
const router = useRouter(); // Access Vue Router instance
const checkIfMobile = () => {
    isMobile.value = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
// Listen for route changes and reset the scroll position to top
onMounted(() => {
    checkIfMobile(); // 檢查裝置類型

    router.afterEach(() => {
        if (scrollContainer.value && !isMobile.value) {
            const psInstance = scrollContainer.value.$el;
            psInstance.scrollTop = 0; // 如果不是手機，重設滾動條到頂部
        }
    });
});
</script>
