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
const customIngredient = ref({
    ingredientId: '',
    ingredientName: '',
    category: '',
    synonym: '',
    expireDay: 0,
    unit: '',
    gram: 0,
    photo: '',
    previewUrl: '',
}); //自定義食材資料

const isModalVisible = ref(true);

onMounted(() => {
    fetchIngredients();
});

// 利用watchEffect讓selectedIngredients變動時自動activate同Id的badge;
watchEffect(() => {
    const allBadge = document.querySelectorAll('.badge.active');
    allBadge.forEach((badge) => badge.classList.remove('active'));
    for (let ingredient of selectedIngredients.value) {
        const badge = document.querySelector(`.badge[data-ingredientId="${ingredient.ingredientId}"]`);
        badge.classList.add('active');
    }
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
const activateBadge = (ingredient) => {
    const Index = selectedIngredients.value.indexOf(ingredient);
    if (Index === -1) {
        selectedIngredients.value.push(ingredient);
    } else {
        selectedIngredients.value.splice(Index, 1);
    }
};

////自定義食材

////自定義食材結束

//multiselect設定
const customLabel = (ingredient) => {
    // 合併名稱和同義字來讓它們參與過濾
    const label = ingredient.ingredientName || '';
    const synonym = ingredient.synonym ? ` (${ingredient.synonym})` : '';
    // 返回顯示的名稱和同義字
    return `${label}${synonym}`;
};

//處理圖片上傳
const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        customIngredient.value.photo = file; // 保留原始 file
        console.log('圖片:', customIngredient.value.photo);
        const reader = new FileReader();
        reader.onload = (e) => {
            // 這裡是用於顯示圖片預覽的 URL
            customIngredient.value.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
//加入自定義食材
const addCustomIngredient = () => {};
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
                            @click="activateBadge(ingredient)"
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

    <section>
        <el-dialog v-model="isModalVisible" title="加入自定義食材" width="70%" center class="bg-primary-subtle">
            <form class="bg-white rounded-4 p-3">
                <div class="mb-4">
                    <label for="ingredientName" class="form-label fs-6">食材名稱</label>
                    <input
                        v-model="customIngredient.ingredientName"
                        type="text"
                        id="ingredientName"
                        class="form-control"
                        placeholder="例如: 豆腐"
                    />
                </div>

                <div class="mb-4">
                    <label for="category" class="form-label fs-6">類別</label>
                    <select v-model="customIngredient.category" id="category" class="form-control">
                        <option value="">請選擇類別</option>
                        <option v-for="category in ingredientCategory" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="synonym" class="form-label fs-6">別名</label>
                    <input
                        v-model="customIngredient.synonym"
                        type="text"
                        id="synonym"
                        class="form-control"
                        placeholder="例如: Tofu"
                    />
                </div>

                <div class="mb-4">
                    <label for="expireDay" class="form-label fs-6">保鮮期 (天)</label>
                    <input
                        v-model="customIngredient.expireDay"
                        type="number"
                        id="expireDay"
                        class="form-control"
                        value="7"
                        placeholder="例如: 7"
                    />
                </div>

                <div class="mb-4">
                    <label for="unit" class="form-label fs-6">常用單位</label>
                    <input
                        v-model="customIngredient.unit"
                        type="text"
                        id="unit"
                        class="form-control"
                        value="克"
                        placeholder="例如: 盒"
                    />
                </div>

                <div class="mb-4">
                    <label for="gram" class="form-label fs-6">每單位重量 (克)</label>
                    <input
                        v-model="customIngredient.gram"
                        type="number"
                        id="gram"
                        class="form-control"
                        value=""
                        placeholder="(選填，當常用單位非'克'時建議填寫) 例如: 200"
                    />
                </div>

                <label for="photo" class="form-label fs-6">食材圖片</label>
                <div class="mb-4 d-flex justify-content-center">
                    <div
                        class="position-relative"
                        style="
                            width: 50%;
                            height: 200px;
                            background-color: #f8f9fa;
                            border: 2px dashed #ced4da;
                            border-radius: 8px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                        "
                    >
                        <div v-if="!recipeData.previewUrl" class="text-center">
                            <i class="fas fa-cloud-upload-alt mb-2" style="font-size: 48px; color: #6c757d"></i>
                            <p class="mb-0 fs-6" style="color: #6c757d">點擊或拖曳上傳食材照片</p>
                        </div>
                        <img
                            v-else
                            alt="食材預覽"
                            style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px"
                        />
                        <input
                            type="file"
                            class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                            accept="image/*"
                            @change="handlePhotoUpload"
                        />
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-info me-5" @click="addCustomIngredient">加入</button>
                    <button class="btn btn-secondary" @click="isModalVisible = false">關閉</button>
                </div>
            </form>
        </el-dialog>
    </section>
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
