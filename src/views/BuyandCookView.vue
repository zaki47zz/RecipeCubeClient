<script setup>
import SoftInput from '@/components/SoftInput.vue';
import SoftSwitch from '@/components/SoftSwitch.vue';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { onMounted } from 'vue';

const initSwiper = function () {
    const category_swiper = new Swiper('.category-carousel', {
        modules: [Navigation],
        slidesPerView: 6,
        spaceBetween: 30,
        speed: 500,
        navigation: {
            nextEl: '.category-carousel-next',
            prevEl: '.category-carousel-prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 4,
            },
            1500: {
                slidesPerView: 6,
            },
        },
    });
};

const initTippy = function () {
    tippy('#tooltip-wrapper-set', {
        content: '啟用此功能，我們會為您搭配一份主餐與一份副餐!',
        placement: 'right-end',
        animation: 'fade',
    });
    tippy('#tooltip-wrapper-inventory', {
        content: '啟用此功能，我們會同時使用您庫存內的食材進行食譜搜索，如不想使用庫存內食材，請取消。',
        placement: 'right-end',
        animation: 'fade',
    });
};

onMounted(() => {
    initSwiper();
    initTippy();
});
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-danger-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>隨買隨煮 Buy & Cook</h1>
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
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-1" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>選擇食材</h5>
                            <p>填入您今天購買的食材</p>
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
                            <p>按下產生食譜按鈕生成食譜</p>
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
                            <p>選擇料理食譜，準備大顯身手</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-3 overflow-hidden">
        <div class="container-fluid banner-ad">
            <div class="row">
                <div class="col-md-12">
                    <div class="section-header d-flex flex-wrap justify-content-between mb-1">
                        <h2 class="section-title">食材列表</h2>
                        <div class="d-flex align-items-center">
                            <a href="#" class="btn-link text-decoration-none">滾動以查看所有類別 →</a>
                            <div class="swiper-buttons">
                                <button class="swiper-prev category-carousel-prev btn btn-yellow m-1">❮</button>
                                <button class="swiper-next category-carousel-next btn btn-yellow m-1">❯</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="search-box position-relative">
                    <SoftInput
                        placeholder="輸入食材關鍵字..."
                        icon="fas fa-search"
                        iconDir="right"
                        class="w-80 mx-auto text-center my-1"
                    />
                </div>
                <div class="col-md-12">
                    <div class="category-carousel swiper">
                        <div class="swiper-wrapper">
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">您的常用食材</h6>
                                <div class="d-flex flex-wrap justify-content-center gap-2">
                                    <span class="badge food-badge bg-success">青椒</span>
                                    <span class="badge food-badge bg-success">高麗菜</span>
                                    <span class="badge food-badge bg-success">菠菜</span>
                                </div>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">蔬菜類</h6>
                                <div class="d-flex flex-wrap justify-content-center gap-2">
                                    <span class="badge food-badge bg-success">青椒</span>
                                    <span class="badge food-badge bg-success">菠菜</span>
                                    <span class="badge food-badge bg-success">高麗菜</span>
                                    <span class="badge food-badge bg-success">青椒</span>
                                    <span class="badge food-badge bg-success">菠菜</span>
                                    <span class="badge food-badge bg-success">高麗菜</span>
                                    <span class="badge food-badge bg-success">青椒</span>
                                    <span class="badge food-badge bg-success">菠菜</span>
                                    <span class="badge food-badge bg-success">高麗菜</span>
                                    <span class="badge food-badge bg-success">青椒</span>
                                    <span class="badge food-badge bg-success">菠菜</span>
                                    <span class="badge food-badge bg-success">高麗菜</span>
                                </div>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">牛肉類</h6>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">豬肉類</h6>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">雞肉類</h6>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">蛋奶類</h6>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">菌菇類</h6>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-center">液體類</h6>
                            </div>
                            <div class="nav-link category-item swiper-slide">
                                <h6 class="text-dark">沒有想要的食材?</h6>
                                <button class="btn blur rounded-3 shadow text-center">加入自定義食材</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="banner-section py-3 overflow-hidden p-5 bg-danger-subtle">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-1">
                        <h5>您選擇的食材</h5>
                        <p class="badge bg-secondary"><i class="fa-solid fa-repeat"></i> 數量換算表</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive p-1">
                    <table class="table table-borderless text-center align-middle bg-white rounded-4">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">編號</th>
                                <th scope="col" class="text-dark">食材</th>
                                <th scope="col" class="text-dark">數量</th>
                                <th scope="col" class="text-dark">權限</th>
                                <th scope="col" class="text-dark">期限</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" class="text-dark">1</th>
                                <td class="text-dark">菠菜</td>
                                <td class="text-dark">
                                    <input type="text" class="form-control inline-control w-30" /> 把
                                </td>
                                <td class="text-dark">
                                    <select class="form-control inline-control text-center">
                                        <option value="0">群組</option>
                                        <option value="1">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        type="date"
                                        class="form-control inline-control text-center"
                                        value="2024-10-30"
                                    />
                                </td>
                                <td class="text-dark">
                                    <i class="fa-solid fa-trash"></i>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-dark">1</th>
                                <td class="text-dark">菠菜</td>
                                <td class="text-dark">
                                    <input type="text" class="form-control inline-control w-30" /> 把
                                </td>
                                <td class="text-dark">
                                    <select class="form-control inline-control text-center">
                                        <option value="0">群組</option>
                                        <option value="1">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        type="date"
                                        class="form-control inline-control text-center"
                                        value="2024-10-30"
                                    />
                                </td>
                                <td class="text-dark">
                                    <i class="fa-solid fa-trash"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <SoftSwitch name="set" id="set" class="switch-set">
                        <span>
                            套餐
                            <span id="tooltip-wrapper-set">
                                <i class="fa-solid fa-circle-question"></i>
                            </span>
                        </span>
                    </SoftSwitch>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <SoftSwitch name="inventory" id="inventory" checked="true" class="switch-inventory">
                        <span>
                            使用庫存食材
                            <span id="tooltip-wrapper-inventory">
                                <i class="fa-solid fa-circle-question"></i>
                            </span>
                        </span>
                    </SoftSwitch>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <RouterLink
                        class="btn bg-danger-subtle text-dark shadow fs-5 w-100"
                        :to="{ name: 'GenerateRecipe' }"
                    >
                        產生食譜
                    </RouterLink>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <p class="text-center">(別擔心，剩餘食材將被加入庫存)</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 加上一個DataTables -->
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

/* Swiper carousel */
.swiper-prev,
.swiper-next {
    width: 38px;
    height: 38px;
    line-height: 38px;
    background: #f1f1f1;
    color: #222222;
    padding: 0;
    text-align: center;
    border-radius: 10px;
    --bs-btn-border-color: transparent;
    --bs-btn-active-bg: #f8d7da;
    --bs-btn-active-border-color: transparent;
    --bs-btn-hover-bg: #f8d7da;
    --bs-btn-hover-border-color: transparent;
    --bs-btn-disabled-color: #ccc;
    --bs-btn-disabled-bg: #eaeaea;
    --bs-btn-disabled-border-color: #eaeaea;
}
.swiper-prev:hover,
.swiper-next:hover {
    background: #f8d7da;
}
.btn-link {
    margin-right: 30px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    text-align: right;
    color: #787878;
}

/* category carousel */
.category-carousel .category-item {
    background: #ffffff;
    border: 3px solid #ffd6d6;
    box-shadow: 0px 5px 22px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    text-align: center;
    padding: 20px;
    margin: 20px 0;
    transition:
        box-shadow 0.3s ease-out,
        transform 0.3s ease-out;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 240px;
}
.category-carousel .category-item:hover {
    transform: translate3d(0, -5px, 0);
    box-shadow: 0px 21px 44px rgba(0, 0, 0, 0.08);
}
.category-carousel .category-item .category-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 27px;
    letter-spacing: 0.02em;
    color: #222222;
    margin-top: 0px;
}

.post-it {
    background: #f4e187;
    padding: 1% 3% 3%;
    text-align: center;
}

.switch-set {
    /* margin-left: calc(50% - 3.5vw); */
    left: 50%;
    transform: translateX(33%);
}

.switch-inventory {
    /* margin-left: calc(50% - 3.5vw); */
    left: 50%;
    transform: translateX(24%);
}
</style>
