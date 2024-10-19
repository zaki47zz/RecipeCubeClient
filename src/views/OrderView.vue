<script lang="ts" setup>
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import Vue3EasyDataTable from 'vue3-easy-data-table';
import Swal from 'sweetalert2';
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue';

const BaseURL = import.meta.env.VITE_API_BASEURL; // 這裡使用 TypeScript 是沒有問題的
const BaseUrlWithoutApi = BaseURL.replace("/api", ""); // 去掉 "/api" 得到基本的 URL

import type { Header, Item } from "vue3-easy-data-table";

const headers: Header[] = [
  { text: "PLAYER", value: "player" },
  { text: "TEAM", value: "team"},
  { text: "NUMBER", value: "number"},
  { text: "POSITION", value: "position"},
  { text: "HEIGHT", value: "height"},
  { text: "WEIGHT (lbs)", value: "weight", sortable: true},
  { text: "LAST ATTENDED", value: "lastAttended"},
  { text: "COUNTRY", value: "country"},
];

const items: Item[] = [
  { "player": "Stephen Curry", "avator": "https://cdn.nba.com/headshots/nba/latest/260x190/201939.png", "team": "GSW", "number": 30, "position": 'G', "height": '6-2', "weight": 185, "lastAttended": "Davidson", "country": "USA"},
  { "player": "Lebron James", "avator": "https://cdn.nba.com/headshots/nba/latest/260x190/2544.png", "team": "LAL", "number": 6, "position": 'F', "height": '6-9', "weight": 250, "lastAttended": "St. Vincent-St. Mary HS (OH)", "country": "USA"},
  { "player": "Kevin Durant", "avator": "https://cdn.nba.com/headshots/nba/latest/260x190/201142.png", "team": "BKN", "number": 7, "position": 'F', "height": '6-10', "weight": 240, "lastAttended": "Texas-Austin", "country": "USA"},
  { "player": "Giannis Antetokounmpo", "avator": "https://cdn.nba.com/headshots/nba/latest/260x190/203507.png", "team": "MIL", "number": 34, "position": 'F', "height": '6-11', "weight": 242, "lastAttended": "Filathlitikos", "country": "Greece"},
];

</script>


<template>
  <div>
    <div>
      <!-- Single Page Header start -->
      <div class="container-fluid page-header py-5">
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

  </div>
</template>

<style lang="css" scoped>
  @import "@/assets/css/StoreBootstrap.min.css";
  @import "@/assets/css/StoreStyle.css";
  @import 'vue3-easy-data-table/dist/style.css';
</style>


  