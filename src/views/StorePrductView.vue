<script setup>
    import '@/assets/js/store.js'
    import Swal from 'sweetalert2'
    import { useRouter } from "vue-router";
    import {computed, ref}from 'vue';
    import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component

    const BaseURL = import.meta.env.VITE_API_BASEURL;  // https://localhost:7188/api
    const BaseUrlWithoutApi = BaseURL.replace('/api', '');  // 去掉 "/api" 得到基本的 URL;
    // 讀取所有商品
    const ApiURL=`${BaseURL}/Products/ProductsNcategory`;
  
    const products=ref([]);
    const loadProducts = async()=>{
        const response = await fetch(ApiURL);
        const datas = await response.json();
        products.value = datas;
        console.log(datas);
    }
    
    // 讀取類別
    const ApiURL_category=`${BaseURL}/Products/GetProductsCategory`;
    const categories=ref([]);
    const loadCategories = async()=>{
        const response = await fetch(ApiURL_category);
        const datas = await response.json();
        console.log(datas);
        categories.value=datas;
        console.log(BaseUrlWithoutApi)
    }

    // 跳轉至商品明細頁面
    const router = useRouter();
    const goToProductDetail = (id) => {
    router.push({ name: 'storeProductDetailById', params: { id } });
    };

    // 將商品加入購物車
    const addToCart = (product)=>{

        // 購物車清空邏輯=========================================================================

        const userId = 3; //這是要寫在登入頁面的 1=>要從登入邏輯拿到userId
        localStorage.setItem('userId',userId);  //寫進localStorage_userId
        //-----------------------------------------
        const currentUserId = localStorage.getItem('userId');
        console.log(`目前登入的userId : ${currentUserId}`);
        const storeUserId = localStorage.getItem('storeUserId');
        console.log(`目前的storeUserId : ${storeUserId}`);

        // 檢查用戶ID是否一致
        if (storeUserId !== currentUserId){
            //如果 目前登入的userId 不等於 localStorage 裡的userId 清空 localStorage
            localStorage.setItem('productCart',JSON.stringify([]));
            localStorage.setItem('storeUserId',currentUserId);
            console.log(`已經完成更改 localStorage_storeUserId : ${currentUserId} 且清除購物車`)
        }
        else{
            console.log("跟上一個使用者是相同id不清除購物車")
        }   
        // ===================================================================================

        
        // 從 localStorage 取得購物車資料 如果還沒有名為cart的localStorage 則為空陣列
        let cart = JSON.parse(localStorage.getItem('productCart')) || [];

        // 檢查是否已經有這商品
        const existingProduct = cart.find(item => item.productId === product.productId);

        if(existingProduct){
            // 商品存在 且 目前購物車數量+加入一單位的量<=stock
            const totalQuantity = (existingProduct.quantity+1)*product.unitQuantity;
            if(totalQuantity<=product.stock){
                // 如果商品存在購物車數量增加'1'
                existingProduct.quantity += 1;
                localStorage.setItem('productCart',JSON.stringify(cart));
                Swal.fire(`${product.productName} 已加入購物車！`);
            }else{
                Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)}，已經將 ${existingProduct.quantity} 個單位加入購物車`)
            }
        }else{
            const totalQuantity = product.unitQuantity
            if(totalQuantity<=product.stock){
                cart.push({...product, quantity:1});
                localStorage.setItem('productCart',JSON.stringify(cart));
                Swal.fire(`${product.productName} 已加入購物車！`);
            }else{
                Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)} 個單位`)
            }
        }

    }

    // 呼叫方法
    loadProducts();
    loadCategories();
</script>

<template>
    <div>
        <!-- Single Page Header start -->
            <div class="container-fluid page-header py-5 ">
                <h1 class="text-center custom-color display-6">商店</h1>
            <div>
                <ol class="breadcrumb justify-content-center mb-0">
                    <!-- <li class="breadcrumb-item"><a href="#">商店首頁</a></li>
                    <li class="breadcrumb-item"><a href="#">Pages</a></li>
                    <li class="breadcrumb-item active text-white">商店</li> -->
                </ol>
            </div>
        </div>
        <!-- Single Page Header End -->

        <!-- RouterLink Start -->
            <ol class="text-center py-0" >
                <h4>
                    <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"><i class="fa-solid fa-shop"></i></RouterLink>
                    <RouterLink :to="{ name: 'cart' }"  class="floating-icon-cart"><i class="fa-solid fa-cart-shopping"></i></RouterLink>
                </h4>
            </ol>    
        <!-- RouterLink End -->

        <!-- Fruits Shop Start-->
        <div class="container-fluid fruite py-1">
            <div class="container py-1">
                <div class="row g-4">
                    <div class="col-lg-12">
                        <div class="row g-4">
                            <div class="col-xl-3">
                                <div class="input-group w-100 mx-auto d-flex">
                                    <input type="search" class="form-control p-3" placeholder="keywords" aria-describedby="search-icon-1">
                                    <span id="search-icon-1" class="input-group-text p-3"><i class="fa fa-search"></i></span>
                                </div>
                            </div>
                            <div class="col-6"></div>
                            <div class="col-xl-3">
                                <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                    <label for="fruits">預設排序:</label>
                                    <select id="fruits" name="fruitlist" class="border-0 form-select-sm bg-light me-3" form="fruitform">
                                        <option value="volvo">無</option>
                                        <option value="saab">名稱</option>
                                        <option value="opel">價格</option>
                                        <option value="audi">種類</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row g-4">
                            <div class="col-lg-3">
                                <div class="row g-4">
                                    <div class="col-lg-12">
                                        <div class="mb-3">
                                            <h4>商品類別</h4>
                                            <ul class="list-unstyled fruite-categorie">
                                                <li>
                                                    <div class="d-flex justify-content-between fruite-name" v-for="category in categories" :key="category.category">
                                                        <a href="#"><i class="fas fa-apple-alt me-2"></i>{{ category.category }}</a>
                                                        <span>({{ category.count }})</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="mb-3">
                                            <h4 class="mb-2">價格區間</h4>
                                            <input type="range" class="form-range w-100" id="rangeInput" name="rangeInput" min="0" max="500" value="0" oninput="amount.value=rangeInput.value">
                                            <output id="amount" name="amount" min-velue="0" max-value="500" for="rangeInput">0</output>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9">
                                <div class="row g-4 justify-content-center">
                                    <div class="col-md-6 col-lg-6 col-xl-4" v-for="product in products" :key="product.productId">
                                        <div class="rounded position-relative fruite-item ">
                                            <div class="fruite-img">
                                                <!-- 獲取商品圖片url 加上?t=${Date.now()} 獲取時間當版本 避免讀快取 加上跳轉至商品明細vue-->
                                                <img :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`" class="img-fluid w-100 rounded-top click-router" alt="" @click="goToProductDetail(product.productId)" >
                                            </div>
                                            <!-- 商品類別 -->
                                            <div class="text-white bg-secondary px-3 py-1 rounded position-absolute click-router" @click="goToProductDetail(product.productId)" style="top: 10px; left: 10px; border: 1.3px solid #81c408;">{{ product.category }}</div>
                                            <div class="p-3 pb-1 border border-secondary border-top-0 rounded-bottom">
                                                <!-- 品名 -->
                                                <h4 class="click-router" @click="goToProductDetail(product.productId)">{{ product.productName }}</h4>
                                                <div class="d-flex justify-content-center flex-lg-wrap">
                                                    <!-- 價格 單位量 單位 -->
                                                    <p class="text-dark fs-5 fw-bold mb-0 click-router" @click="goToProductDetail(product.productId)">$ {{product.price}} 元 / {{ product.unitQuantity }} / {{ product.unit }}</p>
                                                    <div @click="addToCart(product)" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="pagination d-flex justify-content-center mt-5">
                                            <a href="#" class="rounded">&laquo;</a>
                                            <a href="#" class="active rounded">1</a>
                                            <a href="#" class="rounded">2</a>
                                            <a href="#" class="rounded">3</a>
                                            <a href="#" class="rounded">4</a>
                                            <a href="#" class="rounded">5</a>
                                            <a href="#" class="rounded">6</a>
                                            <a href="#" class="rounded">&raquo;</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fruits Shop End-->
         
        <!-- Back to Top -->
        <a href="#" class="btn btn-primary border-3 border-primary rounded-circle back-to-top"><i class="fa fa-arrow-up"></i></a>   

        <!-- 引入購物車 sidebar -->
      <SideBarCartComponent />

    </div>



    
</template>

<style lang="css" scoped>
    @import "@/assets/css/StoreBootstrap.min.css";
    @import "@/assets/css/StoreStyle.css";

    .click-router {
    cursor: pointer;
    }
</style>