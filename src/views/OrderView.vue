<script lang="ts" setup>
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import ShoppingListComponent from '@/components/ShoppingListComponent.vue';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import 'vue3-easy-data-table/dist/style.css';
import type { Header, Item } from 'vue3-easy-data-table';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePantryStore } from '@/stores/pantryStore';
import { useRouter } from 'vue-router';
import { tr } from 'element-plus/es/locale';

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
                await pantryStore.postPantry(UserId, item.ingredientId, item.quantity * item.unitQuantity, action);
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
</script>

<template>
    <div>
        <div>
            <!-- Single Page Header start -->
            <div class="container-fluid page-header py-5 mb-5">
                <h1 class="text-center custom-color display-6">我的訂單</h1>
            </div>
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
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreBootstrap.min.css';
@import '@/assets/css/StoreStyle.css';
@import 'element-plus/theme-chalk/el-dialog.css';

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
</style>
