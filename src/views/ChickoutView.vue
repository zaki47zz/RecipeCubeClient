<script setup>
import '@/assets/js/store.js';
import Swal from 'sweetalert2';
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import CircularJSON from 'circular-json';
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import ShoppingListComponent from '@/components/ShoppingListComponent.vue';
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;

// 讀取使用者資料
const userId = localStorage.getItem('UserId');
const user = ref({});
const loadUser = async (userId) => {
    try {
        const response = await fetch(`${BaseURL}/Users/${userId}`);
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="#">Why do I have this issue?</a>',
            });
            return; //有錯誤則停止執行
        }
        const data = await response.json();
        user.value = data;
        console.log(data);
    } catch (error) {
        console.log('fetch 請求會員失敗', error);
    }
};
if (userId) {
    loadUser(userId);
} else {
    console.log('userId不存在，無法帶入使用者資料');
}

// 讀取所有商品
const ApiURL = `${BaseURL}/Products/ProductsNcategory`;

const products = ref([]);
const loadProducts = async () => {
    const response = await fetch(ApiURL);
    const datas = await response.json();
    products.value = datas;
    // console.log(datas);
    loadProductCartLocalStorage();
    // console.log('已加載loadProductCartLocalStorage')
};

// 從localStorage獲取購物車內容
const cartProducts = ref([]);
const loadProductCartLocalStorage = () => {
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];

    // 過濾所有商品，找到購物車中存在的商品
    cartProducts.value = products.value
        .map((product) => {
            // 檢查該商品是否在購物車中
            const cartProduct = cart.find((item) => item.productId === product.productId);
            // 如果有找到 則保留
            if (cartProduct) {
                // 使用 reactive 來創建一個響應式物件
                const reactiveProduct = reactive({
                    ...product, // 展開原有產品屬性
                    quantity: cartProduct.quantity, // 設置 quantity
                });
                // console.log(reactiveProduct.quantity)
                // console.log(JSON.stringify(reactiveProduct, null, 2));
                // console.log(`有找到購物車商品：${reactiveProduct.productName} , 商品數量:${reactiveProduct.quantity}`);
                // 保留
                // console.log(`商品名稱: ${reactiveProduct.productName}, 數量: ${reactiveProduct.quantity}`);
                return reactiveProduct; // 返回響應式產品
            } else {
                // 過濾掉不在購物車的商品
                // console.log(`沒有找到購物車商品`);
                return null;
            }
        })
        .filter(Boolean); //過濾掉null值
};
// 載入loadProducts
loadProducts();

//============================================================================================================================

//計算商品總價
const totalPrice = computed(() => {
    // console.log(JSON.stringify(cartProducts.value))

    // reduce會迭代 cartProducts 陣列，累加到acc
    return cartProducts.value.reduce((acc, product) => {
        // console.log("product.quantity", product.quantity)

        return acc + product.price * product.quantity;
    }, 0);
});

const selectedShipping = ref(220); //運費
//計算商品總價 含運費
const totalPriceShippingFee = computed(() => {
    return totalPrice.value + parseInt(selectedShipping.value, 10);
});

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
const generateOrderNumber = () => {
    const now = new Date();

    // 格式化時間
    const year = now.getFullYear();
    const mounth = String(now.getMonth() + 1).padStart(2, '0'); // 月份從0開始 要加1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // radom
    const redomNum = Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0');

    let orderNumber = Number(`${year}${mounth}${day}${hours}${minutes}${seconds}${redomNum}`);
    return orderNumber;
};

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
    orderAddress: '',
    orderRemark: '',
});

//結帳創建訂單
const addOrder = async () => {
    // 顯示確認框
    Swal.fire({
        title: '確定要結帳嗎?',
        text: '請確認訂單資訊是否正確',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '結帳',
    }).then(async (result) => {
        if (result.isConfirmed) {
            // 如果確認下單，則執行訂單創建邏輯
            const OrderNum = generateOrderNumber();
            const order = {
                orderId: OrderNum,
                userId: userId || null,
                orderTime: dateTimeOrder(),
                totalAmount: totalPriceShippingFee.value || 0,
                status: 1 || 6, //狀態預設寫 1 未付款,2 已付款，3 訂單確認中，4 已出貨，5 訂單完成
                orderAddress: userInput.value.orderAddress || null,
                orderPhone: user.value.phoneNumber || null,
                orderEmail: user.value.email || null,
                orderRemark: userInput.value.orderRemark || null,
                orderName: user.value.userName || null,
                orderItemsDTO: cartProducts.value.map((item) => ({
                    orderId: OrderNum || null,
                    productId: item.productId || 0,
                    quantity: item.quantity || 0,
                    price: item.price || 0,
                })),
            };

            // console.log('Order before JSON.stringify:', order);
            // console.log('orderItemsDTO:',order.orderItemsDTO);
            try {
                const orderJson = JSON.stringify(order);
                console.log(orderJson);
                const response = await fetch(`${BaseURL}/Orders/PostOrderOrderItem`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: orderJson,
                });

                if (!response.ok) {
                    console.log(`訂單創建失敗：${await response.text()}`);
                    // 可以在這裡使用 Swal 顯示失敗訊息
                    Swal.fire({
                        title: '訂單創建失敗',
                        text: '訂單創建失敗，請聯絡系統管理員',
                        icon: 'error',
                    });
                } else {
                    // 成功創建訂單後的提示
                    Swal.fire({
                        title: '訂單已成立',
                        text: '將繼續前往付款頁面',
                        icon: 'success',
                    }).then(async () => {
                        // 清空購物車 localStorage
                        localStorage.removeItem('productCart');

                        // 呼叫支付api
                        const paymentResponse = await fetch(`${BaseURL}/Orders/StartPayment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(order),
                        });

                        if (paymentResponse.ok) {
                            const paymentHtml = await paymentResponse.text();
                            // 這裡處理支付 HTML，在新窗口打開
                            const paymentWindow = window.open('', '_blank');
                            paymentWindow.document.write(paymentHtml);

                            // 導航原頁面到訂單頁面
                            ToOrders();
                        } else {
                            Swal.fire({
                                title: '支付失敗',
                                text: '無法進入支付頁面，請稍後再試',
                                icon: 'error',
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('訂單創建失敗(catch)', error);
                Swal.fire({
                    title: '訂單創建失敗',
                    text: '訂單創建失敗，請聯絡系統管理員',
                    icon: 'error',
                });
            }
        }
    });
};

// 導航到訂單頁面
const router = useRouter();
const ToOrders = () => {
    router.push({ name: 'order' });
};
// ==============================================================================================================

// ==============================================================================================================
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
    <ol class="text-center py-0">
        <h4>
            <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"
                ><i class="fa-solid fa-shop"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'cart' }" class="floating-icon-cart"
                ><i class="fa-solid fa-cart-shopping"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'order' }" class="floating-icon-order"
                ><i class="fa-solid fa-clipboard-list"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'order' }" class="floating-icon-order"
                ><i class="fa-solid fa-clipboard-list"></i
            ></RouterLink>
        </h4>
    </ol>
    <!-- RouterLink End -->

    <!-- 引入購物車 sidebar -->
    <SideBarCartComponent />
    <!-- 引入購物清單 -->
    <ShoppingListComponent />

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
                                    <input type="text" class="form-control" v-model="user.userName" />
                                </div>
                            </div>
                        </div>
                        <div class="form-item">
                            <label class="fs-5 form-label my-3">地址<sup>*</sup></label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="請輸入地址"
                                v-model="userInput.orderAddress"
                            />
                        </div>
                        <div class="form-item">
                            <label class="fs-5 form-label my-3">電話<sup>*</sup></label>
                            <input type="tel" class="form-control" v-model="user.phoneNumber" />
                        </div>
                        <div class="form-item">
                            <label class="fs-5 form-label my-3">電子郵件<sup>*</sup></label>
                            <input type="email" class="form-control" v-model="user.email" />
                        </div>
                        <div class="form-item">
                            <label class="fs-5 form-label my-3">備註</label>
                            <textarea
                                name="text"
                                class="form-control"
                                spellcheck="false"
                                cols="30"
                                rows="11"
                                placeholder="請輸入備註"
                                v-model="userInput.orderRemark"
                            ></textarea>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6 col-xl-5">
                        <div class="table-responsive">
                            <table class="table">
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
                                                <img
                                                    :src="`${BaseUrlWithoutApi}/images/ingredient/${
                                                        product.photo
                                                    }?t=${Date.now()}`"
                                                    class="img-fluid rounded-circle"
                                                    style="width: 88px; height: 88px"
                                                    alt=""
                                                />
                                            </div>
                                        </th>
                                        <td class="py-5">{{ product.productName }}</td>
                                        <td class="py-5">$ {{ product.price }}</td>
                                        <td class="py-5">{{ product.quantity }}</td>
                                        <td class="py-5">$ {{ product.price * product.quantity }}</td>
                                    </tr>

                                    <tr>
                                        <th scope="row"></th>
                                        <td class="py-5"></td>
                                        <td class="py-5"></td>
                                        <td class="py-5">
                                            <p class="mb-0 text-dark py-3">訂單小計</p>
                                        </td>
                                        <td class="py-5">
                                            <div class="py-3 border-bottom border-top">
                                                <p class="mb-0 text-dark">$ {{ totalPrice }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td class="py-5">
                                            <p class="mb-0 text-dark py-4">運輸方式</p>
                                        </td>
                                        <td colspan="3" class="py-5">
                                            <div class="form-check text-start">
                                                <input
                                                    type="radio"
                                                    class="form-check-input bg-primary border-0"
                                                    id="Shipping-1"
                                                    name="shippingOption"
                                                    value="220"
                                                    v-model="selectedShipping"
                                                />
                                                <label class="form-check-label" for="Shipping-1">冷藏宅配：$ 220</label>
                                            </div>
                                            <div class="form-check text-start">
                                                <input
                                                    type="radio"
                                                    class="form-check-input bg-primary border-0"
                                                    id="Shipping-2"
                                                    name="shippingOption"
                                                    value="0"
                                                    v-model="selectedShipping"
                                                />
                                                <label class="form-check-label" for="Shipping-2">自取：$ 0</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td class="py-5">
                                            <p class="mb-0 text-dark text-uppercase py-3">訂單總價</p>
                                        </td>
                                        <td class="py-5"></td>
                                        <td class="py-5"></td>
                                        <td class="py-5">
                                            <div class="py-3 border-bottom border-top">
                                                <p class="mb-0 text-dark">$ {{ totalPriceShippingFee }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row g-4 text-center align-items-center justify-content-center pt-4">
                            <button
                                type="button"
                                class="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                                @click="addOrder()"
                            >
                                結帳去
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- Checkout Page End -->
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreBootstrap.min.css';
@import '@/assets/css/StoreStyle.css';
</style>
