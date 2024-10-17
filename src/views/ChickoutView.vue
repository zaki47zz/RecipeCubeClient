<script setup>
    import '@/assets/js/store.js'
    import Swal from 'sweetalert2'
    import {ref,computed,reactive,onMounted,onBeforeUnmount} from 'vue';
    import { useRouter } from 'vue-router';
    import CircularJSON from 'circular-json';
    import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const BaseUrlWithoutApi = BaseURL.replace("/api","");  // 去掉 "/api" 得到基本的 URL;

    // 讀取使用者資料
    const userId = localStorage.getItem('UserId');
    const user = ref({});
    const loadUser = async(userId)=>{
        try{
            const response = await fetch(`${BaseURL}/Users/${userId}`)
            if(!response.ok){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
                return; //有錯誤則停止執行
            }
            const data = await response.json();
            user.value=data;
            console.log(data);
        }catch(error){
            console.log('fetch 請求會員失敗' , error);
        }
    }
    if(userId){
        loadUser(userId);
    }else{
        console.log('userId不存在，無法帶入使用者資料')
    }



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
                console.log(reactiveProduct.quantity)
                // console.log(JSON.stringify(reactiveProduct, null, 2));
                // console.log(`有找到購物車商品：${reactiveProduct.productName} , 商品數量:${reactiveProduct.quantity}`);
                // 保留
                console.log(`商品名稱: ${reactiveProduct.productName}, 數量: ${reactiveProduct.quantity}`);
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
        console.log(cartProducts.value)
        return cartProducts.value.reduce((acc, product) => {
            console.log("product.quantity", product.quantity)

            return acc + (product.price * product.quantity);
        },0);
    })

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

    //=========================================================================================================================

    // 產生訂單編號
    const generateOrderNumber = () =>{
        const now = new Date();

        // 格式化時間
        const year = now.getFullYear();
        const mounth = String(now.getMonth() + 1).padStart(2,'0'); // 月份從0開始 要加1
        const day = String(now.getDate()).padStart(2,'0');
        const hours = String(now.getHours()).padStart(2,'0');
        const minutes = String(now.getMinutes()).padStart(2,'0');
        const seconds = String(now.getSeconds()).padStart(2,'0');

        // radom
        const redomNum = Math.floor(Math.random() * 100).toString().padStart(2,'0');

        let orderNumber=Number(`${year}${mounth}${day}${hours}${minutes}${seconds}${redomNum}`)
        return orderNumber;
    }

    // 得到現在時間(訂單下單時間用)
    const dateTimeOrder = () => {
    const now = new Date();

    // 調整時間為台灣時區 (UTC+8)
    const taiwanTime = new Date(now.setHours(now.getHours() + 8));

    // 使用 toISOString() 獲取 ISO 格式的日期時間字串
    const orderTime = taiwanTime.toISOString();

    return orderTime; // 返回台灣時間的 ISO 格式字串
};

    // 沒有響應式的自己創
    const userInput = ref({
        orderAddress:"",
        orderRemark:"",
    });

    //結帳創建訂單
    const addOrder = async()=>{
        const order ={
            orderId:generateOrderNumber(),
            userId:userId,
            orderTime:dateTimeOrder(),
            totalAmount:totalPrice.value,
            status:false,
            orderAddress:userInput.value.orderAddress,
            orderPhone:user.value.phoneNumber,
            orderEmail:user.value.email,
            orderRemark:userInput.value.orderRemark,
            orderName:user.value.userName,
        }
        console.log('Order before JSON.stringify:', order);
        try{
            const orderJson = CircularJSON.stringify(order);
            const response = await fetch(`${BaseURL}/Orders`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:orderJson,
            });
            
            if(!response.ok){
                console.log(`訂單創建失敗：${await response.text()}`);
            }
        }catch(error){
            console.error("訂單創建失敗(catch)",error);
        }
    };
</script>

<template>
    <!-- Single Page Header start -->
    <div class="container-fluid page-header py-5">
            <h1 class="text-center custom-color display-6">結帳</h1>
            <ol class="breadcrumb justify-content-center mb-0">
                <!-- <li class="breadcrumb-item"><a href="#">商店首頁</a></li>
                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                <li class="breadcrumb-item active text-white">結帳</li> -->
            </ol>
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

        <!-- Checkout Page Start -->
        <div class="container-fluid py-2">
            <div class="container py-2">
                <form action="#">
                    <div class="row">
                        <div class="col-md-12 col-lg-6 col-xl-7">
                            <div class="row">
                                <div class="col-md-12 col-lg-6">
                                    <div class="form-item w-100">
                                        <label class="fs-5 form-label my-3">姓名<sup>*</sup></label>
                                        <input type="text" class="form-control" v-model="user.userName">
                                    </div>
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-label my-3">地址<sup>*</sup></label>
                                <input type="text" class="form-control" placeholder="請輸入地址" v-model="userInput.orderAddress">
                            </div>
                            <div class="form-item">
                                <label class="form-label my-3">電話<sup>*</sup></label>
                                <input type="tel" class="form-control" v-model="user.phoneNumber">
                            </div>
                            <div class="form-item">
                                <label class="form-label my-3">電子郵件<sup>*</sup></label>
                                <input type="email" class="form-control" v-model="user.email">
                            </div>
                            <div class="form-item">
                                <label class="form-label my-3">備註</label>
                                <textarea name="text" class="form-control" spellcheck="false" cols="30" rows="11" placeholder="請輸入備註" v-model="userInput.orderRemark"></textarea>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-6 col-xl-5">
                            <div class="table-responsive">
                                <table class="table" >
                                    <thead>
                                        <tr>
                                            <th scope="col">商品</th>
                                            <th scope="col">品名</th>
                                            <th scope="col">單價</th>
                                            <th scope="col">數量</th>
                                            <th scope="col">單品小計</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="product in cartProducts" :key="product.productId">
                                            <th scope="row"> 
                                                <div class="d-flex align-items-center mt-2">
                                                    <img :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`"  class="img-fluid rounded-circle" style="width: 88px; height: 88px;" alt="">
                                                </div>
                                            </th>
                                            <td class="py-5">{{product.productName}}</td>
                                            <td class="py-5">$ {{ product.price }}</td>
                                            <td class="py-5">{{ product.quantity }}</td>
                                            <td class="py-5">$ {{ product.price * product.quantity }}</td>
                                        </tr>
                                        
                                        <tr>
                                            <th scope="row">
                                            </th>
                                            <td class="py-5"></td>
                                            <td class="py-5"></td>
                                            <td class="py-5">
                                                <p class="mb-0 text-dark py-3">訂單小計</p>
                                            </td>
                                            <td class="py-5">
                                                <div class="py-3 border-bottom border-top">
                                                    <p class="mb-0 text-dark">$ {{totalPrice}}</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                            </th>
                                            <td class="py-5">
                                                <p class="mb-0 text-dark py-4">Shipping</p>
                                            </td>
                                            <td colspan="3" class="py-5">
                                                <div class="form-check text-start">
                                                    <input type="checkbox" class="form-check-input bg-primary border-0" id="Shipping-1" name="Shipping-1" value="Shipping">
                                                    <label class="form-check-label" for="Shipping-1">Free Shipping</label>
                                                </div>
                                                <div class="form-check text-start">
                                                    <input type="checkbox" class="form-check-input bg-primary border-0" id="Shipping-2" name="Shipping-1" value="Shipping">
                                                    <label class="form-check-label" for="Shipping-2">Flat rate: $15.00</label>
                                                </div>
                                                <div class="form-check text-start">
                                                    <input type="checkbox" class="form-check-input bg-primary border-0" id="Shipping-3" name="Shipping-1" value="Shipping">
                                                    <label class="form-check-label" for="Shipping-3">Local Pickup: $8.00</label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                            </th>
                                            <td class="py-5">
                                                <p class="mb-0 text-dark text-uppercase py-3">訂單總價</p>
                                            </td>
                                            <td class="py-5"></td>
                                            <td class="py-5"></td>
                                            <td class="py-5">
                                                <div class="py-3 border-bottom border-top">
                                                    <p class="mb-0 text-dark">$ {{totalPrice}}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                                <div class="col-12">
                                    <div class="form-check text-start my-3">
                                        <input type="checkbox" class="form-check-input bg-primary border-0" id="Transfer-1" name="Transfer" value="Transfer">
                                        <label class="form-check-label" for="Transfer-1">Direct Bank Transfer</label>
                                    </div>
                                    <p class="text-start text-dark">Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                </div>
                            </div>
                            <div class="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                                <div class="col-12">
                                    <div class="form-check text-start my-3">
                                        <input type="checkbox" class="form-check-input bg-primary border-0" id="Payments-1" name="Payments" value="Payments">
                                        <label class="form-check-label" for="Payments-1">Check Payments</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                                <div class="col-12">
                                    <div class="form-check text-start my-3">
                                        <input type="checkbox" class="form-check-input bg-primary border-0" id="Delivery-1" name="Delivery" value="Delivery">
                                        <label class="form-check-label" for="Delivery-1">Cash On Delivery</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                                <div class="col-12">
                                    <div class="form-check text-start my-3">
                                        <input type="checkbox" class="form-check-input bg-primary border-0" id="Paypal-1" name="Paypal" value="Paypal">
                                        <label class="form-check-label" for="Paypal-1">Paypal</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-4 text-center align-items-center justify-content-center pt-4">
                                <button type="button" class="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary" @click="addOrder()">Place Order</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
              <!-- 引入購物車 sidebar -->
            <SideBarCartComponent />
        </div>
        <!-- Checkout Page End -->

</template>

<style lang="css" scoped>
    @import "@/assets/css/StoreBootstrap.min.css";
    @import "@/assets/css/StoreStyle.css";
</style>