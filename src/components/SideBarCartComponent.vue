<script setup>
import { ref } from 'vue'; // 引入 ref
import { Offcanvas } from 'bootstrap'; // 引入 Bootstrap 的 Offcanvas 模塊

// offcanvas DOM 元素的引用
let offcanvasCartRef = ref(null);

const openCartSidebar = () => {
  let offcanvas = new Offcanvas(offcanvasCartRef.value); // 使用引入的 Offcanvas
  offcanvas.show();
};
</script>

<template>
  <div>
    <!-- 其他頁面內容... -->

    <!-- 放購物車 Sidebar，從左側滑入 -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart" ref="offcanvasCartRef">
      <div class="offcanvas-header justify-content-center">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div class="order-md-last">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary" >我的購物車</span>
            <span class="badge custom-badge rounded-pill">3</span>
          </h4>
          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">品名</h6>
                <small class="text-body-secondary">數量</small>
              </div>
              <span class="text-body-secondary">$ 小計</span>
            </li>
            <!-- 其他商品... -->
            <li class="list-group-item d-flex justify-content-between">
              <span>總價</span>
              <strong>$20</strong>
            </li>
          </ul>
          <button class="w-100 custom-btn btn-lg" type="submit">Continue to checkout</button>
        </div>
      </div>
    </div>

    <!-- 開啟購物車 Sidebar 的按鈕 -->
    <button @click="openCartSidebar" class="floating-icon-side-cart">
      <i class="fa-solid fa-list-ul"></i>
    </button>
  </div>
</template>

<style lang="css" scoped>
@import "bootstrap/dist/css/bootstrap.min.css";
@import "@/assets/css/StoreStyle.css";

.custom-badge {
  background-color: #81c408 !important; /* 設定背景色 */
  color: white !important; /* 設定文字顏色 */
  border: 1.5px solid #ffb524 !important; /* 橘色邊框 */
  border-radius: 8px; /* 圓角 */
}

.custom-btn {
  background-color: #81c408 !important; /* 設定背景色 */
  color: white !important; /* 設定文字顏色 */
  border: 1.5px solid #ffb524 !important; /* 橘色邊框 */
  border-radius: 8px; /* 圓角 */
}

.custom-btn:hover {
  background-color: #808080 !important; /* 懸停效果為灰色 */
  border: 1.5px solid #ffb524 !important; /* 橘色邊框 */
}

.text-primary{
  color: #81c408 !important;
}
</style>
