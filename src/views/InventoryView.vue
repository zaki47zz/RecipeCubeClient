<script setup>
import Swiper from 'swiper';
import Isotope from 'isotope-layout';
import GreenPepper from '@/assets/img/ForComponent/GreenPepper.jpg';
import SoftBadge from '@/components/SoftBadge.vue';
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
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-1" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>選擇食材</h5>
                            <p>請在下方食材列表選擇食材</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-2" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>產生食譜</h5>
                            <p>按下產生食譜按鈕獲取我們推薦的食譜</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-3" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>開始料理</h5>
                            <p>挑選想要的料理食譜開始大顯身手吧</p>
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
                                <button class="btn blur shadow me-1">歷史編輯紀錄</button>
                                <button class="btn blur shadow me-1">全選</button>
                                <button class="btn blur shadow text-danger me-1">刪除所選食材</button>
                            </div>
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a
                                        href="#"
                                        class="nav-link fs-6 text-dark active"
                                        id="nav-all-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-all"
                                        >所有食材</a
                                    >
                                    <a
                                        href="#"
                                        class="nav-link fs-6 text-dark"
                                        id="nav-fruits-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-fruits"
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
                                                    <span
                                                        class="amount-badge position-absolute translate-middle"
                                                        style="top: 60%; left: 50%"
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
                                        <div class="card shadow-sm position-relative">
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
                                                    <span
                                                        class="amount-badge position-absolute translate-middle"
                                                        style="top: 60%; left: 50%"
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

    <section class="banner-ad">
        <div class="row banner-content p-3">
            <div class="content-wrapper text-center col-md-12"></div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* *** Start editing below this line *** */
.container-fluid {
    padding: 0%;
    margin: 0%;
}
.banner-blocks {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 2rem;
}
.block-1 {
    grid-area: 1 / 1 / 3 / 8;
}
.block-2 {
    grid-area: 1 / 8 / 2 / 13;
}
.block-3 {
    grid-area: 2 / 8 / 3 / 13;
}

@media screen and (max-width: 1140px) {
    .banner-blocks {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
    }
    .block-1 {
        grid-area: 1 / 1 / 3 / 2;
    }
    .block-2 {
        grid-area: 3 / 1 / 4 / 2;
    }
    .block-3 {
        grid-area: 4 / 1 / 5 / 2;
    }
}

/* banner ad */
.banner-section {
    width: 100vw; /* 讓該區塊延伸到整個頁面寬 */
    margin-left: calc(-50vw + 50%); /* 調整位置來居中對齊 */
    background-image: url('@/assets/img/ForBackground/background-pattern.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
}

.banner-ad {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat;
    background-position: center; /* 將圖片置中對齊 */
    background-size: cover; /* 使背景圖片填滿區塊 */
}
.banner-ad .banner-content .banner-title {
    letter-spacing: 0.02em;
    font-size: 33px;
}
.banner-ad.large .banner-content .categories {
    color: var(--accent-color);
}
.banner-ad.large .banner-content .banner-title {
    font-size: 54px;
}
.product-tabs .nav-tabs {
    justify-content: flex-end;
    border: none;
}
.product-tabs .nav-tabs .nav-link.active,
.product-tabs .nav-tabs .nav-item.show .nav-link {
    border: white;
    border-bottom: 3px solid rgb(127, 180, 255);
    background-color: transparent;
}
.amount-badge {
    display: inline-block;
    padding: 0.55em 1.5em;
    font-size: 1em;
    font-weight: 700;
    line-height: 1;
    color: black;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border: 2px solid black;
    border-radius: 1.5rem;
}
.card img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保持圖片的比例，填滿卡片區域 */
    transition: transform 0.3s ease-in-out; /* 動畫效果 */
}
.card:hover img {
    transform: scale(1.1); /* 圖片放大 1.1 倍 */
}
</style>
