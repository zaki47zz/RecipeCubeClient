<script setup>
import Isotope from 'isotope-layout';
import Swal from 'sweetalert2';
import GreenPepper from '@/assets/img/ForComponent/GreenPepper.jpg';
import SoftBadge from '@/components/SoftBadge.vue';
import SoftPagination from '@/components/SoftPagination.vue';
import SoftPaginationItem from '@/components/SoftPaginationItem.vue';

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
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-warning-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>食譜 Recipe</h1>
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
                    <h4>在下方食材列表，您可以看到您所屬群組的庫存食材，您可以進行兩種操作</h4>
                </div>
            </div>
            <div class="row justify-content-center my-5">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-box-open mt-3"></i> 管理食材</h5>
                            <p>對個別食材進行數量的修改或刪除</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-center">
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
                <div class="row g-3 py-1 px-3 my-3 d-flex bg-warning-subtle rounded-4 shadow justify-content-between">
                    <!-- 分類欄 -->
                    <div class="col-md-2">
                        <p class="fw-bold">分類 CATEGORY</p>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select">
                            <option selected>葷素</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select">
                            <option selected>中西式</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select">
                            <option selected>類別</option>
                            <option value="XX">XX</option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select">
                            <option selected>細部類別</option>
                            <option value="0">公開</option>
                            <option value="1">私有</option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
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
                            <h3>食譜列表</h3>
                            <div>
                                <button class="btn blur shadow fs-6 text-danger me-1">刪除</button>
                            </div>
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a
                                        href="#"
                                        class="nav-link fs-5 fw-bold text-dark active"
                                        id="nav-all-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-all"
                                        >所有食譜</a
                                    >
                                    <a
                                        href="#"
                                        class="nav-link fs-5 fw-bold text-dark"
                                        id="nav-fruits-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-fruits"
                                        >群組食譜</a
                                    >
                                    <a
                                        href="#"
                                        class="nav-link fs-5 fw-bold text-dark"
                                        id="nav-fruits-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-fruits"
                                        >您的食譜</a
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
                                <div
                                    class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5"
                                >
                                    <div class="col">
                                        <div class="card shadow-sm position-relative">
                                            <SoftBadge
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute m-2 z-index-3"
                                                >即將過期</SoftBadge
                                            >
                                            <!-- <span class="badge bg-warning text-dark position-absolute m-2">即將過期</span> -->
                                            <div class="card-body position-relative">
                                                <div class="d-flex justify-content-center align-items-center">
                                                    <img :src="GreenPepper" alt="" class="w-75 mt-3" />
                                                    <span class="amount-badge position-absolute translate-middle"
                                                        >3個</span
                                                    >
                                                </div>
                                                <h5 class="card-title mt-5 w-100 text-center">青椒</h5>
                                                <p class="card-text w-100 text-center">蔬菜類</p>
                                                <p
                                                    class="card-text position-absolute translate-middle-x"
                                                    style="bottom: 2%; left: 50%"
                                                >
                                                    2024-10-03
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Additional product items go here -->
                                </div>
                            </div>

                            <!-- Fruits and Veges Tab -->
                            <div class="tab-pane fade" id="nav-fruits" role="tabpanel" aria-labelledby="nav-fruits-tab">
                                <div
                                    class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5"
                                >
                                    <div class="col">
                                        <div class="card shadow-sm position-relative mt-1">
                                            <SoftBadge
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute m-2 z-index-3"
                                                >即將過期</SoftBadge
                                            >
                                            <span class="position-absolute top-3 end-8 z-index-3">
                                                <i class="fa-solid fa-pencil"></i>&ensp;<i
                                                    class="fa-solid fa-trash"
                                                ></i>
                                            </span>
                                            <div class="card-body position-relative">
                                                <div class="d-flex justify-content-center align-items-center">
                                                    <img :src="GreenPepper" alt="" class="w-75 mt-3" />
                                                    <span class="amount-badge position-absolute translate-middle"
                                                        >3個</span
                                                    >
                                                </div>
                                                <h5 class="card-title mt-5 w-100 text-center">青椒</h5>
                                                <p class="card-text w-100 text-center">蔬菜類</p>
                                                <p
                                                    class="card-text position-absolute translate-middle-x"
                                                    style="bottom: 2%; left: 50%"
                                                >
                                                    2024-10-03
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Additional product items go here -->
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
            <soft-pagination color="warning" class="p-0 m-0">
                <soft-pagination-item prev />
                <soft-pagination-item label="1" active />
                <soft-pagination-item label="2" />
                <soft-pagination-item label="3" />
                <soft-pagination-item next />
            </soft-pagination>
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
    background: url('@/assets/img/ForBackground/background-pattern.jpg') no-repeat center / cover;
    position: relative;
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
</style>
