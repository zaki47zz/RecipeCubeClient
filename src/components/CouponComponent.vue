<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';

const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;

// 讀取使用者資料
const userId = localStorage.getItem('UserId');

// //
// loadCoupons(userId);

// // 讀取優惠券 Start
// const coupons = ref([]);

// const loadCoupons = async (userId) => {
//     try {
//         if (userId && userId != null) {
//             const response = await fetch(`${BaseURL}/Coupons/GetCouponsWithUserCoupons`);
//             const data = await response.json();
//             coupons.value = data;
//             loadCouponsByUserId(userId);
//         } else {
//             console.log('使用者未登入或不存在');
//         }
//     } catch (error) {
//         console.log(`fetch 請求優惠券失敗`, error);
//     }
// };

// const couponsByUserId = ref([]);

// const loadCouponsByUserId = async (userId) => {
//     if (coupons.value && coupons.value.length > 0) {
//         couponsByUserId.value = coupons.value.filter((coupon) => coupon.userId === userId);
//         console.log('該使用者的優惠券', couponsByUserId.value);
//     } else {
//         couponsByUserId.value = [];
//         console.log('沒有優惠券');
//     }
// };

// 讀取優惠券 End
</script>

<template>
    <div>
        <!-- 開啟我的優惠券的按鈕 -->
        <button @click="openCartSidebar" class="floating-icon-myCoupon">
            <i class="fa-solid fa-ticket"></i>
        </button>
    </div>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreBootstrap.min.css';
@import '@/assets/css/StoreStyle.css';
</style>
