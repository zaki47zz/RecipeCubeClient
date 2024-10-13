<style>
body {
    font-family: 'Cinzel', 'Chocolate Classical Sans', system-ui, sans-serif !important;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 0;
}
.main-content {
    margin-top: 75px;
}
</style>

<template>
    <Loader></Loader>
    <Navbar></Navbar>
    <main class="main-content container position-relative">
        <RouterView />
    </main>
    <Footer></Footer>
</template>

<script setup>
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import Loader from './components/Layout/Loader.vue';
</script>
