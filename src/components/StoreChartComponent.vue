<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import { ElButton, ElDialog } from 'element-plus';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);
provide(THEME_KEY, 'dark');

const BaseURL = import.meta.env.VITE_API_BASEURL; // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const userId = localStorage.getItem('UserId');
const dialogVisible = ref(false);
const dateRange = ref([null, null]);
const chartRef = ref(null);
const products = ref([]);
const orders = ref([]);

onMounted(() => {
    initTippy();
    window.addEventListener('resize', handleResize);
    loadOrderByUserId(userId);
    loadProducts();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

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

const resizeChart = () => {
    nextTick(() => {
        if (chartRef.value) {
            chartRef.value.resize();
        }
    });
};

const loadOrderByUserId = async (userId) => {
    const response = await fetch(`${BaseURL}/Orders/OrderItem/${userId}`);
    if (!response.ok) {
        Swal.fire('訂單請求失敗');
        return;
    }
    const data = await response.json();
    orders.value = data;
    // console.log(data);

    // 依日期過濾訂單
    const filteredOrders = orders.value.filter((order) => {
        const orderTime = new Date(order.orderTime);
        return orderTime >= new Date(startDate) && orderTime <= new Date(endDate);
    });

    // 整理商品數據
    const productSales = {};
    for (const order of orders.value) {
        for (const item of order.orderItemDTO) {
            const productId = item.productId;
            const quantity = item.quantity;
            const price = item.price;
        }
    }
};

// 讀取所有商品

const loadProducts = async () => {
    try {
        const response = await fetch(`${BaseURL}/Products/ProductsNcategory`);
        const data = await response.json();
        products.value = data;
        console.log('Products loaded successfully');
    } catch (error) {
        console.error('Error loading products:', error);
    }
};

const fetchOrdersInRange = () => {
    if (dateRange.value[0] && dateRange.value[1]) {
        loadOrderByUserId(userId, dateRange.value[0], dateRange.value[1]);
    }
};

const option = ref({
    title: {
        text: 'Traffic Sources',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
    },
    series: [
        {
            name: 'Traffic Sources',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                { value: 335, name: 'Direct' },
                { value: 310, name: 'Email' },
                { value: 234, name: 'Ad Networks' },
                { value: 135, name: 'Video Ads' },
                { value: 1548, name: 'Search Engines' },
            ],
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
        <el-button id="button-chart" class="floating-icon-chart" @click="openDialog"
            ><i class="fa-solid fa-chart-pie"></i>
        </el-button>
        <el-dialog title="消費統計" v-model="dialogVisible" width="60%" @opened="resizeChart">
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                @change="fetchOrdersInRange"
                style="margin-bottom: 20px"
            >
            </el-date-picker>
            <v-chart v-if="dialogVisible" ref="chartRef" class="chart" :option="option" />
        </el-dialog>
    </div>
</template>

<style scoped>
@import '@/assets/css/StoreStyle.css';

.chart {
    height: 500px;
}
</style>
