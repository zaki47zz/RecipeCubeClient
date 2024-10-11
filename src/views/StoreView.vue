<script setup>
    import '@/assets/js/store.js'
    import '@/assets/css/StoreStyle.css'
    import '@/assets/css/StoreBootstrap.min.css'
</script>


<template>
    <!-- Single Page Header start -->
    <!-- <div class="container-fluid page-header py-5">
        <h1 class="text-center text-white display-6">Shop</h1>
        <ol class="breadcrumb justify-content-center mb-0">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item"><a href="#">Pages</a></li>
            <li class="breadcrumb-item active text-white">Shop</li>
        </ol>
    </div> -->
    <!-- Single Page Header End -->
    <!-- <ol class="text-center py-0" >
        <h4>
            <RouterLink :to="{ name: 'storeproduct' }">商店首頁</RouterLink> |
            <RouterLink :to="{ name: 'cart' }">購物車</RouterLink> |
            <RouterLink :to="{ name: 'chickout' }">結帳</RouterLink> 
        </h4>
    </ol> -->
    
    <RouterView></RouterView>
        
</template>

<style lang="css" scoped>

</style>