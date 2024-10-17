<script setup>
import Isotope from 'isotope-layout';
import Swal from 'sweetalert2';
import SoftBadge from '@/components/SoftBadge.vue';
import SoftPagination from '@/components/SoftPagination.vue';
import SoftPaginationItem from '@/components/SoftPaginationItem.vue';
import { onMounted, ref } from 'vue';
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL(抓圖片要用的);
const ApiURL = `${BaseURL}/Inventories`;
const InventoriesURL = `${ApiURL}/${localStorage.getItem('UserId')}`;
const inventories = ref([]);
const totalInventories = ref(0);

const fetchInventories = async () => {
    try {
        const response = await fetch(InventoriesURL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        inventories.value = data; // 將獲取到的數據存入 recipes 變量
        totalInventories.value = inventories.value.length;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

const getRecipeImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/ingredient/${fileName}`;
};

const alertClearCheck = () => {
    Swal.fire({
        title: '您確定嗎?',
        text: '即將清空所選食材列表',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '清空',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '清空了!',
                icon: 'success',
            });
        }
    });
};

onMounted(() => {
    fetchInventories();
});

//卡片點擊
const activateCard = (event) => {
    event.currentTarget.classList.toggle('active');
    console.log('activate');
};
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-primary-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>庫存 Inventory</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>
                        在下方食材列表，您可以看到您所屬群組的庫存食材，您可以進行兩種操作(這裡之後用driver.js做導覽)
                    </h4>
                </div>
            </div>
            <div class="row justify-content-center my-5">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 justify-content-center align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-box-open mt-3"></i> 管理食材</h5>
                            <p>對個別食材進行數量的修改或刪除</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 justify-content-center align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-utensils mt-3"></i> 產生食譜</h5>
                            <p>選取食材讓我們為您自動生成食譜</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-1">
        <div class="container-fluid">
            <div class="col-sm-10 offset-sm-2 offset-md-0 col-lg-12 d-none d-lg-block">
                <div class="row g-3 py-1 px-3 my-3 d-flex bg-primary-subtle rounded-4 shadow justify-content-between">
                    <!-- 分類欄 -->
                    <div class="col-md-3">
                        <p class="fw-bold">分類 CATEGORY</p>
                    </div>
                    <div class="col-md-3 mt-2">
                        <select class="form-select">
                            <option selected>類別</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-3 mt-2">
                        <select class="form-select">
                            <option selected>公開/私有</option>
                            <option value="0">公開</option>
                            <option value="1">私有</option>
                        </select>
                    </div>
                    <div class="col-md-3 mt-2">
                        <input type="text" class="form-control w-100 text-center" placeholder="搜尋" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="banner-ad bootstrap-tabs product-tabs p-3">
                        <div class="tabs-header d-flex justify-content-between">
                            <h3>食材列表</h3>
                            <div>
                                <button class="btn blur shadow fs-6 me-1 should-gone">歷史編輯紀錄</button>
                                <button class="btn blur shadow fs-6 me-1 should-gone">全選</button>
                                <button class="btn blur shadow fs-6 text-danger me-1">刪除</button>
                            </div>
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a
                                        class="nav-link fs-5 fw-bold text-dark active"
                                        id="nav-all-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-all"
                                        >所有食材</a
                                    >
                                    <a
                                        class="nav-link fs-5 fw-bold text-dark"
                                        id="nav-expire-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-expire"
                                        >即期或過期食材</a
                                    >
                                </div>
                            </nav>
                        </div>
                        <div class="tab-content" id="nav-tabContent">
                            <!-- All Products Tab -->
                            <div
                                class="tab-pane fade show active"
                                id="nav-all"
                                role="tabpanel"
                                aria-labelledby="nav-all-tab"
                            >
                                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                                    <div class="col" v-for="inventory in inventories" :key="inventory.id">
                                        <div class="card h-100 p-0 shadow-sm position-relative" @click="activateCard">
                                            <SoftBadge
                                                v-if="inventory.isExpiring"
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute top-2 start-2"
                                            >
                                                即將過期
                                            </SoftBadge>
                                            <span class="position-absolute top-0 end-0 p-2 z-index-3">
                                                <i class="fa-solid fa-pencil me-2"></i>
                                                <i class="fa-solid fa-trash"></i>
                                            </span>
                                            <div class="card-body d-flex flex-column">
                                                <div class="image-container mb-3">
                                                    <img
                                                        :src="getRecipeImageUrl(inventory.photo)"
                                                        :alt="inventory.ingredientName"
                                                        class="product-image"
                                                    />
                                                    <span class="amount-badge"
                                                        >{{ inventory.quantity }}{{ inventory.unit }}</span
                                                    >
                                                </div>
                                                <h5 class="card-title text-center">{{ inventory.ingredientName }}</h5>
                                                <p class="card-text text-center">{{ inventory.category }}</p>
                                                <p class="card-text text-center mt-auto">{{ inventory.expiryDate }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="tab-pane fade show"
                                id="nav-expire"
                                role="tabpanel"
                                aria-labelledby="nav-expire-tab"
                            >
                                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                                    <div class="col" v-for="inventory in inventories" :key="inventory.id">
                                        <div class="card h-100 shadow-sm position-relative">
                                            <SoftBadge
                                                v-if="inventory.isExpiring"
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute top-2 start-2"
                                            >
                                                即將過期
                                            </SoftBadge>
                                            <span class="position-absolute top-0 end-0 p-2 z-index-3">
                                                <i class="fa-solid fa-pencil me-2"></i>
                                                <i class="fa-solid fa-trash"></i>
                                            </span>
                                            <div class="card-body d-flex flex-column">
                                                <div class="image-container mb-3">
                                                    <img
                                                        :src="getRecipeImageUrl(inventory.photo)"
                                                        :alt="inventory.ingredientName"
                                                        class="product-image"
                                                    />
                                                    <span class="amount-badge"
                                                        >{{ inventory.quantity }}{{ inventory.unit }}</span
                                                    >
                                                </div>
                                                <h5 class="card-title text-center">{{ inventory.ingredientName }}</h5>
                                                <p class="card-text text-center">{{ inventory.category }}</p>
                                                <p class="card-text text-center mt-auto">{{ inventory.expiryDate }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="banner-ad d-flex justify-content-center">
        <div class="row banner-content p-3">
            <div class="content-wrapper text-center col-md-12"></div>
            <soft-pagination color="info" class="p-0 m-0">
                <soft-pagination-item prev />
                <soft-pagination-item label="1" active />
                <soft-pagination-item label="2" />
                <soft-pagination-item label="3" />
                <soft-pagination-item next />
            </soft-pagination>
        </div>
    </section>

    <section>
        <div
            class="offcanvas offcanvas-end rounded-3"
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabindex="-1"
            id="offcanvasIngredient"
        >
            <div class="offcanvas-header justify-content-center">
                <button
                    type="button"
                    class="btn-close rounded-circle bg-dark"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
            </div>
            <div class="offcanvas-body">
                <div class="order-md-last">
                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-dark">您所選的食材</span>
                        <span class="badge bg-dark rounded-pill">3</span>
                    </h4>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">青椒</h6>
                                <small class="text-body-secondary">蔬菜類</small>
                            </div>
                            <span class="text-body-secondary">到期日: 2024/10/13</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">青椒</h6>
                                <small class="text-body-secondary">蔬菜類</small>
                            </div>
                            <span class="text-body-secondary">到期日: 2024/10/13</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">青椒</h6>
                                <small class="text-body-secondary">蔬菜類</small>
                            </div>
                            <span class="text-body-secondary">到期日: 2024/10/13</span>
                        </li>
                    </ul>

                    <RouterLink class="w-100 btn bg-gradient-info shadow fs-5" :to="{ name: 'GenerateRecipe' }"
                        >產生食譜</RouterLink
                    >
                    <button class="w-100 btn blur text-danger shadow fs-5" @click="alertClearCheck">
                        清空所選食材
                    </button>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-3">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <RouterLink
                        class="btn bg-primary-subtle text-dark shadow fs-5 w-100"
                        :to="{ name: 'GenerateRecipe' }"
                        >產生食譜</RouterLink
                    >
                </div>
                <div class="col-lg-3">
                    <button
                        type="button"
                        class="btn blur shadow text-dark fs-5 w-100"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasIngredient"
                        aria-controls="offcanvasIngredient"
                    >
                        查看您選擇的食材
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* General Styles */
.container-fluid {
    padding: 0;
    margin: 0;
    max-width: 100vw;
}

/* Banner Styles */
.banner-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
}

.banner-ad {
    position: relative;
    overflow: hidden;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat center / cover;
}

/* Product Tabs Styles */
.product-tabs .nav-tabs {
    justify-content: flex-end;
    border: none;
}

.product-tabs .nav-tabs .nav-link.active,
.product-tabs .nav-tabs .nav-item.show .nav-link {
    border: none;
    border-bottom: 3px solid rgb(127, 180, 255);
    background-color: transparent;
}

.card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card.active {
    border: 3px solid rgb(255, 204, 103);
    opacity: 80%;
}

.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.image-container {
    width: 100%;
    height: 200px;
    margin-top: 15px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 10px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.amount-badge {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25em 0.75em;
    font-size: 0.875rem;
    font-weight: 700;
    color: black;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    border-radius: 1rem;
}

.product-name {
    margin-top: 20px;
    text-align: center;
    width: 100%;
}

.product-category,
.expiry-date {
    text-align: center;
    width: 100%;
}

.expiry-date {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
}

.driver {
    box-shadow:
        rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
        rgba(0, 0, 0, 0.06) 0px 0px 0px 1px !important;
    cursor: pointer;
}
.driver:hover {
    transform: scale(1.05);
}

/* Media Queries */
@media screen and (max-width: 768px) {
    .should-gone {
        display: none;
    }
    .amount-badge {
        top: 72%;
        left: 50%;
    }
}
</style>
