<script setup>
import Handle from '@/assets/img/ForComponent/Handle.png';
import GreenPepper from '@/assets/img/ForComponent/GreenPepper.jpg';
import SoftBadge from '@/components/SoftBadge.vue';
</script>

<template>
    <section>
        <div class="min-vh-75">
            <!-- 上方欄位 -->
            <div class="container col-md-10" style="margin-top: 100px">
                <!-- 抽屜圖示 -->
                <div class="row g-3 py-1 px-3 my-3 bg-white rounded-3 shadow d-flex justify-content-center">
                    <img :src="Handle" alt="" style="width: 50px; transform: rotate(-90deg)" />
                </div>
                <div class="row g-3 py-1 px-3 my-3 blur blur-rounded shadow d-flex justify-content-between">
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
                <!-- 食材Card -->
                <div class="row g-3 my-3">
                    <div class="col-md-3 mb-4">
                        <div class="card shadow-sm position-relative">
                            <SoftBadge variant="gradient" color="info" class="position-absolute m-2 z-index-3"
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
                                <p class="card-text position-absolute translate-middle-x" style="bottom: 2%; left: 50%">
                                    2024-10-03
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
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
