<script setup>
import { ref } from 'vue';
const username = ref('');
const storedUserData = JSON.parse(localStorage.getItem('UserData')); // 取得 UserData

const menuItems = ref([
    { label: '基本資料', active: true },
    { label: '飲食偏好', active: false },
    { label: '群組', active: false },
]);

const setActive = (index) => {
    menuItems.value.forEach((item, i) => {
        item.active = i === index;
    });
};
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-info-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">帳戶設定 Account settings</h1>
                </div>
            </div>
        </div>
    </section>

    <div class="col-12 col-md-3 p-5">
        <div class="list-group">
            <a v-for="(item, index) in menuItems" :key="index" href="#" class="list-group-item list-group-item-action"
                :class="{ active: item.active }" :aria-current="item.active ? 'true' : null" @click="setActive(index)">
                {{ item.label }}
            </a>
        </div>
    </div>
</template>

<style lang="css" scoped>
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
</style>
