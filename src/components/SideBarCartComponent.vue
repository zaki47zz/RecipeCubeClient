<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', '');
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

onMounted(() => {
    initTippy();
});

const initTippy = function () {
    tippy('#button-sideBar-Cart', {
        content: '查看我的購物車',
        placement: 'right-end',
        animation: 'fade',
    });
};

// 控制抽屜顯示狀態
const isCartOpen = ref(false);

const openCartSidebar = () => {
    loadProducts();
    isCartOpen.value = true;
};

const closeCartSidebar = () => {
    isCartOpen.value = false;
};

// 讀取所有商品
const ApiURL = `${BaseURL}/Products/ProductsNcategory`;

const products = ref([]);
const loadProducts = async () => {
    const response = await fetch(ApiURL);
    const datas = await response.json();
    products.value = datas;
    loadProductCartLocalStorage();
};

// 從localStorage獲取購物車內容
const cartProducts = ref([]);
const loadProductCartLocalStorage = () => {
    const currentUserId = localStorage.getItem('UserId');
    const storeUserId = localStorage.getItem('storeUserId');

    if (storeUserId !== currentUserId) {
        localStorage.setItem('productCart', JSON.stringify([]));
        localStorage.setItem('storeUserId', currentUserId);
    }

    let cart = JSON.parse(localStorage.getItem('productCart')) || [];

    cartProducts.value = products.value
        .map((product) => {
            const cartProduct = cart.find((item) => item.productId === product.productId);
            if (cartProduct) {
                const reactiveProduct = reactive({
                    ...product,
                    quantity: cartProduct.quantity,
                });
                return reactiveProduct;
            }
            return null;
        })
        .filter(Boolean);
};

// 載入初始數據
loadProducts();

//計算商品總價
const totalPrice = computed(() => {
    return cartProducts.value.reduce((acc, product) => {
        return acc + product.price * product.quantity;
    }, 0);
});

// 更新購物車
const updateCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];
    const cartProductIndex = cart.findIndex((item) => item.productId === product.productId);

    if (cartProductIndex !== -1) {
        if (product.quantity > 0) {
            cart[cartProductIndex].quantity = product.quantity;
        } else {
            cart.splice(cartProductIndex, 1);
        }
    }

    localStorage.setItem('productCart', JSON.stringify(cart));
    loadProductCartLocalStorage();
};

// 從購物車移除商品
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
            product.quantity = 0;
            updateCart(product);

            Swal.fire({
                title: '已移除!',
                text: `商品 ${product.productName} 已從購物車移除。`,
                icon: 'success',
            });

            loadProductCartLocalStorage();
            window.dispatchEvent(new Event('storage'));
        }
    });
};

// 導航至購物車明細頁面
const router = useRouter();
const goToCheckout = () => {
    closeCartSidebar();
    router.push({ name: 'cart' });
};

// 計算購物車長度
const cartLength = computed(() => {
    return cartProducts.value.length;
});

// 監聽購物車更新
window.addEventListener('cart-updated', () => {
    loadProductCartLocalStorage();
});

// 提供給外部的購物車數據訪問方法
window.windowCartComponent = () => {
    const cartData = localStorage.getItem('productCart');
    return cartData ? JSON.parse(cartData) : [];
};
</script>

<template>
    <div>
        <!-- 使用 el-drawer 作為購物車側邊欄 -->
        <el-drawer
            v-model="isCartOpen"
            :with-header="false"
            direction="ltr"
            :show-close="false"
            size="25%"
            :zIndex="1000"
        >
            <div class="cart-container">
                <div class="cart-header">
                    <button class="close-button" @click="closeCartSidebar">×</button>
                </div>
                <div class="cart-body">
                    <!-- 購物車為空時顯示 -->
                    <div v-show="cartLength === 0">
                        <h4 class="cart-title">
                            <span class="text-black">我的購物車</span>
                            <span class="custom-badge">{{ cartLength }}</span>
                        </h4>
                        <p>快買些東西吧，購物車是空的！</p>
                    </div>

                    <!-- 購物車有商品時顯示 -->
                    <div v-show="cartLength > 0">
                        <h4 class="cart-title">
                            <span class="text-black">我的購物車</span>
                            <span class="custom-badge">{{ cartLength }}</span>
                        </h4>
                        <ul class="cart-list">
                            <li v-for="product in cartProducts" :key="product.productId" class="cart-item">
                                <div class="item-info d-flex justify-content-between align-items-center">
                                    <h6 class="item-title m-0">{{ product.productName }}</h6>
                                    <p class="item-quantity m-0">數量: {{ product.quantity }}</p>
                                    <div class="item-price">
                                        <span class="me-2">$ {{ product.quantity * product.price }}</span>
                                        <button @click="removeFromCart(product)" class="remove-button ms-3">
                                            <i class="fa fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div class="cart-total">
                            <span>總價</span>
                            <strong>$ {{ totalPrice }}</strong>
                        </div>
                    </div>

                    <button class="checkout-button" @click="goToCheckout" :disabled="cartLength === 0">
                        查看我的購物明細並結帳
                    </button>
                </div>
            </div>
        </el-drawer>

        <!-- 開啟購物車按鈕 -->
        <button @click="openCartSidebar" class="floating-icon-side-cart" id="button-sideBar-Cart">
            <span class="cart-badge" v-show="cartLength > 0">{{ cartLength }}</span>
            <i class="fa-solid fa-list-ul"></i>
        </button>
    </div>
</template>

<style scoped>
@import '@/assets/css/StoreStyle.css';

.cart-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 關閉按鈕 */
.cart-header {
    padding: 1rem;
    text-align: right;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
}

/* 購物車內容樣式 */
.cart-body {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
}

.cart-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.cart-item {
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

.item-title {
    margin: 0;
    font-weight: bold;
    font-size: 1.25rem;
}

.item-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
}

.remove-button {
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.remove-button:hover {
    background-color: red;
    color: white;
}

.remove-button i {
    color: #dc3545;
}

.cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-size: 1.25rem;
    font-weight: bold;
}

/* 按鈕樣式 */
.checkout-button {
    width: 100%;
    padding: 1rem;
    background-color: #56c5a9;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: auto;
}

.checkout-button:hover {
    background-color: #808080;
}

.checkout-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Badge樣式 */
.custom-badge {
    background-color: #56c5a9;
    color: white;
    border-radius: 8px;
    padding: 0.25rem 0.75rem;
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: #fb6571;
    color: white;
    border-radius: 50%;
    padding: 0 0.5rem;
    font-size: 0.7em;
}

.text-primary {
    color: #81c408 !important;
}
</style>
