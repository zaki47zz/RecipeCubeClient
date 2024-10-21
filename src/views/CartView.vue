<script setup>
    import '@/assets/js/store.js'
    import Swal from 'sweetalert2'
    import {ref,computed,reactive,onMounted,onBeforeUnmount} from 'vue';
    import { useRouter } from 'vue-router';
    import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
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
        
        // 購物車清空邏輯=========================================================================
        
        const currentUserId = localStorage.getItem('UserId');
        // console.log(`目前登入的userId : ${currentUserId}`);
        const storeUserId = localStorage.getItem('storeUserId');
        // console.log(`目前的storeUserId : ${storeUserId}`);

        // 檢查用戶ID是否一致
        if (storeUserId !== currentUserId){
            //如果 目前登入的userId 不等於 localStorage 裡的userId 清空 localStorage
            localStorage.setItem('productCart',JSON.stringify([]));
            localStorage.setItem('storeUserId',currentUserId);
            // console.log(`已經完成更改 localStorage_storeUserId : ${currentUserId} 且清除購物車`)
        }
        else{
            // console.log("跟上一個使用者是相同id不清除購物車")
        }   


        let cart = JSON.parse(localStorage.getItem('productCart')) || [];
        
        // 過濾所有商品，找到購物車中存在的商品
        cartProducts.value = products.value.map(product=>{
            // 檢查該商品是否在購物車中
            const cartProduct = cart.find(item => item.productId === product.productId);
            // 如果有找到 則保留
            if(cartProduct){
                // 使用 reactive 來創建一個響應式物件
                const reactiveProduct = reactive({
                    ...product, // 展開原有產品屬性
                    quantity: cartProduct.quantity // 設置 quantity
                });
                // console.log(reactiveProduct.quantity)
                // console.log(JSON.stringify(reactiveProduct, null, 2));
                // console.log(`有找到購物車商品：${reactiveProduct.productName} , 商品數量:${reactiveProduct.quantity}`);
                // 保留
                // console.log(`商品名稱: ${reactiveProduct.productName}, 數量: ${reactiveProduct.quantity}`);
                return reactiveProduct; // 返回響應式產品
            }else{
                // 過濾掉不在購物車的商品
                // console.log(`沒有找到購物車商品`);
                return null;
            }
        }).filter(Boolean); //過濾掉null值
    }
    // 載入loadProducts
    loadProducts();

    //============================================================================================================================


    //計算商品總價
    const totalPrice = computed(()=>{
        // reduce會迭代 cartProducts 陣列，累加到acc
        return cartProducts.value.reduce((acc, product) => {
            // console.log("product.quantity", product.quantity)

            return acc + (product.price * product.quantity);
        },0);
    })

    //============================================================================================================================

    // 減少數量
    const decQuantity = (product) => {
    if (product.quantity > 1) {
        product.quantity -= 1;  // 減少數量
        // console.log(`目前商品數量選擇:${product.quantity}`);
        // console.log(`目前商品庫存:${product.stock}`);

        // 同步更新 localStorage
        updateCart(product);
    } else {
        Swal.fire('不能小於 1');  // 提示用戶數量不能小於1
    }
    };

    // 增加單位量但不能超過stock 
    const incQuantity = (product) =>{
        // 從 localStorage 取得購物車資料 如果還沒有名為cart的localStorage 則為空陣列
        let cart = JSON.parse(localStorage.getItem('productCart')) || [];

        // 檢查是否已經有這商品
        const existingProduct = cart.find(item => item.productId === product.productId);

        if(existingProduct){
            // 如果商品存在
            const totalQuantity = (product.unitQuantity*(product.quantity+1));
            // if(totalQuantity <= product.stock){
            //     product.quantity += 1;

            // }else{
            //     Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)}，已經將 ${existingProduct.quantity} 個單位加入購物車`)
            // }

            // 試寫成三元運算符
            (totalQuantity <= product.stock) ? product.quantity += 1 : Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)}，已經將 ${existingProduct.quantity} 個單位加入購物車`)

        }else{
            // 如果商品不存在
            // const totalQuantity = (product.unitQuantity*(product.quantity+1)); 
            // if(totalQuantity <= product.stock){
            //     product.quantity += 1;
            // }else{
            //     Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)} 個單位`)
            // }

            // 試寫成三元運算符
            (totalQuantity <= product.stock) ? product.quantity += 1 : Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)} 個單位`)
        }
        // 同步更新 localStorage
        updateCart(product);
    }

    //============================================================================================================================

    // 更新購物車
    const updateCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];
    const cartProductIndex = cart.findIndex(item => item.productId === product.productId);
    
    if (cartProductIndex !== -1) {
        // 如果數量大於 0，更新數量；如果為 0 或無效，從購物車中刪除
        if (product.quantity > 0) {
            cart[cartProductIndex].quantity = product.quantity;  // 更新數量
            // console.log("更新localStorage成功")
        } else {
            cart.splice(cartProductIndex, 1);  // 刪除該商品
            // console.log("刪除localStorage成功")
        }
    }
    
    localStorage.setItem('productCart', JSON.stringify(cart));  // 更新 localStorage
    };

    //===========================================================================================================================

    // 從購物車 及 localStorage_productCart 移除商品 
    const removeFromCart = (product) => {
        Swal.fire({
            title: "確定要移除這個商品嗎?",
            text: "移除後將無法恢復!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "是的, 移除它!",
            cancelButtonText: "取消"
        }).then((result) => {
        if (result.isConfirmed) {
            // 如果用戶點擊了"確認"，設置數量為0，因為updateCart數量為0會移除
            product.quantity = 0;
            updateCart(product); // 更新購物車並移除商品
            
            Swal.fire({
                title: "已移除!",
                text: `商品 ${product.productName} 已從購物車移除。`,
                icon: "success"
            });

            loadProductCartLocalStorage();  //重新載入localStorage
            }
        });
    };

    //=========================================================================================================================
    // 導航至結帳頁面
    const router = useRouter();
    const goToCheckout = () =>{
        router.push({name:'chickout'});
    }

    // ======================================================================================================================
    // 組件掛載時監聽 localStorage 的變化
    onMounted(() => {
    loadProducts(); // 初始加載購物車商品
    window.addEventListener('storage', loadProducts);
    });

    // 組件卸載時移除監聽器
    onBeforeUnmount(() => {
    window.removeEventListener('storage', loadProducts);
    });

</script>

<template>
    <!-- Single Page Header start -->
    <div class="container-fluid page-header py-5">
        <h1 class="text-center custom-color display-6">購物車</h1>
            <ol class="breadcrumb justify-content-center mb-0">
                <!-- <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                <li class="breadcrumb-item active text-white">Cart</li> -->
            </ol>
    </div>
        <!-- Single Page Header End -->

     <!-- RouterLink Start -->
     <ol class="text-center py-0" >
                <h4>
                    <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"><i class="fa-solid fa-shop"></i></RouterLink>
                    <RouterLink :to="{ name: 'cart' }"  class="floating-icon-cart"><i class="fa-solid fa-cart-shopping"></i></RouterLink>
                    <RouterLink :to="{ name: 'order' }"  class="floating-icon-order"><i class="fa-solid fa-clipboard-list"></i></RouterLink>
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
                            <th scope="col">單位總量</th>
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
                                <!-- 數量 -->
                                <td>
                                    <div class="input-group quantity mt-4" style="width: 100px;">
                                        <div class="input-group-btn">
                                            <button @click="decQuantity(product)" class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                            <i class="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <input type="text" class="form-control form-control-sm text-center border-0" v-model="product.quantity" readonly>
                                        <div class="input-group-btn">
                                            <button @click="incQuantity(product)" class="btn btn-sm btn-plus rounded-circle bg-light border">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <!-- 單品小計 -->
                                <td>
                                    <p class="mb-0 mt-4">$ {{ product.price * product.quantity }}</p>
                                </td>
                                <td>
                                    <p class="mb-0 mt-4">{{ product.unitQuantity * product.quantity }} {{ product.unit }}</p>
                                </td>
                                <td>
                                    <button @click="removeFromCart(product)" class="btn btn-md rounded-circle bg-light border mt-4" >
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
                                    <p class="mb-0">${{totalPrice}}</p>
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
                            <button class="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4" type="button" @click="goToCheckout">結帳</button>
                        </div>
                    </div>
                </div>
            </div>
              <!-- 引入購物車 sidebar -->
            <SideBarCartComponent />
        </div>
        <!-- Cart Page End -->
</template>

<style lang="css" scoped>
    @import "@/assets/css/StoreBootstrap.min.css";
    @import "@/assets/css/StoreStyle.css";
</style>