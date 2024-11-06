<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, onMounted, nextTick, onBeforeUnmount, watch, computed } from 'vue';
import { ElButton, ElDialog, ElSelect, ElOption, ElSwitch } from 'element-plus';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);
provide(THEME_KEY, 'dark');

const BaseURL = import.meta.env.VITE_API_BASEURL;
const userId = localStorage.getItem('UserId');
const dialogVisible = ref(false);
const dateRange = ref([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
]);
const selectedDateRange = ref('thisMonth'); // 定義 selectedDateRange
const chartRef = ref(null);
const products = ref([]);
const orders = ref([]);
const selectedView = ref(false); // 切換顯示模式，'product' 或 'category'

const isLogin = computed(() => {
    return userId && userId;
});

// 初始化圖表提示
onMounted(() => {
    initTippy();
    loadOrderByUserId(userId);
    loadProducts();
    window.addEventListener('resize', handleResize);
    nextTick(() => {
        fetchOrdersInRange();
        console.log('渲染完後執行');
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

// Tippy.js 初始化
const initTippy = function () {
    tippy('#button-chart', {
        content: '消費統計',
        placement: 'right-end',
        animation: 'fade',
    });
};

const openDialog = () => {
    dialogVisible.value = true;
};

// 監聽窗口大小變化，調整圖表大小
const handleResize = () => {
    if (dialogVisible.value && chartRef.value) {
        chartRef.value.resize();
    }
};

// 監聽日期範圍和模式變化
watch([dateRange, selectedView], () => {
    // console.log('監聽到日期或模式變化');
    fetchOrdersInRange();
    // console.log('已執行fetchOrdersInRange');
});

const resizeChart = () => {
    nextTick(() => {
        if (chartRef.value) {
            chartRef.value.resize();
        }
    });
};

const updateChartOption = (data) => {
    option.value.series[0].data = data;
    resizeChart();
};

// 根據使用者 ID 加載訂單資料並篩選日期範圍
const loadOrderByUserId = async (userId, startDate = null, endDate = null) => {
    const response = await fetch(`${BaseURL}/Orders/OrderItem/${userId}`);
    if (!response.ok) {
        Swal.fire('訂單請求失敗');
        return;
    }
    const data = await response.json();
    orders.value = data;

    // 過濾訂單資料
    const filteredOrders =
        startDate && endDate
            ? orders.value.filter((order) => {
                  const orderTime = new Date(order.orderTime);
                  return orderTime >= new Date(startDate) && orderTime <= new Date(endDate);
              })
            : orders.value;

    // 整理商品數據
    const productSales = {};
    for (const order of filteredOrders) {
        if (order.getOrderItemProductUnit) {
            for (const item of order.getOrderItemProductUnit) {
                const productId = item.productId;
                const productName = item.productName;
                const quantity = item.quantity;
                const price = item.price;
                const total = price * quantity;

                if (productSales[productId]) {
                    productSales[productId].total += total;
                    productSales[productId].quantity += quantity;
                    productSales[productId].productName = productName;
                } else {
                    productSales[productId] = {
                        total: total,
                        quantity: quantity,
                        productId: productId,
                        productName: productName,
                    };
                }
            }
        }
    }

    let selectedViewValue = selectedView.value === true ? 'category' : 'product';

    if (selectedViewValue === 'product') {
        // 顯示按商品的統計圖表
        const chartData = Object.keys(productSales).map((id) => ({
            name: productSales[id].productName,
            value: productSales[id].total,
        }));
        updateChartOption(chartData);
    } else if (selectedViewValue === 'category') {
        // 顯示按類別的統計圖表;
        const categorySales = {};

        // 遍歷所有的 filteredOrders 並根據產品 ID 匹配到產品分類
        for (const order of filteredOrders) {
            if (order.getOrderItemProductUnit) {
                for (const item of order.getOrderItemProductUnit) {
                    const matchedProduct = products.value.find((product) => product.productId === item.productId);

                    // 如果在 products 中找到匹配的商品
                    if (matchedProduct) {
                        // console.log('有找到');
                        const category = matchedProduct.category;
                        const total = item.price * item.quantity;
                        // console.log(
                        //     `產品 ID: ${item.productId}, 價格: ${item.price}, 數量: ${item.quantity}, 總價: ${total}`
                        // );
                        // 累加同一個 category 的 total 值
                        if (categorySales[category]) {
                            categorySales[category].total += total;
                        } else {
                            categorySales[category] = { name: category, total: total };
                        }
                    }
                }
            }
        }
        // 最後檢查 categorySales 的值
        // console.log('各類別累加後的銷售數據:', categorySales);

        const categoryData = Object.values(categorySales).map((category) => ({
            name: category.name,
            value: category.total,
        }));
        // console.log('篩選後的類別', categoryData);
        updateChartOption(categoryData);
    }
};

// 讀取所有商品
const loadProducts = async () => {
    try {
        const response = await fetch(`${BaseURL}/Products/ProductsNcategory`);
        const data = await response.json();
        products.value = data;
    } catch (error) {
        console.error('Error loading products:', error);
    }
};

// 根據日期範圍過濾訂單
const fetchOrdersInRange = () => {
    if (dateRange.value[0] && dateRange.value[1]) {
        loadOrderByUserId(userId, dateRange.value[0], dateRange.value[1]);
    }
};

// 預設日期範圍選擇
const selectDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;

    if (range === 'thisMonth') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (range === 'lastMonth') {
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    } else {
        startDate = new Date('1900-01-01');
        endDate = new Date('2099-12-31');
    }
    dateRange.value = [startDate, endDate];
    fetchOrdersInRange();
};

const option = ref({
    title: {
        text: '消費統計',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
    },
    series: [
        {
            name: '品名',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
});
</script>

<template>
    <div>
        <el-button id="button-chart" class="floating-icon-chart" @click="openDialog">
            <i class="fa-solid fa-chart-pie"></i>
        </el-button>
        <el-dialog title="消費統計" v-model="dialogVisible" width="60%" @opened="resizeChart">
            <div v-if="isLogin" class="animate__animated animate__fadeIn col-12">
                <span class="col-12 d-flex justify-content-between">
                    <!-- 日期範圍選擇 -->
                    <el-date-picker
                        class="col-8"
                        v-model="dateRange"
                        type="daterange"
                        start-placeholder="開始日期"
                        end-placeholder="結束日期"
                        @change="fetchOrdersInRange"
                        style="margin-bottom: 20px"
                    />
                    <!-- 預設日期範圍下拉選單 -->
                    <el-select
                        v-model="selectedDateRange"
                        @change="selectDateRange"
                        style="margin-bottom: 20px"
                        class="col-2 ms-1"
                    >
                        <el-option label="本月" value="thisMonth"></el-option>
                        <el-option label="上個月" value="lastMonth"></el-option>
                        <el-option label="顯示全部" value="allTime"></el-option>
                    </el-select>
                    <!-- 切換顯示模式 -->
                    <el-switch v-model="selectedView" active-text="類別" inactive-text="商品" class="col-6 ms-1" />
                </span>
                <!-- 顯示圖表 -->
                <v-chart v-if="dialogVisible" ref="chartRef" class="chart" :option="option"></v-chart>
            </div>
            <div v-else class="col-12 d-flex flex-column align-items-center animate__animated animate__bounceIn">
                <span>請登入後繼續查看消費統計</span>
                <img src="@/assets/img/ForBackground/logo去背.png" alt="食譜魔方" style="width: 256px; height: auto" />
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
@import '@/assets/css/StoreStyle.css';

.chart {
    height: 550px;
}
</style>
