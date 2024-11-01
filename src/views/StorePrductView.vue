<script setup>
import '@/assets/js/store.js';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import ShoppingListComponent from '@/components/ShoppingListComponent.vue';
import CouponComponent from '@/components/CouponComponent.vue';
// swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
const modules = [EffectCoverflow, Pagination, Autoplay, Navigation];

const BaseURL = import.meta.env.VITE_API_BASEURL; // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const userId = localStorage.getItem('UserId');
const products = ref([]);
const filteredProducts = ref([]);
const selectedCategory = ref(null);
const ProductsByPriceRange = ref([]);
const priceRange = ref(1400); // 預設最大價格
const searchTerm = ref('');
const checkFilterProducts = ref(false);

// 讀取所有商品

const ApiURL = `${BaseURL}/Products/ProductsNcategory`;

const loadProducts = async () => {
    const response = await fetch(`${ApiURL}`);
    const data = await response.json();
    products.value = data;
    filteredProducts.value = data;
    console.log(data);
};

// 讀取類別
const ApiURL_category = `${BaseURL}/Products/GetProductsCategory`;
const categories = ref([]);
const loadCategories = async () => {
    const response = await fetch(ApiURL_category);
    const datas = await response.json();
    console.log(datas);
    categories.value = datas;
    console.log(BaseUrlWithoutApi);
};

// 呼叫方法
loadProducts();
loadCategories();

// 跳轉至商品明細頁面
const router = useRouter();
const goToProductDetail = (id) => {
    router.push({ name: 'storeProductDetailById', params: { id } });
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
    if (userId && userId.length > 0) {
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
    } else {
        Swal.fire('請先登入或註冊會員！');
    }
    window.dispatchEvent(new Event('cart-updated'));
};

// 分頁功能 Start

const totalProducts = computed(() => {
    return filteredProducts.value.length;
});
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value)); //總頁數
const pageSize = ref(12); // 每頁顯示商品數
const currentPage = ref(1); // 當前頁碼

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;

    return filteredProducts.value.slice(start, end);
});
// 更新當前頁碼
const handleCurrentPageChange = (newPage) => {
    currentPage.value = newPage; //更新當前頁碼
};

const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; //更改顯示數量 重新指向第一頁
};

watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages) {
        currentPage.value = newTotalPages;
    }
});
// 分頁功能 End

// 篩選功能

const clickCategory = (category) => {
    currentPage.value = 1; // 篩選後重設頁碼為第一頁
    loadFilteredProducts(category);
};

const clearCategory = () => {
    selectedCategory.value = null;

    loadFilteredProducts(null); // 加載所有商品
};

const handlePriceRangeInput = () => {
    currentPage.value = 1;
    loadFilteredProducts(selectedCategory.value);
    console.log(filteredProducts.value);
};

const handleSearch = () => {
    searchTerm.value = searchTerm.value.trim(); // 去除前后空格
    currentPage.value = 1;
    loadFilteredProducts(selectedCategory.value);
};

// 排序
const selectedSortOption = ref('default'); // 初始化排序選項

// 監視 selectedSortOption
watch(selectedSortOption, () => {
    loadFilteredProducts(selectedCategory.value); // 更新篩選後的商品
});

const loadFilteredProducts = async (category) => {
    ProductsByPriceRange.value = products.value.filter((p) => p.price <= priceRange.value);
    console.log('價格篩選後的產品:', ProductsByPriceRange.value);
    // 根據類別過濾
    if (category) {
        filteredProducts.value = ProductsByPriceRange.value.filter((p) => p.category === category);
        selectedCategory.value = category; //把現在選擇的類別存進去
    } else {
        filteredProducts.value = ProductsByPriceRange.value;
    }
    // 根據關鍵詞過濾
    if (searchTerm.value) {
        filteredProducts.value = filteredProducts.value.filter(
            (p) => p.productName.includes(searchTerm.value) // 直接使用 includes 进行模糊搜索
        );
    }

    // 排序邏輯
    if (selectedSortOption.value === 'priceAsc') {
        filteredProducts.value.sort((a, b) => a.price - b.price);
    } else if (selectedSortOption.value === 'priceDesc') {
        filteredProducts.value.sort((a, b) => b.price - a.price);
    }

    // 更新 checkFilterProducts 的值
    checkFilterProducts.value = filteredProducts.value.length === 0; // 如果没有商品，则為 true
};

// swiper
const swiperProducts = computed(() => {
    const lengthProducts = products.value.length;

    if (lengthProducts <= 11) {
        return products.value;
    }

    const randomIndices = new Set();
    while (randomIndices.size < 11) {
        const randomIndex = Math.floor(Math.random() * lengthProducts);
        randomIndices.add(randomIndex);
    }

    return Array.from(randomIndices).map((index) => products.value[index]);
});
</script>

<template>
    <!-- 引入購物車 sidebar -->
    <SideBarCartComponent />
    <!-- 引入購物清單 -->
    <ShoppingListComponent />
    <!-- 引入我的優惠券 -->
    <CouponComponent />

    <div class="p-0 m-0">
        <!-- Single Page Header start -->
        <section>
            <div class="header">
                <div class="title">
                    <h1>商店</h1>
                    <h1>Store</h1>
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

        <!-- 輪播 Start -->
        <div
            style="
                background-image: url('src/assets/img/Store/background-pattern-blue.png');
                background-size: cover;
                background-position: center;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                margin: 20px;
            "
        >
            <div>
                <h3 class="text-center" style="color: #fb9d9e">
                    今日推薦商品<i class="fa-solid fa-carrot" style="margin-left: 6px"></i>
                </h3>
            </div>
            <div>
                <swiper
                    :space-between="80"
                    :initial-slide="5"
                    :effect="'coverflow'"
                    :grabCursor="true"
                    :centeredSlides="true"
                    :slidesPerView="'auto'"
                    :coverflowEffect="{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }"
                    :navigation="true"
                    :pagination="true"
                    :modules="modules"
                    :loop="true"
                    class="mySwiper"
                >
                    <swiper-slide
                        v-for="(product, index) in swiperProducts"
                        :key="index"
                        @click="goToProductDetail(product.productId)"
                        class="swiper-slide"
                    >
                        <img
                            :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`"
                            alt="Product Image"
                        />
                        <div
                            class="product-info"
                            style="
                                position: absolute;
                                bottom: 10px;
                                width: 80%;
                                background-color: #f4b0a5;
                                color: #333;
                                text-align: center;
                                padding: 5px;
                                border-radius: 10px;
                                font-weight: bold;
                                font-size: 18px;
                                opacity: 0.9;
                            "
                        >
                            {{ product.productName }}
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <!-- 輪播 End -->

        <!-- Fruits Shop Start-->
        <div class="container-fluid fruite py-1">
            <div class="py-1 p-0 m-0">
                <div class="row g-4">
                    <div class="col-lg-12">
                        <div class="row g-4">
                            <!-- search Start -->
                            <div class="col-xl-10">
                                <div class="input-group w-100 d-flex">
                                    <input
                                        type="search"
                                        class="form-control p-3"
                                        placeholder="請輸入商品名稱"
                                        aria-describedby="search-icon-1"
                                        v-model="searchTerm"
                                        @input="handleSearch"
                                    />
                                    <span id="search-icon-1" class="input-group-text p-3"
                                        ><i class="fa fa-search"></i
                                    ></span>
                                </div>
                            </div>
                            <!-- search End -->
                            <!-- <div class="col-6"></div> -->
                            <div class="col-xl-2">
                                <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                    <label for="fruits">預設排序:</label>
                                    <select
                                        id="fruits"
                                        name="fruitlist"
                                        class="border-0 form-select-sm bg-light me-3"
                                        form="fruitform"
                                        v-model="selectedSortOption"
                                    >
                                        <option value="default">無</option>
                                        <option value="priceAsc">價格低到高</option>
                                        <option value="priceDesc">價格高到低</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row g-5">
                            <div class="col-lg-2">
                                <div class="row g-4">
                                    <div class="col-lg-12">
                                        <div class="mb-3">
                                            <h4>商品類別</h4>
                                            <ul class="list-unstyled fruite-categorie">
                                                <li>
                                                    <div
                                                        class="d-flex justify-content-between fruite-name"
                                                        v-for="category in categories"
                                                        :key="category.category"
                                                        @click="clickCategory(category.category)"
                                                    >
                                                        <a href="#"
                                                            ><i class="fas fa-apple-alt me-2"></i
                                                            >{{ category.category }}</a
                                                        >
                                                        <div class="d-flex align-items-center">
                                                            <span>({{ category.count }})</span>
                                                            <!-- 顯示XX 來取消篩選 回到全部商品 -->
                                                            <!-- 要加上.stop 阻止冒泡事件 -->
                                                            <button
                                                                v-if="selectedCategory === category.category"
                                                                @click.stop="clearCategory"
                                                                class="btn btn-sm ms-2 animate__animated animate__bounceIn"
                                                                style="color: #9bc8fb; background-color: #fbeae3"
                                                            >
                                                                <i class="fa-solid fa-x"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- 價格區間 Start -->
                                    <div class="col-lg-12">
                                        <div class="mb-3">
                                            <h4 class="mb-2">價格區間</h4>
                                            <input
                                                type="range"
                                                class="form-range w-100"
                                                v-model="priceRange"
                                                min="1"
                                                max="1400"
                                                @input="handlePriceRangeInput"
                                            />
                                            <span>當前價格上限: {{ priceRange }}</span>
                                        </div>
                                    </div>
                                    <!-- 價格區間 End -->
                                </div>
                            </div>
                            <div class="col-lg-10">
                                <div class="row g-4 justify-content-start">
                                    <div
                                        class="col-md-6 col-lg-4 col-xl-3 animate__animated animate__fadeIn"
                                        v-for="product in paginatedProducts"
                                        :key="product.productId"
                                        v-if="filteredProducts.length > 0"
                                    >
                                        <div class="rounded position-relative fruite-item">
                                            <div class="fruite-img">
                                                <!-- 獲取商品圖片url 加上?t=${Date.now()} 獲取時間當版本 避免讀快取 加上跳轉至商品明細vue-->
                                                <img
                                                    :src="`${BaseUrlWithoutApi}/images/ingredient/${
                                                        product.photo
                                                    }?t=${Date.now()}`"
                                                    class="img-fluid w-100 rounded-top click-router"
                                                    alt=""
                                                    @click="goToProductDetail(product.productId)"
                                                />
                                            </div>
                                            <!-- 商品類別 -->
                                            <div
                                                class="text-white bg-secondary px-3 py-1 rounded position-absolute click-router"
                                                @click="goToProductDetail(product.productId)"
                                                style="top: 10px; left: 10px; border: 1.3px solid #81c408"
                                            >
                                                {{ product.category }}
                                            </div>
                                            <div class="p-3 pb-1 border border-secondary border-top-0 rounded-bottom">
                                                <!-- 品名 -->
                                                <h4 class="click-router" @click="goToProductDetail(product.productId)">
                                                    {{ product.productName }}
                                                    <span class="amount-badge"
                                                        >{{ product.unitQuantity }} {{ product.unit }}</span
                                                    >
                                                </h4>
                                                <div class="d-flex justify-content-center">
                                                    <!-- 價格 單位量 單位 -->
                                                    <p
                                                        class="text-dark fs-5 fw-bold mb-0 click-router"
                                                        @click="goToProductDetail(product.productId)"
                                                    >
                                                        $ {{ product.price }} 元
                                                    </p>
                                                </div>
                                                <div class="d-flex justify-content-center">
                                                    <div
                                                        @click="addToCart(product)"
                                                        class="btn border border-secondary rounded-pill px-3 text-primary"
                                                    >
                                                        <i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 顯示没有此商品的提示 -->
                                    <div v-if="checkFilterProducts" class="mt-4 animate__animated animate__bounceIn">
                                        <h3 class="text-center mt-2" style="color: #fb9d9e">没有此商品</h3>
                                        <img
                                            src="@/assets/img/ForBackground/logo去背.png"
                                            alt=""
                                            class="img-fluid mx-auto"
                                            style="
                                                width: 300px;
                                                height: auto;
                                                display: flex;
                                                flex-direction: column;
                                                align-items: center;
                                                text-align: center;
                                            "
                                        />
                                    </div>
                                    <!-- 分頁 Start -->
                                    <div class="col-12">
                                        <el-pagination
                                            :current-page="currentPage"
                                            :page-size="pageSize"
                                            background
                                            layout="sizes,total, ->,prev,pager,next,jumper"
                                            :page-sizes="[12, 20, 48, 96, 300]"
                                            :total="totalProducts"
                                            @size-change="handlePageSizeChange"
                                            @current-change="handleCurrentPageChange"
                                            size="large"
                                            class="mt-4 d-flex justify-content-end align-items-center gap-2"
                                        >
                                        </el-pagination>
                                    </div>
                                    <!-- 分頁 End -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fruits Shop End-->

        <!-- Back to Top -->
        <a href="#" class="btn btn-primary border-3 border-primary rounded-circle back-to-top"
            ><i class="fa fa-arrow-up"></i
        ></a>
    </div>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreStyle.css';
/* header本人 */
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
    background: #1b2030 url('src/assets/img/ForBackground/bg-header.jpg') 50% 0 no-repeat;
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

.click-router {
    cursor: pointer;
}

.img-fluid {
    height: 100%;
}

.container-fluid {
    min-width: 100%;
}

.amount-badge {
    position: absolute;
    right: 20px;
    white-space: nowrap; /* 禁止文字換行 */
    padding: 0.3em 0.8em;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    background-color: #f4b0a5;
    border: 1px solid #ffb524;
    border-radius: 1rem;
}

.swiper {
    width: 100%;
    padding-top: 30px;
    padding-bottom: 50px;
}

.swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 250px; /* 調整為 250px */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.swiper-slide img {
    display: block;
    width: 300px;
    height: 250px; /* 固定為 300px x 250px */
    object-fit: cover; /* 防止圖片變形 */
    border-radius: 10px; /* 添加圓角 */
}
</style>
