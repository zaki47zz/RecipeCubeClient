<script setup>
import { storeToRefs } from 'pinia';
import { useIngredientStore } from '@/stores/ingredientStore';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { onMounted, ref, watchEffect } from 'vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const ingredientStore = useIngredientStore();
const { ingredients, groupedIngredients, ingredientCategory } = storeToRefs(ingredientStore);
const { fetchIngredients } = ingredientStore;
const selectedIngredients = ref([]); //所選的食材放這

onMounted(() => {
    fetchIngredients();
});

//利用watchEffect讓selectedIngredients變動時自動activate同Id的badge
watchEffect(async () => {
    console.log(selectedIngredients.value);
});

// Swiper設定
const swiperOptions = {
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
};

//Badge點擊事件
const activateBadge = (ingredient, event) => {
    const selectedBadge = event.currentTarget;
    if (!selectedBadge.classList.contains('active')) {
        selectedBadge.classList.add('active');
        selectedIngredients.value.push(ingredient);
    } else {
        selectedBadge.classList.remove('active');
        const deletingIndex = selectedIngredients.value.indexOf(ingredient);
        if (deletingIndex > -1) {
            selectedIngredients.value.splice(deletingIndex, 1);
        }
    }
};

//multiselect設定
const customLabel = (option) => {
    // 合併名稱和同義字來讓它們參與過濾
    const label = option.ingredientName || '';
    const synonym = option.synonym ? ` (${option.synonym})` : '';
    // 返回顯示的名稱和同義字
    return `${label}${synonym}`;
};
</script>

<template>
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
            <Multiselect
                v-model="selectedIngredients"
                :options="groupedIngredients"
                placeholder="搜尋或選擇食材 (可以多選)"
                :multiple="true"
                :close-on-select="false"
                group-label="category"
                group-values="ingredients"
                :group-select="false"
                track-by="ingredientId"
                :custom-label="customLabel"
            >
                <span slot="noResult">找不到該食材</span>
            </Multiselect>
        </div>
        <div class="col-md-12">
            <!-- 使用 Swiper 和 SwiperSlide 組件 -->
            <Swiper v-bind="swiperOptions" class="category-carousel">
                <SwiperSlide class="nav-link category-item">
                    <h6 class="text-center">您的常用食材</h6>
                    <div class="d-flex flex-wrap justify-content-center gap-2">
                        <span class="badge food-badge bg-success">青椒</span>
                    </div>
                </SwiperSlide>

                <SwiperSlide
                    v-for="(category, index) in ingredientCategory"
                    :key="index"
                    class="nav-link category-item"
                >
                    <h6 class="text-center">{{ category }}</h6>
                    <div class="d-flex flex-wrap justify-content-center gap-2">
                        <span
                            class="badge food-badge bg-secondary"
                            v-for="ingredient in ingredients.filter((i) => i.category == category)"
                            :key="ingredient.ingredientId"
                            :data-ingredientId="ingredient.ingredientId"
                            @click="activateBadge(ingredient, $event)"
                            >{{ ingredient.ingredientName }}</span
                        >
                    </div>
                </SwiperSlide>

                <SwiperSlide class="nav-link category-item">
                    <h6 class="text-dark">沒有想要的食材?</h6>
                    <button class="btn blur rounded-3 shadow text-center">加入自定義食材</button>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>

<style lang="css" scoped>
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
    border: 3px solid #a1a1a1;
    box-shadow: 0px 5px 22px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    text-align: center;
    padding: 20px;
    margin: 20px 0;
    transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;
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
.food-badge {
    background-color: #f0f2f4 !important;
    color: #96979e !important;
}
.food-badge:hover {
    opacity: 70%;
    cursor: pointer;
}
.food-badge.active {
    background-color: #93c759 !important;
    color: #ffffff !important;
}
</style>
