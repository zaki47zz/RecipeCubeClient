<script setup>
import SoftInput from '@/components/SoftInput.vue';
import Swiper from 'swiper';
import Swal from 'sweetalert2';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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

const alertClearCheck = () => {
    Swal.fire({
        title: '您確定嗎?',
        text: '即將加入食材至庫存',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '加入',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '成功加入!',
                icon: 'success',
            });
        }
    });
};

onMounted(() => {
    initSwiper();
});
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-primary-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>加入食材 Add Ingredient</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5 overflow-hidden">
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

    <div class="d-flex justify-content-center my-3">
        <hr class="horizontal dark my-0 w-50" />
    </div>

    <section class="py-3 overflow-hidden">
        <div class="container-fluid post-it shadow">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-2">
                        <h5>今天買了</h5>
                        <p class="badge bg-secondary"><i class="fa-solid fa-repeat"></i> 數量換算表</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive p-3">
                    <table class="table table-borderless text-center table-hover align-middle mb-0">
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

    <section class="pt-3">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <button class="btn bg-primary-subtle text-dark shadow fs-5 w-100" @click="alertClearCheck">
                        加入食材
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
    border: 3px solid #b9bbde;
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
    background: #fffaa2;
    padding: 1% 3% 3%;
    text-align: center;
}
</style>
