<script lang="ts" setup>
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import ShoppingListComponent from '@/components/ShoppingListComponent.vue';
import CouponComponent from '@/components/CouponComponent.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import 'vue3-easy-data-table/dist/style.css';
import type { Header } from 'vue3-easy-data-table';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePantryStore } from '@/stores/pantryStore';
import { useRouter } from 'vue-router';

// @ts-ignore
const BaseURL = import.meta.env.VITE_API_BASEURL; //先忽略對import.meta錯誤檢查
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL
const inventoryStore = useInventoryStore(); // 使用ingredientStore pinia
const pantryStore = usePantryStore();

// 讀取localStorage的"UserId"
const UserId = localStorage.getItem('UserId');
console.log(UserId);

// 測試用userId
// const testUserId = 'e9f150de-3492-47b4-9efe-783a6b9d9319'
// localStorage.setItem("UserId",testUserId);
// const UserId = localStorage.getItem("UserId")
// console.log(UserId);

const orders = ref([]);
// 讀取該userId
const loadOrderByUserId = async (userId) => {
    const response = await fetch(`${BaseURL}/Orders/OrderItem/${userId}`);
    if (!response.ok) {
        Swal.fire('訂單請求失敗');
        return;
    }
    const data = await response.json();
    orders.value = data;
    console.log(data);
    // orders.value.forEach(order => {
    // console.log("Order ID:", order.orderId);
    // 遍歷嵌套的商品數據
    // order.getOrderItemProductUnit.forEach(item => {
    //     console.log("Product Name:", item.productName);
    // });
    // });
    loadTableItems(); // 載入表格內容
};

// 叫用loadOrderByUserId  參數用localStorage的UserId
loadOrderByUserId(UserId);

const headers: Header[] = [
    { text: '訂單編號', value: 'orderNum', sortable: true },
    { text: '訂單時間', value: 'orderTime', sortable: true },
    { text: '商品項目數量', value: 'productLength', sortable: true },
    { text: '訂單總價', value: 'orderAmount', sortable: true },
    { text: '狀態', value: 'orderStatus', sortable: true },
    { text: '操作', value: 'operation' },
];

const items = ref([]);

// 載入表格內容
const loadTableItems = () => {
    items.value = []; // 清空 items

    // 歷遍 orders
    orders.value.forEach((order) => {
        // 格式化orderTime
        const date = new Date(order.orderTime);
        const formatDate = date.toISOString().split('T')[0]; //日期
        const formatTime = date.toTimeString().split(' ')[0]; //時間

        // 狀態數字轉文字
        let status = '';
        switch (order.status) {
            case 1:
                status = '未付款';
                break;
            case 2:
                status = '已付款';
                break;
            case 3:
                status = '訂單確認中';
                break;
            case 4:
                status = '已出貨';
                break;
            case 5:
                status = '訂單完成';
                break;
        }
        // 填充 items
        items.value.push({
            orderNum: order.orderId,
            orderTime: `${formatDate}  ${formatTime}`,
            productLength: order.getOrderItemProductUnit.length,
            orderAmount: order.totalAmount,
            orderStatus: status,
            showCompleteButton: status === '已付款' || status === '訂單確認中' || status === '已出貨', // 狀態為已付款或確認訂單或已出貨時顯示按鈕
            showContinuePay: status === '未付款', //狀態為未付款
            showEvaluatesButton: status === '訂單完成', // 狀態為完成訂單
        });
        // console.log('Items loaded with showCompleteButton:', items.value);
    });
    // console.log("Items loaded:", items.value);
};

const isModalVisible = ref(false); // 控制ModalVisible 顯示
const selectedOrder = ref(null); // 儲存選擇的訂單詳細資訊

// 點擊行事件
const handleRowClick = (row) => {
    // console.log("Row clicked:", row); // 新增這行以確定事件是否被觸發
    const orderNum = row.orderNum;
    const order = orders.value.find((order) => order.orderId === orderNum);
    console.log('Selected Order:', order); // 檢查找到的訂單是否正確
    openModal(order);
    //console.log("isModalVisible:", isModalVisible.value); //  Modal 可見性
};

// 格式化時間 給訂單詳細使用
const formatTime = (orderTime) => {
    const date = new Date(orderTime);
    const formatDate = date.toISOString().split('T')[0]; //日期
    const formatTime = date.toTimeString().split(' ')[0]; //時間
    return `${formatDate} ${formatTime}`;
};

// 開啟Modal
const openModal = (order) => {
    selectedOrder.value = order;

    // 格式化時間
    selectedOrder.value.orderTime = formatTime(order.orderTime);

    // console.log(selectedOrder.value.orderTime)

    isModalVisible.value = true;
};

// 關閉Modal
const closeModal = () => {
    isModalVisible.value = false;
    selectedOrder.value = null;
};

// Timeline

const getStatusType = (stepStatus: number, currentStatus: number) => {
    if (stepStatus < currentStatus) {
        // 當前狀態之前的步驟
        return { color: '#81c408', text: '已完成' };
    } else if (stepStatus === currentStatus) {
        // 當前狀態
        return { color: 'pink', text: '當前步驟' };
    } else {
        // 當前狀態之後的步驟
        return { color: 'gray', text: '未完成' };
    }
};

const steps = [
    { status: 1, content: '未付款' },
    { status: 2, content: '已付款' },
    { status: 3, content: '訂單確認中' },
    { status: 4, content: '已出貨' },
    { status: 5, content: '訂單完成' },
];

// 處理完成訂單按鈕點擊 Start
const handleCompleteOrder = async (item) => {
    selectedOrder.value = orders.value.find((order) => order.orderId === item.orderNum);
    console.log('完成訂單按鈕的訂單', selectedOrder.value);
    // 检查 selectedOrder 是否为 null
    if (!selectedOrder || !selectedOrder.value.getOrderItemProductUnit) {
        Swal.fire('錯誤', '選擇的訂單無效或沒有商品。', 'error');
        return; // 退出函数
    }

    const { value: visibility } = await Swal.fire({
        title: '選擇可見性',
        text: '請選擇該訂單商品的可見性',
        icon: 'question',
        input: 'radio',
        inputOptions: {
            true: '可見',
            false: '不可見',
        },
        inputValidator: (value) => {
            if (!value) return '請選擇一個選項！';
        },
        showCancelButton: true,
        confirmButtonText: '完成訂單',
    });

    if (visibility !== undefined) {
        try {
            // 強制轉換布林值 以免出錯
            const visibilityConvertToBoolean = visibility === 'true' ? true : false;

            const action = '增加';
            // 遍歷選擇的訂單中的每個商品，並傳遞數量
            for (const item of selectedOrder.value.getOrderItemProductUnit) {
                await inventoryStore.postInventory({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity * item.unitQuantity,
                    expiryDate: undefined,
                    visibility: visibilityConvertToBoolean,
                });
                await pantryStore.postPantry({
                    userId: UserId,
                    ownerId: undefined,
                    ingredientId: item.ingredientId,
                    quantity: item.quantity * item.unitQuantity,
                    action: action,
                });
            }

            // 更新訂單狀態為 5，表示訂單已完成
            selectedOrder.value.status = 5;

            // 將更新狀態的訂單同步到資料庫
            await updateOrderStatus(selectedOrder.value);

            Swal.fire('完成訂單', '訂單已成功更新', 'success');
            loadOrderByUserId(UserId); // 完成訂單更新 重新載入
        } catch (error) {
            Swal.fire('錯誤', '無法完成訂單操作', 'error');
        }
    }
};

// 按完成訂單後 要更新訂單狀態
// 定義更新訂單狀態的方法
const updateOrderStatus = async (order) => {
    try {
        const response = await fetch(`${BaseURL}/Orders/${order.orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error('更新訂單狀態失敗');
        }
    } catch (error) {
        console.error('更新訂單狀態錯誤:', error);
        throw error;
    }
};

// 處理完成訂單按鈕點擊 End

// 未完成付款訂單 繼續前往綠界付款 Start
const handleContinuePay = async (item) => {
    selectedOrder.value = orders.value.find((order) => order.orderId === item.orderNum);
    const fakeOrderId = `${selectedOrder.value.orderId}00`; // 將訂單加入00 避免重複
    const order = {
        orderId: fakeOrderId,
        userId: UserId || null,
        orderTime: dateTimeOrder(),
        totalAmount: selectedOrder.value.totalAmount || 0,
        status: 1 || 6, //狀態預設寫 1 未付款,2 已付款，3 訂單確認中，4 已出貨，5 訂單完成
        orderAddress: selectedOrder.value.orderAddress || null,
        orderPhone: selectedOrder.value.phoneNumber || null,
        orderEmail: selectedOrder.value.email || null,
        orderRemark: selectedOrder.value.orderRemark || null,
        orderName: selectedOrder.value.userName || null,
    };

    const paymentResponse = await fetch(`${BaseURL}/Orders/StartPaymentForContinue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });

    if (paymentResponse.ok) {
        const paymentHtml = await paymentResponse.text();
        // 這裡處理支付 HTML，在新窗口打開
        const paymentWindow = window.open('', '_blank');
        paymentWindow.document.write(paymentHtml);

        // 導航原頁面到訂單頁面
        ToOrders();
    } else {
        Swal.fire({
            title: '支付失敗',
            text: '無法進入支付頁面，請稍後再試',
            icon: 'error',
        });
    }
};

// 導航到訂單頁面
const router = useRouter();
const ToOrders = () => {
    router.push({ name: 'order' });
};

// 得到現在時間(訂單下單時間用)
const dateTimeOrder = () => {
    const now = new Date();

    // 調整時間為台灣時區 (UTC+8)
    const taiwanTime = new Date(now.setHours(now.getHours() + 8));

    // 使用 toISOString() 獲取 ISO 格式的日期時間字串
    const orderTime = taiwanTime.toISOString();

    return orderTime; // 返回台灣時間的 ISO 格式字串
};

// 未完成付款訂單 繼續前往綠界付款 End

// 點擊評論
const isReviewModalVisible = ref(false);
const handleReview = async (row) => {
    const orderNum = row.orderNum;
    const order = orders.value.find((order) => order.orderId === orderNum);
    console.log('Selected Order:', order); // 檢查找到的訂單是否正確
    openReviewModal(order);
};
const closeReviewModal = () => {
    isReviewModalVisible.value = false;
};
const openReviewModal = (order) => {
    selectedOrder.value = order;

    isReviewModalVisible.value = true;
};

const submitReview = async (item) => {
    // 構建要提交的數據
    const reviewData = {
        userId: UserId,
        productId: item.productId,
        commentMessage: item.commentMessage,
        commentStars: item.commentStars,
        date: new Date().toISOString().split('T')[0], // 取得當前日期，格式化為 yyyy-MM-dd
    };

    try {
        const response = await fetch(`${BaseURL}/ProductEvaluates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error('提交失敗');
        }

        const result = await response.json();
        console.log('評論提交成功:', result);

        // 成功提示
        Swal.fire({
            icon: 'success',
            title: '提交成功!',
            text: '感謝您的評論！',
            confirmButtonText: '確定',
        });

        // 重置評論表單
        item.commentMessage = '';
        item.commentStars = 0;
    } catch (error) {
        console.error('提交評論出錯:', error);

        // 失敗提示
        Swal.fire({
            icon: 'error',
            title: '提交失敗',
            text: '請稍後再試一次',
            confirmButtonText: '確定',
        });
    }
};
</script>

<template>
    <div>
        <div>
            <!-- Single Page Header start -->
            <section>
                <div class="header">
                    <div class="title">
                        <h1>訂單</h1>
                        <h1>Orders</h1>
                    </div>
                </div>
            </section>
            <!-- Single Page Header End -->
        </div>
        <div>
            <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"
                ><i class="fa-solid fa-shop"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'cart' }" class="floating-icon-cart"
                ><i class="fa-solid fa-cart-shopping"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'order' }" class="floating-icon-order"
                ><i class="fa-solid fa-clipboard-list"></i
            ></RouterLink>
        </div>
        <div>
            <!-- 引入購物車 sidebar -->
            <SideBarCartComponent />
            <!-- 引入購物清單 -->
            <ShoppingListComponent />
            <!-- 引入我的優惠券 -->
            <CouponComponent />
        </div>
        <div>
            <!-- EasyDataTable Start -->
            <div>
                <EasyDataTable
                    :headers="headers"
                    :items="items"
                    alternating
                    buttons-pagination
                    theme-color="#C4EBF0"
                    table-class-name="customize-table"
                    header-text-direction="center"
                    body-text-direction="center"
                    @click-row="handleRowClick"
                >
                    <!-- 添加 Operation 欄位的自定義模板 -->
                    <template #item-operation="item">
                        <div>
                            <button
                                v-if="item.showCompleteButton"
                                @click.stop="handleCompleteOrder(item)"
                                style="
                                    background-color: #a8e6cf;
                                    color: #ffffff;
                                    border: none;
                                    padding: 8px 12px;
                                    border-radius: 5px;
                                "
                            >
                                完成訂單
                            </button>
                            <button
                                v-if="item.showEvaluatesButton"
                                @click.stop="handleReview(item)"
                                style="
                                    background-color: #edcfb3;
                                    color: #ffffff;
                                    border: none;
                                    padding: 8px 12px;
                                    border-radius: 5px;
                                "
                            >
                                評價商品
                            </button>
                            <button
                                v-if="item.showContinuePay"
                                @click.stop="handleContinuePay(item)"
                                style="
                                    background-color: #ffb7b2;
                                    color: #ffffff;
                                    border: none;
                                    padding: 8px 12px;
                                    border-radius: 5px;
                                "
                            >
                                繼續付款
                            </button>
                        </div>
                    </template>
                </EasyDataTable>
            </div>
            <!-- EasyDataTable End -->
            <div>
                <!-- 訂單詳情的 Modal Start-->
                <el-dialog title="訂單詳細資訊" v-model="isModalVisible" width="80%" @close="closeModal">
                    <div>
                        <!-- el-descriptions OrderInfo Start -->
                        <div class="row">
                            <div v-if="selectedOrder" class="col-9 macaron-orderInfo mx-auto">
                                <el-descriptions title="訂單資訊" direction="vertical" :column="3" border>
                                    <el-descriptions-item label="訂單編號">{{
                                        selectedOrder.orderId
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="訂單時間">{{
                                        selectedOrder.orderTime
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="連絡電話" :span="2">{{
                                        selectedOrder.orderPhone
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="訂單總價">
                                        <el-tag>$ {{ selectedOrder.totalAmount }}</el-tag>
                                    </el-descriptions-item>
                                    <el-descriptions-item label="收貨地址">
                                        {{ selectedOrder.orderAddress }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="訂單備註">{{
                                        selectedOrder.orderRemark
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </div>
                            <!-- el-descriptions OrderInfo End -->

                            <!-- Timeline Start -->
                            <div class="col-2 macaron-orderTimeline mx-auto">
                                <el-timeline style="max-width: 600px">
                                    <el-timeline-item
                                        v-for="(step, index) in steps"
                                        :key="index"
                                        :color="getStatusType(step.status, selectedOrder.status).color"
                                        :hollow="step.status > selectedOrder.status"
                                        siza="large"
                                    >
                                        {{ step.content }}
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                            <!-- Timeline End -->
                        </div>
                        <div>
                            <!-- 商品列表 -->
                            <h4 class="macaron-title mt-3">商品清單</h4>
                            <div v-for="(item, index) in selectedOrder.getOrderItemProductUnit" :key="index">
                                <el-descriptions title="" direction="vertical" border class="macaron-bg no-border">
                                    <el-descriptions-item :rowspan="2" :width="140" label="商品圖" align="center">
                                        <el-image
                                            style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover"
                                            :src="`${BaseUrlWithoutApi}/images/ingredient/${
                                                item.photo
                                            }?t=${Date.now()}`"
                                        />
                                    </el-descriptions-item>
                                    <el-descriptions-item label="商品名稱">{{ item.productName }}</el-descriptions-item>
                                    <el-descriptions-item label="購買數量">{{ item.quantity }}</el-descriptions-item>
                                    <el-descriptions-item label="單價">{{ item.price }}</el-descriptions-item>
                                    <el-descriptions-item label="單位量"
                                        >{{ item.unitQuantity }} {{ item.unit }}</el-descriptions-item
                                    >
                                    <el-descriptions-item label="小計">
                                        <el-tag class="macaron-tag"> $ {{ item.price * item.quantity }} </el-tag>
                                    </el-descriptions-item>
                                    <el-descriptions-item label="總數量">
                                        {{ item.unitQuantity * item.quantity }} {{ item.unit }}
                                    </el-descriptions-item>
                                </el-descriptions>
                                <!-- el-descriptions-item ProductDetail End -->
                            </div>
                        </div>
                    </div>
                </el-dialog>
                <!-- 訂單詳情的 Modal End-->
                <!-- 評價的 Modal Start -->
                <el-dialog
                    title=""
                    v-model="isReviewModalVisible"
                    width="75%"
                    @close="closeReviewModal"
                    :z-index="1000"
                >
                    <h3>評論</h3>
                    <hr class="hr-shadow" />
                    <div
                        v-for="(item, index) in selectedOrder.getOrderItemProductUnit"
                        :key="index"
                        class="review-item"
                        style="margin-bottom: 20px"
                    >
                        <div class="review-header" style="display: flex; align-items: center">
                            <el-image
                                style="
                                    width: 100px;
                                    height: 100px;
                                    border-radius: 50%;
                                    object-fit: cover;
                                    margin-right: 10px;
                                "
                                :src="`${BaseUrlWithoutApi}/images/ingredient/${item.photo}?t=${Date.now()}`"
                            />
                            <div>
                                <h3>{{ item.productName }}</h3>
                            </div>
                        </div>

                        <el-form style="margin-top: 10px">
                            <el-form-item label="評論內容" required>
                                <el-input
                                    type="textarea"
                                    v-model="item.commentMessage"
                                    placeholder="請輸入您的評論..."
                                    :rows="4"
                                    maxlength="200"
                                    show-word-limit
                                />
                            </el-form-item>

                            <div style="display: flex; align-items: center; justify-content: space-between">
                                <el-form-item label="評分" style="margin: 0">
                                    <el-rate
                                        v-model="item.commentStars"
                                        :texts="['糟透了', '有點失望', '正常', '不錯', '太棒了']"
                                        show-text
                                        size="large"
                                        disabled-void-color="#ebeab7"
                                        clearable
                                    />
                                </el-form-item>
                                <!-- 個別的提交按鈕 -->
                                <el-button class="button-85" type="primary" @click="submitReview(item)"
                                    >提交評論</el-button
                                >
                            </div>
                        </el-form>
                        <hr class="hr-shadow" />
                    </div>
                </el-dialog>
                <!-- 評價的 Modal End -->
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreStyle.css';
@import 'element-plus/theme-chalk/el-dialog.css';

/* header本人 */
.header {
    position: relative;
    overflow: hidden;
    height: 40vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    color: #eee;
    z-index: 0;
}
/* 背景 */
.header:before {
    content: '';
    width: 100%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateZ(0) scale(1, 1);
    background: #1b2030 url('src/assets/img/ForBackground/bg-header.jpg') 50% 0 no-repeat;
    background-size: cover;
    background-attachment: fixed;
    animation: grow 180s linear 10ms infinite;
    transition: all 0.4s ease-in-out;
    z-index: -2;
}
/* 下方mask */
.header:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 40%, rgb(254, 254, 254) 100%);
}
/* 文字 */
.title {
    width: 100%;
    padding-top: 5%;
    text-align: center;
    text-shadow: 0 2px 3px rgba(255, 255, 255, 0.4);
}
/* 上下移動縮放特效 */
@keyframes grow {
    0% {
        transform: scale(1) translateY(0px);
    }
    50% {
        transform: scale(1.2) translateY(-250px);
    }
}

.customize-table {
    --easy-table-border: 1px solid #ffd1dc; /* 柔和粉紅 */
    --easy-table-row-border: 1px solid #ffd1dc;

    --easy-table-header-font-size: 14px;
    --easy-table-header-height: 50px;
    --easy-table-header-font-color: #333333; /* 深灰色 */
    --easy-table-header-background-color: #ffb6c1; /* 亮粉紅 */

    --easy-table-header-item-padding: 10px 15px;

    --easy-table-body-even-row-font-color: #333333; /* 深灰色 */
    --easy-table-body-even-row-background-color: #ffefd5; /* 淡杏黃 */

    --easy-table-body-row-font-color: #333333; /* 深灰色 */
    --easy-table-body-row-background-color: #fff0f5; /* 淡紫紅 */

    --easy-table-body-row-height: 50px;
    --easy-table-body-row-font-size: 14px;

    --easy-table-body-row-hover-font-color: #333333; /* 深灰色 */
    --easy-table-body-row-hover-background-color: #c4ebf0;
    --easy-table-body-item-padding: 10px 15px;

    --easy-table-footer-background-color: #ffb6c1; /* 亮粉紅 */
    --easy-table-footer-font-color: #333333; /* 深灰色 */
    --easy-table-footer-font-size: 14px;
    --easy-table-footer-padding: 0px 10px;
    --easy-table-footer-height: 50px;

    --easy-table-rows-per-page-selector-width: 70px;
    --easy-table-rows-per-page-selector-option-padding: 10px;
    --easy-table-rows-per-page-selector-z-index: 1;

    --easy-table-scrollbar-track-color: #ffb6c1; /* 亮粉紅 */
    --easy-table-scrollbar-color: #ffd1dc; /* 柔和粉紅 */
    --easy-table-scrollbar-thumb-color: #c4ebf0;
    --easy-table-scrollbar-corner-color: #ffd1dc; /* 柔和粉紅 */

    --easy-table-loading-mask-background-color: #ffb6c1; /* 亮粉紅 */
}

.el-timeline {
    font-size: 16px;
}

.macaron-bg {
    background-color: #f9f0f0; /* 浅粉色背景 */
    border: 1px solid #e6b2b2; /* 边框颜色 */
    border-radius: 8px; /* 圆角 */
    padding: 16px; /* 内边距 */
    margin-top: 20px;
}

.macaron-title {
    font-weight: bold;
    font-size: 18px;
    color: #303133; /* 标题颜色 */
}

.macaron-item {
    background-color: #fff3f3; /* 商品项背景色 */
    border: 1px solid #f2c6c6; /* 商品项边框颜色 */
    border-radius: 8px; /* 商品项圆角 */
    padding: 10px; /* 商品项内边距 */
    margin-bottom: 10px; /* 商品项间距 */
}

.macaron-tag {
    background-color: #ffb3b3; /* Tag背景色 */
    color: #fff; /* Tag文字颜色 */
}

.macaron-orderInfo {
    background-color: #fef8d6; /* 背景色 */
    border: 1px solid #e6b2b2; /* 边框颜色 */
    border-radius: 8px; /* 圆角 */
    padding: 12px; /* 内边距 */
}

.macaron-orderTimeline {
    background-color: #f2fdec; /* 背景色 */
    border: 1px solid #e6b2b2; /* 边框颜色 */
    border-radius: 8px; /* 圆角 */
    padding: 30px 30px 1px; /* 内边距 */
}

.hr-shadow {
    border: 0;
    padding-top: 10px;
    color: #d0d0d5;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 10px 10px -10px;
}

.button-85 {
    padding: 0.6em 2em;
    border: none;
    outline: none;
    color: rgb(255, 255, 255);
    background: #111;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}

.button-85:before {
    content: '';
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing-button-85 20s linear infinite;
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
}

@keyframes glowing-button-85 {
    0% {
        background-position: 0 0;
    }
    50% {
        background-position: 400% 0;
    }
    100% {
        background-position: 0 0;
    }
}

.button-85:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #b2d1d3;
    left: 0;
    top: 0;
    border-radius: 10px;
}
</style>
