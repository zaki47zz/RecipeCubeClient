<script setup>
import Swal from 'sweetalert2';
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import ShoppingListComponent from '@/components/ShoppingListComponent.vue';
import CouponComponent from '@/components/CouponComponent.vue';
import StoreChatComponent from '@/components/StoreChatComponent.vue';
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const userId = localStorage.getItem('UserId');
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
    // 購物車清空邏輯=========================================================================

    const currentUserId = localStorage.getItem('UserId');
    // console.log(`目前登入的userId : ${currentUserId}`);
    const storeUserId = localStorage.getItem('storeUserId');
    // console.log(`目前的storeUserId : ${storeUserId}`);

    // 檢查用戶ID是否一致
    if (storeUserId !== currentUserId) {
        //如果 目前登入的userId 不等於 localStorage 裡的userId 清空 localStorage
        localStorage.setItem('productCart', JSON.stringify([]));
        localStorage.setItem('storeUserId', currentUserId);
        // console.log(`已經完成更改 localStorage_storeUserId : ${currentUserId} 且清除購物車`)
    } else {
        // console.log("跟上一個使用者是相同id不清除購物車")
    }

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
    // reduce會迭代 cartProducts 陣列，累加到acc
    return cartProducts.value.reduce((acc, product) => {
        // console.log("product.quantity", product.quantity)

        return acc + product.price * product.quantity;
    }, 0);
});

//============================================================================================================================

// 減少數量
const decQuantity = (product) => {
    if (product.quantity > 1) {
        product.quantity -= 1; // 減少數量
        // console.log(`目前商品數量選擇:${product.quantity}`);
        // console.log(`目前商品庫存:${product.stock}`);

        // 同步更新 localStorage
        updateCart(product);
    } else {
        Swal.fire('不能小於 1'); // 提示用戶數量不能小於1
    }
};

// 增加單位量但不能超過stock
const incQuantity = (product) => {
    // 從 localStorage 取得購物車資料 如果還沒有名為cart的localStorage 則為空陣列
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];

    // 檢查是否已經有這商品
    const existingProduct = cart.find((item) => item.productId === product.productId);

    if (existingProduct) {
        // 如果商品存在
        const totalQuantity = product.unitQuantity * (product.quantity + 1);
        // if(totalQuantity <= product.stock){
        //     product.quantity += 1;

        // }else{
        //     Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)}，已經將 ${existingProduct.quantity} 個單位加入購物車`)
        // }

        // 試寫成三元運算符
        totalQuantity <= product.stock
            ? (product.quantity += 1)
            : Swal.fire(
                  `不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)}，已經將 ${
                      existingProduct.quantity
                  } 個單位加入購物車`
              );
    } else {
        // 如果商品不存在
        // const totalQuantity = (product.unitQuantity*(product.quantity+1));
        // if(totalQuantity <= product.stock){
        //     product.quantity += 1;
        // }else{
        //     Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock/product.unitQuantity)} 個單位`)
        // }

        // 試寫成三元運算符
        totalQuantity <= product.stock
            ? (product.quantity += 1)
            : Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)} 個單位`);
    }
    // 同步更新 localStorage
    updateCart(product);
};

//============================================================================================================================

// 更新購物車
const updateCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];
    const cartProductIndex = cart.findIndex((item) => item.productId === product.productId);

    if (cartProductIndex !== -1) {
        // 如果數量大於 0，更新數量；如果為 0 或無效，從購物車中刪除
        if (product.quantity > 0) {
            cart[cartProductIndex].quantity = product.quantity; // 更新數量
            // console.log("更新localStorage成功")
        } else {
            cart.splice(cartProductIndex, 1); // 刪除該商品
            // console.log("刪除localStorage成功")
        }
    }

    localStorage.setItem('productCart', JSON.stringify(cart)); // 更新 localStorage
};

//===========================================================================================================================

// 從購物車 及 localStorage_productCart 移除商品
const removeFromCart = (product) => {
    Swal.fire({
        title: '確定要移除這個商品嗎?',
        text: '移除後將無法恢復!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '是的, 移除它!',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            // 如果用戶點擊了"確認"，設置數量為0，因為updateCart數量為0會移除
            product.quantity = 0;
            updateCart(product); // 更新購物車並移除商品

            Swal.fire({
                title: '已移除!',
                text: `商品 ${product.productName} 已從購物車移除。`,
                icon: 'success',
            });

            loadProductCartLocalStorage(); //重新載入localStorage
        }
    });
};

// 移除購物車所有商品
const clearAllCart = () => {
    Swal.fire({
        title: '確定要移除所有商品嗎?',
        text: '移除後將無法恢復!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '是的, 移除所有商品!',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('productCart');
            cartProducts.value = [];
            Swal.fire({
                title: '已移除!',
                text: `商品 ${product.productName} 已從購物車移除。`,
                icon: 'success',
            });
        }
    });
};

//=========================================================================================================================
// 導航至結帳頁面
const router = useRouter();
const goToCheckout = () => {
    if (userId && userId.length > 0) {
        router.push({ name: 'chickout' });
    } else {
        Swal.fire('請先登入或註冊會員');
    }
};

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
    <section>
        <div class="header">
            <div class="title">
                <h1>購物車</h1>
                <h1>Shopping Cart</h1>
            </div>
        </div>
    </section>
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
        </h4>
    </ol>
    <!-- RouterLink End -->

    <!-- 引入購物車 sidebar -->
    <SideBarCartComponent />
    <!-- 引入購物清單 -->
    <ShoppingListComponent />
    <!-- 引入我的優惠券 -->
    <CouponComponent />
    <!-- 引入聊天機器人 -->
    <StoreChatComponent />
    <!-- Cart Page Start -->
    <div class="container-fluid py-2">
        <div class="container py-2">
            <div v-if="cartProducts.length === 0" class="text-center">
                <h4 class="animate__animated animate__flipInX" style="color: #94ccc3">
                    購物車沒商品，快去買一些東西吧！
                </h4>
                <p>
                    <img
                        class="animate__animated animate__bounceIn"
                        src="@/assets/img/ForBackground/logo去背.png"
                        alt=""
                        style="width: 500px; height: auto"
                    />
                </p>
            </div>
            <div v-else class="cart-table-container">
                <table class="table custom-table">
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
                            <td class="product-image">
                                <div class="image-container">
                                    <img
                                        :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`"
                                        class="product-img"
                                        alt=""
                                    />
                                </div>
                            </td>
                            <td class="product-name">
                                <p>{{ product.productName }}</p>
                            </td>
                            <td class="product-price">
                                <p>$ {{ product.price }}</p>
                            </td>
                            <td class="product-quantity">
                                <div class="quantity-control">
                                    <button @click="decQuantity(product)" class="quantity-btn">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                    <input type="text" class="quantity-input" v-model="product.quantity" readonly />
                                    <button @click="incQuantity(product)" class="quantity-btn">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </td>
                            <td class="product-subtotal">
                                <p>$ {{ product.price * product.quantity }}</p>
                            </td>
                            <td class="product-total-unit">
                                <p>{{ product.unitQuantity * product.quantity }} {{ product.unit }}</p>
                            </td>
                            <td class="product-remove">
                                <button @click="removeFromCart(product)" class="remove-btn">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="cart-summary">
                <div class="summary-content">
                    <h2>購物車總結</h2>
                    <div class="summary-row">
                        <span>小計:</span>
                        <span>${{ totalPrice }}</span>
                    </div>
                    <div class="summary-row total">
                        <span>總計:</span>
                        <span>${{ totalPrice }}</span>
                    </div>
                    <div class="summary-actions">
                        <button class="clear-cart-btn" @click="clearAllCart">移除所有商品</button>
                        <button class="checkout-btn" @click="goToCheckout">前往結帳</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Cart Page End -->
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreStyle.css';

/* header本人 */
* {
    margin: 0;
}
.header {
    position: relative;
    overflow: hidden;
    height: 40vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    color: #eee;
    z-index: 0;
}
/* 背景 */
.header:before {
    content: '';
    width: 100%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateZ(0) scale(1, 1);
    background: #1b2030 url('@/assets/img/ForBackground/bg-header.jpg') 50% 0 no-repeat;
    background-size: cover;
    background-attachment: fixed;
    animation: grow 180s linear 10ms infinite;
    transition: all 0.4s ease-in-out;
    z-index: -2;
}
/* 下方mask */
.header:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 40%, rgb(254, 254, 254) 100%);
}
/* 文字 */
.title {
    width: 100%;
    padding-top: 5%;
    text-align: center;
    text-shadow: 0 2px 3px rgba(255, 255, 255, 0.4);
}
/* 上下移動縮放特效 */
@keyframes grow {
    0% {
        transform: scale(1) translateY(0px);
    }
    50% {
        transform: scale(1.2) translateY(-250px);
    }
}

/* 新增的表格相關樣式 */
.cart-table-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
    overflow: hidden;
}

.custom-table {
    width: 100%;
    margin-bottom: 0;
}

.custom-table th {
    background-color: #f8f9fa;
    color: #666;
    font-weight: 600;
    text-align: center;
    padding: 15px;
    border-bottom: 2px solid #eee;
}

.custom-table td {
    vertical-align: middle;
    text-align: center;
    padding: 20px 15px;
    border-bottom: 1px solid #eee;
}

.product-image {
    width: 120px;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-img:hover {
    transform: scale(1.1);
}

.product-name p {
    margin: 0;
    font-weight: 500;
    color: #333;
}
.product-remove {
    transform: translate(28%);
}

.quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.quantity-btn {
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quantity-btn:hover {
    background: #e9ecef;
}

.quantity-input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}

.remove-btn {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.remove-btn:hover {
    background: #dc3545;
    border-color: #dc3545;
}

.remove-btn:hover i {
    color: white;
}

.remove-btn i {
    color: #dc3545;
    transition: color 0.3s ease;
}

/* 購物車總結樣式 */
.cart-summary {
    width: 40%;
    margin-left: auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    margin-top: 30px;
    padding: 20px;
}

.summary-content {
    max-width: 500px;
    margin-left: auto;
}

.summary-content h2 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 1.1rem;
}

.summary-row.total {
    border-top: 2px solid #eee;
    margin-top: 10px;
    padding-top: 20px;
    font-weight: bold;
    font-size: 1.2rem;
}

.summary-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.clear-cart-btn,
.checkout-btn {
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    font-weight: 500;
    transition: all 0.3s ease;
    flex: 1;
}

.clear-cart-btn {
    background: #f8f9fa;
    color: #dc3545;
    border: 1px solid #dc3545;
}

.clear-cart-btn:hover {
    background: #dc3545;
    color: white;
}

.checkout-btn {
    background: #94ccc3;
    color: white;
}

.checkout-btn:hover {
    opacity: 0.8;
}
</style>
