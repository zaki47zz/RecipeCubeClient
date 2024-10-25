<script setup>
// 引入 ref API，用來管理響應式狀態
import { ref } from 'vue';

// 定義一個響應式變數 username，儲存使用者名稱
const username = ref('');
// 動態修改橫幅標題
const section = ref('帳戶設定 Account settings');

// 從 localStorage 取得使用者資料並解析為 JSON，儲存到 storedUserData 中
const storedUserData = JSON.parse(localStorage.getItem('UserData'));
console.log(storedUserData);
// 定義選單項目，包含標籤名稱；activeIndex 將會控制選擇的項目
const menuItems = ref(['基本資料', '飲食偏好', '群組']);


// 用來儲存目前被選中的選單項目的索引值，預設為ji3 -1（"不顯示自 廖"）
const activeIndex = ref(-1);

// setActive 函式用於設定目前選中的選單項目
const setActive = (index) => {
    activeIndex.value = index; // 更新 activeIndex，根據點擊的項目
    section.value = menuItems.value[activeIndex.value]; // 根據 index 動態更新橫幅標題
};
</script>

<template>
    <!-- 橫幅區塊 -->
    <section class="banner-section">
        <div class="banner-ad bg-info-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">{{ section }}</h1>
                </div>
            </div>
        </div>
    </section>

    <div class="row">
        <!-- 左側選單 -->
        <div class="col-12 col-md-3 p-5">
            <div class="list-group">
                <!-- 使用 v-for 迴圈渲染選單項目 -->
                <!-- 根據activeIndex 動態設定選單項目樣式 -->
                <!-- ARIA 屬性幫助無障礙性 -->
                <a v-for="(item, index) in menuItems" :key="index" href="#"
                    class="list-group-item list-group-item-action" :class="{ active: activeIndex === index }"
                    :aria-current="activeIndex === index ? 'true' : null" @click="setActive(index)">
                    <!-- 點擊事件，調用 setActive 函式 -->
                    {{ item }}
                </a>
            </div>
        </div>

        <!-- 右側內容區域 -->
        <div class="col-12 col-md-9 p-5">
            <!-- 根據 activeIndex 動態顯示對應的內容 -->
            <div v-if="activeIndex === 0">
                <p><strong>姓名:</strong> {{ storedUserData?.UserName }}</p>
                <p><strong>Email:</strong> {{ storedUserData?.Email }}</p>
                <p><strong>電話:</strong> {{ storedUserData?.Phone }}</p>
            </div>
            <div v-else-if="activeIndex === 1">
                飲食偏好
            </div>
            <div v-else-if="activeIndex === 2">
                <p><strong>群組:</strong> {{ storedUserData?.GroudId }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
/* 橫幅樣式 */
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
</style>
