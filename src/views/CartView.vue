<script setup>
    import '@/assets/js/store.js'
    import Swal from 'sweetalert2'
    import {ref,computed} from 'vue';
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const BaseUrlWithoutApi = BaseURL.replace("/api","");  // 去掉 "/api" 得到基本的 URL;

    // 讀取所有商品
    const ApiURL=`${BaseURL}/Products/ProductsNcategory`;
  
    const products=ref([]);
    const loadProducts = async()=>{
        const response = await fetch(ApiURL);
        const datas = await response.json();
        products.value = datas;
        // console.log(datas);
        loadProductCartLocalStorage();
        // console.log('已加載loadProductCartLocalStorage')
    }

    // 從localStorage獲取購物車內容
    const cartProducts = ref([]);
    const loadProductCartLocalStorage=()=>{
        let cart = JSON.parse(localStorage.getItem('productCart')) || [];
        
        // 過濾所有商品，找到購物車中存在的商品
        cartProducts.value = products.value.filter(product=>{
            // 檢查該商品是否在購物車中
            const cartProduct = cart.find(item => item.productId === product.productId);
            
            // 如果有找到 則保留
            return cartProduct ? (product.quantity = cartProduct.quantity ,  true) :  false ;
            // if(cartProduct){
            //     // 將購物車中的數量合併到商品對象中
            //     product.quantity = cartProduct.quantity;
            //     // console.log(`有找到購物車商品：${product.productName} , 商品數量:${product.quantity}`);
            //     // 保留
            //     return true;
            // }else{
            //     // 過濾掉不在購物車的商品
            //     // console.log(`沒有找到購物車商品`);
            //     return false;
            // }
        })

        // console.log(`購物車商品列表：${JSON.stringify(cartProducts.value)}`)
    }
    // 載入loadProducts
    loadProducts();

    //計算商品總價
    const totalPrice = computed(()=>{
        // reduce會迭代 cartProducts 陣列，累加到acc
        return cartProducts.value.reduce((acc, product) => {
            return acc + (product.price * product.quantity);
        },0);
    })
</script>

<template>
     <!-- Single Page Header start -->
     <div class="container-fluid page-header py-5">
            <h1 class="text-center custom-color display-6">購物車</h1>
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                <li class="breadcrumb-item active text-white">Cart</li>
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

        <!-- Cart Page Start -->
        <div class="container-fluid py-2">
            <div class="container py-2">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">商品</th>
                            <th scope="col">品名</th>
                            <th scope="col">單價</th>
                            <th scope="col">數量</th>
                            <th scope="col">單品小計</th>
                            <th scope="col">移除</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in cartProducts" :key="product.productId">
                                <th scope="row">
                                    <!-- 商品圖 -->
                                    <div class="d-flex align-items-center">
                                        <img :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">
                                    </div>
                                </th>
                                <!-- 品名 -->
                                <td>
                                    <p class="mb-0 mt-4">{{ product.productName }}</p>
                                </td>
                                <!-- 單價 -->
                                <td>
                                    <p class="mb-0 mt-4">$ {{product.price}}</p>
                                </td>
                                <td>
                                    <div class="input-group quantity mt-4" style="width: 100px;">
                                        <div class="input-group-btn">
                                            <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                            <i class="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <input type="text" class="form-control form-control-sm text-center border-0" v-model="product.quantity">
                                        <div class="input-group-btn">
                                            <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p class="mb-0 mt-4">$ {{ product.price * product.quantity }}</p>
                                </td>
                                <td>
                                    <button class="btn btn-md rounded-circle bg-light border mt-4" >
                                        <i class="fa fa-times text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- <div class="mt-5">
                    <input type="text" class="border-0 border-bottom rounded me-5 py-3 mb-4" placeholder="Coupon Code">
                    <button class="btn border-secondary rounded-pill px-4 py-3 text-primary" type="button">Apply Coupon</button>
                </div> -->
                <div class="row g-4 justify-content-end">
                    <div class="col-8"></div>
                    <div class="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                        <div class="bg-light rounded">
                            <div class="p-4">
                                <h1 class="display-6 mb-4">總價 </h1>
                                <div class="d-flex justify-content-between mb-4">
                                    <h5 class="mb-0 me-4">小計:</h5>
                                    <p class="mb-0">$96.00</p>
                                </div>
                                <!-- <div class="d-flex justify-content-between">
                                    <h5 class="mb-0 me-4">Shipping</h5>
                                    <div class="">
                                        <p class="mb-0">Flat rate: $3.00</p>
                                    </div>
                                </div>
                                <p class="mb-0 text-end">Shipping to Ukraine.</p> -->
                            </div>
                            <div class="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                                <h5 class="mb-0 ps-4 me-4">總計:</h5>
                                <p class="mb-0 pe-4">${{totalPrice}}</p>
                            </div>
                            <button class="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4" type="button">結帳</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Cart Page End -->
</template>

<style lang="css" scoped>
    @import "@/assets/css/StoreBootstrap.min.css";
    @import "@/assets/css/StoreStyle.css";
</style>