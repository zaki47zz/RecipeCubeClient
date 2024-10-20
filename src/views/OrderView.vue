<script lang="ts" setup>
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import Swal from 'sweetalert2';
import { ref , watch ,onMounted} from 'vue';
import 'vue3-easy-data-table/dist/style.css';
import type { Header, Item } from "vue3-easy-data-table";
import { ElMessageBox } from 'element-plus';

// @ts-ignore
const BaseURL = import.meta.env.VITE_API_BASEURL; //先忽略對import.meta錯誤檢查
const BaseUrlWithoutApi = BaseURL.replace("/api", ""); // 去掉 "/api" 得到基本的 URL


// 讀取localStorage的"UserId"
// const UserId = localStorage.getItem("UserId");
// console.log(UserId);

// 測試用userId
const testUserId = 'e9f150de-3492-47b4-9efe-783a6b9d9319'
localStorage.setItem("UserId",testUserId);
const UserId = localStorage.getItem("UserId")
console.log(UserId);



const orders=ref([]);
// 讀取該userId
const loadOrderByUserId = async(userId) => {
    const response = await fetch(`${BaseURL}/Orders/OrderItem/${userId}`);
    if(!response.ok){
      Swal.fire("訂單請求失敗");
      return;
    }
    const data = await response.json();
    orders.value=data;
    console.log(data);
    // orders.value.forEach(order => {
    // console.log("Order ID:", order.orderId);
    // 遍歷嵌套的商品數據
    // order.getOrderItemProductUnit.forEach(item => {
    //     console.log("Product Name:", item.productName);
    // });
    // });
    loadTableItems();  // 載入表格內容
};

// 叫用loadOrderByUserId  參數用localStorage的UserId
loadOrderByUserId(UserId);




const headers: Header[] = [
  { text: "訂單編號", value: "orderNum" },
  { text: "訂單時間", value: "orderTime"},
  { text: "商品項目數量", value: "productLength"},
  { text: "訂單總價", value: "orderAmount"},
  { text: "狀態", value: "orderStatus"},
];

const items = ref([]);

// 載入表格內容
const loadTableItems = () => {
    items.value = []; // 清空 items

    // 歷遍 orders
    orders.value.forEach(order => {

        // 格式化orderTime 
        const date = new Date(order.orderTime);
        const formatDate = date.toISOString().split("T")[0]; //日期
        const formatTime = date.toTimeString().split(" ")[0]; //時間

        // 狀態數字轉文字
        let status = "";
        switch (order.status)
        {
          case 1:
            status = "未付款";
            break;
          case 2:
            status = "已付款";
            break;
          case 3:
            status = "訂單確認中";
            break;
          case 4:
            status = "已出貨";
            break;
          case 5:
            status = "訂單完成";
            break;
        }
        // 填充 items
        items.value.push({
            orderNum: order.orderId, 
            orderTime: `${formatDate}  ${formatTime}`, 
            productLength: order.getOrderItemProductUnit.length, 
            orderAmount: order.totalAmount, 
            orderStatus: status, 
        });
    });
    // console.log("Items loaded:", items.value); 
};

const isModalVisible = ref(false); // 控制ModalVisible 顯示
const selectedOrder = ref(null); // 儲存選擇的訂單詳細資訊

// 點擊行事件
const handleRowClick = (row) =>{
  // console.log("Row clicked:", row); // 新增這行以確定事件是否被觸發
  const orderNum = row.orderNum;
  const order = orders.value.find(order => order.orderId === orderNum);
  console.log("Selected Order:", order); // 檢查找到的訂單是否正確
  openModal(order);
  console.log("isModalVisible:", isModalVisible.value); //  Modal 可见性
};

// 開啟Modal
const openModal = (order) =>{
  selectedOrder.value = order;
  isModalVisible.value = true;
}

// 關閉Modal
const closeModal = () =>{
  isModalVisible.value = false; 
  selectedOrder.value = null;
}

watch(isModalVisible, (newVal) => {
  console.log("Modal visibility changed:", newVal);
});

onMounted(() => {
    console.log("Modal visibility on mounted:", isModalVisible.value);
});
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
      <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"><i class="fa-solid fa-shop"></i></RouterLink>
      <RouterLink :to="{ name: 'cart' }"  class="floating-icon-cart"><i class="fa-solid fa-cart-shopping"></i></RouterLink>
      <RouterLink :to="{ name: 'order' }"  class="floating-icon-order"><i class="fa-solid fa-clipboard-list"></i></RouterLink>
    </div>
    <div>
      <!-- 引入購物車 sidebar -->
      <SideBarCartComponent />
    </div>
    <div>
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
        />
      </div>
      <div>
            <!-- 訂單詳情的 Modal Start-->
        <el-dialog
          title="訂單詳細資訊"
          :visible.sync="isModalVisible"
          width="600px"
          @close="closeModal"
        >
          <div v-if="selectedOrder">
            <p><strong>訂單編號:</strong> {{ selectedOrder.orderId }}</p>
            <p><strong>訂單時間:</strong> {{ selectedOrder.orderTime }}</p>
            <p><strong>訂單總價:</strong> {{ selectedOrder.totalAmount }}</p>
            <p><strong>收件地址:</strong> {{ selectedOrder.orderAddress }}</p>
            <p><strong>聯絡電話:</strong> {{ selectedOrder.orderPhone }}</p>
            <p><strong>訂單備註:</strong> {{ selectedOrder.orderRemark }}</p>

            <!-- 商品列表 -->
            <h4>商品清單</h4>
            <ul>
              <li v-for="(item, index) in selectedOrder.getOrderItemProductUnit" :key="index">
                <p>商品名稱: {{ item.productName }}</p>
                <p>數量: {{ item.quantity }}</p>
                <p>單價: {{ item.price }}</p>
                <p>單位: {{ item.unit }}</p>
                <!-- <img :src="item.photo" alt="Product Image" style="width: 100px; height: 100px;"> -->
              </li>
            </ul>
          </div>
        </el-dialog>
        <!-- 訂單詳情的 Modal End-->
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
  @import "@/assets/css/StoreBootstrap.min.css";
  @import "@/assets/css/StoreStyle.css";
  @import 'element-plus/theme-chalk/el-dialog.css';

  .customize-table {
  --easy-table-border: 1px solid #ffd1dc; /* 柔和粉紅 */
  --easy-table-row-border: 1px solid #ffd1dc;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #333333; /* 深灰色，讓字體保持清晰 */
  --easy-table-header-background-color: #ffb6c1; /* 亮粉紅 */

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #333333; /* 深灰色 */
  --easy-table-body-even-row-background-color: #ffefd5; /* 淡杏黃 */

  --easy-table-body-row-font-color: #333333; /* 深灰色 */
  --easy-table-body-row-background-color: #fff0f5; /* 淡紫紅 */

  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #333333; /* 深灰色 */
  --easy-table-body-row-hover-background-color: #C4EBF0; 
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
  --easy-table-scrollbar-thumb-color: #C4EBF0; 
  --easy-table-scrollbar-corner-color: #ffd1dc; /* 柔和粉紅 */

  --easy-table-loading-mask-background-color: #ffb6c1; /* 亮粉紅 */
}

</style>


  