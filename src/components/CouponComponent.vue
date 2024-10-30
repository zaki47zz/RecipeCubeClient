<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';

const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const isModalVisible = ref(false); // 對話框的顯示狀態
const coupons = ref([]);
const couponsByUserId = ref([]);

// 讀取使用者資料
const userId = localStorage.getItem('UserId');

// 讀取優惠券 Start

const loadCoupons = async (userId) => {
    try {
        if (userId && userId != null) {
            const response = await fetch(`${BaseURL}/Coupons/GetCouponsWithUserCoupons`);
            const data = await response.json();
            coupons.value = data;
            loadCouponsByUserId(userId);
        } else {
            console.log('使用者未登入或不存在');
        }
    } catch (error) {
        console.log(`fetch 請求優惠券失敗`, error);
    }
};

const loadCouponsByUserId = async (userId) => {
    if (coupons.value && coupons.value.length > 0) {
        couponsByUserId.value = coupons.value.filter((coupon) => coupon.userId === userId);
        console.log('該使用者的優惠券', couponsByUserId.value);
    } else {
        couponsByUserId.value = [];
        console.log('沒有優惠券');
    }
};
loadCoupons(userId);
// 讀取優惠券 End

const openMyCoupon = () => {
    isModalVisible.value = true;
};
</script>

<template>
    <div>
        <!-- 開啟我的優惠券的按鈕 -->
        <button @click="openMyCoupon" class="floating-icon-myCoupon">
            <i class="fa-solid fa-ticket"></i>
        </button>

        <!-- 優惠券列表的對話框 -->
        <el-dialog title="我的優惠券" v-model="isModalVisible" width="45%" @close="dialogVisible = false">
            <div v-if="couponsByUserId.length">
                <div
                    v-for="coupon in couponsByUserId"
                    :key="coupon.couponId"
                    class="coupon-item"
                    :class="coupon.usedStatus === 1 ? 'unused' : 'used'"
                >
                    <p class="coupon-name">{{ coupon.couponName }}</p>
                    <p class="coupon-status">{{ coupon.usedStatus === 1 ? '未使用' : '已使用' }}</p>
                </div>
            </div>
            <div v-else>
                <p>目前沒有可用的優惠券</p>
            </div>

            <!-- 對話框的底部操作按鈕 -->
            <template #footer>
                <el-button @click="isModalVisible = false">關閉</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreBootstrap.min.css';
@import '@/assets/css/StoreStyle.css';

.coupon-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.floating-icon-myCoupon {
    z-index: 100;
}

/* 調整優惠券的基本樣式，使其看起來像真實的優惠券 */
.coupon-item {
    background-color: #fff7e6; /* 模擬紙張的柔和色調 */
    border: 1px dashed #d4a373;
    border-radius: 10px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.3s;
}
.coupon-item:hover {
    transform: scale(1.02);
}

.coupon-name {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
}

.coupon-status {
    font-size: 1em;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

/* 未使用優惠券的顏色 - 馬卡龍綠 */
.unused {
    background-color: #b0eacd; /* 馬卡龍綠 */
    border-color: #82d4b0;
}
.unused .coupon-status {
    background-color: #56c5a9;
}

/* 已使用優惠券的顏色 - 馬卡龍紅 */
.used {
    background-color: #f8c5c5; /* 馬卡龍紅 */
    border-color: #f29e9e;
}
.used .coupon-status {
    background-color: #e78b8b;
}
</style>
