<script setup>
    import '@/assets/js/store.js'

    import {ref,computed, onMounted} from 'vue';
    import { useRoute } from 'vue-router';
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const BaseUrlWithoutApi = BaseURL.replace("/api","");  // 去掉 "/api" 得到基本的 URL;

    const route = useRoute(); // 獲取當前路由
    const products=ref([]);
    
    // 取得商品id 獲取單一商品 
    const loadProductById = async(id)=>{
        try{
            const response=await fetch(`${BaseURL}/Products/ProductsNcategory/${id}`);
            if(!response){
                alert('請求商品失敗');
                return;
            }
            const data = await response.json();
            products.value=[data];  // 找到一個商品 將結果放入 products 列表
            console.log(data);
            console.log(`商品id=${route.params.id}`);
        }
        catch(error){
            console.log('fetch 請求商品失敗',error);
        }
    }
    loadProductById(route.params.id);
     
</script>

<template>
        <!-- Single Page Header start -->
        <div class="container-fluid page-header py-5">
            <h1 class="text-center custom-color display-6">商品明細</h1>
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">商店首頁</a></li>
                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                <li class="breadcrumb-item active text-white">商品明細</li>
            </ol>
        </div>
        <!-- Single Page Header End -->

        <!-- RouterLink Start -->
        <ol class="text-center py-0" >
        <h4>
            <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"><i class="fa-solid fa-shop"></i></RouterLink>
            <RouterLink :to="{ name: 'cart' }"  class="floating-icon-cart"><i class="fa-solid fa-cart-shopping"></i></RouterLink>
            <RouterLink :to="{ name: 'chickout' }">結帳</RouterLink>
        </h4>
        </ol>
        <!-- RouterLink End -->

        <!-- Single Product Start -->
        <div class="container-fluid py-1 mt-5 d-flex justify-content-center">
            <div class="container py-1">
                <div class="row g-4 mb-5">
                    <div class="col-lg-12 col-xl-12">
                        <div class="row g-4">
                            <div class="col-lg-4">
                                <div>
                                    <!-- 商品圖片 -->
                                    <a href="#" v-for="product in products" :key="product.productId">
                                        <img :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`" class="img-fluid rounded" alt="Image">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <!-- 商品名稱 -->
                                <h4 class="fw-bold mb-3" v-for="product in products" :key="product.productId">{{product.productName}}</h4>
                                <!-- 商品類別 -->
                                <p class="mb-3" v-for="product in products" :key="product.productId">類別: {{product.category}}</p>
                                <!-- 商品價格 單位量 單位 -->
                                <h5 class="fw-bold mb-3" v-for="product in products" :key="product.productId">$ {{product.price}} / {{ product.unitQuantity }} {{ product.unit }}</h5>
                                <!-- 商品描述 -->
                                <p class="mb-4" v-for="product in products" :key="product.productId">{{ product.description }}</p>
                                <div class="input-group quantity mb-5" style="width: 100px;">
                                    <div class="input-group-btn">
                                        <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                            <i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control form-control-sm text-center border-0" value="1">
                                    <div class="input-group-btn">
                                        <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                            <i class="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <!-- 加入購物車按鈕 -->
                                <a href="#" class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Single Product End -->
</template>

<style lang="css" scoped>
    @import "@/assets/css/StoreBootstrap.min.css";
    @import "@/assets/css/StoreStyle.css";
</style>