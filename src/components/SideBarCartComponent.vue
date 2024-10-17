<script setup>
import {ref,computed,reactive} from 'vue';
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router';
import { Offcanvas } from 'bootstrap'; // 引入 Bootstrap 的 Offcanvas 模塊
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace("/api","");  // 去掉 "/api" 得到基本的 URL;

// offcanvas DOM 元素的引用
let offcanvasCartRef = ref(null);

const openCartSidebar = () => {
  loadProducts();
  let offcanvas = new Offcanvas(offcanvasCartRef.value); // 使用引入的 Offcanvas
  offcanvas.show();
};


// 讀取所有商品
const ApiURL=`${BaseURL}/Products/ProductsNcategory`;

const products=ref([]);
const loadProducts = async()=>{
    const response = await fetch(ApiURL);
    const datas = await response.json();
    products.value = datas;
    // console.log(datas);
    loadProductCartLocalStorage();
    // console.log('已加載loadProductCartLocalStorage')
}

// 從localStorage獲取購物車內容
const cartProducts = ref([]);
const loadProductCartLocalStorage=()=>{
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];
    
    // 過濾所有商品，找到購物車中存在的商品
    cartProducts.value = products.value.map(product=>{
        // 檢查該商品是否在購物車中
        const cartProduct = cart.find(item => item.productId === product.productId);
        // 如果有找到 則保留
        if(cartProduct){
            // 使用 reactive 來創建一個響應式物件
            const reactiveProduct = reactive({
                ...product, // 展開原有產品屬性
                quantity: cartProduct.quantity // 設置 quantity
            });
            // console.log(reactiveProduct.quantity)
            // console.log(JSON.stringify(reactiveProduct, null, 2));
            // console.log(`有找到購物車商品：${reactiveProduct.productName} , 商品數量:${reactiveProduct.quantity}`);
            // 保留
            // console.log(`商品名稱: ${reactiveProduct.productName}, 數量: ${reactiveProduct.quantity}`);
            return reactiveProduct; // 返回響應式產品
        }else{
            // 過濾掉不在購物車的商品
            // console.log(`沒有找到購物車商品`);
            return null;
        }
    }).filter(Boolean); //過濾掉null值

}
// 載入loadProducts
loadProducts();

//============================================================================================================================


//計算商品總價
const totalPrice = computed(()=>{
    // reduce會迭代 cartProducts 陣列，累加到acc
    return cartProducts.value.reduce((acc, product) => {
        // console.log("product.quantity", product.quantity)

        return acc + (product.price * product.quantity);
    },0);
})
//============================================================================================================================

    // 更新購物車
    const updateCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];
    const cartProductIndex = cart.findIndex(item => item.productId === product.productId);
    
    if (cartProductIndex !== -1) {
        // 如果數量大於 0，更新數量；如果為 0 或無效，從購物車中刪除
        if (product.quantity > 0) {
            cart[cartProductIndex].quantity = product.quantity;  // 更新數量
            // console.log("更新localStorage成功")
        } else {
            cart.splice(cartProductIndex, 1);  // 刪除該商品
            // console.log("刪除localStorage成功")
        }
    }
    
    localStorage.setItem('productCart', JSON.stringify(cart));  // 更新 localStorage
    };

    //===========================================================================================================================

    // 從購物車 及 localStorage_productCart 移除商品 
    const removeFromCart = (product) => {
        Swal.fire({
            title: "確定要移除這個商品嗎?",
            text: "移除後將無法恢復!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "是的, 移除它!",
            cancelButtonText: "取消"
        }).then((result) => {
        if (result.isConfirmed) {
            // 如果用戶點擊了"確認"，設置數量為0，因為updateCart數量為0會移除
            product.quantity = 0;
            updateCart(product); // 更新購物車並移除商品
            
            Swal.fire({
                title: "已移除!",
                text: `商品 ${product.productName} 已從購物車移除。`,
                icon: "success"
            });

            loadProductCartLocalStorage();  //重新載入localStorage

             // 手動觸發 storage 事件通知 CartView 更新購物車
              window.dispatchEvent(new Event('storage')); // 這行手動觸發
            }
        });
    };

//=========================================================================================================================
    // 導航至購物車明細頁面
    const router = useRouter();
    const goToCheckout = () =>{
        // 移除禁止滾動的樣式
        document.body.style.overflow = 'auto'; // 恢復滾動
        document.body.classList.remove('modal-open'); // 如果有modal-open類別，則移除
        router.push({name:'cart'});
    }
//=========================================================================================================================

    const closeCartSidebar = () => {
    // 隱藏側邊欄
    let offcanvas = new Offcanvas(offcanvasCartRef.value);
    offcanvas.hide();

    // 恢復滾動
    document.body.style.overflow = 'auto'; // 恢復滾動
    document.body.classList.remove('modal-open'); // 移除 modal-open 類別
};

//=========================================================================================================================
    // 取得localStorage_productCart的長度
    const getCartlenghtFromLocalStorage = () => {
      const cart = JSON.parse(localStorage.getItem('productCart')) || [];
      return cart.length;
    };

//======================================================================================================================== 
    // 監聽SideBarCartComponent
    window.windowCartComponent = () => {
      const cartData = localStorage.getItem('productCart');
      return cartData ? JSON.parse(cartData) : [];
    };
</script>

<template>
  <div>
    <!-- 其他頁面內容... -->

    <!-- 放購物車 Sidebar，從左側滑入 -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart" ref="offcanvasCartRef">
      <div class="offcanvas-header justify-content-center">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" @click="closeCartSidebar"></button>
      </div>
      <div class="offcanvas-body">
        <!-- localStorage_productCart.length 為 0 顯示 -->
        <div v-show="getCartlenghtFromLocalStorage() === 0">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary" >我的購物車</span>
            <span class="badge custom-badge rounded-pill">{{ getCartlenghtFromLocalStorage() }}</span>
          </h4>
          <p>
            快買些東西吧，購物車是空的！
          </p>
        </div>
        <!-- localStorage_productCart.length 為 0 隱藏 -->
        <div class="order-md-last" v-show="getCartlenghtFromLocalStorage() > 0">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary" >我的購物車</span>
            <span class="badge custom-badge rounded-pill">{{ getCartlenghtFromLocalStorage() }}</span>
          </h4>
          <ul class="list-group mb-3" v-for="product in cartProducts" :key="product.productId" >
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0 custom-title mb-3"  style="font-weight: bold;">{{product.productName}}</h6>
                <small class="text-body-secondary custom-quantity" >數量: {{ product.quantity }}</small>
              </div>
              <div class="text-body-secondary custom-price">$ {{product.quantity*product.price}}
                <button @click="removeFromCart(product)" class="btn btn-md rounded-circle bg-light border mt-2 ms-3 mb-2" >
                  <i class="fa fa-times text-danger"></i>
                </button>
              </div>
            </li>
          </ul>
          
            <div class="list-group-item d-flex justify-content-between ms-3 mb-2">
              <span class="custom-total">總價</span>
              <strong class=" me-3 custom-totalPrice">$ {{ totalPrice }}</strong>
            </div>
          
        </div>
          <button class="w-100 custom-btn btn-lg" @click="goToCheckout" :disabled="getCartlenghtFromLocalStorage() === 0">查看我的購物明細並結帳</button>
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

.custom-title {
  font-size: 1.25rem; /* 調整字體大小 */
}

.custom-quantity {
  font-size: 1.1rem; /* 調整字體大小 */
}

.custom-price {
  font-size: 1.1rem; /* 調整字體大小 */
}

.custom-total{
  font-size: 1.25rem; /* 調整字體大小 */
  font-weight: bold;
}

.custom-totalPrice{
  font-size: 1.2rem; /* 調整字體大小 */
}

.offcanvas-start{
  background-image: url('@/assets/img/ForBackground/background-pattern.jpg'); /* 圖片路徑 */
  background-size: cover; /* 使圖片覆蓋整個側邊欄 */
  background-position: center; /* 圖片居中 */
  background-repeat: no-repeat; /* 不重複圖片 */
  width: 250px; /* 側邊欄寬度，根據需求調整 */
  height: 100vh; /* 側邊欄高度設置為整個視窗高度 */  
}
</style>
