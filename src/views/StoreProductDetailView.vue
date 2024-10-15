<script setup>
    import '@/assets/js/store.js'
    import Swal from 'sweetalert2'
    import {ref} from 'vue';
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
            // 如果商品存在購物車數量增加'商品數量選擇input_selectQuantity的value'
            existingProduct.quantity += selectQuantity.value;
        }else{
            cart.push({...product, quantity:selectQuantity.value});
        }

        // 將購物車內容存進localStorage
        localStorage.setItem('productCart',JSON.stringify(cart));

        Swal.fire(`${product.productName} 已加入購物車！`);
       
    }

    // 商品數量選擇

    // 數量的響應式變量
    const selectQuantity = ref(1);

    // 減少數量1但不能低於1
    const decQuantity = () =>{
        if(selectQuantity.value > 1){
            selectQuantity.value -= 1;
            console.log(`目前商品數量選擇:${selectQuantity.value}`)
        }
    }
    // 增加數量1但不能超過stock 尚未做stock判斷
    const incQuantity = () =>{
        selectQuantity.value += 1; 
        console.log(`目前商品數量選擇:${selectQuantity.value}`)
    }

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
                        <div class="row g-4" v-for="product in products" :key="product.productId">
                            <div class="col-lg-4">
                                <div>
                                    <!-- 商品圖片 -->
                                    <div>
                                        <img :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`" class="img-fluid rounded" alt="Image">
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <!-- 商品名稱 -->
                                <h4 class="fw-bold mb-3">{{product.productName}}</h4>
                                <!-- 商品類別 -->
                                <p class="mb-3">類別: {{product.category}}</p>
                                <!-- 商品價格 單位量 單位 -->
                                <h5 class="fw-bold mb-3">$ {{product.price}} / {{ product.unitQuantity }} {{ product.unit }}</h5>
                                <!-- 商品描述 -->
                                <p class="mb-4">{{ product.description }}</p>
                                <!-- 商品數量input btn -->
                                <div class="input-group quantity mb-5" style="width: 100px;">
                                    <div class="input-group-btn">
                                        <button class="btn btn-sm btn-minus rounded-circle bg-light border" @click="decQuantity">
                                            <i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control form-control-sm text-center border-0" :value="selectQuantity" readonly>
                                    <div class="input-group-btn">
                                        <button class="btn btn-sm btn-plus rounded-circle bg-light border" @click="incQuantity">
                                            <i class="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <!-- 加入購物車按鈕 -->
                                <div @click="addToCart(product)" class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車</div>
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