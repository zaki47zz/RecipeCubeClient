<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
const BaseURL = import.meta.env.VITE_API_BASEURL; // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const inventoryStore = useInventoryStore();
const { getRunningOutIngredients } = inventoryStore;

const isModalVisible = ref(false);
const runningOutIngredients = ref([]);
const products = ref([]);

onMounted(() => {
    initTippy();
});

const initTippy = function () {
    tippy('#button-shopping-list', {
        content: '查看推薦的購物清單',
        placement: 'right-end',
        animation: 'fade',
    });
};
// 載入組件
onMounted(async () => {
    runningOutIngredients.value = await getRunningOutIngredients();
    loadCart();
});

// 開啟Modal 且重新載入購物車資訊
const openModal = () => {
    isModalVisible.value = true;
    loadCart();
    loadProducts();
};

// 關閉Modal
const closeModal = () => {
    isModalVisible.value = false;
};

// 判斷購物車裡面是否已經有清單上的商品 Start

const myCart = ref([]);
const loadCart = () => {
    // 從localStorage讀購物車
    const storeCart = localStorage.getItem('productCart');
    // 將storeCart 寫進 cart ， JSON 要轉換
    myCart.value = storeCart ? JSON.parse(storeCart) : [];
};

const checkProductInCart = (ingredientId) => {
    return myCart.value.some((item) => item.ingredientId === ingredientId);
};

// 判斷購物車裡面是否已經有清單上的商品 End

// 讀取所有商品

const ApiURL = `${BaseURL}/Products/ProductsNcategory`;

const loadProducts = async () => {
    const response = await fetch(`${ApiURL}`);
    const data = await response.json();
    products.value = data;
    console.log(data);
};

// 加入購物車邏輯
const addIngredientToCart = (ingredient) => {
    const product = products.value.find((p) => p.ingredientId === ingredient.ingredientId);
    product ? addToCart(product) : Swal.fire(`無法找到對應的商品:${ingredient.ingredientName}`);
    loadCart();
};

// 將商品加入購物車
const addToCart = (product) => {
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
    // ===================================================================================

    // 從 localStorage 取得購物車資料 如果還沒有名為cart的localStorage 則為空陣列
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];

    // 檢查是否已經有這商品
    const existingProduct = cart.find((item) => item.productId === product.productId);

    if (existingProduct) {
        // 商品存在 且 目前購物車數量+加入一單位的量<=stock
        const totalQuantity = (existingProduct.quantity + 1) * product.unitQuantity;
        if (totalQuantity <= product.stock) {
            // 如果商品存在購物車數量增加'1'
            existingProduct.quantity += 1;
            localStorage.setItem('productCart', JSON.stringify(cart));
            Swal.fire(`${product.productName} 已加入購物車！`);
        } else {
            Swal.fire(
                `不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)}，已經將 ${
                    existingProduct.quantity
                } 個單位加入購物車`
            );
        }
    } else {
        const totalQuantity = product.unitQuantity;
        if (totalQuantity <= product.stock) {
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem('productCart', JSON.stringify(cart));
            Swal.fire(`${product.productName} 已加入購物車！`);
        } else {
            Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)} 個單位`);
        }
    }
    window.dispatchEvent(new Event('cart-updated'));
};

// 將所有不在購物車中的推薦商品加入購物車
const addAllToCart = () => {
    let addedAny = false;
    runningOutIngredients.value.forEach((ingredient) => {
        if (!checkProductInCart(ingredient.ingredientId)) {
            addIngredientToCart(ingredient);
            addedAny = true;
        }
    });
    loadCart(); // 重新載入購物車資訊

    // 如果有添加任何商品，顯示一次 Swal 提示
    if (addedAny) {
        Swal.fire('已將所有商品加入購物車！');
    }
};
</script>

<template>
    <button class="floating-icon-shoppingList" @click="openModal" id="button-shopping-list">
        <i class="fa-solid fa-list-check"></i>
    </button>

    <el-dialog
        v-model="isModalVisible"
        title="推薦購物清單"
        width="40%"
        center
        :z-index="1000"
        class="bg-primary-subtle"
    >
        <button @click="addAllToCart" class="add-all-button">全部加入購物車</button>
        <ul v-if="runningOutIngredients.length > 0">
            <li
                v-for="(ingredient, index) in runningOutIngredients"
                :key="ingredient.ingredientId"
                class="fs-5 ps-3 my-2 position-relative"
            >
                <span :class="{ 'in-cart': checkProductInCart(ingredient.ingredientId) }">
                    ({{ ingredient.source }})
                    <strong
                        >{{ ingredient.ingredientName }} 庫存還剩下 {{ ingredient.quantity }}
                        {{ ingredient.unit }}</strong
                    >
                </span>
                <button class="cart-button" @click="addIngredientToCart(ingredient)">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                </button>
            </li>
        </ul>
        <p v-else>暫無推薦購物清單</p>
        <template #footer>
            <span class="dialog-footer d-flex justify-content-center">
                <el-button type="danger" @click="closeModal">關閉</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreStyle.css';

.add-all-button {
    display: block;
    margin: 10px 0;
    padding: 8px 16px;
    background-color: #56c5a9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.add-all-button:hover {
    opacity: 0.7;
}

.cart-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #56c5a9;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    display: flex; /* 使用 Flexbox 來居中內容 */
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 80%; /* 保持寬高相等，讓圖標正中 */
    padding: 0; /* 移除 padding */
    margin-right: 5px;
}
.cart-button:hover {
    opacity: 0.7;
}

.in-cart {
    text-decoration: line-through;
    text-decoration-color: #f4b0a5;
    color: #d7d2b4;
}

* {
    box-sizing: border-box;
}

body {
    font-size: 1.4rem;
    background: whitesmoke;
    margin: 0;
    padding: 1rem;
    display: grid;
    place-items: center;
    min-height: 100vh;
}

ul {
    list-style-position: inside;
    width: 100%;
    max-width: 100%;
    background: white;
    box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 0.15);
    padding: 0;
    margin: 0;
    border-radius: 0.1rem;
}

li {
    padding: 0 0 0 1rem;
}

li:not(:last-child) {
    border-bottom: 1px solid lightblue;
}

li:first-child {
    margin-top: 1rem;
}

li:last-child {
    margin-bottom: 1rem;
}

::marker {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='14' viewBox='0 0 50 50'%3E%3Cpath d='M46.4 16.2c-2.3-2.3-5.4-3.5-8.4-4.5-.5-.2-1.1-.3-1.6-.5-1.6-1.6-3.7-2.8-6.2-3.2-1-.2-1.9.1-2.5.6-.9-.3-1.8-.6-2.7-.8-3.2-1-6.4-1.8-9.5-.1-1 .5-1.9 1.2-2.7 2-6.4 1.4-11.7 5-12.4 12.7C0 27 1.9 31.5 4.9 34.9c.1.6.2 1.1.4 1.7 1 3.2 3.3 5.7 6.7 6.5 2.7.6 5.4-.2 7.9-1.2 3.3.4 6.7.3 9.9 0 6.5-.7 13.3-2.8 17.1-8.5 3.6-5.2 4-12.6-.5-17.2zm-17.3.9c2.1.4 4 1.7 4.7 3.8 0 .5-.1 1.1-.2 1.6-.3 1.4-.8 2.6-1.6 3.7-.7.2-1.5.1-2.3-.4-.8-.4-1.6-1-2.2-1.6-.4-.4-1.2-1.7-1.6-1.9 3.4 1.3 5.1-3 3.2-5.2zm-11.6 9.7c.2-1.9 1.1-3.9 2.3-5.5-.4 2.1.3 4.2 1.7 6 1.3 1.7 3.1 3.2 5 4.2-.2.1-.4.2-.6.4-.1 0-.1.1-.2.1-3.9.2-8.7-.8-8.2-5.2zm-6.4 3.1c.1.3.1.7.2 1 .2.6.4 1.2.7 1.8-.4-.2-.7-.5-1-.7.1-.8.1-1.4.1-2.1zm31.2-1.3c-.9 1.7-2.1 3.1-3.7 4.1 2-2.1 3.4-4.7 4-7.6.2-.7.3-1.4.3-2.1.6 1.5.5 3.3-.6 5.6z'/%3E%3C/svg%3E")
        ' ';
}

li:nth-child(3n)::marker {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='14' viewBox='0 0 50 50'%3E%3Cpath d='M46.5 12.5c-.4-1.1-1.3-1.8-2.2-2-4.2-4-11.6-4.3-17.1-4.1-6.9.3-13.9 2.1-19.4 6.5C2 17.5-2.4 25.7 2.5 32.6c2.2 3.2 5.5 4.9 9 5.5 3.3 1.7 6.7 3.3 10.2 4.4 7.8 2.3 17 1.6 23.2-4.3 7.3-7 4.8-17.3 1.6-25.7zm-20.2 2.7c.6 0 1.3 0 1.8.2 1.1.4 1.7 1.3 2 2.3-1-1.2-2.4-2.1-3.8-2.5zm-1.4 6.6c.9.9 1.3 2.2-.2 2.3-2 .2-1.1-1.9.2-2.3zm-11.8 9.8c-.6-.3-2.9-1.1-3.2-1.8-.2-.5 1.4-3.1 2.1-4.2.3.5.7 1 1.2 1.4 0 .3.1.6.2.8.5 1.9 1.5 3.1 2.9 4h-.2c-.8.1-1.6.1-2.5-.1-.2 0-.3 0-.5-.1zM24 36.4c1.6-.7 3-1.5 4.3-2.5.8.2 1.7.3 2.5.5 2.5.4 5.2.9 7.7.6-.9.6-2 1.1-3 1.4-3.9 1.3-7.7 1-11.5 0z'/%3E%3C/svg%3E")
        ' ';
}

li:nth-child(3n - 1)::marker {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='14' viewBox='0 0 50 50'%3E%3Cpath d='M48.3 23.7c-1-9.9-9.9-15.6-18.8-17.8-8.2-2.1-18.8-2.6-24.6 4.8C.6 16.2 1 23.6 4.3 29.3c-.5 1-.8 2-1 3-.6 4 2 7.6 5.1 10 5.9 4.4 14 4.2 19.6-.4 1.5 0 2.9-.2 4.4-.5 1.8 0 3.5 0 5.3-.1 2.3-.1 3.5-1.9 3.5-3.7 4.5-3.3 7.7-8.2 7.1-13.9zM9.1 17.8c1.1-4.1 4.9-5.8 8.8-6.1.9-.1 1.9-.1 2.9-.1-3.2 1.6-6.3 4.6-8 7.4-.1.1-.1.2-.2.3-1.1.9-2.1 1.9-3 2.9-.2.2-.4.4-.5.6-.4-1.7-.5-3.3 0-5z'/%3E%3C/svg%3E")
        ' ';
}
</style>
